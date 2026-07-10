import { afterEach, describe, expect, it, vi } from 'vitest'
import { validateServerEnv } from '../validate-server-env'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('validateServerEnv', () => {
  it('accepts a non-empty server secret', () => {
    vi.stubEnv('JwtSecret', 'server-secret')

    expect(() => validateServerEnv()).not.toThrow()
  })

  it('rejects a missing server secret', () => {
    vi.stubEnv('JwtSecret', '')

    expect(() => validateServerEnv()).toThrowError(/JwtSecret is required/)
  })

  it('rejects a whitespace-only server secret', () => {
    vi.stubEnv('JwtSecret', '   ')

    expect(() => validateServerEnv()).toThrowError(/JwtSecret is required/)
  })
})
