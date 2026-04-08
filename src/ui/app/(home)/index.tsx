import type { FC } from 'react'
import Link from 'next/link'
import { sharedConfig } from '@/configs/shared'
import { ServerConfig } from './server-config'

export const HomePage: FC = () => {
  return (
    <div className="container space-y-6">
      <div className="space-y-2">
        <h1 className="font-semibold text-3xl tracking-tight">Home</h1>
        <div>Environment: {sharedConfig.env.environment}</div>
        <div>App Name: {sharedConfig.appConfig.appName}</div>
      </div>

      <ServerConfig />

      <div className="flex flex-col space-y-2">
        <Link className="text-primary hover:underline" href="/examples/server-time">
          Example: Server Time
        </Link>
      </div>
    </div>
  )
}
