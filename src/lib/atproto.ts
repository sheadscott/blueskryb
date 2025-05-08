import { SessionStore, StateStore } from '@/lib/storage'
import {
  NodeOAuthClient,
  OAuthClientMetadataInput,
} from '@atproto/oauth-client-node'

export function blueskyClientMetadata(): OAuthClientMetadataInput {
  const baseUrl: string = process.env.NEXT_PUBLIC_URL as string
  const enc = encodeURIComponent
  return {
    client_name: 'Blueskryb',
    client_id: `http://localhost?redirect_uri=${enc(`${baseUrl}/api/oauth/callback`)}&scope=${enc('atproto transition:generic')}`,
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
