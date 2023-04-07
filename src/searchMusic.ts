import ora from 'ora'
import { cyan, red } from 'colorette'
import search from './services/search'
import type { SongInfo } from './types'

const searchMusic = async ({ text, options }: SongInfo) => {
  try {
    const { number: pageNum, size: pageSize, service, songListId, kugou } = options
    const intRegex = /^[1-9]\d*$/
    if (text === '' && !songListId) {
      console.error(red('请输入歌曲名称或歌手名字'))
      process.exit(1)
    }

    if (text && songListId) {
      console.error(red('不能同时输入搜索词和歌单id'))
      process.exit(1)
    }

    if (!intRegex.test(pageNum)) {
      console.error(red('页码数应是大于0的整数，请重新输入'))
      process.exit(1)
    }

    if (!intRegex.test(pageSize)) {
      console.error(red('歌曲数量应是大于0的整数，请重新输入'))
      process.exit(1)
    }

    if (kugou && songListId) {
      console.error(red('kugou服务不支持歌单下载'))
      process.exit(1)
    }

    const spinner = ora(cyan('搜索ing')).start()
    const { searchSongs, totalSongCount } = await search[service]({
      text,
      pageNum,
      pageSize,
      songListId,
    })

    if (!searchSongs.length) {
      if (text && totalSongCount === undefined) {
        spinner.fail(red(`没搜索到 ${text} 的相关结果`))
        process.exit(1)
      }
      if (songListId && totalSongCount === undefined) {
        spinner.fail(red(`没搜索到歌单ID: ${songListId} 的相关结果`))
        process.exit(1)
      }
      spinner.fail(red('搜索页码超出范围，请重新输入'))
      process.exit(1)
    }
    spinner.stop()
    return { searchSongs, options }
  } catch (err: any) {
    console.error(red(err))
    process.exit(1)
  }
}

export default searchMusic
