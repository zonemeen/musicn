import got from 'got'
import express from 'express'
import portfinder from 'portfinder'
import qrcode from 'qrcode-terminal'
import search from '../services/search'
import { getNetworkAddress } from '../utils'
import htmlStr from '../utils/template'
import { ServiceType, SearchProps } from '../types'

const config = {
  qrcode: {
    small: true,
  },
  portfinder: {
    port: 7478,
    stopPort: 8000,
  },
}

export default async ({ port }: { port: string | undefined }) => {
  const app = express()

  const realPort = port ?? (await portfinder.getPortPromise(config.portfinder))

  const onStart = () => {
    const address = `http://${getNetworkAddress()}:${realPort}/music`

    console.log('\n扫描二维码，播放及下载音乐')
    qrcode.generate(address, config.qrcode)
    console.log(`访问链接: ${address}\n`)
  }

  app.get('/music', (req, res) => {
    res.send(htmlStr)
  })

  app.get('/search', async (req, res) => {
    const { service, text, pageNum } = req.query
    const { searchSongs, totalSongCount } = await search[service as ServiceType]({
      text,
      pageNum,
    } as SearchProps)
    res.send({ searchSongs, totalSongCount })
  })

  app.get('/download', (req, res) => {
    const { url } = req.query
    got.stream(url as string).pipe(res)
  })

  app.listen(realPort, onStart)
}
