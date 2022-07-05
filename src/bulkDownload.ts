import fs from 'fs'
import path from 'path'
import cliProgress from 'cli-progress'
import got from 'got'
import { pipeline } from 'stream'
import { promisify } from 'util'
import { red, green } from 'colorette'
import prettyBytes from 'pretty-bytes'
import { delUnfinishedFiles, checkFileExist } from './utils'
import { SongInfo } from './types'

const promisifyPipeline = promisify(pipeline)

const barList: cliProgress.SingleBar[] = []
const songNameMap = new Map<string, number>()
const unfinishedPathMap = new Map<string, boolean>()

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

const download = (song: SongInfo, index: number) => {
  let { songName, songDownloadUrl, lyricDownloadUrl, songSize, options, serviceName } = song
  return new Promise<void>((resolve, reject) => {
    if (songNameMap.has(songName)) {
      songNameMap.set(songName, Number(songNameMap.get(songName)) + 1)
      const [name, extension] = songName.split('.')
      const newName = `${name}(${songNameMap.get(songName)})`
      songName = `${newName}.${extension}`
    } else {
      songNameMap.set(songName, 0)
    }
    const { lyric: withLyric = false, path: targetDir = process.cwd() } = options
    const songPath = path.join(targetDir, songName)
    const lrcName = `${songName.slice(0, songName.lastIndexOf('.'))}.lrc`
    const lrcPath = path.join(targetDir, lrcName)
    checkFileExist(songPath, songName)
    barList.push(multiBar.create(songSize, 0, { file: songName }))

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir)
    }

    const fileReadStream = got.stream(songDownloadUrl)

    const onError = (err: any) => {
      delUnfinishedFiles(targetDir, unfinishedPathMap.keys())
      console.error(red(`${songName}下载失败，报错信息：${err}`))
      reject(err)
      process.exit(1)
    }

    fileReadStream.on('response', async () => {
      // 是否下载歌词
      if (withLyric && serviceName === 'netease') {
        try {
          const {
            lrc: { lyric },
          } = await got(lyricDownloadUrl).json()
          if (lyric) {
            const lrcFile = fs.createWriteStream(lrcPath)
            lrcFile.write(lyric)
          }
        } catch (err) {
          onError(err)
        }
      }
      if (withLyric && serviceName === 'migu') {
        try {
          await promisifyPipeline(got.stream(lyricDownloadUrl), fs.createWriteStream(lrcPath))
        } catch (err) {
          onError(err)
        }
      }

      // 防止`onError`被调用两次
      fileReadStream.off('error', onError)

      try {
        unfinishedPathMap.set(songPath, true)
        await promisifyPipeline(fileReadStream, fs.createWriteStream(songPath))
        unfinishedPathMap.delete(songPath)
        resolve()
      } catch (err) {
        onError(err)
      }
    })

    fileReadStream.on('downloadProgress', ({ transferred }) => {
      barList[index].update(transferred)
    })

    fileReadStream.once('error', onError)
  })
}

const bulkDownload = async (songs: SongInfo[]) => {
  const { path: targetDir = process.cwd() } = songs[0].options
  console.log(green('下载开始...'))
  multiBar.on('stop', () => {
    if (!unfinishedPathMap.size) {
      console.log(green('下载完成'))
      process.exit(0)
    }
  })
  process.on('SIGINT', () => {
    delUnfinishedFiles(targetDir, unfinishedPathMap.keys())
    process.exit(1)
  })
  await Promise.all(songs.map(async (song, index) => await download(song, index)))
}
export default bulkDownload
