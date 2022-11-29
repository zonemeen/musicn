import { red } from 'colorette'
import command from './command'
import choose from './choose'
import search from './search'
import download from './download'
import type { SongInfo } from './types'

const cli = async () => {
  const result = await search(<SongInfo>command)
  const { songs = [] } = await choose(<SongInfo>result)
  if (!songs.length) {
    console.error(red('请选择歌曲'))
    process.exit(1)
  }
  await download(songs)
}

export default cli
