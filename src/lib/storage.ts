import type {
  NodeSavedSession,
  NodeSavedSessionStore,
  NodeSavedState,
  NodeSavedStateStore,
} from '@atproto/oauth-client-node'
import { eq } from 'drizzle-orm'
import { db } from './db'
import { authSession, authState } from './schema'

export class StateStore implements NodeSavedStateStore {
  async get(key: string): Promise<NodeSavedState | undefined> {
    const result = await db
      .select()
      .from(authState)
      .where(eq(authState.key, key))
    if (!result[0]) return
    return JSON.parse(result[0].state) as NodeSavedState
  }

  async set(key: string, val: NodeSavedState) {
    const state = JSON.stringify(val)
    // Upsert: try update, if not updated, insert
    const updated = await db
      .update(authState)
      .set({ state })
      .where(eq(authState.key, key))
      .returning()
    if (updated.length === 0) {
      await db.insert(authState).values({ key, state })
    }
  }

  async del(key: string) {
    await db.delete(authState).where(eq(authState.key, key))
  }
}

export class SessionStore implements NodeSavedSessionStore {
  async get(key: string): Promise<NodeSavedSession | undefined> {
    const result = await db
      .select()
      .from(authSession)
      .where(eq(authSession.key, key))
    if (!result[0]) return
    return JSON.parse(result[0].session) as NodeSavedSession
  }

  async set(key: string, val: NodeSavedSession) {
    const session = JSON.stringify(val)
    // Upsert: try update, if not updated, insert
    const updated = await db
      .update(authSession)
      .set({ session })
      .where(eq(authSession.key, key))
      .returning()
    if (updated.length === 0) {
      await db.insert(authSession).values({ key, session })
    }
  }

  async del(key: string) {
    await db.delete(authSession).where(eq(authSession.key, key))
  }
}
