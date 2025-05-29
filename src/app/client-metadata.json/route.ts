import { blueskyClientMetadata } from '@/lib/atproto'
import { NextResponse } from 'next/server'

// Comment for git
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(blueskyClientMetadata(), {
    status: 200,
  })
}
