import { z } from 'zod'

export const appConfigSchema = z.object({
  appName: z.string().trim().min(1),
})

export type AppConfig = z.infer<typeof appConfigSchema>
