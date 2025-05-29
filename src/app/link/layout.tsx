import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blueskryb Link Generator',
  description: 'Convert Bookshop.org URLs to pretty links',
  openGraph: {
    title: 'Blueskryb Link Generator',
    description: 'Convert Bookshop.org URLs to pretty links',
  },
}

export default function LinkLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
