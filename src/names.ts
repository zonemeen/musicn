import prettyBytes from 'pretty-bytes'
import { joinSingersName } from './utils'
import { CommandOptions, SearchSongInfo } from './types'

const names = (
  song: SearchSongInfo,
  index: number,
  options: CommandOptions,
  serviceName: string
) => {
  let songName, songDownloadUrl, lyricDownloadUrl, songSize
  if (serviceName === 'netease') {
    const { id, name, url, artists, extension, size } = song
    songSize = size
    songDownloadUrl = url
    lyricDownloadUrl = `https://music.163.com/api/song/lyric?id=${id}&lv=1`
    songName = `${joinSingersName(artists)} - ${name}.${extension}`
  } else {
    const { name, singers, rateFormats, newRateFormats } = song
    const rateFormatData = newRateFormats.length
      ? newRateFormats[newRateFormats.length - 1]
      : rateFormats[rateFormats.length - 1]
    songSize = rateFormatData.androidSize || rateFormatData.size
    const extension = rateFormatData.androidFileType || rateFormatData.fileType
    const { pathname } = new URL(rateFormatData.androidUrl || rateFormatData.url)
    songDownloadUrl = `https://freetyst.nf.migu.cn${pathname}`
    lyricDownloadUrl = song.lyricUrl
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
      serviceName,
    },
  }
}

export default names
