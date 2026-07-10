import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

afterEach(() => {
  vi.resetModules()
  vi.unstubAllEnvs()
})

describe('serverEnv', () => {
  it('exposes the server secret', async () => {
    vi.stubEnv('JwtSecret', 'server-secret')

    const { serverEnv } = await import('../server-env')

    expect(serverEnv).toEqual({
      jwtSecret: 'server-secret',
    })
  })
})
