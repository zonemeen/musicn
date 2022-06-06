import fs from 'fs'
import path from 'path'
import cliProgress from 'cli-progress'
import got from 'got'
import { pipeline } from 'stream'
import { promisify } from 'util'
import { red, green } from 'colorette'
import prettyBytes from 'pretty-bytes'

const promisifyPipeline = promisify(pipeline)

const bars = []
const unfinishedPathItems = []

const multiBar = new cliProgress.MultiBar({
  format: '[\u001b[32m{bar}\u001b[0m] | {file} | {value}/{total}',
  hideCursor: true,
  barCompleteChar: '#',
  barIncompleteChar: '#',
  barGlue: '\u001b[33m',
  stopOnComplete: true,
  noTTYOutput: true,
  formatValue(value, _, type) {
    if (type === 'total' || type === 'value') {
      return prettyBytes(Number(value))
    }
    return String(value)
  },
})

const download = ({ name, downloadUrl, lyricUrl, size, options }, index) => {
  const { lyric = false, path: targetDir = process.cwd() } = options
  const songPath = path.join(targetDir, name)
  const lrcPath = path.join(
    targetDir,
    `${name.slice(0, name.lastIndexOf('.'))}.lrc`
  )
  bars.push(multiBar.create(size, 0, { file: name }))

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir)
  }

  const fileReadStream = got.stream(downloadUrl)

  const onError = (err) => {
    // 删除已创建但未下载完全的文件或已下载的歌词文件
    for (const item of unfinishedPathItems) {
      if (fs.existsSync(item)) {
        fs.unlinkSync(item)
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
    // 是否下载歌词
    if (lyricUrl && lyric) {
      try {
        unfinishedPathItems.push(lrcPath)
        await promisifyPipeline(
          got.stream(lyricUrl),
          fs.createWriteStream(lrcPath)
        )
        unfinishedPathItems.splice(unfinishedPathItems.indexOf(lrcPath), 1)
      } catch (err) {
        onError(err)
      }
    }

    // 防止`onError`被调用两次
    fileReadStream.off('error', onError)

    try {
      unfinishedPathItems.push(songPath)
      await promisifyPipeline(fileReadStream, fs.createWriteStream(songPath))
      unfinishedPathItems.splice(unfinishedPathItems.indexOf(songPath), 1)
      multiBar.on('stop', () => {
        console.log(green('下载完成'))
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
  console.log(green('下载开始...'))
  songs.forEach((song, index) => {
    download(song, index)
  })
}
export default bulkDownload
