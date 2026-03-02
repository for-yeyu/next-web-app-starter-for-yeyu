'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { type FC, useEffect, useState } from 'react'
import { Button } from '@/ui/shadcn/button'

type ButtonProps = React.ComponentProps<typeof Button>

// TODO: animation
export const SwitchTheme: FC<ButtonProps> = props => {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button size="icon" variant="ghost" className="cursor-pointer" {...props}>
        <Sun className="opacity-0" />
      </Button>
    )
  }

  return (
    <Button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      size="icon"
      className="cursor-pointer"
      variant={'ghost'}
      {...props}
    >
      {theme === 'light' ? <Sun /> : <Moon />}
    </Button>
  )
}
