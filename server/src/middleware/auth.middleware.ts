import { Request, Response, NextFunction } from 'express';
import { verifyJwtToken } from '../utils/security';
import { envConfig } from '../config/env';
import { UserRole } from '../models/user.model';

export interface AuthenticatedUserPayload {
  userId: string;
  role: UserRole;
  organizationId: string;
  customerId?: string;
  email: string;
  name: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUserPayload;
    }
  }
}

/**
 * Parses cookies from raw Cookie header.
 */
export function parseCookies(cookieHeader?: string): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const name = parts[0]?.trim();
    if (name) {
      list[name] = decodeURIComponent(parts.slice(1).join('=').trim());
    }
  });

  return list;
}

/**
 * Authentication middleware: verifies Bearer token in Authorization header
 * or access cookie, populating req.user.
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else {
    const cookies = parseCookies(req.headers.cookie);
    token = cookies.access_token;
  }

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: 'Authentication required. No token provided.' });
    return;
  }

  const verified = verifyJwtToken<AuthenticatedUserPayload>(token, envConfig.JWT_SECRET);
  if (!verified.valid || !verified.payload) {
    res
      .status(401)
      .json({ success: false, message: verified.error || 'Invalid or expired token.' });
    return;
  }

  req.user = verified.payload;
  next();
}

/**
 * Optional authentication: attaches req.user if a valid token is present, but does not block if absent.
 */
export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else {
    const cookies = parseCookies(req.headers.cookie);
    token = cookies.access_token;
  }

  if (token) {
    const verified = verifyJwtToken<AuthenticatedUserPayload>(token, envConfig.JWT_SECRET);
    if (verified.valid && verified.payload) {
      req.user = verified.payload;
    }
  }

  next();
}

/**
 * Role-Based Access Control (RBAC) middleware: ensures req.user has one of the allowed roles.
 */
export function requireRoles(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: Access requires one of [${allowedRoles.join(', ')}] permissions. Current role: ${req.user.role}`,
      });
      return;
    }

    next();
  };
}

/**
 * Customer isolation guard: prevents Insecure Direct Object Reference (IDOR).
 * Ensures CUSTOMER role can only access records matching their assigned customerId.
 */
export function requireCustomerIsolation(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Authentication required.' });
    return;
  }

  // Admins and Staff have workspace-wide authority
  if (req.user.role === 'ADMIN' || req.user.role === 'STAFF') {
    return next();
  }

  // Customer must have an assigned customerId
  if (req.user.role === 'CUSTOMER') {
    if (!req.user.customerId) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: No customer account attached to user profile.',
      });
      return;
    }

    // If request contains customerId param or query, check match
    const requestedCustomerId =
      req.params.customerId || req.query.customerId || req.body?.customerId;
    if (requestedCustomerId && requestedCustomerId !== req.user.customerId) {
      res.status(403).json({
        success: false,
        message: 'Forbidden: Customer data isolation violation (IDOR prevented).',
      });
      return;
    }
  }

  next();
}
