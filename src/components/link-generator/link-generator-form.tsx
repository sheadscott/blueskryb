'use client'

import { Button } from '@/components/ui/button'
import { ButtonLoading } from '@/components/ui/button-loading'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { extractIsbn13FromBookshopUrl, getBaseUrl } from '@/lib/utils'
import { Copy, ExternalLink, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { lazy, Suspense, useState } from 'react'

// Lazy load the Image component to reduce initial bundle size
const OptimizedImage = lazy(() =>
  import('next/image').then((mod) => ({ default: mod.default }))
)

export function LinkGeneratorForm() {
  const [bookshopUrl, setBookshopUrl] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')
  const [ogImageUrl, setOgImageUrl] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [showImage, setShowImage] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setGeneratedLink('')
    setCopied(false)
    setImageLoading(true)
    setShowImage(false)

    try {
      if (!bookshopUrl.trim()) {
        setError('Please enter a Bookshop.org URL')
        setImageLoading(false)
        return
      }

      // Extract ISBN13 from the URL
      const isbn13 = extractIsbn13FromBookshopUrl(bookshopUrl)

      if (!isbn13) {
        setError(
          'Could not extract ISBN13 from the URL. Make sure it contains an ean= parameter.'
        )
        setImageLoading(false)
        return
      }

      // Generate the Blueskryb link first (fast)
      const baseUrl = getBaseUrl(
        process.env.NEXT_PUBLIC_VERCEL_ENV || 'development'
      )
      const blueskrybLink = `${baseUrl}/book/link/${isbn13}`
      setGeneratedLink(blueskrybLink)

      // Only load image if it's different (lazy)
      const newOgImageApiUrl = `/api/og?isbn=${isbn13}`
      if (ogImageUrl !== newOgImageApiUrl) {
        setOgImageUrl(newOgImageApiUrl)
        setShowImage(true)
      } else {
        setImageLoading(false)
        setShowImage(true)
      }
    } catch (err) {
      setError('An error occurred while processing the URL')
      console.error(err)
      setImageLoading(false)
    }
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(generatedLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bookshop-url">Bookshop.org URL</Label>
          <Input
            id="bookshop-url"
            type="url"
            placeholder="https://bookshop.org/p/books/the-great-gatsby/18533627?ean=9780743273565..."
            value={bookshopUrl}
            onChange={(e) => setBookshopUrl(e.target.value)}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground">
            Paste a{' '}
            <Link
              href="https://bookshop.org"
              target="_blank"
              className="underline hover:text-primary"
            >
              Bookshop.org
            </Link>{' '}
            URL that contains an ISBN (ean)
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {imageLoading ? (
          <ButtonLoading className="w-full">Generating Link...</ButtonLoading>
        ) : (
          <Button type="submit" className="w-full">
            <ExternalLink className="mr-2 h-4 w-4" />
            Generate Link
          </Button>
        )}
      </form>

      {generatedLink && (
        <div className="space-y-2">
          <Label>Pretty Bookshop.org Link</Label>
          <div className="relative">
            <code className="block w-full rounded-md border bg-muted p-3 pr-14 text-sm font-mono break-all">
              {generatedLink}
            </code>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1 h-8 w-10 p-0 flex-shrink-0"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy to clipboard</span>
            </Button>
          </div>
          {copied && (
            <p className="text-sm text-green-600">Link copied to clipboard!</p>
          )}
        </div>
      )}

      {showImage && ogImageUrl && (
        <div className="space-y-2">
          <Label>Generated Book Cover Image</Label>
          <div className="rounded-md border bg-muted md:p-4 relative w-full">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-md z-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            <Suspense
              fallback={
                <div className="w-full h-[315px] flex items-center justify-center bg-muted rounded-md">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              }
            >
              <OptimizedImage
                src={ogImageUrl}
                alt="Generated book card"
                width={1200}
                height={630}
                key={ogImageUrl}
                className="w-full rounded-md shadow-sm"
                loading="lazy"
                priority={false}
                onLoadStart={() => setImageLoading(true)}
                onLoad={() => setImageLoading(false)}
                onError={(e) => {
                  console.error('Failed to load OG image')
                  setImageLoading(false)
                  e.currentTarget.style.display = 'none'
                }}
              />
            </Suspense>
          </div>
        </div>
      )}
    </>
  )
}
