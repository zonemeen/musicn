import got from 'got'
import crypto from 'crypto'
import { removePunctuation } from '../utils/index.js'

export default async ({ text, pageNum }) => {
  if (!text) return { searchSongs: [] }
  const searchUrl = `http://msearchcdn.kugou.com/api/v3/search/song?pagesize=20&keyword=${encodeURIComponent(
    text
  )}&page=${pageNum}`
  const {
    data: { info: searchSongs, total },
  } = await got(searchUrl).json()
  const totalSongCount = total || undefined
  const detailResults = await Promise.all(
    searchSongs.map(({ hash }) => {
      const detailUrl = `http://trackercdn.kugou.com/i/v2/?key=${crypto
        .createHash('md5')
        .update(`${hash}kgcloudv2`)
        .digest('hex')}&hash=${hash}&br=hq&appid=1005&pid=2&cmd=25&behavior=play`
      return got(detailUrl).json()
    })
  )
  searchSongs.map((item, index) => {
    const { url = [], fileSize = 0 } = detailResults[index]
    Object.assign(item, {
      url: url[0],
      size: fileSize,
      disabled: !fileSize,
      songName: `${removePunctuation(item.filename.replaceAll('、', ','))}.mp3`,
      lyricUrl: `http://lyrics.kugou.com/search?ver=1&man=yes&client=pc&hash=${item.hash}`,
    })
  })
  return {
    searchSongs,
    totalSongCount,
  }
}
