import { cac } from 'cac'
import { red } from 'colorette'
import updateNotifier from 'update-notifier'
import pkg from '../package.json'

export default (() => {
  const cli = cac('musicn')
  updateNotifier({ pkg }).notify()

  cli
    .option('-n, --number <number>', '搜索时的页码数', { default: 1 })
    .option('-s, --songListId <songListId>', '歌单ID')
    .option('-l, --lyric', '是否下载歌词')
    .option('-p, --path <path>', '音乐批量下载的目标目录路径')
    .option('-m, --migu', '默认是咪咕的服务')
    .option('-k, --kuwo', '酷我的服务')
    .option('-g, --kugou', '酷狗的服务')
    .option('-w, --wangyi', '网易云的服务')

  cli.help()

  cli.version(pkg.version)

  const { args, options } = cli.parse()
  const { kuwo, wangyi, migu, kugou, help, version } = options
  const serviceNum = [kuwo, wangyi, migu, kugou].filter(Boolean).length
  if (serviceNum > 1) {
    console.error(red('同时只允许输入一种服务'))
    process.exit(1)
  }
  if (help || version) process.exit()
  options.migu = !(wangyi || kuwo || kugou)
  options.service = wangyi ? 'wangyi' : kuwo ? 'kuwo' : kugou ? 'kugou' : 'migu'
  const content = { text: args.join(' '), options }
  process.stdout.write(JSON.stringify(content))
  return content
})()
