import { red } from 'colorette'
import command from './command'
import choose from './choose'
import search from './search'
import bulkDownload from './bulkDownload'
import { removePunctuation } from './utils'
import { SearchSongInfo, SongInfo } from './types'

const musicn = async () => {
  const result = await search(<SongInfo>command)
  result.searchSongs.forEach((song: SearchSongInfo) => {
    song.name = removePunctuation(song.name)
  })
  const { songs = [] } = await choose(<SongInfo>result)
  if (!songs.length) {
    console.error(red('请选择歌曲'))
    process.exit(1)
  }
  bulkDownload(songs)
}

export default musicn
