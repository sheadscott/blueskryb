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

// https://cdn.bsky.app/img/feed_thumbnail/plain/did:plc:hekesxwmqrhmfbf77qe6jhe4/bafkreifnlryp65qn76dhkfnfgtrs7avtrg2hlkcjlqmgpfqq7hjql4spa4@jpeg
// https://atproto-browser.vercel.app/blob/did:plc:hekesxwmqrhmfbf77qe6jhe4/bafkreifnlryp65qn76dhkfnfgtrs7avtrg2hlkcjlqmgpfqq7hjql4spa4
