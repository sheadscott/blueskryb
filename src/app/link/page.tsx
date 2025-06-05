import { LinkGeneratorForm } from '@/components/link-generator/link-generator-form'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pretty Link Generator - Blueskryb',
  description:
    'Convert Bookshop.org URLs to beautiful, shareable links with book cover previews',
}

export default function LinkGeneratorPage() {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <div className="space-y-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight">
            Bookshop.org Pretty Link Generator
          </h1>
          <p className="font-sans mt-2 text-lg">
            Convert{' '}
            <Link
              href="https://bookshop.org"
              target="_blank"
              className="underline hover:text-primary"
            >
              Bookshop.org
            </Link>{' '}
            URLs to pretty links
          </p>
        </div>

        <LinkGeneratorForm />
      </div>
    </div>
  )
}
