import { Command } from 'commander'
import { cyan } from 'colorette'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const pkg = require('../package.json')

const program = new Command()

export default (() => {
  program.name('musicn or msc').usage('<text>').version(pkg.version)

  program.on('--help', () => {
    console.log('')
    console.log(cyan('普通下载:'))
    console.log(`${cyan('$ ')}msc 稻香`)
    console.log(cyan('附带歌词:'))
    console.log(`${cyan('$ ')}msc 稻香 -l`)
    console.log(cyan('下载路径:'))
    console.log(`${cyan('$ ')}msc 稻香 -p ./music`)
    console.log('')
  })

  program
    .option('-l, --lyric', 'Download lyrics or not')
    .option('-p, --path <path>', 'Target directory path to music bulkDownload')

  program.parse(process.argv)

  const options = program.opts()

  return { text: program.args.join(' '), options }
})()
