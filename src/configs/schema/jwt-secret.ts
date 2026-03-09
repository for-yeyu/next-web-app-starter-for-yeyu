import { z } from 'zod'

export const jwtSecretSchema = z.object({
  jwtSecret: z.string().trim().min(1),
})

export type JwtSecretConfig = z.infer<typeof jwtSecretSchema>
