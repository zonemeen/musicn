import command from './command.js'
import choose from './choose.js'
import search from './search.js'
import download from './download.js'

const musicn = async () => {
  const result = await search(command)
  const { song } = await choose(result)
  song && (await download(song))
}

export default musicn
