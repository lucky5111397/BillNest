import { describe, it, expect } from 'vitest';
import { envSchema } from '../src/config/env';

describe('Environment Configuration Schema', () => {
  it('should parse valid environment variables with defaults in development', () => {
    const parsed = envSchema.parse({});

    expect(parsed.PORT).toBe(4000);
    expect(parsed.NODE_ENV).toBe('development');
    expect(parsed.CORS_ORIGIN).toBe('http://localhost:5173');
    expect(parsed.MONGODB_URI).toBeUndefined();
  });

  it('should accept valid mongodb+srv URI in production', () => {
    const parsed = envSchema.parse({
      PORT: '8080',
      NODE_ENV: 'production',
      CORS_ORIGIN: 'https://app.billnest.io',
      MONGODB_URI:
        'mongodb+srv://prod_user:secret@cluster0.mongodb.net/billnest?retryWrites=true&w=majority',
    });

    expect(parsed.PORT).toBe(8080);
    expect(parsed.NODE_ENV).toBe('production');
    expect(parsed.CORS_ORIGIN).toBe('https://app.billnest.io');
    expect(parsed.MONGODB_URI).toBe(
      'mongodb+srv://prod_user:secret@cluster0.mongodb.net/billnest?retryWrites=true&w=majority',
    );
  });

  it('should accept standard mongodb:// URI format', () => {
    const parsed = envSchema.parse({
      MONGODB_URI: 'mongodb://localhost:27017/billnest_dev',
    });

    expect(parsed.MONGODB_URI).toBe('mongodb://localhost:27017/billnest_dev');
  });

  it('should treat empty string MONGODB_URI as undefined', () => {
    const parsed = envSchema.parse({
      MONGODB_URI: '   ',
    });

    expect(parsed.MONGODB_URI).toBeUndefined();
  });

  it('should reject invalid MONGODB_URI format', () => {
    expect(() =>
      envSchema.parse({
        MONGODB_URI: 'postgresql://localhost:5432/db',
      }),
    ).toThrow(/MONGODB_URI must be a valid mongodb/);

    expect(() =>
      envSchema.parse({
        MONGODB_URI: 'not-a-valid-uri',
      }),
    ).toThrow(/MONGODB_URI must be a valid mongodb/);
  });

  it('should require MONGODB_URI in production mode', () => {
    expect(() =>
      envSchema.parse({
        NODE_ENV: 'production',
      }),
    ).toThrow(/MONGODB_URI is required when NODE_ENV/);
  });

  it('should fail on invalid PORT or NODE_ENV', () => {
    expect(() =>
      envSchema.parse({
        PORT: 'invalid-port',
      }),
    ).toThrow();

    expect(() =>
      envSchema.parse({
        NODE_ENV: 'staging',
      }),
    ).toThrow();
  });
});
