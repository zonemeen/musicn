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
  }: { data: { info: SearchSongInfo[]; total: number } } = await got(searchUrl).json()
  const totalSongCount = total || undefined
  const detailResults = await Promise.all(
    searchSongs.map(async ({ hash }) => {
      const detailUrl = `http://trackercdn.kugou.com/i/v2/?key=${createHash('md5')
        .update(`${hash}kgcloudv2`)
        .digest('hex')}&hash=${hash}&br=hq&appid=1005&pid=2&cmd=25&behavior=play`
      const coverUrl = `https://wwwapi.kugou.com/yy/index.php?r=play/getdata&hash=${hash}`
      const detail: { url: string[]; fileSize: number; cover: string } = await got(detailUrl).json()
      const {
        data: { img },
      }: { data: { img: string } } = await got(coverUrl, {
        method: 'get',
        headers: {
          Cookie:
            'kg_mid=e7c09bf4e2ff701959e419aa6259f5e1; kg_dfid=2UHiuH0E3doo4ZW8ud01Teb3; kg_dfid_collect=d41d8cd98f00b204e9800998ecf8427e; Hm_lvt_aedee6983d4cfc62f509129360d6bb3d=1690770238; musicwo17=kugou; Hm_lpvt_aedee6983d4cfc62f509129360d6bb3d=1690771797',
        },
      }).json()
      detail.cover = img
      return detail
    })
  )
  searchSongs.map((item: SearchSongInfo, index: number) => {
    const { url = [], fileSize = 0, cover } = detailResults[index]
    const [artists, name] = removePunctuation(item.filename.replaceAll('、', ',')).split(' - ')
    Object.assign(item, {
      id: item.hash,
      url: url[0],
      cover,
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
