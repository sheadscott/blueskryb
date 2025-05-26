// https://www.reddit.com/r/BlueskySocial/comments/1hhmg2t/how_to_use_bluesky_api_to_send_a_dm_without_convo/

import { AtpAgent } from '@atproto/api'

async function sendChat(msg) {
  const agent = new AtpAgent({ service: 'https://bsky.social' })

  await agent.login({
    identifier: 'YourHandle',

    password: 'Your APP Password with Chat Access',
  })

  const proxy = agent.withProxy('bsky_chat', 'did:web:api.bsky.chat')

  const { profile } = await agent.getProfile({ actor: 'TargetHandleForChat' })

  const convo = await proxy.chat.bsky.convo.getConvoForMembers({
    members: [profile['did']],
  })

  await proxy.chat.bsky.convo.sendMessage({
    convoId: convo['data']['convo']['id'],

    message: { text: msg },
  })
}

sendChat('Hello from JS SDK!')
