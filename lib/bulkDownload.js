import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream'
import { promisify } from 'util'
import cliProgress from 'cli-progress'
import got from 'got'
import prettyBytes from 'pretty-bytes'
import { red, green } from 'colorette'
import removePunctuation from './util.js'

const promisifyPipeline = promisify(pipeline)

const bars = []

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
  const { lyric = false, path: targetDir = './' } = options
  const joinPathWithName = (fileName) => path.join(targetDir, fileName)
  const extension = path.extname(downloadUrl)
  bars.push(multiBar.create(size, 0, { file: `${name}${extension}` }))

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir)
  }

  if (lyricUrl && lyric) {
    await promisifyPipeline(
      got.stream(lyricUrl),
      fs.createWriteStream(joinPathWithName(`${removePunctuation(name)}.lrc`))
    )
  }

  const fileReadStream = got.stream(downloadUrl)

  const onError = (err) => {
    console.error(red(err))
    process.exit(1)
  }

  fileReadStream.on('response', async () => {
    // 防止`onError`被调用两次
    fileReadStream.off('error', onError)

    try {
      await promisifyPipeline(
        fileReadStream,
        fs.createWriteStream(
          joinPathWithName(`${removePunctuation(name)}${extension}`)
        )
      )
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
  songs.map(async (song, index) => {
    await download(song, index)
  })
  multiBar.on('stop', () => {
    console.log(green('文件下载完成'))
    process.exit(0)
  })
}
export default bulkDownload
