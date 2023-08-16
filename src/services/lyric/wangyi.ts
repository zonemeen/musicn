import got from 'got'
import { createWriteStream } from 'node:fs'

export default async (lrcPath: string | null, lyricDownloadUrl: string) => {
  let lrc, lrcFileWriteStream
  const {
    lrc: { lyric },
  }: { lrc: { lyric: string } } = await got(lyricDownloadUrl).json()
  if (lrcPath) {
    lrcFileWriteStream = createWriteStream(lrcPath)
  }
  if (lyric) {
    lrcFileWriteStream?.write(lyric)
    lrc = lyric
  } else {
    lrc = `[00:00.00]${lrcPath?.split('.')[0] ?? '无歌词'}`
    lrcFileWriteStream?.write(lrc)
  }
  if (!lrcPath) return lrc
}
