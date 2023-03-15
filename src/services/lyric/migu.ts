import got from 'got'
import { pipeline } from 'stream/promises'
import { createWriteStream } from 'fs'

export default async (lrcPath: string, lyricDownloadUrl: string) => {
  await pipeline(got.stream(lyricDownloadUrl), createWriteStream(lrcPath))
}
