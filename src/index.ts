import command from './command'
import choose from './choose'
import search from './search'
import download from './download'
import type { SongInfo } from './types'

const cli = async () => {
  const result = await search(<SongInfo>command)
  const songs = await choose(<SongInfo>result)
  await download(songs as SongInfo[])
}

export default cli
