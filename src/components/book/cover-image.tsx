'use client'

import Image from 'next/image'
import { useState } from 'react'

interface BookCoverImageProps {
  src: string
  alt: string
  className?: string
  width: number
  height: number
}

export function BookCoverImage({
  src,
  alt,
  className,
  width,
  height,
}: BookCoverImageProps) {
  const fallback = '/default-cover.svg'
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      onError={() => setImgSrc(fallback)}
      loading="lazy"
      referrerPolicy="no-referrer"
    />
  )
}
