import LoginButton from '@/components/auth/login-button'
import * as Profile from '@/lexicon/types/app/bsky/actor/profile'
import { getAgent } from '@/lib/atproto-agent'
import getSession from '@/lib/iron'

export default async function AgentExamplePage() {
  const session = await getSession()
  const agent = await getAgent()

  if (!session.user) {
    return (
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <span>
          You need to be logged in to view this page. <LoginButton />
        </span>
      </main>
    )
  }

  if (!agent) {
    return (
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <span>
          Something went wrong getting your data from Bluesky. <LoginButton />
        </span>
      </main>
    )
  }

  // Example: fetch the user's profile record
  // const profile = await agent.com.atproto.repo.getRecord({
  //   repo: agent.assertDid,
  //   collection: 'app.bsky.actor.profile',
  //   rkey: 'self',
  // })

  // Fetch additional information about the logged-in user
  const profileResponse = await agent.com.atproto.repo
    .getRecord({
      repo: agent.assertDid,
      collection: 'app.bsky.actor.profile',
      rkey: 'self',
    })
    .catch(() => undefined)

  const profileRecord = profileResponse?.data

  const profile: Profile.Record | undefined =
    profileRecord &&
    Profile.isRecord(profileRecord.value) &&
    Profile.validateRecord(profileRecord.value).success
      ? profileRecord.value
      : undefined

  console.log(profile)

  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
      <span>Private page, welcome {profile?.displayName || 'User'}!</span>
    </main>
  )
}
