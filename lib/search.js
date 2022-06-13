import got from 'got'
import ora from 'ora'
import { red, cyan } from 'colorette'
import { removePunctuation } from './utils.js'

const search = async ({ text, options, serviceName }) => {
  let songs
  if (text === '') {
    console.error(red(`请输入歌曲名称或歌手名字`))
    process.exit(1)
  }
  const spinner = ora(cyan('搜索ing')).start()
  spinner.start()
  if (serviceName === 'netease') {
    const searchUrl = `https://music.163.com/api/search/get/web?s=${removePunctuation(
      text
    )}&type=1&limit=20`
    const searchResult = await got(searchUrl).json()
    songs = searchResult.result.songs
    if (songs) {
      songs = songs.filter((item) => item.fee !== 1)
      for (const song of songs) {
        const detailUrl = `https://music.163.com/api/song/detail/?ids=[${song.id}]`
        const detailResult = await got(detailUrl).json()
        const { size, extension } = detailResult.songs[0].lMusic
        song.size = size
        song.extension = extension
      }
    }
  } else {
    const searchUrl = `https://pd.musicapp.migu.cn/MIGUM3.0/v1.0/content/search_all.do?&text=${removePunctuation(
      text
    )}&pageSize=1&searchSwitch={song:1}`
    const searchResult = await got(searchUrl).json()
    songs = searchResult.songResultData?.result
  }
  if (!songs) {
    spinner.fail(red(`没搜索到 ${text} 的相关结果`))
    process.exit(1)
  }
  spinner.stop()
  return { songs, options, serviceName }
}

export default search
