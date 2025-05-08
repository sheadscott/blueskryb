import { processGoodreadsCSV } from '@/trigger/processGoodreadsCSV'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const userId = formData.get('userId') as string | null
    if (!file || !userId) {
      return NextResponse.json(
        { error: 'Missing file or userId' },
        { status: 400 }
      )
    }
    const text = await file.text()
    const handle = await processGoodreadsCSV.trigger({
      content: text,
      userId: parseInt(userId),
    })
    return NextResponse.json(handle)
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    )
  }
}
