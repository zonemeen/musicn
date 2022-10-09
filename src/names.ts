import prettyBytes from 'pretty-bytes'
import { joinSingersName } from './utils'
import type { CommandOptions, SearchSongInfo } from './types'

const names = (song: SearchSongInfo, index: number, options: CommandOptions) => {
  const { wangyi, kuwo } = options
  let songName,
    songDownloadUrl,
    lyricDownloadUrl,
    songSize,
    disabled = false
  if (wangyi) {
    const { id, name, url, artists, size, songDisabled } = song
    songSize = size
    songDownloadUrl = url
    disabled = songDisabled
    lyricDownloadUrl = `https://music.163.com/api/song/lyric?id=${id}&lv=1`
    songName = `${joinSingersName(artists)} - ${name}.mp3`
  } else if (kuwo) {
    const { ARTIST, DC_TARGETID, url, name, size } = song
    const singersName = ARTIST.replaceAll('&', ',')
    songDownloadUrl = url
    songSize = size
    lyricDownloadUrl = `https://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=${DC_TARGETID}`
    songName = `${singersName} - ${name}.mp3`
  } else {
    const { name, singers, extension, size, lyricUrl, url } = song
    songSize = size
    songDownloadUrl = url
    lyricDownloadUrl = lyricUrl
    songName = `${joinSingersName(singers)} - ${name}.${extension}`
  }

  return {
    name: `${index + 1}. ${songName} - ${prettyBytes(Number(songSize))}`,
    disabled,
    value: {
      songName,
      songDownloadUrl,
      lyricDownloadUrl,
      songSize,
      options,
    },
  }
}

export default names
