import ejs from 'ejs'
import got from 'got'
import express from 'express'
import portfinder from 'portfinder'
import qrcode from 'qrcode-terminal'
import { readFileSync } from 'fs'
import { getNetworkAddress } from './utils'
import { SearchSongInfo } from './types'

const readTemplateFile = () => readFileSync('../template/download.ejs', 'utf-8')

const config = {
  qrcode: {
    small: true,
  },
  portfinder: {
    port: 7478,
    stopPort: 8000,
  },
}

export default async (musicDownloadList: SearchSongInfo[]) => {
  const app = express()

  const port = await portfinder.getPortPromise(config.portfinder)

  const onStart = () => {
    const address = `http://${getNetworkAddress()}:${port}/music`

    console.log('\n扫描二维码，播放及下载音乐')
    qrcode.generate(address, config.qrcode)
    console.log(`访问链接: ${address}\n`)
  }

  const templateParams = { dataList: musicDownloadList }

  app.get('/music', (req, res) => {
    res.send(ejs.render(readTemplateFile(), templateParams))
  })

  app.get('/download', (req, res) => {
    const { url } = req.query
    got.stream(url as string).pipe(res)
  })

  app.listen(port, onStart)
}
