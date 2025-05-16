export async function fetchDid(handle: string) {
  // Check with Bluesky to see if the user exists
  // console.time('bluesky_handle_check_fetch')
  const response = await fetch(
    `https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=${handle}`
  )
  // console.timeEnd('bluesky_handle_check_fetch')
  if (response.status !== 200) {
    throw new Error('No Bluesky user with that handle exists.')
  }
  return response.json()
}
