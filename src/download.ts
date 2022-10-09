import fs from 'fs'
import path from 'path'
import got from 'got'
import cliProgress from 'cli-progress'
import prettyBytes from 'pretty-bytes'
import { pipeline } from 'stream/promises'
import { red, green } from 'colorette'
import { delUnfinishedFiles, checkFileExist } from './utils'
import type { SongInfo } from './types'

const barList: cliProgress.SingleBar[] = []
const songNameMap = new Map<string, number>()
const unfinishedPathMap = new Map<string, string>()
let timer: NodeJS.Timer

const multiBar = new cliProgress.MultiBar({
  format: '[\u001b[32m{bar}\u001b[0m] | {file} | {value}/{total}',
  hideCursor: true,
  barCompleteChar: '#',
  barIncompleteChar: '#',
  barGlue: '\u001b[33m',
  barsize: 30,
  stopOnComplete: true,
  noTTYOutput: true,
  forceRedraw: true,
  formatValue(value, _, type) {
    if (type === 'total' || type === 'value') {
      return prettyBytes(Number(value))
    }
    return String(value)
  },
})

const downloadSong = (song: SongInfo, index: number) => {
  let { songName, songDownloadUrl, lyricDownloadUrl, songSize, options } = song
  const { lyric: withLyric = false, path: targetDir = process.cwd(), wangyi, migu, kuwo } = options
  return new Promise<void>(async () => {
    // 防止因歌曲名重名导致下载时被覆盖
    if (songNameMap.has(songName)) {
      songNameMap.set(songName, Number(songNameMap.get(songName)) + 1)
      const [name, extension] = songName.split('.')
      const newName = `${name}(${songNameMap.get(songName)})`
      songName = `${newName}.${extension}`
    } else {
      songNameMap.set(songName, 0)
    }
    const songPath = path.join(targetDir, songName)
    const lrcName = `${songName.split('.')[0]}.lrc`
    const lrcPath = path.join(targetDir, lrcName)
    checkFileExist(songPath)
    barList.push(multiBar.create(songSize, 0, { file: songName }))

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir)
    }

    const onError = (err: any, songPath: string) => {
      timer = setInterval(function () {
        const bar = barList[index]
        const STEP_COUNT = 9999
        bar.options.format = '[\u001b[31m{bar}\u001b[0m] | {file} | {value}/{total}'
        if (songSize - bar.value >= STEP_COUNT) {
          return bar.increment(STEP_COUNT)
        }
        bar.increment(songSize - bar.value)
      }, 3)
      if (unfinishedPathMap.has(songPath)) {
        unfinishedPathMap.set(songPath, err)
      }
    }

    unfinishedPathMap.set(songPath, '')

    // 是否下载歌词
    if (withLyric && migu) {
      await pipeline(got.stream(lyricDownloadUrl), fs.createWriteStream(lrcPath))
    }
    if (withLyric && kuwo) {
      const {
        data: { lrclist },
      } = await got(lyricDownloadUrl).json()
      let lyric = ''
      for (const lrc of lrclist) {
        lyric += `[${lrc.time}] ${lrc.lineLyric}\n`
      }
      const lrcFile = fs.createWriteStream(lrcPath)
      lrcFile.write(lyric)
    }
    if (withLyric && wangyi) {
      const {
        lrc: { lyric },
      } = await got(lyricDownloadUrl).json()
      const lrcFile = fs.createWriteStream(lrcPath)
      if (lyric) {
        lrcFile.write(lyric)
      } else {
        lrcFile.write(`[00:00.00]${songName.split('.')[0]}`)
      }
    }

    try {
      const fileReadStream = got.stream(songDownloadUrl)
      fileReadStream.on('response', async () => {
        // 防止`onError`被调用两次
        fileReadStream.off('error', (err) => {
          onError(err, songPath)
        })

        await pipeline(fileReadStream, fs.createWriteStream(songPath))
        unfinishedPathMap.delete(songPath)
      })

      fileReadStream.on('downloadProgress', ({ transferred }) => {
        barList[index].update(transferred)
      })

      fileReadStream.once('error', (err) => {
        onError(err, songPath)
      })
    } catch (err) {
      onError(err, songPath)
    }
  })
}

const download = async (songs: SongInfo[]) => {
  if (!songs.length) {
    console.error(red('请选择歌曲'))
    process.exit(1)
  }
  const { path: targetDir = process.cwd() } = songs[0].options
  console.log(green('下载开始...'))
  multiBar.on('stop', () => {
    clearInterval(timer)
    let message = ''
    if (unfinishedPathMap.size) {
      message = Array.from(unfinishedPathMap.entries()).reduce((pre, cur, index) => {
        pre += `\n${index + 1}.${path.basename(cur[0])}下载失败，报错信息：${cur[1]}`
        return pre
      }, '失败信息：')
    }
    console.log(
      green(
        `下载完成，成功 ${songs.length - unfinishedPathMap.size} 首，失败 ${
          unfinishedPathMap.size
        } 首\n${red(message)}`
      )
    )
    delUnfinishedFiles(targetDir, unfinishedPathMap.keys())
    process.exit()
  })
  // 多种信号事件触发执行清理操作
  ;['exit', 'SIGINT', 'SIGHUP', 'SIGBREAK', 'SIGTERM'].forEach((eventType) => {
    process.on(eventType, () => {
      delUnfinishedFiles(targetDir, unfinishedPathMap.keys())
      process.exit()
    })
  })
  await Promise.all(songs.map((song, index) => downloadSong(song, index)))
}
export default download
