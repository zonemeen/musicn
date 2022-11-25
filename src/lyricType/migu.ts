import got from 'got'
import { pipeline } from 'stream/promises'
import { createWriteStream } from 'fs'

const miguSongLyric = async (lrcPath: string, lyricDownloadUrl: string) => {
  await pipeline(got.stream(lyricDownloadUrl), createWriteStream(lrcPath))
}

export default miguSongLyric
