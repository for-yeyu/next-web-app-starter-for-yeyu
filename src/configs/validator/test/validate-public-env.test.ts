import { afterEach, describe, expect, it, vi } from 'vitest'
import { validatePublicEnv } from '../validate-public-env'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('validatePublicEnv', () => {
  it('accepts a valid public environment', () => {
    vi.stubEnv('NEXT_PUBLIC_ENVIRONMENT', 'development')
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', 'Test application')

    expect(() => validatePublicEnv()).not.toThrow()
  })

  it('rejects an unsupported environment name', () => {
    vi.stubEnv('NEXT_PUBLIC_ENVIRONMENT', 'test')
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', 'Test application')

    expect(() => validatePublicEnv()).toThrowError()
  })

  it('rejects a blank application name', () => {
    vi.stubEnv('NEXT_PUBLIC_ENVIRONMENT', 'production')
    vi.stubEnv('NEXT_PUBLIC_APP_NAME', '   ')

    expect(() => validatePublicEnv()).toThrowError(/NEXT_PUBLIC_APP_NAME is required/)
  })
})
