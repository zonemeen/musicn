import fs from 'fs'
import path from 'path'
import cliProgress from 'cli-progress'
import got from 'got'
import { pipeline } from 'stream'
import { promisify } from 'util'
import prettyBytes from 'pretty-bytes'
import { red, green } from 'colorette'

const promisifyPipeline = promisify(pipeline)

const bars = []
const unfinishedPaths = []

const multiBar = new cliProgress.MultiBar({
  format: '下载进度 {bar} | {file} | {value}/{total}',
  hideCursor: true,
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  stopOnComplete: true,
  noTTYOutput: true,
  formatValue(value, _, type) {
    if (type === 'total' || type === 'value') {
      return prettyBytes(Number(value))
    }
    return String(value)
  },
})

const download = async (
  { name, downloadUrl, lyricUrl, size, options },
  index
) => {
  const { lyric = false, path: targetDir = process.cwd() } = options
  const extension = path.extname(downloadUrl)
  const songPath = path.join(targetDir, `${name}${extension}`)
  const lrcPath = path.join(targetDir, `${name}.lrc`)
  bars.push(multiBar.create(size, 0, { file: `${name}${extension}` }))

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir)
  }

  const fileReadStream = got.stream(downloadUrl)

  const onError = (err) => {
    // 删除已创建但未下载完全的文件或已下载的歌词文件
    for (const path of unfinishedPaths) {
      if (fs.existsSync(path)) {
        fs.unlinkSync(path)
      }
    }
    const files = fs.readdirSync(targetDir)
    if (!files.length) {
      fs.rmdirSync(targetDir)
    }
    console.error(red(err))
    process.exit(1)
  }

  fileReadStream.on('response', async () => {
    unfinishedPaths.push(songPath)

    // 是否下载歌词
    if (lyricUrl && lyric) {
      unfinishedPaths.push(lrcPath)
      await promisifyPipeline(
        got.stream(lyricUrl),
        fs.createWriteStream(lrcPath)
      )
    }

    // 防止`onError`被调用两次
    fileReadStream.off('error', onError)

    try {
      await promisifyPipeline(fileReadStream, fs.createWriteStream(songPath))
      unfinishedPaths.splice(unfinishedPaths.indexOf(songPath), 1)
      lyricUrl &&
        lyric &&
        unfinishedPaths.splice(unfinishedPaths.indexOf(lrcPath), 1)
      multiBar.on('stop', () => {
        console.log(green('文件下载完成'))
        process.exit(0)
      })
    } catch (err) {
      onError(err)
    }
  })

  fileReadStream.on('downloadProgress', ({ transferred }) => {
    bars[index].update(transferred)
  })

  fileReadStream.once('error', onError)
}

const bulkDownload = (songs) => {
  console.log(green('文件下载开始...'))
  songs.forEach(async (song, index) => {
    await download(song, index)
  })
}
export default bulkDownload
