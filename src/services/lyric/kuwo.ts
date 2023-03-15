import got from 'got'
import { createWriteStream } from 'fs'

export default async (lrcPath: string, lyricDownloadUrl: string) => {
  const {
    data: { lrclist },
  } = await got(lyricDownloadUrl).json()
  let lyric = ''
  for (const lrc of lrclist) {
    lyric += `[${lrc.time}] ${lrc.lineLyric}\n`
  }
  const lrcFileWriteStream = createWriteStream(lrcPath)
  lrcFileWriteStream.write(lyric)
}
