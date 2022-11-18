import { joinSingersName } from '../utils'
import type { SearchSongInfo } from '../types'

const miguNameSong = (song: SearchSongInfo) => {
  const { name, singers, extension, size, lyricUrl, url } = song
  const songName = `${joinSingersName(singers)} - ${name}.${extension}`
  return {
    songSize: size,
    songDownloadUrl: url,
    lyricDownloadUrl: lyricUrl,
    songName,
    disabled: false,
  }
}

export default miguNameSong
