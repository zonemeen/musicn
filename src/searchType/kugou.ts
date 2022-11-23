import got from 'got'
import crypto from 'crypto'
import { decodeLyric, parseLyric } from '../utils'
import type { SearchSongInfo } from '../types'

const kugouSearchSong = async (text: string, pageNum: string) => {
  const searchUrl = `http://msearchcdn.kugou.com/api/v3/search/song?pagesize=20&keyword=${encodeURIComponent(
    text
  )}&page=${Number(pageNum)}`
  const {
    data: { info: searchSongs, total },
  } = await got(searchUrl).json()
  const totalSongCount = total || undefined
  const detailResults = await Promise.all(
    searchSongs.map(({ hash }: SearchSongInfo) => {
      const detailUrl = `http://trackercdn.kugou.com/i/v2/?key=${crypto
        .createHash('md5')
        .update(`${hash}kgcloudv2`)
        .digest('hex')}&hash=${hash}&br=hq&appid=1005&pid=2&cmd=25&behavior=play`
      return got(detailUrl).json()
    })
  )
  const lyricSearchResults = await Promise.all(
    searchSongs.map(({ hash }: SearchSongInfo) => {
      const lyricSearchUrl = `http://lyrics.kugou.com/search?ver=1&man=yes&client=pc&hash=${hash}`
      return got(lyricSearchUrl).json()
    })
  )
  const lyricDetailResults = await Promise.all(
    lyricSearchResults.map(({ candidates }: any) => {
      const { id, accesskey } = candidates[0]
      const lyricDetailUrl = `http://lyrics.kugou.com/download?ver=1&client=pc&id=${id}&accesskey=${accesskey}&fmt=krc&charset=utf8`
      return got(lyricDetailUrl).json()
    })
  )
  const decodeContents = await Promise.all(
    lyricDetailResults.map((item) => {
      const { content }: any = item
      return decodeLyric(content)
    })
  )
  const newLyricDetailResults = decodeContents.map((item) => {
    const { lyric = '' } = parseLyric(item as string)
    return lyric
  })
  searchSongs.forEach((item: SearchSongInfo, index: number) => {
    const { url = [], fileSize = 0 }: any = detailResults[index]
    Object.assign(item, {
      url: url[0],
      name: item.filename,
      size: fileSize,
      disabled: !fileSize,
      songName: `${item.filename.replaceAll('、', ',')}.mp3`,
      lyricUrl: newLyricDetailResults[index],
    })
  })
  return {
    searchSongs,
    totalSongCount,
  }
}

export default kugouSearchSong
