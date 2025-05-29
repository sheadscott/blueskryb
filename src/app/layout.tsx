import Header from '@/components/header/header'
import getSession from '@/lib/iron'
import type { Metadata } from 'next'
import { League_Spartan, Libre_Baskerville } from 'next/font/google'
// import localFont from 'next/font/local'
import './globals.css'

// const lora = Lora({
//   weight: '400',
//   subsets: ['latin'],
//   variable: '--font-lora',
// })
const leagueSpartan = League_Spartan({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-league-spartan',
})

const libreBaskerville = Libre_Baskerville({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-libre-baskerville',
})

export const metadata: Metadata = {
  title: 'Blueskryb',
  description: 'Blueskryb is a platform for sharing books on Bluesky.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession()
  // console.log('session.user: ', session.user)
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${libreBaskerville.variable} ${leagueSpartan.variable} font-sans antialiased`}
      >
        <div className="container mx-auto px-4">
          <Header user={session.user} />
          {/* <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-(family-name:--font-geist-sans)"> */}
          <main className="max-w-xl mx-auto md:mt-8">{children}</main>
        </div>
      </body>
    </html>
  )
}
