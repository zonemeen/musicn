#!/usr/bin/env node

const commander = require('commander')
const chalk = require('chalk')
const util = require('util')
const got = require('got')
const fs = require('fs')
const stream = require('stream')
const updateNotifier = require('update-notifier')
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

!(async () => {
  const text = commander.args.join(' ')

  const searchUrl = `https://pd.musicapp.migu.cn/MIGUM3.0/v1.0/content/search_all.do?&text=${text}&pageSize=1&searchSwitch={song:1}`

  const { body } = await got(searchUrl)
  const newRateFormats = JSON.parse(body).songResultData?.result[0]
    .newRateFormats

  if (!newRateFormats) {
    return console.log(chalk.red('There is no such song'))
  }

  let hqSource
  for (let format of newRateFormats) {
    if (format.formatType === 'SQ' || format.formatType === 'HQ') {
      hqSource = format
    }
  }
  const { pathname } = new URL(hqSource.url || hqSource.androidUrl)

  const downloadUrl = `https://freetyst.nf.migu.cn/${pathname}`

  const pipeline = util.promisify(stream.pipeline)

  await pipeline(got.stream(downloadUrl), fs.createWriteStream(`${text}.mp3`))

  console.log(chalk.green('Download successful'))
})()
