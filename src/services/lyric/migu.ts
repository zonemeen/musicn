import got from 'got'
import { pipeline } from 'node:stream/promises'
import { createWriteStream } from 'node:fs'
import { streamToString } from '../../utils'

export default async (lrcPath: string | null, lyricDownloadUrl: string) => {
  const stream = got.stream(lyricDownloadUrl)
  if (lrcPath) {
    await pipeline(stream, createWriteStream(lrcPath))
  } else {
    return await streamToString(stream)
  }
}
