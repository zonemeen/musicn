import got from 'got'
import { createWriteStream } from 'fs'
import { decodeLyric, parseLyric } from '../../utils'

export default async (lrcPath: string, lyricDownloadUrl: string) => {
  const { candidates } = await got(lyricDownloadUrl).json()
  const lrcFileWriteStream = createWriteStream(lrcPath)
  if (candidates.length) {
    const { id, accesskey } = candidates[0]
    const lyricDetailUrl = `http://lyrics.kugou.com/download?ver=1&client=pc&id=${id}&accesskey=${accesskey}&fmt=krc&charset=utf8`
    const { content = '' } = await got(lyricDetailUrl).json()
    const decode = await decodeLyric(content)
    const { lyric = '' } = parseLyric(decode as string)
    lrcFileWriteStream.write(lyric)
  } else {
    lrcFileWriteStream.write(`[00:00.00]${lrcPath.split('.')[0]}`)
  }
}
