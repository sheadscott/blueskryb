import getSession from '@/lib/iron'
import type { Metadata } from 'next'
import { League_Spartan, Libre_Baskerville } from 'next/font/google'
// import localFont from 'next/font/local'
import Footer from '@/components/footer/footer'
import Header from '@/components/header/header'
import { WebVitals } from '@/components/performance/web-vitals'
import { CookieConsentWrapper } from '@/components/ui/cookie-consent-wrapper'
import { Suspense } from 'react'
import './globals.css'
import { PostHogProvider } from './providers'

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
        <PostHogProvider>
          <WebVitals />
          <Suspense fallback={null}>
            <CookieConsentWrapper />
          </Suspense>
          <div className="container max-w-4xl mx-auto px-4 flex flex-col min-h-screen">
            <Header user={session.user} />
            <main className="md:mt-8">{children}</main>
            <Footer />
          </div>
        </PostHogProvider>
      </body>
    </html>
  )
}
