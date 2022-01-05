const text = require('./text')
const choose = require('./choose')
const search = require('./search')
const download = require('./download')

module.exports = async () => {
  const songs = await search(text)
  const { song } = await choose(songs)
  download(song)
}
