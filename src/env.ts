import { z } from 'zod';

export const envSchema = z.object({
    AUTH_API: z.string(),
    AUTH_API_KEY: z.string(),
    JWT_SECRET: z.string(),
    NODE_ENV: z.enum(['development', 'production']),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);