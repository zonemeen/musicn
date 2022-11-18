import { joinSingersName } from '../utils'
import type { SearchSongInfo } from '../types'

const kuwoNameSong = (song: SearchSongInfo) => {
  const { id, name, url, artists, size, songDisabled } = song
  const lyricDownloadUrl = `https://music.163.com/api/song/lyric?id=${id}&lv=1`
  const songName = `${joinSingersName(artists)} - ${name}.mp3`
  return {
    songSize: size,
    songDownloadUrl: url,
    disabled: songDisabled,
    lyricDownloadUrl,
    songName,
  }
}

export default kuwoNameSong
