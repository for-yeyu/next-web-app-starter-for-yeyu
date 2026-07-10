import { afterEach, describe, expect, it } from 'vitest'
import { useErrorStore } from '../error-store'

afterEach(() => {
  useErrorStore.setState({ lastError: null })
})

describe('useErrorStore', () => {
  it('stores the latest error', () => {
    const error = new Error('request failed')

    useErrorStore.getState().setLastError(error)

    expect(useErrorStore.getState().lastError).toBe(error)
  })

  it('clears the latest error', () => {
    useErrorStore.getState().setLastError(new Error('request failed'))
    useErrorStore.getState().setLastError(null)

    expect(useErrorStore.getState().lastError).toBeNull()
  })
})
