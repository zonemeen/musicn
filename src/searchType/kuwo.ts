import got from 'got'
import { removePunctuation, getSongSizeByUrl } from '../utils'
import type { SearchSongInfo } from '../types'

const kuwoSearchSong = async (text: string, pageNum: string) => {
  const searchUrl = `https://search.kuwo.cn/r.s?client=kt&all=${encodeURIComponent(text)}&pn=${
    Number(pageNum) - 1
  }&rn=10&vipver=1&ft=music&encoding=utf8&rformat=json&mobi=1`
  const { abslist, TOTAL }: { abslist: SearchSongInfo[]; TOTAL: number } = await got(
    searchUrl
  ).json()
  const totalSongCount = Number(TOTAL) || undefined
  await Promise.all(
    abslist.map(async (item) => {
      const detailUrl = `https://www.kuwo.cn/api/v1/www/music/playUrl?mid=${item.DC_TARGETID}&type=1`
      const {
        data: { url },
      }: any = await got(detailUrl).json()
      const size = await getSongSizeByUrl(url)
      Object.assign(item, {
        url,
        size,
        songName: `${item.ARTIST.replaceAll('&', ',')} - ${removePunctuation(item.NAME)}.mp3`,
        lyricUrl: `https://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=${item.DC_TARGETID}`,
      })
    })
  )
  return {
    searchSongs: abslist,
    totalSongCount,
  }
}

export default kuwoSearchSong
