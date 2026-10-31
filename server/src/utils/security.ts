import crypto from 'crypto';

/**
 * Validates password strength against policy:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one special character
 * - At least one number
 */
export function validatePasswordStrength(password: string): { valid: boolean; error?: string } {
  if (!password || password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number.' };
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one special character.' };
  }
  return { valid: true };
}

/**
 * Hashes a password using Node.js built-in scrypt with a cryptographically secure 16-byte salt.
 * OWASP-compliant key derivation function.
 */
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

/**
 * Verifies a plaintext password against a stored scrypt hash using timing-safe comparison.
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  return new Promise((resolve) => {
    const parts = storedHash.split(':');
    if (parts.length !== 2) return resolve(false);

    const [salt, keyHex] = parts;
    const key = Buffer.from(keyHex, 'hex');

    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return resolve(false);
      try {
        const isMatch = crypto.timingSafeEqual(key, derivedKey);
        resolve(isMatch);
      } catch {
        resolve(false);
      }
    });
  });
}

/**
 * Signs an HMAC-SHA256 JWT access token.
 */
export function signJwtToken(
  payload: Record<string, unknown>,
  secret: string,
  expiresInSeconds = 900, // 15 minutes default short-lived
): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload = { ...payload, exp, iat: Math.floor(Date.now() / 1000) };

  const encodeBase64Url = (obj: unknown) => Buffer.from(JSON.stringify(obj)).toString('base64url');

  const encodedHeader = encodeBase64Url(header);
  const encodedPayload = encodeBase64Url(fullPayload);

  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64url');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verifies and decodes an HMAC-SHA256 JWT access token.
 */
export function verifyJwtToken<T = Record<string, unknown>>(
  token: string,
  secret: string,
): { valid: boolean; payload?: T; error?: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Malformed token structure' };
    }

    const [encodedHeader, encodedPayload, signature] = parts;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');

    const sigBuffer = Buffer.from(signature);
    const expectedSigBuffer = Buffer.from(expectedSignature);

    if (
      sigBuffer.length !== expectedSigBuffer.length ||
      !crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)
    ) {
      return { valid: false, error: 'Invalid token signature' };
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as T & {
      exp?: number;
    };

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false, error: 'Token has expired' };
    }

    return { valid: true, payload };
  } catch (err) {
    return { valid: false, error: 'Token verification failed' };
  }
}

/**
 * Generates a high-entropy random token for refresh sessions or password reset.
 */
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hashes a token with SHA-256 for safe database storage.
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
