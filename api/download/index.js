import got from 'got'

export default async (req, res) => {
  const { url } = req.query
  got.stream(url).pipe(res)
}
