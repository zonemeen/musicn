import got from 'got'
import { removePunctuation, getSongSizeByUrl } from '../../utils'
import type { SearchSongInfo, SearchProps } from '../../types'

export default async ({ text, pageNum, pageSize, songListId }: SearchProps) => {
  let searchSongs: SearchSongInfo[], totalSongCount
  if (songListId) {
    const songListSearchUrl = `https://nplserver.kuwo.cn/pl.svc?op=getlistinfo&pid=${songListId}&pn=${
      Number(pageNum) - 1
    }&rn=${pageSize}&encode=utf8&keyset=pl2012&vipver=MUSIC_9.0.5.0_W1`
    const { musiclist, total }: { musiclist: SearchSongInfo[]; total: number } = await got(
      songListSearchUrl
    ).json()
    totalSongCount = Number(total) || undefined
    searchSongs = musiclist
  } else {
    const normalSearchUrl = `https://search.kuwo.cn/r.s?client=kt&all=${encodeURIComponent(
      text
    )}&pn=${Number(pageNum) - 1}&rn=${pageSize}&vipver=1&ft=music&encoding=utf8&rformat=json&mobi=1`
    const { abslist, TOTAL }: { abslist: SearchSongInfo[]; TOTAL: number } = await got(
      normalSearchUrl
    ).json()
    totalSongCount = Number(TOTAL) || undefined
    searchSongs = abslist
  }
  await Promise.all(
    searchSongs.map(async (item) => {
      const detailUrl = `https://www.kuwo.cn/api/v1/www/music/playUrl?mid=${
        item.DC_TARGETID || item.id
      }&type=1`
      const {
        data: { url },
      }: { data: { url: string } } = await got(detailUrl).json()
      const size = await getSongSizeByUrl(url)
      const artist = item.ARTIST || item.artist
      Object.assign(item, {
        id: item.DC_TARGETID || item.id,
        url,
        size,
        disabled: !size,
        songName: `${removePunctuation(item.NAME || item.name)} - ${artist.replaceAll(
          '&',
          ','
        )}.mp3`,
        lyricUrl: `https://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=${item.DC_TARGETID}`,
      })
    })
  )
  return {
    searchSongs,
    totalSongCount,
  }
}
