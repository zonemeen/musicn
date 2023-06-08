import got from 'got'
import { pipeline } from 'stream/promises'
import { createWriteStream } from 'fs'

async function streamToString(stream: any) {
  const chunks = []
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk))
  }
  return Buffer.concat(chunks).toString('utf-8')
}

export default async (lrcPath: string | null, lyricDownloadUrl: string) => {
  const stream = got.stream(lyricDownloadUrl)
  if (lrcPath) {
    await pipeline(stream, createWriteStream(lrcPath))
  } else {
    return await streamToString(stream)
  }
}
