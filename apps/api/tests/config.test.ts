import { describe, it, expect } from 'vitest';
import { envSchema } from '../src/config/env';

describe('Environment Configuration Schema', () => {
  it('should parse valid environment variables with defaults', () => {
    const parsed = envSchema.parse({});

    expect(parsed.PORT).toBe(4000);
    expect(parsed.NODE_ENV).toBe('development');
    expect(parsed.CORS_ORIGIN).toBe('http://localhost:5173');
    expect(parsed.DATABASE_URL).toContain('postgresql://');
  });

  it('should accept custom valid values', () => {
    const parsed = envSchema.parse({
      PORT: '8080',
      NODE_ENV: 'production',
      CORS_ORIGIN: 'https://app.brightloop.io',
      DATABASE_URL:
        'postgresql://prod_user:secret@db.prod.internal:5432/brightloop?sslmode=require',
    });

    expect(parsed.PORT).toBe(8080);
    expect(parsed.NODE_ENV).toBe('production');
    expect(parsed.CORS_ORIGIN).toBe('https://app.brightloop.io');
  });

  it('should fail on invalid PORT or NODE_ENV', () => {
    expect(() =>
      envSchema.parse({
        PORT: 'invalid-port',
      }),
    ).toThrow();

    expect(() =>
      envSchema.parse({
        NODE_ENV: 'staging', // only 'development' | 'test' | 'production' allowed
      }),
    ).toThrow();
  });
});
