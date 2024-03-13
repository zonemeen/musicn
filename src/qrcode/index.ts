import { fileURLToPath } from 'node:url'
import { resolve, dirname, join } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { existsSync, mkdirSync, createWriteStream, readFileSync } from 'node:fs'
import got from 'got'
import portfinder from 'portfinder'
import qrcode from 'qrcode-terminal'
import open from 'open'
import express, { NextFunction, Request, Response } from 'express'
import search from '../services/search'
import lyricDownload from '../services/lyric'
import { getNetworkAddress } from '../utils'
import { version } from '../../package.json'
import type { ServiceType, CommandOptions } from '../types'

interface DownloadRequestType {
  service: ServiceType
  url: string
  songName: string
  lyricUrl: string
}

interface SearchRequestType {
  service: ServiceType
  text: string
  pageNum: string
  pageSize: string
}

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

export default async (options: CommandOptions) => {
  const app = express()
  let { port, open: isOpen, path, lyric: withLyric, base = '' } = options

  const indexPath = resolve(
    __dirname,
    process.env.IS_DEV === 'true' ? '../../template/index.html' : '../template/index.html'
  )

  let htmlContent = readFileSync(indexPath, 'utf8')

  htmlContent = htmlContent
    .replace(/{{base}}/g, base?.length ? `/${base}` : '')
    .replace(/{{version}}/g, version)

  app.use(
    `${base?.length ? `/${base}` : ''}/${version}`,
    express.static(
      resolve(__dirname, process.env.IS_DEV === 'true' ? '../../public' : '../public'),
      {
        maxAge: 31536000,
      }
    )
  )

  app.get(`/${base}`, (_, res) => {
    res.send(htmlContent)
  })

  app.get(
    '/search',
    async (
      req: Request<
        Record<string, unknown>,
        Record<string, unknown>,
        Record<string, unknown>,
        SearchRequestType
      >,
      res: Response
    ) => {
      const { service, text, pageNum, pageSize = '20' } = req.query
      const { searchSongs, totalSongCount } = await search[service]({
        text,
        pageNum,
        pageSize,
      })
      const lyricList = (await Promise.allSettled(
        searchSongs.map(({ lyricUrl }) => lyricDownload[service](null, lyricUrl!))
      )) as { value: string | undefined }[]
      searchSongs.forEach((song, index) => {
        song.lrc = lyricList[index].value ?? '[00:00.00]无歌词'
      })
      res.send({ searchSongs, totalSongCount })
    }
  )

  app.get(
    '/download',
    async (
      req: Request<
        Record<string, unknown>,
        Record<string, unknown>,
        Record<string, unknown>,
        DownloadRequestType
      >,
      res: Response
    ) => {
      const { service, url, songName, lyricUrl } = req.query
      if (path) {
        if (!existsSync(path)) mkdirSync(path)
        const songPath = join(path, songName)
        await pipeline(got.stream(url), createWriteStream(songPath))
        if (withLyric) {
          const lrcPath = join(path, `${songName.split('.')[0]}.lrc`)
          await lyricDownload[service](lrcPath, lyricUrl).catch(() => {
            createWriteStream(lrcPath).write('[00:00.00]无歌词')
          })
        }
        res.send({ download: 'success' })
      } else {
        got.stream(url).pipe(res)
      }
    }
  )

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(res.statusCode || 500)
    res.render('error', {
      message: err.message,
      error: err,
    })
  })

  const realPort = port ?? (await portfinder.getPortPromise(config.portfinder))

  const onStart = () => {
    const address = `http://${getNetworkAddress()}:${realPort}/${base}`

    console.log('\n扫描二维码，播放及下载音乐')
    qrcode.generate(address, config.qrcode)
    console.log(`访问链接: ${address}\n`)
    isOpen && open(address)
  }

  app.listen(realPort, onStart)
}
