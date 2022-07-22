import prettyBytes from 'pretty-bytes'
import { joinSingersName } from './utils'
import { CommandOptions, SearchSongInfo } from './types'

const names = (song: SearchSongInfo, index: number, options: CommandOptions) => {
  const { service } = options
  let songName, songDownloadUrl, lyricDownloadUrl, songSize
  if (service === 'netease') {
    const { id, name, url, artists, extension, size } = song
    songSize = size
    songDownloadUrl = url
    lyricDownloadUrl = `https://music.163.com/api/song/lyric?id=${id}&lv=1`
    songName = `${joinSingersName(artists)} - ${name}.${extension}`
  } else {
    const { name, singers, rateFormats, newRateFormats, contentId, copyrightId } = song
    const rateFormatData = newRateFormats.length ? newRateFormats[0] : rateFormats[0]
    songSize = rateFormatData.androidSize || rateFormatData.size
    const extension = rateFormatData.androidFileType || rateFormatData.fileType
    songDownloadUrl = `https://app.pd.nf.migu.cn/MIGUM3.0/v1.0/content/sub/listenSong.do?channel=mx&copyrightId=${copyrightId}&contentId=${contentId}`
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
    },
  }
}

export default names
