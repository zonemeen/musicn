import { readFileSync } from 'fs'

export default async (req, res) => {
  res.send(readFileSync('music.html', 'utf-8'))
}
