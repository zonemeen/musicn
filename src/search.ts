import got from 'got'
import ora from 'ora'
import { red, cyan } from 'colorette'
import { removePunctuation } from './utils'
import { SongInfo, SearchSongInfo } from './types'

const search = async ({ text, options, serviceName }: SongInfo) => {
  const { number: pageNum } = options
  const intRegex = /^[1-9]\d*$/
  let searchSongs: SearchSongInfo[]

  if (text === '') {
    console.error(red('请输入歌曲名称或歌手名字'))
    process.exit(1)
  }

  if (!intRegex.test(pageNum)) {
    console.error(red('页码数应是大于0的整数'))
    process.exit(1)
  }

  const spinner = ora(cyan('搜索ing')).start()
  if (serviceName === 'netease') {
    const searchUrl = `https://music.163.com/api/search/get/web?s=${removePunctuation(
      text
    )}&type=1&limit=20&offset=${(Number(pageNum) - 1) * 20}`
    const {
      result: { songs = [] },
    } = await got(searchUrl).json()
    searchSongs = songs.filter((item: { fee: number }) => item.fee !== 1)
    for (const song of searchSongs) {
      const detailUrl = `https://music.163.com/api/song/enhance/player/url?id=${song.id}&ids=[${song.id}]&br=3200000`
      const { data } = await got(detailUrl).json()
      const { url, size, type } = data[0]
      song.url = url
      song.size = size
      song.extension = type
    }
  } else {
    const searchUrl = `https://pd.musicapp.migu.cn/MIGUM3.0/v1.0/content/search_all.do?text=${removePunctuation(
      text
    )}&pageNo=${pageNum}&searchSwitch={song:1}`
    const { songResultData } = await got(searchUrl).json()
    searchSongs = songResultData?.result || []
  }
  if (!searchSongs.length) {
    if (Number(pageNum) > 1) {
      spinner.fail(red('搜索页码超出可搜索范围'))
      process.exit(1)
    }
    spinner.fail(red(`没搜索到 ${text} 的相关结果`))
    process.exit(1)
  }
  spinner.stop()
  return { searchSongs, options, serviceName }
}

export default search
