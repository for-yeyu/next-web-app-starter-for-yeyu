'use client'

import type { FC } from 'react'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { BaseError } from '@/lib/common/errors/base'
import { useErrorStore } from '@/lib/common/errors/error-store'
import { initializeErrorStore } from '@/lib/runtime/init-error-store'

export const ErrorHandler: FC = () => {
  const lastError = useErrorStore(state => state.lastError)
  const setLastError = useErrorStore(state => state.setLastError)

  const recentMessages = useRef<Partial<Record<string, boolean>>>({})

  useEffect(() => {
    return initializeErrorStore()
  }, [])

  useEffect(() => {
    if (lastError != null) {
      setLastError(null)

      if (lastError instanceof BaseError) {
        setTimeout(() => {
          if (!lastError.handled) {
            lastError.handled = true

            if (recentMessages.current[lastError.message] !== true) {
              recentMessages.current[lastError.message] = true

              toast.error(lastError.message)

              setTimeout(() => {
                delete recentMessages.current[lastError.message]
              }, 1000)
            }
          }
        })
        if (lastError.needFix) {
          console.error(lastError)
        } else {
          // biome-ignore lint/suspicious/noConsole: <ignore>
          console.log(lastError)
        }
      } else {
        console.error(lastError)
      }
    }
  }, [lastError, setLastError])

  return null
}
