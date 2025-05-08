import { helloWorldTask } from '@/trigger/example'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const handle = await helloWorldTask.trigger({ test: true })
    return NextResponse.json(handle)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
