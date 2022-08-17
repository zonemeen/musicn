import prettyBytes from 'pretty-bytes'
import { joinSingersName } from './utils'
import { CommandOptions, SearchSongInfo } from './types'

const names = (song: SearchSongInfo, index: number, options: CommandOptions) => {
  const { wangyi, migu } = options
  let songName, songDownloadUrl, lyricDownloadUrl, songSize
  if (wangyi) {
    const { id, name, url, artists, extension, size } = song
    songSize = size
    songDownloadUrl = url
    lyricDownloadUrl = `https://music.163.com/api/song/lyric?id=${id}&lv=1`
    songName = `${joinSingersName(artists)} - ${name}.${extension}`
  } else if (migu) {
    const { name, singers, rateFormats, newRateFormats, contentId, copyrightId } = song
    const { size, fileType } = newRateFormats.length ? newRateFormats[0] : rateFormats[0]
    songSize = size
    songDownloadUrl = `https://app.pd.nf.migu.cn/MIGUM3.0/v1.0/content/sub/listenSong.do?channel=mx&copyrightId=${copyrightId}&contentId=${contentId}`
    lyricDownloadUrl = song.lyricUrl
    songName = `${joinSingersName(singers)} - ${name}.${fileType}`
  } else {
    const { ARTIST, DC_TARGETID, url, name, size } = song
    const singersName = ARTIST.replaceAll('&', ',')
    songDownloadUrl = url
    songSize = size
    lyricDownloadUrl = `https://m.kuwo.cn/newh5/singles/songinfoandlrc?musicId=${DC_TARGETID}`
    songName = `${singersName} - ${name}.mp3`
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
