import getSession from '@/lib/iron'
import { redirect } from 'next/navigation'

import LoginButton from '@/components/auth/login-button'
import UserListItem from '@/components/user/user-list-item'
import * as Profile from '@/lexicon/types/app/bsky/actor/profile'
import { getAgent } from '@/lib/atproto-agent'
// import { createPost } from '@/lib/bsky/create-post'
import { getUsersByDid } from '@/lib/db/users/get-users-by-did'

export default async function FriendsPage() {
  const session = await getSession()
  const agent = await getAgent()

  if (!session.user) {
    // Redirect to homepage
    redirect('/')
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

  // const postText = `✨ example mentioning @atproto.com to share the URL 👨‍❤️‍👨 https://en.wikipedia.org/wiki/CBOR.`
  // await createPost(postText, agent)

  // Example: fetch the user's profile record
  // const profile = await agent.com.atproto.repo.getRecord({
  //   repo: agent.assertDid,
  //   collection: 'app.bsky.actor.profile',
  //   rkey: 'self',
  // })

  // Get the user's known followers
  const knownFollowersResponse = await agent.app.bsky.graph.getKnownFollowers({
    actor: agent.assertDid,
  })
  const knownFollowers = knownFollowersResponse.data.followers

  const knownFollowersOnBlueskrybDids = await getUsersByDid(
    knownFollowers.map((f) => f.did)
  )

  const knownFollowersOnBlueskryb = knownFollowers.filter((follower) =>
    knownFollowersOnBlueskrybDids.some((u) => u.did === follower.did)
  )

  const knownFollowersNotOnBlueskryb = knownFollowers.filter(
    (follower) =>
      !knownFollowersOnBlueskryb.some((user) => user.did === follower.did)
  )

  // Get the user's followers
  const followersResponse = await agent.app.bsky.graph.getFollowers({
    actor: agent.assertDid,
  })
  const followers = followersResponse.data.followers

  const followersOnBlueskrybDids = await getUsersByDid(
    followers.map((f) => f.did)
  )

  const followersOnBlueskryb = followers.filter((follower) =>
    followersOnBlueskrybDids.some((u) => u.did === follower.did)
  )

  const followersNotOnBlueskryb = followers.filter(
    (follower) =>
      !followersOnBlueskryb.some((user) => user.did === follower.did)
  )

  console.log('FOLLOWERS', followers.length)

  // Get the user's following
  const followingResponse = await agent.app.bsky.graph.getFollows({
    actor: agent.assertDid,
  })
  const following = followingResponse.data.follows

  console.log('FOLLOWING', following.length)

  const followingOnBlueskrybDids = await getUsersByDid(
    following.map((f) => f.did)
  )

  const followingOnBlueskryb = following.filter((follower) =>
    followingOnBlueskrybDids.some((u) => u.did === follower.did)
  )

  const followingNotOnBlueskryb = following.filter(
    (follower) =>
      !followingOnBlueskryb.some((user) => user.did === follower.did)
  )

  // This is not working, but it's in the docs so I'm leaving it here for now
  // const buzzers = await agent.com.atproto.sync.listReposByCollection({
  //   collection: 'buzz.bookhive.book',
  // })

  // console.log('buzzers', buzzers)

  // Get the user's followers

  // const knownFollowersOnBlueskryb;
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
      <h1>Friends</h1>
      {knownFollowersOnBlueskryb ? (
        <div>
          <h2>
            {knownFollowersOnBlueskryb.length} mutual followers on Blueskryb
          </h2>
          {knownFollowersOnBlueskryb.map((user) => (
            <UserListItem key={user.did} user={user} />
          ))}
        </div>
      ) : null}
      {knownFollowersNotOnBlueskryb ? (
        <div>
          <h2>
            {knownFollowersNotOnBlueskryb.length} mutual followers not on
            Blueskryb
          </h2>
          {knownFollowersNotOnBlueskryb.map((user) => (
            <UserListItem key={user.did} user={user} />
          ))}
        </div>
      ) : null}
      {followersOnBlueskryb ? (
        <div>
          <h2>{followersOnBlueskryb.length} followers on Blueskryb</h2>
          {followersOnBlueskryb.map((user) => (
            <UserListItem key={user.did} user={user} />
          ))}
        </div>
      ) : null}
      {followersNotOnBlueskryb ? (
        <div>
          <h2>{followersNotOnBlueskryb.length} followers not on Blueskryb</h2>
          {followersNotOnBlueskryb.map((user) => (
            <UserListItem key={user.did} user={user} />
          ))}
        </div>
      ) : null}
      {followingOnBlueskryb ? (
        <div>
          <h2>{followingOnBlueskryb.length} following on Blueskryb</h2>
          {followingOnBlueskryb.map((user) => (
            <UserListItem key={user.did} user={user} />
          ))}
        </div>
      ) : null}
      {followingNotOnBlueskryb ? (
        <div>
          <h2>{followingNotOnBlueskryb.length} following not on Blueskryb</h2>
          {followingNotOnBlueskryb.map((user) => (
            <UserListItem key={user.did} user={user} />
          ))}
        </div>
      ) : null}
    </main>
  )
}
