import got from 'got'
import { createWriteStream } from 'node:fs'
import { convertToStandardTime } from '../../utils'

export default async (lrcPath: string | null, lyricDownloadUrl: string) => {
  const {
    data: { lrclist },
  }: { data: { lrclist: { time: string; lineLyric: string }[] } } = await got(
    lyricDownloadUrl
  ).json()
  let lyric = ''
  if (lrclist && lrclist.length) {
    for (const lrc of lrclist) {
      lyric += `[${convertToStandardTime(lrc.time)}]${lrc.lineLyric}\n`
    }
  } else {
    lyric = '[00:00.00]无歌词'
  }
  if (lrcPath) {
    const lrcFileWriteStream = createWriteStream(lrcPath)
    lrcFileWriteStream.write(lyric)
  }
  if (!lrcPath) return lyric
}
