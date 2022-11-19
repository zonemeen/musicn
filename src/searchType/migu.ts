import got from 'got'
import type { SearchSongInfo } from '../types'

const miguSearchSong = async (text: string, pageNum: string) => {
  const searchUrl = `https://pd.musicapp.migu.cn/MIGUM3.0/v1.0/content/search_all.do?text=${encodeURIComponent(
    text
  )}&pageNo=${pageNum}&searchSwitch={song:1}`
  const { songResultData } = await got(searchUrl).json()
  const searchSongs = (songResultData?.result || []) as SearchSongInfo[]
  const totalSongCount = songResultData?.totalCount
  const detailResults = await Promise.all(
    searchSongs.map(({ copyrightId }) => {
      const detailUrl = `https://c.musicapp.migu.cn/MIGUM2.0/v1.0/content/resourceinfo.do?copyrightId=${copyrightId}&resourceType=2`
      return got(detailUrl).json()
    })
  )
  searchSongs.forEach((item, index) => {
    const { resource }: any = detailResults[index]
    const { rateFormats, newRateFormats } = resource[0]
    const { androidSize, size, androidFileType, fileType, androidUrl, url } = newRateFormats.length
      ? newRateFormats[newRateFormats.length - 1]
      : rateFormats[rateFormats.length - 1]
    item.size = androidSize || size
    item.extension = androidFileType || fileType
    const { pathname } = new URL(androidUrl || url)
    item.url = `https://freetyst.nf.migu.cn${pathname}`
    item.artists = item.singers
  })
  return {
    searchSongs,
    totalSongCount,
  }
}

export default miguSearchSong
