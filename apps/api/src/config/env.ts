import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  DATABASE_URL: z
    .string()
    .url()
    .default(
      'postgresql://brightloop_dev:brightloop_dev_password@localhost:5432/brightloop_dev?schema=public',
    ),
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
export { envSchema };
