import 'server-only'
import { z } from 'zod'

const jwtSecretSchema = z.object({
  jwtSecret: z.string().trim().min(1),
})

export const jwtSecretConfig = jwtSecretSchema.parse({
  jwtSecret: process.env.JwtSecret,
})

export const jwtSecret = jwtSecretConfig.jwtSecret

export type JwtSecretConfig = z.infer<typeof jwtSecretSchema>
