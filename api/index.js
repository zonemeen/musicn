import { readFileSync } from 'fs'

export default async (req, res) => {
  res.send(readFileSync('template/music.html', 'utf-8'))
}
