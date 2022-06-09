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
const unfinishedPaths = []

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

// 删除已创建但未下载完全的文件
const delUnfinishedFiles = (targetDir) => {
  for (const item of unfinishedPaths) {
    if (fs.existsSync(item)) {
      fs.unlinkSync(item)
    }
  }
  const files = fs.readdirSync(targetDir)
  if (!files.length) {
    fs.rmdirSync(targetDir)
  }
}

const download = (index, { name, downloadUrl, lyricUrl, size, options }) => {
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
    delUnfinishedFiles(targetDir)
    console.error(red(err))
    process.exit(1)
  }

  fileReadStream.on('response', async () => {
    // 是否下载歌词
    if (lyricUrl && lyric) {
      try {
        unfinishedPaths.push(lrcPath)
        await promisifyPipeline(
          got.stream(lyricUrl),
          fs.createWriteStream(lrcPath)
        )
        unfinishedPaths.splice(unfinishedPaths.indexOf(lrcPath), 1)
      } catch (err) {
        onError(err)
      }
    }

    // 防止`onError`被调用两次
    fileReadStream.off('error', onError)

    try {
      unfinishedPaths.push(songPath)
      await promisifyPipeline(fileReadStream, fs.createWriteStream(songPath))
      unfinishedPaths.splice(unfinishedPaths.indexOf(songPath), 1)
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
  const { path: targetDir = process.cwd() } = songs[0].options
  console.log(green('下载开始...'))
  for (const [index, song] of songs.entries()) {
    download(index, song)
  }
  multiBar.on('stop', () => {
    !unfinishedPaths.length && console.log(green('下载完成'))
    delUnfinishedFiles(targetDir)
    process.exit(0)
  })
}
export default bulkDownload
