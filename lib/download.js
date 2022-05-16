const cliProgress = require('cli-progress')
const colors = require('colorette')
const fs = require('fs')
const https = require('https')
const http = require('http')
const path = require('path')

module.exports = ({ name, downloadUrl, lyricUrl, withLyric }) => {
  const extension = path.extname(downloadUrl)

  if (fs.existsSync(`${name}${extension}`)) {
    console.error(colors.red(`歌曲 ${name}${extension} 已存在`))
    process.exit(1)
  }

  const progress = new cliProgress.SingleBar({
    format: '下载进度 | {bar} | {percentage}%',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  })

  console.log(colors.green('文件下载开始...'))

  if (withLyric) {
    http.get(lyricUrl, (res) => {
      const lrcStream = fs.createWriteStream(`${name}.lrc`, {
        encoding: 'utf8',
      })
      res.pipe(lrcStream)
    })
  }

  https.get(downloadUrl, (res) => {
    const fileStream = fs.createWriteStream(`${name}${extension}`)
    res.pipe(fileStream)

    progress.start(res.headers['content-length'], 0)

    let dataLength = 0

    res.on('data', (chunk) => {
      dataLength += chunk.length
      progress.update(dataLength)
    })

    fileStream.on('finish', () => {
      progress.stop()
      console.log(colors.green('文件下载完成'))
      process.exit(0)
    })
  })
}
