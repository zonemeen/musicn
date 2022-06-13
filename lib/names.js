import prettyBytes from 'pretty-bytes'
import { joinSingersName } from './utils.js'

const names = (song, index, options, serviceName) => {
  let songName, downloadUrl, lyricUrl, size
  if (serviceName === 'netease') {
    const { id, name, artists, extension } = song
    size = song.size
    downloadUrl = `http://music.163.com/song/media/outer/url?id=${id}`
    lyricUrl = `https://music.163.com/api/song/lyric?id=${id}&lv=1`
    songName = `${joinSingersName(artists)} - ${name}.${extension}`
  } else {
    const { name, singers, rateFormats, newRateFormats } = song
    const rateFormat = newRateFormats.length
      ? newRateFormats[newRateFormats.length - 1]
      : rateFormats[rateFormats.length - 1]
    size = rateFormat.androidSize || rateFormat.size
    const extension = rateFormat.androidFileType || rateFormat.fileType
    const { pathname } = new URL(rateFormat.androidUrl || rateFormat.url)
    downloadUrl = `https://freetyst.nf.migu.cn${pathname}`
    lyricUrl = song.lyricUrl
    songName = `${joinSingersName(singers)} - ${name}.${extension}`
  }

  return {
    title: `${index + 1}. ${songName} - ${prettyBytes(Number(size))}`,
    value: {
      songName,
      downloadUrl,
      lyricUrl,
      size,
      options,
      serviceName,
    },
  }
}

export default names
