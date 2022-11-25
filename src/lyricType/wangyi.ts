import got from 'got'
import { createWriteStream } from 'fs'

const wangyiSongLyric = async (lrcPath: string, lyricDownloadUrl: string) => {
  const {
    lrc: { lyric },
  } = await got(lyricDownloadUrl).json()
  const lrcFile = createWriteStream(lrcPath)
  if (lyric) {
    lrcFile.write(lyric)
  } else {
    lrcFile.write(`[00:00.00]${lrcPath.split('.')[0]}`)
  }
}

export default wangyiSongLyric
