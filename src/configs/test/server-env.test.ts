import { describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

describe('serverEnv', () => {
  it('starts without project-specific server config', async () => {
    const { serverEnv } = await import('../server-env')

    expect(serverEnv).toEqual({})
  })
})
