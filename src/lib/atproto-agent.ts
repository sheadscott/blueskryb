import createBlueskyClient from '@/lib/atproto'
import getSession from '@/lib/iron'
// import { logger } from '@/lib/logger' // If you have a logger utility
import { Agent } from '@atproto/api'

export async function getAgent() {
  const session = await getSession()
  const user = session.user
  if (!user?.did) return null

  // Create or reuse your OAuth client
  const oauthClient = await createBlueskyClient()

  try {
    // Restore the user's OAuth session from your DB-backed session store
    const oauthSession = await oauthClient.restore(user.did, false)
    return oauthSession ? new Agent(oauthSession) : null
  } catch (err) {
    // if (logger) logger.warn({ err }, 'oauth restore failed')
    console.warn(err)
    session.destroy()
    return null
  }
}
