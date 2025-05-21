interface HandlePageProps {
  params: Promise<{ handle: string }>
}

export default async function FriendsPage({ params }: HandlePageProps) {
  const { handle } = await params

  // You can fetch user data here using the handle
  // Example: const user = await getUserByHandle(handle)
  // if (!user) return notFound()

  return (
    <div>
      <h1>{handle}&apos;s Friends</h1>
    </div>
  )
}
