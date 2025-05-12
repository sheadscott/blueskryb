import { SessionStore, StateStore } from '@/lib/storage'
import {
  NodeOAuthClient,
  OAuthClientMetadataInput,
} from '@atproto/oauth-client-node'

export function blueskyClientMetadata(): OAuthClientMetadataInput {
  const url: string = process.env.NEXT_PUBLIC_URL as string
  const isLocalhost = url.includes('localhost')
  const baseUrl: string = isLocalhost ? `http://127.0.0.1:3000` : url
  const enc = encodeURIComponent
  return {
    client_name: 'Blueskryb',
    // client_id: `${baseUrl}/client-metadata.json`,
    client_id: isLocalhost
      ? `http://localhost?redirect_uri=${enc(`${baseUrl}/api/oauth/callback`)}&scope=${enc('atproto transition:generic')}`
      : `${baseUrl}/client-metadata.json`,
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
