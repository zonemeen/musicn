import prettyBytes from 'pretty-bytes'
import { joinSingersName } from './utils'
import type { CommandOptions, SearchSongInfo } from './types'

const names = (song: SearchSongInfo, index: number, options: CommandOptions) => {
  const { service } = options
  const { id, name, url, artists, size, disabled, lyricUrl, extension, ARTIST } = song
  const lyricDownloadUrl =
    service === 'wangyi'
      ? `https://music.163.com/api/song/lyric?id=${id}&lv=1`
      : service === 'kuwo'
      ? `https://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=${id}`
      : lyricUrl
  const songName =
    service === 'wangyi'
      ? `${joinSingersName(artists)} - ${name}.mp3`
      : service === 'kuwo'
      ? `${ARTIST.replaceAll('&', ',')} - ${name}.mp3`
      : `${joinSingersName(artists)} - ${name}.${extension}`

  return {
    name: `${index + 1}. ${songName} - ${prettyBytes(Number(size))}`,
    disabled,
    value: {
      songName,
      songDownloadUrl: url,
      lyricDownloadUrl,
      songSize: size,
      options,
    },
  }
}

export default names
