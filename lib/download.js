const cliProgress = require('cli-progress')
const chalk = require('chalk')
const fs = require('fs')
const https = require('https')

module.exports = (song, text) => {
  const option = song[song.length - 1]

  const { pathname } = new URL(option.androidUrl || option.url)

  const downloadUrl = `https://freetyst.nf.migu.cn/${pathname}`

  const extension = pathname.substring(pathname.lastIndexOf('.') + 1)

  const progress = new cliProgress.SingleBar({
    format: '下载进度 | {bar} | {percentage}%',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  })

  console.log(chalk.green('文件下载开始...'))

  https.get(downloadUrl, (res) => {
    const fileSteam = fs.createWriteStream(`${text}.${extension}`)
    res.pipe(fileSteam)

    progress.start(res.headers['content-length'], 0)

    let dataLength = 0

    res.on('data', (chunk) => {
      dataLength += chunk.length
      progress.update(dataLength)
    })

    fileSteam.on('finish', () => {
      progress.stop()
      console.log(chalk.green('文件保存完成'))
    })
  })
}
