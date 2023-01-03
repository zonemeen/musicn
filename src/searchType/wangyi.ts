import got from 'got'
import { removePunctuation, joinSingersName } from '../utils'
import type { SearchSongInfo } from '../types'

const wangyiSearchSong = async (text: string, pageNum: string) => {
  const searchUrl = `https://music.163.com/api/search/get/web?s=${encodeURIComponent(
    text
  )}&type=1&limit=20&offset=${(Number(pageNum) - 1) * 20}`
  const {
    result: { songs = [], songCount },
  } = await got(searchUrl).json()
  const totalSongCount = songCount
  const detailResults = await Promise.all(
    songs.map(({ id }) => {
      const detailUrl = `https://music.163.com/api/song/enhance/player/url?id=${id}&ids=[${id}]&br=3200000`
      return got(detailUrl).json()
    })
  )
  songs.forEach((item: SearchSongInfo, index: number) => {
    const { data }: any = detailResults[index]
    const { id, url, size } = data[0]
    Object.assign(item, {
      url,
      size,
      disabled: !size,
      songName: `${joinSingersName(item.artists)} - ${removePunctuation(item.name)}.mp3`,
      lyricUrl: `https://music.163.com/api/song/lyric?id=${id}&lv=1`,
    })
  })
  return {
    searchSongs: songs,
    totalSongCount,
  }
}

export default wangyiSearchSong
