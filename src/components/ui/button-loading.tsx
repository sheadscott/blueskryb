import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function ButtonLoading({ children }: { children: React.ReactNode }) {
  return (
    <Button disabled>
      <Loader2 className="animate-spin" />
      {children}
    </Button>
  )
}
