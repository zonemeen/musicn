import prettyBytes from 'pretty-bytes'
import { joinSingersName } from './utils.js'

const names = (song, index, options, serviceName) => {
  let songName, songDownloadUrl, lyricDownloadUrl, songSize
  if (serviceName === 'netease') {
    const { id, name, url, artists, extension, size } = song
    songSize = size
    songDownloadUrl = url
    lyricDownloadUrl = `https://music.163.com/api/song/lyric?id=${id}&lv=1`
    songName = `${joinSingersName(artists)} - ${name}.${extension}`
  } else {
    const { name, singers, rateFormats, newRateFormats } = song
    const rateFormat = newRateFormats.length
      ? newRateFormats[newRateFormats.length - 1]
      : rateFormats[rateFormats.length - 1]
    songSize = rateFormat.androidSize || rateFormat.size
    const extension = rateFormat.androidFileType || rateFormat.fileType
    const { pathname } = new URL(rateFormat.androidUrl || rateFormat.url)
    songDownloadUrl = `https://freetyst.nf.migu.cn${pathname}`
    lyricDownloadUrl = song.lyricUrl
    songName = `${joinSingersName(singers)} - ${name}.${extension}`
  }

  return {
    title: `${index + 1}. ${songName} - ${prettyBytes(Number(songSize))}`,
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
