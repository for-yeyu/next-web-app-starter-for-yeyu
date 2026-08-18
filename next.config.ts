import type { NextConfig } from 'next'
import { validatePublicEnv } from './src/configs/validator/validate-public-env'
import { validateServerEnv } from './src/configs/validator/validate-server-env'

validatePublicEnv()
validateServerEnv()

const config: NextConfig = {
  reactCompiler: true,
  experimental: {
    turbopackRustReactCompiler: true,
    optimizePackageImports: ['lucide-react'],
  },
  typedRoutes: true,
}

export default config
