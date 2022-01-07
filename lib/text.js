const text = require('commander')
const updateNotifier = require('update-notifier')
const colors = require('colorette')
const pkg = require('../package.json')

module.exports = (() => {
  updateNotifier({ pkg }).notify()

  text.name('musicn or msc').usage('<text>').version(pkg.version)

  text.on('--help', () => {
    console.log('')
    console.log(colors.gray('Examples:'))
    console.log(colors.cyan('  $ ') + 'musicn You Are Not Alone')
    console.log(colors.cyan('  # ') + 'or')
    console.log(colors.cyan('  $ ') + 'msc You Are Not Alone')
    console.log('')
  })

  text.parse(process.argv)

  return text.args.join(' ')
})()
