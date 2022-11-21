import prettyBytes from 'pretty-bytes'
import type { CommandOptions, SearchSongInfo } from './types'

const names = (song: SearchSongInfo, index: number, options: CommandOptions) => {
  const { songName, url, size, disabled, lyricUrl } = song

  return {
    name: `${index + 1}. ${songName} - ${prettyBytes(Number(size))}`,
    disabled,
    value: {
      songName,
      songDownloadUrl: url,
      lyricDownloadUrl: lyricUrl,
      songSize: size,
      options,
    },
  }
}

export default names
