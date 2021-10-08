const commander = require('commander')
const chalk = require('chalk')
const got = require('got')
const fs = require('fs')
const https = require('https')
const updateNotifier = require('update-notifier')
const cliProgress = require('cli-progress')
const pkg = require('../package.json')

updateNotifier({ pkg }).notify()

commander.name('musicn or msc').usage('<text>').version(pkg.version)

commander.on('--help', () => {
  console.log('')
  console.log(chalk.gray('Examples:'))
  console.log(chalk.cyan('  $ ') + 'musicn You Are Not Alone')
  console.log(chalk.cyan('  # ') + 'or')
  console.log(chalk.cyan('  $ ') + 'msc You Are Not Alone')
  console.log('')
})

commander.parse(process.argv)

export default async () => {
  const text = commander.args.join(' ')

  const searchUrl = `https://pd.musicapp.migu.cn/MIGUM3.0/v1.0/content/search_all.do?&text=${text}&pageSize=1&searchSwitch={song:1}`

  const { body } = await got(searchUrl)
  const newRateFormats = JSON.parse(body).songResultData?.result[0]
    .newRateFormats

  if (!newRateFormats) {
    return console.log(chalk.red(`没搜索到 ${text} 的相关结果`))
  }

  let hqSource
  for (let format of newRateFormats) {
    if (format.formatType === 'SQ' || format.formatType === 'HQ') {
      hqSource = format
    }
  }
  const { pathname } = new URL(hqSource.url || hqSource.androidUrl)

  const downloadUrl = `https://freetyst.nf.migu.cn/${pathname}`

  const extension = downloadUrl.substring(downloadUrl.lastIndexOf('.') + 1)

  const progress = new cliProgress.SingleBar({
    format: '下载进度 | {bar} | {percentage}%',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
  })

  console.log(chalk.green('文件下载开始'))

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
