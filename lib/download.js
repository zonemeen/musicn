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

const download = async ({ name, downloadUrl, lyricUrl, options }) => {
  const { lyric: withLyric = false, path: destPath = './' } = options
  const joinPathWithName = (fileName) => path.join(destPath, fileName)
  const extension = path.extname(downloadUrl)

  if (fs.existsSync(joinPathWithName(`${name}${extension}`))) {
    console.error(red(`歌曲 ${name}${extension} 已存在`))
    process.exit(1)
  }

  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath)
  }

  const progress = new cliProgress.SingleBar({
    format: '下载进度 | {bar} | {percentage}% | {value}/{total}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
    formatValue(value, _, type) {
      if (type === 'total' || type === 'value') {
        return prettyBytes(Number(value))
      }
      return String(value)
    },
  })

  console.log(green('文件下载开始...'))

  if (lyricUrl && withLyric) {
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

  fileReadStream.on('response', async (res) => {
    progress.start(res.headers['content-length'], 0)

    // 防止`onError`被调用两次
    fileReadStream.off('error', onError)

    let dataLength = 0
    res.on('data', (chunk) => {
      dataLength += chunk.length
      progress.update(dataLength)
    })

    try {
      await promisifyPipeline(
        fileReadStream,
        fs.createWriteStream(
          joinPathWithName(`${removePunctuation(name)}${extension}`)
        )
      )
      progress.stop()
      console.log(green('文件下载完成'))
      process.exit(0)
    } catch (err) {
      onError(err)
    }
  })
  fileReadStream.once('error', onError)
}

export default download
