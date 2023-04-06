import search from './services/migu.js'

export default async (req, res) => {
  const { service, text, pageNum } = req.query
  const { searchSongs, totalSongCount } = await search[service]({
    text,
    pageNum,
  })
  res.send({ searchSongs, totalSongCount })
}
