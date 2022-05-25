import { Command } from 'commander'
import { gray, cyan } from 'colorette'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pkg = require('../package.json')
const program = new Command()

export default (() => {
  program.name('musicn or msc').usage('<text>').version(pkg.version)

  program.on('--help', () => {
    console.log('')
    console.log(gray('Examples:'))
    console.log(cyan('  $ ') + 'musicn.js 稻香')
    console.log(cyan('  # ') + 'or')
    console.log(cyan('  $ ') + 'msc 稻香')
    console.log('')
  })

  program
    .option('-l, --lyric', 'Download lyrics or not')
    .option('-p, --path <path>', 'Target directory path to music bulkDownload')

  program.parse(process.argv)

  const options = program.opts()

  return { text: program.args.join(' '), options }
})()
