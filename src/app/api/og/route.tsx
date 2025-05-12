import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const coverUrl = searchParams.get('cover')
  if (!coverUrl) {
    return new Response('Missing cover param', { status: 400 })
  }
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 628,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#efefef',
        }}
      >
        <img
          src={coverUrl}
          style={{
            maxHeight: 628 * 0.9,
            maxWidth: 1200 * 0.4,
            objectFit: 'contain',
            boxShadow: '0 4px 32px rgba(0,0,0,0.15)',
            borderRadius: 16,
            background: '#fff',
          }}
        />
      </div>
    ),
    { width: 1200, height: 628 }
  )
}
