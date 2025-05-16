import { SessionStore, StateStore } from '@/lib/storage'
import {
  NodeOAuthClient,
  OAuthClientMetadataInput,
} from '@atproto/oauth-client-node'
import { getBaseUrl } from './utils'
export function blueskyClientMetadata(): OAuthClientMetadataInput {
  console.log('process.env.VERCEL_TARGET_ENV', process.env.VERCEL_TARGET_ENV)
  const baseUrl: string = getBaseUrl(process.env.VERCEL_TARGET_ENV as string)
  console.log('baseUrl from atproto.ts', baseUrl)
  const isLocalhost = baseUrl.includes('127.0.0.1')
  const enc = encodeURIComponent
  return {
    client_name: 'Blueskryb',
    // client_id: `${baseUrl}/client-metadata.json`,
    client_id: isLocalhost
      ? `http://localhost?redirect_uri=${enc(`${baseUrl}/api/oauth/callback`)}&scope=${enc('atproto transition:generic')}`
      : `${baseUrl}/client-metadata.json?x-vercel-protection-bypass=8fF3fbaibcMhd2dNCGwb3683ujcUsAFh`,
    client_uri: `${baseUrl}`,
    redirect_uris: [`${baseUrl}/api/oauth/callback`],
    policy_uri: `${baseUrl}/policy`,
    tos_uri: `${baseUrl}/tos`,
    scope: 'atproto transition:generic',
    grant_types: ['authorization_code', 'refresh_token'],
    response_types: ['code'],
    application_type: 'web',
    token_endpoint_auth_method: 'none',
    dpop_bound_access_tokens: true,
  }
}

const createBlueskyClient = async (): Promise<NodeOAuthClient> =>
  new NodeOAuthClient({
    clientMetadata: blueskyClientMetadata(),
    stateStore: new StateStore(),
    sessionStore: new SessionStore(),
  })

export default createBlueskyClient
