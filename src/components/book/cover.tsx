'use client'

import Image from 'next/image'
import { useState } from 'react'

interface BookCoverProps {
  isbn: string | null
  title?: string
  author?: string
  className?: string
  width?: number
  height?: number
}

export default function BookCover({
  isbn,
  title,
  author,
  className,
  width = 96,
  height = 144,
}: BookCoverProps) {
  const fallback = '/default-cover.svg'
  const [src, setSrc] = useState(
    isbn ? `https://images-us.bookshop.org/ingram/${isbn}.jpg` : fallback
  )

  let alt = 'Book cover'
  if (title && author) alt = `Cover of ${title} by ${author}`
  else if (title) alt = `Cover of ${title}`
  else if (author) alt = `Book by ${author}`

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={() => setSrc(fallback)}
      loading="lazy"
    />
  )
}

// 9780823405954

// https://covers.openlibrary.org/b/isbn/9780823405954-L.jpg

// https://covers.openlibrary.org/b/isbn/9780312367541-L.jpg

// 9781599869506

// https://covers.openlibrary.org/b/isbn/9781599869506-L.jpg

// 9780060976255

// https://images-us.bookshop.org/ingram/9780060976255.jpg

// https://images-us.bookshop.org/ingram/9780545586177.jpg?v=enc-v1

// 9781780383040

// https://images-us.bookshop.org/ingram/9781780383040.jpg
