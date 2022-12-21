import got from 'got'
import { createWriteStream } from 'fs'

const wangyiSongLyric = async (lrcPath: string, lyricDownloadUrl: string) => {
  const {
    lrc: { lyric },
  } = await got(lyricDownloadUrl).json()
  const lrcFileWriteStream = createWriteStream(lrcPath)
  if (lyric) {
    lrcFileWriteStream.write(lyric)
  } else {
    lrcFileWriteStream.write(`[00:00.00]${lrcPath.split('.')[0]}`)
  }
}

export default wangyiSongLyric
