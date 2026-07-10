import { afterEach, describe, expect, it, vi } from 'vitest'

afterEach(() => {
  vi.resetModules()
  vi.unstubAllEnvs()
})

describe('clientEnv', () => {
  it('exposes validated public environment values', async () => {
    vi.stubEnv('NEXT_PUBLIC_ENVIRONMENT', 'development')
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', 'Test application')

    const { clientEnv } = await import('../client-env')

    expect(clientEnv).toEqual({
      environment: 'development',
      appName: 'Test application',
    })
  })
})
