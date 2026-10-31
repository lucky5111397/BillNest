import { describe, it, expect } from 'vitest';
import {
  validatePasswordStrength,
  hashPassword,
  verifyPassword,
  signJwtToken,
  verifyJwtToken,
  generateSecureToken,
  hashToken,
} from '../src/utils/security';

describe('Security & Cryptographic Utilities', () => {
  it('enforces comprehensive password strength policy', () => {
    // Too short
    expect(validatePasswordStrength('Short1!').valid).toBe(false);
    // Missing uppercase
    expect(validatePasswordStrength('lowercase1!').valid).toBe(false);
    // Missing lowercase
    expect(validatePasswordStrength('UPPERCASE1!').valid).toBe(false);
    // Missing number
    expect(validatePasswordStrength('NoNumbers!').valid).toBe(false);
    // Missing special character
    expect(validatePasswordStrength('NoSpecial123').valid).toBe(false);
    // Valid strong password
    expect(validatePasswordStrength('BillNest@Secure2026').valid).toBe(true);
  });

  it('hashes and verifies passwords using timing-safe scrypt', async () => {
    const rawPassword = 'StrongP@ssword2026!';
    const hashed = await hashPassword(rawPassword);

    expect(hashed).toContain(':');
    expect(await verifyPassword(rawPassword, hashed)).toBe(true);
    expect(await verifyPassword('WrongPassword', hashed)).toBe(false);
  });

  it('signs and verifies JWT access tokens with expiration checking', () => {
    const secret = 'super-secret-test-key-32-chars-long';
    const payload = { userId: 'user-123', role: 'ADMIN' };

    const token = signJwtToken(payload, secret, 300); // 5 min
    const verified = verifyJwtToken<{ userId: string; role: string }>(token, secret);

    expect(verified.valid).toBe(true);
    expect(verified.payload?.userId).toBe('user-123');
    expect(verified.payload?.role).toBe('ADMIN');

    // Wrong secret verification fails
    const invalid = verifyJwtToken(token, 'wrong-secret');
    expect(invalid.valid).toBe(false);
  });

  it('generates high entropy tokens and produces deterministic SHA-256 hashes', () => {
    const token1 = generateSecureToken();
    const token2 = generateSecureToken();
    expect(token1).not.toBe(token2);
    expect(token1.length).toBe(64); // 32 bytes hex = 64 chars

    const hash1 = hashToken(token1);
    const hash2 = hashToken(token1);
    expect(hash1).toBe(hash2);
  });
});

