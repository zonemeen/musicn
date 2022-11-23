import got from 'got'
import { getSongSizeByUrl } from '../utils'
import type { SearchSongInfo } from '../types'

const kuwoSearchSong = async (text: string, pageNum: string) => {
  const searchUrl = `https://search.kuwo.cn/r.s?client=kt&all=${encodeURIComponent(text)}&pn=${
    Number(pageNum) - 1
  }&rn=10&vipver=1&ft=music&encoding=utf8&rformat=json&mobi=1`
  const { abslist, TOTAL }: { abslist: SearchSongInfo[]; TOTAL: number } = await got(
    searchUrl
  ).json()
  const totalSongCount = Number(TOTAL) || undefined
  const detailResults = await Promise.all(
    abslist.map(({ DC_TARGETID }) => {
      const detailUrl = `https://www.kuwo.cn/api/v1/www/music/playUrl?mid=${DC_TARGETID}&type=1`
      return got(detailUrl).json()
    })
  )
  abslist.forEach((item, index) => {
    const {
      data: { url },
    }: any = detailResults[index]
    Object.assign(item, {
      url,
      name: item.NAME,
      songName: `${item.ARTIST.replaceAll('&', ',')} - ${item.NAME}.mp3`,
      lyricUrl: `https://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=${item.DC_TARGETID}`,
    })
  })
  const sizeResults = await Promise.all(abslist.map(({ url }) => getSongSizeByUrl(url)))
  abslist.forEach((item, index) => {
    item.size = sizeResults[index] as number
  })
  return {
    searchSongs: abslist,
    totalSongCount,
  }
}

export default kuwoSearchSong
