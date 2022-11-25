import got from 'got'
import { createWriteStream } from 'fs'
import { decodeLyric, parseLyric } from '../utils'

const kugouSongLyric = async (lrcPath: string, lyricDownloadUrl: string) => {
  let lyricDetail = ''
  const { candidates } = await got(lyricDownloadUrl).json()
  if (candidates.length) {
    const { id, accesskey } = candidates[0]
    const lyricDetailUrl = `http://lyrics.kugou.com/download?ver=1&client=pc&id=${id}&accesskey=${accesskey}&fmt=krc&charset=utf8`
    const { content = '' } = await got(lyricDetailUrl).json()
    const decode = await decodeLyric(content)
    const { lyric = '' } = parseLyric(decode as string)
    lyricDetail = lyric
  }
  const lrcFile = createWriteStream(lrcPath)
  if (lyricDetail) {
    lrcFile.write(lyricDetail)
  } else {
    lrcFile.write(`[00:00.00]${lrcPath.split('.')[0]}`)
  }
}

export default kugouSongLyric
