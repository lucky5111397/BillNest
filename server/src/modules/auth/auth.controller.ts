import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { User } from '../../models/user.model';
import { Customer } from '../../models/customer.model';
import { getOrCreateDefaultOrganization } from '../../utils/organization';
import {
  validatePasswordStrength,
  hashPassword,
  verifyPassword,
  signJwtToken,
  generateSecureToken,
  hashToken,
} from '../../utils/security';
import { envConfig } from '../../config/env';
import { parseCookies } from '../../middleware/auth.middleware';

// In-memory brute-force login attempts limiter (IP or email based)
const loginAttempts = new Map<string, { count: number; lockedUntil?: number }>();

function checkRateLimit(key: string): { allowed: boolean; remainingLockSeconds?: number } {
  const record = loginAttempts.get(key);
  if (!record) return { allowed: true };

  const now = Date.now();
  if (record.lockedUntil && record.lockedUntil > now) {
    return { allowed: false, remainingLockSeconds: Math.ceil((record.lockedUntil - now) / 1000) };
  }

  if (record.lockedUntil && record.lockedUntil <= now) {
    loginAttempts.delete(key);
    return { allowed: true };
  }

  return { allowed: true };
}

function recordFailedLogin(key: string): void {
  const record = loginAttempts.get(key) || { count: 0 };
  record.count += 1;
  if (record.count >= 5) {
    record.lockedUntil = Date.now() + 15 * 60 * 1000; // 15 minutes lockout
  }
  loginAttempts.set(key, record);
}

function clearFailedLogin(key: string): void {
  loginAttempts.delete(key);
}

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Valid email is required').trim().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  businessName: z.string().optional(),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Valid email is required').trim().toLowerCase(),
  password: z.string().min(1, 'Password is required'),
});

const createStaffSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Valid email is required').trim().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function registerCustomer(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const parsed = registerSchema.parse(req.body);

    const strength = validatePasswordStrength(parsed.password);
    if (!strength.valid) {
      res.status(400).json({ success: false, message: strength.error });
      return;
    }

    const existingUser = await User.findOne({
      organizationId: org._id,
      email: parsed.email,
    });
    if (existingUser) {
      res
        .status(409)
        .json({ success: false, message: 'An account with this email already exists' });
      return;
    }

    // Auto-generate customer number
    const custCount = await Customer.countDocuments({ organizationId: org._id });
    const customerNumber = `CUST-2026-${String(custCount + 1).padStart(4, '0')}`;

    // Create Customer profile
    const customer = await Customer.create({
      organizationId: org._id,
      customerNumber,
      businessName: parsed.businessName || parsed.name,
      contactName: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      status: 'ACTIVE',
    });

    const passwordHash = await hashPassword(parsed.password);
    const refreshToken = generateSecureToken();
    const refreshTokenHash = hashToken(refreshToken);

    const user = await User.create({
      organizationId: org._id,
      name: parsed.name,
      email: parsed.email,
      passwordHash,
      role: 'CUSTOMER',
      customerId: customer._id,
      refreshTokenHash,
      status: 'ACTIVE',
      lastLoginAt: new Date(),
    });

    // 15-minute short-lived access token
    const accessToken = signJwtToken(
      {
        userId: user._id.toString(),
        role: user.role,
        organizationId: org._id.toString(),
        customerId: customer._id.toString(),
        email: user.email,
        name: user.name,
      },
      envConfig.JWT_SECRET,
      900,
    );

    // Set secure HTTP-only refresh cookie
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: envConfig.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          customerId: customer._id,
        },
        customer: {
          id: customer._id,
          businessName: customer.businessName,
          customerNumber: customer.customerNumber,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const parsed = loginSchema.parse(req.body);

    const rateCheck = checkRateLimit(parsed.email);
    if (!rateCheck.allowed) {
      res.status(429).json({
        success: false,
        message: `Too many failed login attempts. Account temporarily locked. Try again in ${rateCheck.remainingLockSeconds} seconds.`,
      });
      return;
    }

    const user = await User.findOne({
      organizationId: org._id,
      email: parsed.email,
    });

    if (!user) {
      recordFailedLogin(parsed.email);
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    if (user.status !== 'ACTIVE') {
      res.status(403).json({ success: false, message: `Account is ${user.status.toLowerCase()}` });
      return;
    }

    const isMatch = await verifyPassword(parsed.password, user.passwordHash);
    if (!isMatch) {
      recordFailedLogin(parsed.email);
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    clearFailedLogin(parsed.email);

    // Issue new session tokens
    const refreshToken = generateSecureToken();
    user.refreshTokenHash = hashToken(refreshToken);
    user.lastLoginAt = new Date();
    await user.save();

    const accessToken = signJwtToken(
      {
        userId: user._id.toString(),
        role: user.role,
        organizationId: org._id.toString(),
        customerId: user.customerId?.toString(),
        email: user.email,
        name: user.name,
      },
      envConfig.JWT_SECRET,
      900,
    );

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: envConfig.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          customerId: user.customerId,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const clientRefreshToken = cookies.refresh_token;

    if (!clientRefreshToken) {
      res.status(401).json({ success: false, message: 'No refresh token provided' });
      return;
    }

    const tokenHash = hashToken(clientRefreshToken);
    const user = await User.findOne({ refreshTokenHash: tokenHash, status: 'ACTIVE' });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid or revoked refresh token' });
      return;
    }

    // Refresh token rotation: issue a fresh one
    const newRefreshToken = generateSecureToken();
    user.refreshTokenHash = hashToken(newRefreshToken);
    await user.save();

    const newAccessToken = signJwtToken(
      {
        userId: user._id.toString(),
        role: user.role,
        organizationId: user.organizationId.toString(),
        customerId: user.customerId?.toString(),
        email: user.email,
        name: user.name,
      },
      envConfig.JWT_SECRET,
      900,
    );

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: envConfig.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          customerId: user.customerId,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const clientRefreshToken = cookies.refresh_token;

    if (clientRefreshToken) {
      const tokenHash = hashToken(clientRefreshToken);
      await User.findOneAndUpdate(
        { refreshTokenHash: tokenHash },
        { $unset: { refreshTokenHash: 1 } },
      );
    }

    res.clearCookie('refresh_token');
    res.clearCookie('access_token');

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }

  res.json({
    success: true,
    data: {
      user: req.user,
    },
  });
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      res.status(400).json({ success: false, message: 'Valid email is required' });
      return;
    }

    const user = await User.findOne({ organizationId: org._id, email: email.trim().toLowerCase() });
    if (user) {
      const rawToken = generateSecureToken();
      user.resetPasswordTokenHash = hashToken(rawToken);
      user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry
      await user.save();

      // In production: send email without logging token
      // In dev environment: return resetToken in payload to facilitate automated tests
      const isDev = envConfig.NODE_ENV !== 'production';

      res.json({
        success: true,
        message: 'If the email exists, password reset instructions have been dispatched.',
        resetToken: isDev ? rawToken : undefined,
      });
      return;
    }

    // Always return success to prevent email enumeration
    res.json({
      success: true,
      message: 'If the email exists, password reset instructions have been dispatched.',
    });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      res.status(400).json({ success: false, message: 'Token and new password are required' });
      return;
    }

    const strength = validatePasswordStrength(newPassword);
    if (!strength.valid) {
      res.status(400).json({ success: false, message: strength.error });
      return;
    }

    const tokenHash = hashToken(token);
    const user = await User.findOne({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      res
        .status(400)
        .json({ success: false, message: 'Password reset token is invalid or has expired' });
      return;
    }

    user.passwordHash = await hashPassword(newPassword);
    user.resetPasswordTokenHash = undefined;
    user.resetPasswordExpires = undefined;
    user.refreshTokenHash = undefined; // Revoke active sessions on reset
    await user.save();

    res.json({ success: true, message: 'Password successfully reset. You can now login.' });
  } catch (err) {
    next(err);
  }
}

/**
 * Creates staff account (ADMIN only permission).
 */
export async function createStaffMember(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const parsed = createStaffSchema.parse(req.body);

    const strength = validatePasswordStrength(parsed.password);
    if (!strength.valid) {
      res.status(400).json({ success: false, message: strength.error });
      return;
    }

    const existing = await User.findOne({ organizationId: org._id, email: parsed.email });
    if (existing) {
      res
        .status(409)
        .json({ success: false, message: `User with email ${parsed.email} already exists` });
      return;
    }

    const passwordHash = await hashPassword(parsed.password);
    const staff = await User.create({
      organizationId: org._id,
      name: parsed.name,
      email: parsed.email,
      passwordHash,
      role: 'STAFF',
      status: 'ACTIVE',
    });

    res.status(201).json({
      success: true,
      message: `Staff account created for ${staff.name}`,
      data: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        status: staff.status,
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Lists staff accounts (ADMIN only permission).
 */
export async function listStaffMembers(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const org = await getOrCreateDefaultOrganization();
    const staff = await User.find({
      organizationId: org._id,
      role: { $in: ['ADMIN', 'STAFF'] },
    })
      .select('name email role status lastLoginAt createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: staff });
  } catch (err) {
    next(err);
  }
}
