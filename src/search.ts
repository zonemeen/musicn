import got from 'got'
import ora from 'ora'
import { red, cyan } from 'colorette'
import { getSongSizeByUrl } from './utils'
import { SongInfo, SearchSongInfo } from './types'

const search = async ({ text, options }: SongInfo) => {
  const { number: pageNum, service } = options
  const intRegex = /^[1-9]\d*$/
  let searchSongs: SearchSongInfo[], rawSearchSongs: SearchSongInfo[], totalSongCount

  if (text === '') {
    console.error(red('请输入歌曲名称或歌手名字'))
    process.exit(1)
  }

  if (!intRegex.test(pageNum)) {
    console.error(red('页码数应是大于0的整数，请重新输入'))
    process.exit(1)
  }

  const spinner = ora(cyan('搜索ing')).start()

  if (service === 'netease') {
    const searchUrl = `https://music.163.com/api/search/get/web?s=${encodeURIComponent(
      text
    )}&type=1&limit=20&offset=${(Number(pageNum) - 1) * 20}`
    const {
      result: { songs = [], songCount },
    } = await got(searchUrl).json()
    rawSearchSongs = songs
    searchSongs = songs.filter((item: { fee: number }) => item.fee !== 1)
    totalSongCount = songCount
    for (const song of searchSongs) {
      const detailUrl = `https://music.163.com/api/song/enhance/player/url?id=${song.id}&ids=[${song.id}]&br=3200000`
      const { data } = await got(detailUrl).json()
      const { url, size, type } = data[0]
      Object.assign(song, { url, size, extension: type })
    }
  } else if (service === 'migu') {
    const searchUrl = `https://pd.musicapp.migu.cn/MIGUM3.0/v1.0/content/search_all.do?text=${encodeURIComponent(
      text
    )}&pageNo=${pageNum}&searchSwitch={song:1}`
    const { songResultData } = await got(searchUrl).json()
    const songs = songResultData?.result || []
    rawSearchSongs = songs
    searchSongs = songs.filter((item: { chargeAuditions: string }) => item.chargeAuditions !== '1')
    totalSongCount = songResultData?.totalCount
  } else {
    const searchUrl = `https://search.kuwo.cn/r.s?client=kt&all=${encodeURIComponent(text)}&pn=${
      Number(pageNum) - 1
    }&rn=10&vipver=1&ft=music&encoding=utf8&rformat=json&mobi=1`
    const { abslist, TOTAL } = await got(searchUrl).json()
    totalSongCount = Number(TOTAL) || undefined
    for (const song of abslist) {
      const {
        data: { url },
      } = await got(
        `https://www.kuwo.cn/api/v1/www/music/playUrl?mid=${song.DC_TARGETID}&type=1`
      ).json()
      song.url = url
      song.name = song.NAME
      song.size = await getSongSizeByUrl(url)
    }
    searchSongs = rawSearchSongs = abslist
  }

  if (!searchSongs.length) {
    if (totalSongCount === undefined) {
      spinner.fail(red(`没搜索到 ${text} 的相关结果`))
      process.exit(1)
    }
    if (rawSearchSongs.length && totalSongCount > 0) {
      spinner.fail(red('会员专属歌曲无法下载'))
      process.exit(1)
    }
    spinner.fail(red('搜索页码超出范围，请重新输入'))
    process.exit(1)
  }
  spinner.stop()
  return { searchSongs, options }
}

export default search
