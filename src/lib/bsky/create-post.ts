import { Agent, RichText } from '@atproto/api'

export async function createPost(post: string, agent: Agent) {
  const richTextPost = await stringToRichText(post, agent)

  await agent.post(richTextPost)
}

async function stringToRichText(text: string, agent: Agent) {
  // creating richtext
  const rt = new RichText({
    text,
  })
  if (rt.graphemeLength > 300) {
    throw new Error('Post exceeds 300 characters')
  }
  await rt.detectFacets(agent) // automatically detects mentions and links
  return {
    $type: 'app.bsky.feed.post' as const,
    text: rt.text,
    facets: rt.facets,
    createdAt: new Date().toISOString(),
  }
}
