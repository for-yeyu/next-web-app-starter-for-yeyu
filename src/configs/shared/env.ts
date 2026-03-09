import { envSchema } from '../schema'

export const env = envSchema.parse({
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
})
