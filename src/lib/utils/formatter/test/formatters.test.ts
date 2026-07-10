import { describe, expect, it } from 'vitest'
import { formatTime } from '../formatters'

describe('formatTime', () => {
  it.each([null, undefined, Number.NaN])('returns a placeholder for %s', value => {
    expect(formatTime(value)).toBe('--')
  })

  it('formats a valid timestamp', () => {
    const result = formatTime(Date.UTC(2024, 0, 2, 3, 4, 5))

    expect(result).toMatch(/2024/)
    expect(result).not.toBe('--')
  })
})
