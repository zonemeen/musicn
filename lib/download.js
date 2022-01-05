const cliProgress = require('cli-progress')
const chalk = require('chalk')
const fs = require('fs')
const https = require('https')
const path = require('path')

module.exports = ({ name, newRateFormats }) => {
  const option = newRateFormats[newRateFormats.length - 1]

  const { pathname } = new URL(option.androidUrl || option.url)

  const downloadUrl = `https://freetyst.nf.migu.cn/${pathname}`

  const extension = path.extname(pathname).toLowerCase().substr(1)

  const progress = new cliProgress.SingleBar({
    format: '下载进度 | {bar} | {percentage}%',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  })

  console.log(chalk.green('文件下载开始...'))

  https.get(downloadUrl, (res) => {
    const fileSteam = fs.createWriteStream(`${name}.${extension}`)
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
      fileSteam.end()
      process.exit(0)
    })
  })
}
