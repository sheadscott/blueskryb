import { Agent } from '@atproto/api'
import sharp from 'sharp'

export async function uploadImageBlob(image: string | undefined, agent: Agent) {
  try {
    if (image) {
      console.log('trying to fetch image', { image })
      const data = await fetch(image as string).then((res) => res.arrayBuffer())
      console.log('downloaded image')

      const resizedImage = await sharp(data)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ lossless: true })
        .toBuffer()
      console.log('resized image')

      const uploadResponse = await agent.com.atproto.repo.uploadBlob(
        resizedImage,
        {
          encoding: 'image/jpeg',
        }
      )
      console.log('reupload image', { success: uploadResponse.success })
      if (uploadResponse.success) {
        return uploadResponse.data.blob
      }
    }
  } catch (err) {
    console.error('failed to upload image blob', { err })
  }
  return undefined
}

// https://cdn.bsky.app/img/feed_thumbnail/plain/did:plc:hekesxwmqrhmfbf77qe6jhe4/bafkreifnlryp65qn76dhkfnfgtrs7avtrg2hlkcjlqmgpfqq7hjql4spa4@jpeg
// https://atproto-browser.vercel.app/blob/did:plc:hekesxwmqrhmfbf77qe6jhe4/bafkreifnlryp65qn76dhkfnfgtrs7avtrg2hlkcjlqmgpfqq7hjql4spa4
