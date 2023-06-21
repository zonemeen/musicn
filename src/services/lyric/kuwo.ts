import got from 'got'
import { createWriteStream } from 'node:fs'

function convertToStandardTime(timeStr: string) {
  const timeInSec = parseFloat(timeStr)
  const hours = Math.floor(timeInSec / 3600)
  const minutes = Math.floor((timeInSec - hours * 3600) / 60)
  const seconds = Math.floor(timeInSec - hours * 3600 - minutes * 60)
  const milliseconds = Math.round((timeInSec - Math.floor(timeInSec)) * 100)

  const minutesStr = minutes.toString().padStart(2, '0')
  const secondsStr = seconds.toString().padStart(2, '0')
  const millisecondsStr = milliseconds.toString().padStart(2, '0')

  return `${minutesStr}:${secondsStr}.${millisecondsStr}`
}

export default async (lrcPath: string | null, lyricDownloadUrl: string) => {
  const {
    data: { lrclist },
  } = await got(lyricDownloadUrl).json()
  let lyric = ''
  if (lrclist && lrclist.length) {
    for (const lrc of lrclist) {
      lyric += `[${convertToStandardTime(lrc.time)}]${lrc.lineLyric}\n`
    }
  } else {
    lyric = '[00:00.00]无歌词'
  }
  if (lrcPath) {
    const lrcFileWriteStream = createWriteStream(lrcPath)
    lrcFileWriteStream.write(lyric)
  }
  if (!lrcPath) return lyric
}
