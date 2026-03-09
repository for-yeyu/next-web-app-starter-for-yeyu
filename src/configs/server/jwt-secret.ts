import 'server-only'
import { jwtSecretSchema } from '../schema'

export const jwtSecretConfig = jwtSecretSchema.parse({
  jwtSecret: process.env.JwtSecret,
})

export const jwtSecret = jwtSecretConfig.jwtSecret
