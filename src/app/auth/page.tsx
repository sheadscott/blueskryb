import ComboForm from '@/components/auth/combo-form'
import UploadBooks from '@/components/upload-csv/upload-books'
import getSession from '@/lib/iron'

export default async function Home() {
  const session = await getSession()
  // if env is production, redirect to https://blueskryb.cloud/link
  // console.log('Session: ', session.user)
  return (
    <>
      {/* If the user is logged in then show them the upload Goodread component */}
      {session.user ? (
        <UploadBooks userId={session.user.id} />
      ) : (
        // <ReactPapaparse />
        <div className="flex flex-col items-center justify-center">
          <div className="py-8">
            Blueskryb is a platform for reading and sharing books. You think you
            have what it takes to upload your own books?
          </div>
          <ComboForm />
        </div>
      )}
    </>
  )
}
