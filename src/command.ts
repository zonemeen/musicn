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
    console.log(cyan('普通下载:'))
    console.log(`${cyan('$ ')}msc 晴天`)
    console.log(cyan('网易云服务下载:'))
    console.log(`${cyan('$ ')}msc 晴天 -s netease`)
    console.log(cyan('咪咕服务下载:'))
    console.log(`${cyan('$ ')}msc 晴天 -s migu`)
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
    .option('-s, --service <service>', '支持的音乐服务: kuwo, migu, netease', 'kuwo')

  const supportedServices = ['kuwo', 'netease', 'migu']
  program.parse(process.argv)

  const options = program.opts()

  if (!supportedServices.includes(options.service)) {
    console.error(red(`不支持 ${options.service} 服务`))
    process.exit(1)
  }
  return { text: program.args.join(' '), options }
})()
