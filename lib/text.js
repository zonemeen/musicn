const text = require('commander')
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')

module.exports = (() => {
  updateNotifier({ pkg }).notify()

  text.name('musicn or msc').usage('<text>').version(pkg.version)

  text.on('--help', () => {
    console.log('')
    console.log(chalk.gray('Examples:'))
    console.log(chalk.cyan('  $ ') + 'musicn You Are Not Alone')
    console.log(chalk.cyan('  # ') + 'or')
    console.log(chalk.cyan('  $ ') + 'msc You Are Not Alone')
    console.log('')
  })

  text.parse(process.argv)

  return text.args.join(' ')
})()
