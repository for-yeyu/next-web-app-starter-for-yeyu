import { z } from 'zod'

const appSchema = z.object({
  appName: z.string().trim().min(1),
})

export const app = appSchema.parse({
  appName: process.env.NEXT_PUBLIC_APP_NAME,
})

export const appName = app.appName

export type App = z.infer<typeof appSchema>
