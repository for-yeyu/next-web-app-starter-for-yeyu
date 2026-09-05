import { describe, expect, it } from 'vitest'
import { validateServerEnv } from '../validate-server-env'

describe('validateServerEnv', () => {
  it('does not require project-specific server environment values', () => {
    expect(() => validateServerEnv()).not.toThrow()
  })
})
