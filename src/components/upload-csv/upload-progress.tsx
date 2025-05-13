import { useRealtimeRun } from '@trigger.dev/react-hooks'

export function UploadProgress({
  runId,
  publicAccessToken,
}: {
  runId: string
  publicAccessToken: string
}) {
  const { run, error } = useRealtimeRun(runId, {
    accessToken: publicAccessToken, // This is required
  })

  return (
    <div>
      <h1>Upload Progress</h1>
      <p>{run?.status}</p>
      <p>{error?.message}</p>
    </div>
  )

  // ...
}
