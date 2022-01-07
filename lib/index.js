const text = require('./text')
const choose = require('./choose')
const search = require('./search')
const download = require('./download')

module.exports = async () => {
  console.log(1)
  const songs = await search(text)
  console.log(2)
  const { song } = await choose(songs)
  console.log(3)
  download(song)
}
