const cliProgress = require('cli-progress')
const colors = require('colorette')
const got = require('got')
const fs = require('fs')
const path = require('path')
const { pipeline } = require('stream/promises')
const prettyBytes = require('./pretty-bytes')

module.exports = async ({ name, downloadUrl, lyricUrl, options }) => {
  const { lyric: withLyric = false, path: destPath = './' } = options
  const joinPathWithName = (fileName) => path.join(destPath, fileName)
  const extension = path.extname(downloadUrl)

  if (fs.existsSync(joinPathWithName(`${name}${extension}`))) {
    console.error(colors.red(`歌曲 ${name}${extension} 已存在`))
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

  console.log(colors.green('文件下载开始...'))

  if (lyricUrl && withLyric) {
    await pipeline(
      got.stream(lyricUrl),
      fs.createWriteStream(joinPathWithName(`${name}.lrc`))
    )
  }

  const fileReadStream = got.stream(downloadUrl)

  const onError = (err) => {
    console.error(colors.red(err))
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
      await pipeline(
        fileReadStream,
        fs.createWriteStream(joinPathWithName(`${name}${extension}`))
      )
      progress.stop()
      console.log(colors.green('文件下载完成'))
      process.exit(0)
    } catch (err) {
      onError(err)
    }
  })
  fileReadStream.once('error', onError)
}
