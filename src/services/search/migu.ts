import got from 'got'
import { removePunctuation, joinSingersName, getSongSizeByUrl } from '../../utils'
import type { SearchSongInfo, SearchProps } from '../../types'

export default async ({ text, pageNum, pageSize, songListId }: SearchProps) => {
  let searchSongs, totalSongCount
  if (songListId) {
    const songListSearchUrl = `https://app.c.nf.migu.cn/MIGUM3.0/v1.0/user/queryMusicListSongs.do?musicListId=${songListId}&pageNo=${pageNum}&pageSize=${pageSize}`
    const { list, totalCount }: { list: SearchSongInfo[]; totalCount: number } = await got(
      songListSearchUrl
    ).json()
    searchSongs = list
    totalSongCount = totalCount || undefined
  } else {
    const normalSearchUrl = `https://pd.musicapp.migu.cn/MIGUM3.0/v1.0/content/search_all.do?text=${encodeURIComponent(
      text
    )}&pageNo=${pageNum}&pageSize=${pageSize}&searchSwitch={song:1}`
    const {
      songResultData,
    }: { songResultData: { result?: SearchSongInfo[]; totalCount?: number } } = await got(
      normalSearchUrl
    ).json()
    searchSongs = songResultData?.result || []
    totalSongCount = songResultData?.totalCount
  }
  await Promise.all(
    searchSongs.map(async (song) => {
      const detailUrl = `https://c.musicapp.migu.cn/MIGUM2.0/v1.0/content/resourceinfo.do?copyrightId=${song.copyrightId}&resourceType=0`
      const {
        resource,
      }: {
        resource: { audioUrl: string }[]
      } = await got(detailUrl).json()
      const { audioUrl } = resource[0] || {}
      const { pathname } = new URL(audioUrl || 'https://music.migu.cn/')
      const url = decodeURIComponent(`https://freetyst.nf.migu.cn${pathname}`).replace(
        '彩铃/6_mp3-128kbps',
        '标清高清/MP3_320_16_Stero'
      )
      const size = audioUrl ? await getSongSizeByUrl(url) : 0
      const fileType = audioUrl?.replace(/.+\.(mp3|flac)/, '$1') ?? 'mp3'
      Object.assign(song, {
        disabled: !size,
        cover: song.imgItems[0]?.img,
        size: size,
        url,
        songName: `${removePunctuation(song.name || song.songName)} - ${joinSingersName(
          song.singers || song.artists
        )}.${fileType}`,
      })
    })
  )
  return {
    searchSongs,
    totalSongCount,
  }
}
