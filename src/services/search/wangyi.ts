import got from 'got'
import { removePunctuation, joinSingersName } from '../../utils'
import type { SearchSongInfo, SearchProps } from '../../types'

export default async ({ text, pageNum, pageSize, songListId }: SearchProps) => {
  let searchSongs: SearchSongInfo[], totalSongCount
  if (songListId) {
    const songListSearchUrl = `https://music.163.com/api/v3/playlist/detail?id=${songListId}`
    const { playlist } = await got(songListSearchUrl).json()
    const searchSongsIds =
      playlist?.trackIds.slice((Number(pageNum) - 1) * 20, Number(pageNum) * 20) || []
    const detailSongs = await Promise.all(
      searchSongsIds.map(({ id }: { id: string }) => {
        const detailUrl = `http://music.163.com/api/song/detail/?id=${id}&ids=[${id}]`
        return got(detailUrl).json()
      })
    )
    searchSongs = detailSongs.map((item) => item.songs[0])
    totalSongCount = playlist?.trackIds?.length || undefined
  } else {
    const normalSearchUrl = `https://music.163.com/api/search/get/web?s=${encodeURIComponent(
      text
    )}&type=1&limit=${pageSize}&offset=${(Number(pageNum) - 1) * 20}`
    const {
      result: { songs = [], songCount },
    } = await got(normalSearchUrl).json()
    searchSongs = songs
    totalSongCount = songCount
  }
  const detailResults = await Promise.all(
    searchSongs.map(({ id }) => {
      const detailUrl = `https://music.163.com/api/song/enhance/player/url?id=${id}&ids=[${id}]&br=3200000`
      return got(detailUrl).json()
    })
  )
  searchSongs.map((item: SearchSongInfo, index: number) => {
    const { data }: any = detailResults[index]
    const { id, url, size } = data[0]
    Object.assign(item, {
      url,
      size,
      disabled: !size,
      songName: `${removePunctuation(joinSingersName(item.artists))} - ${removePunctuation(
        item.name
      )}.mp3`,
      lyricUrl: `https://music.163.com/api/song/lyric?id=${id}&lv=1`,
    })
  })
  return {
    searchSongs,
    totalSongCount,
  }
}
