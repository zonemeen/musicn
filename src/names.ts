import prettyBytes from 'pretty-bytes'
import type { NamesProps } from './types'

const names = ({ song, index, options }: NamesProps) => {
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
