const commander = require('./commander')
const choose = require('./choose')
const search = require('./search')
const download = require('./download')

module.exports = async () => {
  const songs = await search(commander)
  const { song } = await choose(songs)
  await download(song)
}
