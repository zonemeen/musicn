import prettyBytes from 'pretty-bytes'
import { joinSingersName } from './utils'
import { CommandOptions, SearchSongInfo } from './types'

const names = (song: SearchSongInfo, index: number, options: CommandOptions) => {
  const { wangyi, kuwo } = options
  let songName, songDownloadUrl, lyricDownloadUrl, songSize
  if (wangyi) {
    const { id, name, url, artists, extension, size } = song
    songSize = size
    songDownloadUrl = url
    lyricDownloadUrl = `https://music.163.com/api/song/lyric?id=${id}&lv=1`
    songName = `${joinSingersName(artists)} - ${name}.${extension}`
  } else if (kuwo) {
    const { ARTIST, DC_TARGETID, url, name, size } = song
    const singersName = ARTIST.replaceAll('&', ',')
    songDownloadUrl = url
    songSize = size
    lyricDownloadUrl = `https://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=${DC_TARGETID}`
    songName = `${singersName} - ${name}.mp3`
  } else {
    const { name, singers, extension, size, lyricUrl, downloadUrl } = song
    songSize = size
    songDownloadUrl = downloadUrl
    lyricDownloadUrl = lyricUrl
    songName = `${joinSingersName(singers)} - ${name}.${extension}`
  }

  return {
    name: `${index + 1}. ${songName} - ${prettyBytes(Number(songSize))}`,
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
