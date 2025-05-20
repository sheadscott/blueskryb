import Image from 'next/image'

export default function BookCover({ isbn }: { isbn: string }) {
  return (
    <div>
      <Image
        src={`https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`}
        alt={`Cover for ${isbn}`}
        width={300}
        height={450}
      />
    </div>
  )
}

// 9780823405954

// https://covers.openlibrary.org/b/isbn/9780823405954-L.jpg

// https://covers.openlibrary.org/b/isbn/9780312367541-L.jpg

// 9781599869506

// https://covers.openlibrary.org/b/isbn/9781599869506-L.jpg
