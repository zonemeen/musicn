import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import got from 'got'
import portfinder from 'portfinder'
import qrcode from 'qrcode-terminal'
import open from 'open'
import express, { NextFunction, Request, Response } from 'express'
import search from '../services/search'
import lyric from '../services/lyric'
import { getNetworkAddress } from '../utils'
import type { ServiceType, SearchProps, SearchSongInfo } from '../types'

const __dirname = dirname(fileURLToPath(import.meta.url))

const config = {
  qrcode: {
    small: true,
  },
  portfinder: {
    port: 7478,
    stopPort: 8000,
  },
}

export default async ({ port, open: isOpen }: { port: string; open: boolean }) => {
  const app = express()

  app.use(
    express.static(
      resolve(__dirname, process.env.IS_DEV === 'true' ? '../../template' : '../template')
    )
  )

  const realPort = port ?? (await portfinder.getPortPromise(config.portfinder))

  const onStart = () => {
    const address = `http://${getNetworkAddress()}:${realPort}`

    console.log('\n扫描二维码，播放及下载音乐')
    qrcode.generate(address, config.qrcode)
    console.log(`访问链接: ${address}\n`)
    isOpen && open(address)
  }

  app.get('/search', async (req: Request, res: Response) => {
    const { service, text, pageNum, pageSize = 20 } = req.query
    const { searchSongs, totalSongCount } = await search[service as ServiceType]({
      text,
      pageNum,
      pageSize,
    } as SearchProps)
    const lyricList = (await Promise.allSettled(
      searchSongs.map(({ lyricUrl }: SearchSongInfo) =>
        lyric[service as ServiceType](null, lyricUrl!)
      )
    )) as { value: string | undefined }[]
    searchSongs.forEach((song: SearchSongInfo, index: number) => {
      song.lrc = lyricList[index].value ?? '[00:00.00]无歌词'
    })
    res.send({ searchSongs, totalSongCount })
  })

  app.get('/download', (req: Request, res: Response) => {
    const { url } = req.query
    got.stream(url as string).pipe(res)
  })

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(res.statusCode || 500)
    res.render('error', {
      message: err.message,
      error: err,
    })
  })

  app.listen(realPort, onStart)
}
