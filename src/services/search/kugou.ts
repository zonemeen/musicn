import got from 'got'
import { createHash } from 'node:crypto'
import { removePunctuation, kgCookie } from '../../utils'
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
  await Promise.all(
    searchSongs.map(async (song) => {
      const detailUrl = `http://trackercdn.kugou.com/i/v2/?key=${createHash('md5')
        .update(`${song.hash}kgcloudv2`)
        .digest('hex')}&hash=${song.hash}&br=hq&appid=1005&pid=2&cmd=25&behavior=play`
      const coverUrl = `https://wwwapi.kugou.com/yy/index.php?r=play/getdata&hash=${song.hash}`
      const { url = [], fileSize = 0 }: { url: string[]; fileSize: number } = await got(
        detailUrl
      ).json()
      const {
        data: { img },
      }: { data: { img: string } } = await got(coverUrl, {
        method: 'get',
        headers: {
          Cookie: kgCookie,
        },
      }).json()
      const [artists, name] = removePunctuation(song.filename.replaceAll('、', ',')).split(' - ')
      Object.assign(song, {
        id: song.hash,
        url: url[0],
        cover: img,
        size: fileSize,
        disabled: !fileSize,
        songName: `${name} - ${artists}.mp3`,
        lyricUrl: `http://lyrics.kugou.com/search?ver=1&man=yes&client=pc&hash=${song.hash}`,
      })
    })
  )
  return {
    searchSongs,
    totalSongCount,
  }
}
