const { Command } = require('commander')
const updateNotifier = require('update-notifier')
const colors = require('colorette')
const pkg = require('../package.json')
const program = new Command()

module.exports = (() => {
  updateNotifier({ pkg }).notify()

  program.name('musicn or msc').usage('<text>').version(pkg.version)

  program.on('--help', () => {
    console.log('')
    console.log(colors.gray('Examples:'))
    console.log(colors.cyan('  $ ') + 'musicn You Are Not Alone')
    console.log(colors.cyan('  # ') + 'or')
    console.log(colors.cyan('  $ ') + 'msc You Are Not Alone')
    console.log('')
  })

  program.option('-l, --lyric', 'Download lyrics or not')

  program.parse(process.argv)

  const options = program.opts()

  return { text: program.args.join(' '), options }
})()
