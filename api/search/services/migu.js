import got from 'got'
import { removePunctuation, joinSingersName } from '../utils/index.js'

export default async ({ text, pageNum, songListId }) => {
  let searchSongs, totalSongCount
  if (songListId) {
    const songListSearchUrl = `https://app.c.nf.migu.cn/MIGUM3.0/v1.0/user/queryMusicListSongs.do?musicListId=${songListId}&pageNo=${pageNum}&pageSize=20`
    const { list, totalCount } = await got(songListSearchUrl).json()
    searchSongs = list
    totalSongCount = totalCount || undefined
  } else {
    const normalSearchUrl = `https://pd.musicapp.migu.cn/MIGUM3.0/v1.0/content/search_all.do?text=${encodeURIComponent(
      text
    )}&pageNo=${pageNum}&searchSwitch={song:1}`
    const { songResultData } = await got(normalSearchUrl).json()
    searchSongs = songResultData?.result || []
    totalSongCount = songResultData?.totalCount
  }
  const detailResults = await Promise.all(
    searchSongs.map(({ copyrightId }) => {
      const detailUrl = `https://c.musicapp.migu.cn/MIGUM2.0/v1.0/content/resourceinfo.do?copyrightId=${copyrightId}&resourceType=2`
      return got(detailUrl).json()
    })
  )
  searchSongs.map((item, index) => {
    const { resource } = detailResults[index]
    const { rateFormats = [], newRateFormats = [] } = resource[0] || {}
    const {
      androidSize = 0,
      size = 0,
      androidFileType = '',
      fileType = '',
      androidUrl = '',
      url = '',
    } = newRateFormats.length
      ? newRateFormats[newRateFormats.length - 1]
      : newRateFormats.length
      ? rateFormats[rateFormats.length - 1]
      : {}
    const { pathname } = new URL(url || androidUrl || 'https://music.migu.cn/')
    Object.assign(item, {
      disabled: !androidSize && !size,
      size: size || androidSize,
      url: `https://freetyst.nf.migu.cn${pathname}`,
      songName: `${joinSingersName(item.singers || item.artists)} - ${removePunctuation(
        item.name || item.songName
      )}.${fileType || androidFileType}`,
    })
  })
  return {
    searchSongs,
    totalSongCount,
  }
}
