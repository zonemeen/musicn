import command from './command.js'
import choose from './choose.js'
import search from './search.js'
import bulkDownload from './bulkDownload.js'
import { red } from 'colorette'

const musicn = async () => {
  const result = await search(command)
  const { songs } = await choose(result)
  if (songs && !songs.length) {
    console.error(red('请选择歌曲'))
    process.exit(1)
  }
  songs && songs.length && (await bulkDownload(songs))
}

export default musicn
