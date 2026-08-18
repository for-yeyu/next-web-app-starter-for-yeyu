'use client'

import type { FC } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/ui/shadcn/button'

export const SwitchTheme: FC = () => {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      size="icon"
      variant="ghost"
      className="relative"
      onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="size-4 rotate-0 scale-100 opacity-100 transition-[transform,opacity] dark:-rotate-90 dark:scale-95 dark:opacity-0" />
      <Moon className="absolute size-4 rotate-90 scale-95 opacity-0 transition-[transform,opacity] dark:rotate-0 dark:scale-100 dark:opacity-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
