import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const MONGODB_URI_REGEX = /^mongodb(\+srv)?:\/\/.+/;

export const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(4000),
    CORS_ORIGIN: z.string().default('http://localhost:5173'),
    MONGODB_URI: z
      .string()
      .trim()
      .refine((val) => val === '' || MONGODB_URI_REGEX.test(val), {
        message: 'MONGODB_URI must be a valid mongodb:// or mongodb+srv:// connection URI',
      })
      .optional()
      .transform((val) => (val === '' ? undefined : val)),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV === 'production' && !data.MONGODB_URI) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['MONGODB_URI'],
        message: 'MONGODB_URI is required when NODE_ENV is "production"',
      });
    }
  });

export type EnvConfig = z.infer<typeof envSchema>;

function loadConfig(): EnvConfig {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errorDetails = result.error.format();
    console.error('Invalid environment configuration:', JSON.stringify(errorDetails, null, 2));
    throw new Error('Invalid environment configuration');
  }

  return result.data;
}

export const envConfig = loadConfig();
