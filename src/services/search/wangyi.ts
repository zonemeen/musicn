import got from 'got'
import { removePunctuation, joinSingersName, encryptParams } from '../../utils'
import type { SearchSongInfo, SearchProps } from '../../types'

export default async ({ text, pageNum, pageSize, songListId }: SearchProps) => {
  let searchSongs, totalSongCount
  if (songListId) {
    const songListSearchUrl = `https://music.163.com/api/v3/playlist/detail?id=${songListId}`
    const { playlist }: { playlist: { trackIds: { id: string }[] } } = await got(
      songListSearchUrl
    ).json()
    const searchSongsIds =
      playlist?.trackIds.slice(
        (Number(pageNum) - 1) * Number(pageSize),
        Number(pageNum) * Number(pageSize)
      ) || []
    const ids = searchSongsIds.map(({ id }) => id)
    const { songs }: { songs: SearchSongInfo[] } = await got(
      'https://music.163.com/weapi/v3/song/detail',
      {
        method: 'post',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
          origin: 'https://music.163.com',
        },
        form: encryptParams({
          c: '[' + ids.map((id: string) => '{"id":' + id + '}').join(',') + ']',
          ids: '[' + ids.join(',') + ']',
        }),
      }
    ).json()
    searchSongs = songs
    totalSongCount = playlist?.trackIds?.length || undefined
  } else {
    const normalSearchUrl = `https://music.163.com/api/search/get/web?s=${encodeURIComponent(
      text
    )}&type=1&limit=${pageSize}&offset=${(Number(pageNum) - 1) * 20}`
    const {
      result: { songs = [], songCount },
    }: { result: { songs: SearchSongInfo[]; songCount: number } } = await got(
      normalSearchUrl
    ).json()
    searchSongs = songs
    totalSongCount = songCount
  }
  const detailResults = await Promise.all(
    searchSongs.map(async (song) => {
      const { songs }: any = await got('https://music.163.com/weapi/v3/song/detail', {
        method: 'post',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36',
          Referer: 'https://music.163.com/song?id=' + song.id,
          origin: 'https://music.163.com',
        },
        form: encryptParams({
          c: `[{"id":${song.id}}]`,
          ids: `[${song.id}]`,
        }),
      }).json()
      song.cover = songs[0].al.picUrl
      const detailUrl = `https://music.163.com/api/song/enhance/player/url/v1?id=${song.id}&ids=[${song.id}]&level=standard&encodeType=mp3`
      return got(detailUrl).json()
    })
  )
  searchSongs.map((item: SearchSongInfo, index: number) => {
    const { data } = detailResults[index] as { data: { id: string; url: string; size: number }[] }
    const { id, url, size } = data[0]
    Object.assign(item, {
      url,
      size,
      disabled: !size,
      songName: `${removePunctuation(item.name)} - ${removePunctuation(
        joinSingersName(songListId ? item.ar : item.artists)
      )}.mp3`,
      lyricUrl: `https://music.163.com/api/song/lyric?id=${id}&lv=1`,
    })
  })
  return {
    searchSongs,
    totalSongCount,
  }
}
