import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface ButtonLoadingProps {
  children: React.ReactNode
  className?: string
}

export function ButtonLoading({ children, className }: ButtonLoadingProps) {
  return (
    <Button disabled className={className}>
      <Loader2 className="animate-spin" />
      {children}
    </Button>
  )
}
