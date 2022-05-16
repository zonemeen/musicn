const commander = require('./commander')
const choose = require('./choose')
const search = require('./search')
const download = require('./download')

module.exports = async () => {
  const result = await search(commander)
  const { song } = await choose(result)
  download(song)
}
