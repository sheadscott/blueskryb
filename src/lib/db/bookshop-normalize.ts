// Normalize a book's title and author for bookshop.org ISBN13 lookup
// - Remove duplicate whitespace from title and author (max one space between words)
// - For title: if it contains ':', '(', or '[', only take the part before that, trimmed
// - Concatenate as: `${title} by ${author}`
// - Return the result

function normalizeWhitespace(str: string): string {
  return str.replace(/\s+/g, ' ').trim()
}

export function getBookshopQueryString(title: string, author: string): string {
  let cleanTitle = normalizeWhitespace(title)
  const match = cleanTitle.match(/^[^:(\[]+/)
  if (match) cleanTitle = match[0].trim()
  const cleanAuthor = normalizeWhitespace(author)
  const query = `${cleanTitle} by ${cleanAuthor}`
  // encodeURIComponent, then replace %20 (space) with +
  return encodeURIComponent(query).replace(/%20/g, '+')
}

export function getBookshopSearchUrl(title: string, author: string): string {
  const encoded = getBookshopQueryString(title, author)
  return `https://bookshop.org/beta-search?keywords=${encoded}`
}
