'use client'

import { useState } from 'react'
import { Button } from '@/ui/shadcn/button'

type ErrorResponse = {
  message?: unknown
}

export function JwtSecretButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [jwtSecret, setJwtSecret] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleClick() {
    setIsLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch('/api/jwt-secret', {
        method: 'GET',
        cache: 'no-store',
      })
      const json: unknown = await response.json()

      if (!response.ok) {
        const message =
          typeof json === 'object' &&
          json !== null &&
          'message' in json &&
          typeof (json as ErrorResponse).message === 'string'
            ? (json as { message: string }).message
            : 'Request failed'
        throw new Error(message)
      }

      if (typeof json !== 'string') {
        throw new Error('Invalid API response format')
      }

      setJwtSecret(json)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
      setJwtSecret('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-4 flex flex-col gap-2">
      <Button className="w-fit" disabled={isLoading} onClick={handleClick}>
        {isLoading ? 'Loading...' : 'Get Jwt Secret'}
      </Button>

      {jwtSecret ? <div className="text-sm">JwtSecret: {jwtSecret}</div> : null}
      {errorMessage ? <div className="text-red-500 text-sm">{errorMessage}</div> : null}
    </div>
  )
}
