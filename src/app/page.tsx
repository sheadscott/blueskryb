import UploadBooks from '@/components/upload-books'
import getSession from '@/lib/iron'

export default async function Home() {
  const session = await getSession()
  console.log('Session: ', session)
  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <h1 className="font-black text-5xl uppercase">Welcome to Blueskryb</h1>
      <div className="w-full">
        {/* If the user is logged in then show them the upload Goodread component */}
        {session.user ? (
          <UploadBooks userId={session.user.id} />
        ) : (
          // <ReactPapaparse />
          <div>Blueskryb is a platform for reading and sharing books.</div>
        )}
      </div>
    </main>
  )
}
