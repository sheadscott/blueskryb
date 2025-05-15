interface HandlePageProps {
  params: Promise<{ handle: string }>
}

export default async function HandlePage({ params }: HandlePageProps) {
  const { handle } = await params

  // You can fetch user data here using the handle
  // Example: const user = await getUserByHandle(handle)
  // if (!user) return notFound()

  return <h1>Profile for {handle}</h1>
}
