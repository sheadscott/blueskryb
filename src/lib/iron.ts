'use server'

import { User } from '@/lib/db/create-user'
import { getIronSession, type IronSession } from 'iron-session'
import { ResponseCookies } from 'next/dist/server/web/spec-extension/cookies'
import { cookies } from 'next/headers'

export type Session = {
  user: User | null
}

const getSession = async (): Promise<IronSession<Session>> => {
  const password = process.env.COOKIE_PASSWORD
  if (!password || password.length < 32) {
    throw new Error(
      'COOKIE_PASSWORD env var must be set and at least 32 characters long'
    )
  }

  return await getIronSession<Session>((await cookies()) as ResponseCookies, {
    cookieName: 'sid',
    password: process.env.COOKIE_PASSWORD as string,
  })
}

export default getSession
