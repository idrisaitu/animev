import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AnimeGridProps {
  children: ReactNode
  className?: string
}

export function AnimeGrid({ children, className }: AnimeGridProps) {
  return (
    <div className={cn(
      "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6",
      className
    )}>
      {children}
    </div>
  )
}
