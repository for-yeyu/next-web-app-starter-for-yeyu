'use client'

import type { ComponentProps, FC } from 'react'
import Link from 'next/link'
import { appName } from '@/configs/app'
import { cn } from '@/lib/utils/shadcn'
import { SwitchTheme } from '../components/shared/switch-theme'

export const Header: FC<ComponentProps<'div'>> = ({ className }) => {
  return (
    <div className={cn('sticky mb-4 flex h-16 w-screen border-b border-dashed', className)}>
      <div className="container m-auto flex justify-between">
        <Link href={'/'} className="text-2xl hover:underline">
          {appName}
        </Link>

        <div className="flex space-x-4">
          <SwitchTheme />
        </div>
      </div>
    </div>
  )
}
