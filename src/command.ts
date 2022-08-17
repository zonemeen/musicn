import { Command } from 'commander'
import { cyan, red } from 'colorette'
import updateNotifier from 'update-notifier'
import pkg from '../package.json'

const program = new Command()

export default (() => {
  updateNotifier({ pkg }).notify()
  program.name('musicn or msc').usage('<text>').version(pkg.version)
  program.on('--help', () => {
    console.log('')
    console.log(cyan('普通下载(默认是咪咕的服务):'))
    console.log(`${cyan('$ ')}msc 晴天`)
    console.log(cyan('酷我服务下载:'))
    console.log(`${cyan('$ ')}msc 晴天 -k`)
    console.log(cyan('网易云服务下载:'))
    console.log(`${cyan('$ ')}msc 晴天 -w`)
    console.log(cyan('附带歌词:'))
    console.log(`${cyan('$ ')}msc 晴天 -l`)
    console.log(cyan('下载路径:'))
    console.log(`${cyan('$ ')}msc 晴天 -p ./music`)
    console.log('')
  })

  program
    .option('-n, --number <number>', '搜索时的页码数', '1')
    .option('-l, --lyric', '是否下载歌词')
    .option('-p, --path <path>', '音乐批量下载的目标目录路径')
    .option('-m, --migu', '默认是咪咕的服务')
    .option('-k, --kuwo', '酷我的服务')
    .option('-w, --wangyi', '网易云的服务')

  program.parse(process.argv)

  const options = program.opts()
  const { kuwo, wangyi, migu } = options
  const serviceNum = [kuwo, wangyi, migu].filter(Boolean).length
  if (serviceNum > 1) {
    console.error(red('同时只允许输入一种服务'))
    process.exit(1)
  }
  options.migu = !(wangyi || kuwo)
  return { text: program.args.join(' '), options }
})()
