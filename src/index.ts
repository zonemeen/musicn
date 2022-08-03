import command from './command'
import choose from './choose'
import search from './search'
import bulkDownload from './bulkDownload'
import { SongInfo } from './types'

const download = async () => {
  const result = await search(<SongInfo>command)
  const { songs = [] } = await choose(<SongInfo>result)
  await bulkDownload(songs)
}

export default download
