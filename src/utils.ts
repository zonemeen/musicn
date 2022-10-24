import got from 'got'
import { red } from 'colorette'
import type { Artist } from './types'

export function removePunctuation(str: string) {
  return str.replace(/[.?,\/#!|$%\^&\*;:{}+=\-_`'"~<>()]/g, '').replace(/\s{2,}/g, ' ')
}

export function joinSingersName(singers: Artist[]) {
  const singersNames = singers.map((singer) => singer.name)
  return singersNames.join(',')
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
