import fs from 'fs'
import got from 'got'
import { basename } from 'path'
import { red } from 'colorette'
import type { Artist } from './types'

export function removePunctuation(str: string) {
  return str.replace(/[.?,\/#!|$%\^&\*;:{}+=\-_`'"~<>()]/g, '').replace(/\s{2,}/g, ' ')
}

export function joinSingersName(singers: Artist[]) {
  const singersNames = singers.map((singer) => singer.name)
  return singersNames.join(',')
}

// 删除已创建但未下载完全的文件
export function delUnfinishedFiles(targetDir: string, unfinishedPaths: IterableIterator<string>) {
  for (const item of unfinishedPaths) {
    if (fs.existsSync(item)) {
      fs.unlinkSync(item)
    }
  }
}

export function checkFileExist(filePath: string) {
  const isLrcExist = fs.existsSync(filePath)
  if (isLrcExist) {
    console.error(red(`文件 ${basename(filePath)} 已存在`))
    process.exit(1)
  }
}

export function getSongSizeByUrl(url: string) {
  if (!url) return Promise.reject(new Error('无效的Url'))
  return new Promise(async (resolve, reject) => {
    try {
      const request = got.stream(url)
      request.on('response', async (res) => {
        const length = parseInt(<string>res.headers['content-length'])
        if (!isNaN(length) && res.statusCode === 200) {
          resolve(length)
        } else {
          reject(new Error('无法获取文件大小'))
        }
      })
      request.once('error', async (e: any) => reject(e))
    } catch (err) {
      console.error(red(`${err}`))
    }
  })
}
