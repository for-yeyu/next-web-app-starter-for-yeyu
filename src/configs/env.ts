import { z } from 'zod'

const environmentSchema = z.enum(['development', 'production'])

const envSchema = z.object({
  environment: environmentSchema,
})

export const env = envSchema.parse({
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
})

export type Environment = z.infer<typeof environmentSchema>
