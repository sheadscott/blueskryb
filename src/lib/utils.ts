import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBaseUrl(env: string) {
  if (env === 'production') {
    return 'https://www.blueskryb.cloud'
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

/**
 * Fetch with retry logic and exponential backoff
 * @param url - The URL to fetch
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @returns Promise<Response> - The successful response
 * @throws Error with descriptive message including the URL
 */
export async function retryFetch(
  url: string,
  maxRetries = 3
): Promise<Response> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url)

      if (response.ok) {
        // console.log(`Fetch successful for: ${url}`)
        return response
      }

      if (response.status === 404) {
        throw new Error(`Resource not found (404): ${url}`)
      }

      if (attempt === maxRetries) {
        throw new Error(
          `Fetch failed after all retries (${response.status}): ${url}`
        )
      }

      console.warn(
        `Fetch failed (attempt ${attempt}/${maxRetries}, status ${response.status}): ${url}`
      )

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt - 1) * 1000)
      )
    } catch (error) {
      if (attempt === maxRetries || (error as Error).message.includes('404')) {
        throw error
      }

      console.warn(
        `Fetch error (attempt ${attempt}/${maxRetries}): ${error} - ${url}`
      )

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt - 1) * 1000)
      )
    }
  }

  throw new Error(`Unexpected retry loop exit for: ${url}`)
}
