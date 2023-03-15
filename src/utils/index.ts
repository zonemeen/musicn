import https from 'https'
import { networkInterfaces } from 'os'
import { inflate } from 'zlib'
import type { Artist } from '../types'

export const getNetworkAddress = () => {
  for (const interfaceDetails of Object.values(networkInterfaces())) {
    if (!interfaceDetails) continue
    for (const details of interfaceDetails) {
      const { address, family, internal } = details
      if (family === 'IPv4' && !internal) return address
    }
  }
}

export const removePunctuation = (str: string) => {
  return str.replace(/[.?\/#|$%\^&\*;:{}+=_`'"~<>]/g, '').replace(/\s{2,}/g, ' ')
}

export const joinSingersName = (singers: Artist[]) => {
  const singersNames = singers.map((singer) => singer.name)
  return singersNames.join(',')
}

export const getSongSizeByUrl = (url: string) => {
  if (!url) return Promise.reject(new Error('无效的Url'))
  return new Promise(async (resolve, reject) => {
    https
      .get(
        url,
        {
          rejectUnauthorized: false,
        },
        (res) => {
          const length = parseInt(<string>res.headers['content-length'])
          if (!isNaN(length) && res.statusCode === 200) {
            resolve(length)
          } else {
            reject(new Error('无法获取文件大小'))
          }
        }
      )
      .on('error', (e: any) => {
        reject(e)
      })
  })
}

// https://github.com/lyswhut/lx-music-desktop/issues/296#issuecomment-683285784
const enc_key = Buffer.from(
  // @ts-ignore
  [0x40, 0x47, 0x61, 0x77, 0x5e, 0x32, 0x74, 0x47, 0x51, 0x36, 0x31, 0x2d, 0xce, 0xd2, 0x6e, 0x69],
  'binary'
)
export const decodeLyric = (str: string) =>
  new Promise((resolve, reject) => {
    if (!str.length) return
    const buf_str = Buffer.from(str, 'base64').slice(4)
    for (let i = 0, len = buf_str.length; i < len; i++) {
      buf_str[i] = buf_str[i] ^ enc_key[i % 16]
    }
    inflate(buf_str, (err, result) => {
      if (err) return reject(err)
      resolve(result.toString())
    })
  })

const headExp = /^.*\[id:\$\w+\]\n/

const encodeNames = {
  '&nbsp;': ' ',
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&#039;': "'",
}
const decodeName = (str = '') =>
  // @ts-ignore
  str?.replace(/(?:&amp;|&lt;|&gt;|&quot;|&apos;|&#039;|&nbsp;)/gm, (s) => encodeNames[s]) || ''

export const parseLyric = (str: string) => {
  str = str.replace(/\r/g, '')
  if (headExp.test(str)) str = str.replace(headExp, '')
  const trans = str.match(/\[language:([\w=\\/+]+)\]/)
  let lyric
  let tlyric: any
  if (trans) {
    str = str.replace(/\[language:[\w=\\/+]+\]\n/, '')
    const json = JSON.parse(Buffer.from(trans[1], 'base64').toString())
    for (const item of json.content) {
      if (item.type == 1) {
        tlyric = item.lyricContent
        break
      }
    }
  }
  let i = 0
  let rlyric = str.replace(/\[((\d+),\d+)\].*/g, (str) => {
    const result = str.match(/\[((\d+),\d+)\].*/)
    let time = parseInt(result?.[2] as string)
    const ms = time % 1000
    time /= 1000
    const m = parseInt(String(time / 60))
      .toString()
      .padStart(2, '0')
    time %= 60
    const s = parseInt(String(time)).toString().padStart(2, '0')
    const newTime = `${m}:${s}.${ms}`
    if (tlyric) tlyric[i] = `[${newTime}]${tlyric[i++][0]}`
    return str.replace(result?.[1] as string, newTime)
  })
  tlyric = tlyric ? tlyric.join('\n') : ''
  rlyric = rlyric.replace(/<(\d+,\d+),\d+>/g, '<$1>')
  rlyric = decodeName(rlyric)
  lyric = rlyric.replace(/<\d+,\d+>/g, '')
  tlyric = decodeName(tlyric)
  return {
    lyric,
    rlyric,
    tlyric,
  }
}
