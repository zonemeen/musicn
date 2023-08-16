import got, { type Request } from 'got'
import { pipeline } from 'node:stream/promises'
import { createWriteStream } from 'node:fs'

async function streamToString(stream: Request) {
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
