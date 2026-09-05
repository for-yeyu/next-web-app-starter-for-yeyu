'use client'

import type { FC, ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/http/react-query'
import { Toaster } from '@/ui/shadcn/sonner'
import { ErrorHandler } from './error-handler'

export const Providers: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <Toaster />
      <ErrorHandler />
      {children}
    </QueryClientProvider>
  )
}
