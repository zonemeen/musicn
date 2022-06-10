import { red } from 'colorette'
import command from './command.js'
import choose from './choose.js'
import search from './search.js'
import bulkDownload from './bulkDownload.js'
import removePunctuation from './utils.js'

const musicn = async () => {
  const result = await search(command)
  result.songs.forEach((item) => {
    item.name = removePunctuation(item.name)
  })
  const { songs = [] } = await choose(result)
  if (!songs.length) {
    console.error(red('请选择歌曲'))
    process.exit(1)
  }
  bulkDownload(songs)
}

export default musicn
