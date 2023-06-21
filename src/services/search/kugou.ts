import got from 'got'
import { createHash } from 'node:crypto'
import { removePunctuation } from '../../utils'
import type { SearchSongInfo, SearchProps } from '../../types'

export default async ({ text, pageNum, pageSize }: SearchProps) => {
  if (!text) return { searchSongs: [] }
  const searchUrl = `http://msearchcdn.kugou.com/api/v3/search/song?pagesize=${pageSize}&keyword=${encodeURIComponent(
    text
  )}&page=${pageNum}`
  const {
    data: { info: searchSongs, total },
  } = await got(searchUrl).json()
  const totalSongCount = total || undefined
  const detailResults = await Promise.all(
    searchSongs.map(({ hash }: SearchSongInfo) => {
      const detailUrl = `http://trackercdn.kugou.com/i/v2/?key=${createHash('md5')
        .update(`${hash}kgcloudv2`)
        .digest('hex')}&hash=${hash}&br=hq&appid=1005&pid=2&cmd=25&behavior=play`
      return got(detailUrl).json()
    })
  )
  searchSongs.map((item: SearchSongInfo, index: number) => {
    const { url = [], fileSize = 0 }: any = detailResults[index]
    const [artists, name] = removePunctuation(item.filename.replaceAll('、', ',')).split(' - ')
    Object.assign(item, {
      url: url[0],
      size: fileSize,
      disabled: !fileSize,
      songName: `${name} - ${artists}.mp3`,
      lyricUrl: `http://lyrics.kugou.com/search?ver=1&man=yes&client=pc&hash=${item.hash}`,
    })
  })
  return {
    searchSongs,
    totalSongCount,
  }
}
