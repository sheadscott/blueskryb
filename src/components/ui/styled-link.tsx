import Link from 'next/link'

export default function StyledLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="text-base text-gray-500 inline-block hover:underline"
    >
      {children}
    </Link>
  )
}
