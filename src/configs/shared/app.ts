import { appConfigSchema } from '../schema'

export const appConfig = appConfigSchema.parse({
  appName: process.env.NEXT_PUBLIC_APP_NAME,
})

export const appName = appConfig.appName
