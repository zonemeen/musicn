import prettyBytes from 'pretty-bytes'
import nameType from './nameType'
import type { CommandOptions, SearchSongInfo } from './types'

const names = (song: SearchSongInfo, index: number, options: CommandOptions) => {
  const { service } = options
  const { songName, songDownloadUrl, lyricDownloadUrl, songSize, disabled } =
    nameType[service](song)

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
