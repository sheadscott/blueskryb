import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl(env: string) {
  if (env === 'production') {
    return 'https://blueskryb.cloud'
  }
  if (env === 'preview') {
    return 'https://blueskryb-git-dev-shea-scotts-projects.vercel.app'
  }
  return 'http://127.0.0.1:3000'
}

/**
 * Extracts ISBN13 from Bookshop.org URLs
 * Supports URLs with ean= parameter like:
 * https://bookshop.org/p/books/james-percival-everett/20246670?ean=9780385550369&next=t&listref=pulitzer-prize-winning-books-and-finalists-2025&next=t
 */
export function extractIsbn13FromBookshopUrl(url: string): string | null {
  try {
    // Test that the url is a valid Bookshop.org URL
    if (!url.includes('bookshop.org')) {
      return null
    }
    // Use regex to find the ISBN13
    const match = url.match(isbn13Regex)
    return match ? match[0] : null
  } catch {
    return null
  }
}

export const isbn13Regex = /97(?:-?\d){11}/
