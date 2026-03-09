import { z } from 'zod'

export const environmentSchema = z.enum(['development', 'production'])

export const envSchema = z.object({
  environment: environmentSchema,
})

export type Environment = z.infer<typeof environmentSchema>
export type EnvConfig = z.infer<typeof envSchema>
