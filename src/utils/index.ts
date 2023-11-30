import { get } from 'node:https'
import { networkInterfaces } from 'node:os'
import { inflate } from 'node:zlib'
import {
  createCipheriv,
  publicEncrypt,
  randomBytes,
  constants,
  BinaryLike,
  CipherKey,
} from 'node:crypto'
import type { Request } from 'got'
import type { Artist } from '../types'

const iv = Buffer.from('0102030405060708')
const presetKey = Buffer.from('0CoJUm6Qyw8W8jud')
const base62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const publicKey =
  '-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgtQn2JZ34ZC28NWYpAUd98iZ37BUrX/aKzmFbt7clFSs6sXqHauqKWqdtLkF2KexO40H1YTX8z2lSgBBOAxLsvaklV8k4cBFK9snQXE9/DDaFt6Rr7iVZMldczhC0JNgTz+SHXT6CBHuX3e9SdB1Ua44oncaTWz7OBGLbCiK45wIDAQAB\n-----END PUBLIC KEY-----'

export const kgCookie =
  'kg_mid=e7c09bf4e2ff701959e419aa6259f5e1; kg_dfid=2UHiuH0E3doo4ZW8ud01Teb3; kg_dfid_collect=d41d8cd98f00b204e9800998ecf8427e; Hm_lvt_aedee6983d4cfc62f509129360d6bb3d=1690770238; musicwo17=kugou; Hm_lpvt_aedee6983d4cfc62f509129360d6bb3d=1690771797'

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
  if (!url) return Promise.resolve(0)
  return new Promise((resolve) => {
    get(
      url,
      {
        rejectUnauthorized: false,
      },
      (res) => {
        const length = parseInt(<string>res.headers['content-length'])
        if (!isNaN(length) && res.statusCode === 200) {
          resolve(length)
        } else {
          resolve(0)
        }
      }
    ).on('error', () => {
      resolve(0)
    })
  })
}

// https://github.com/lyswhut/lx-music-desktop/issues/296#issuecomment-683285784
const encKey = Buffer.from(
  // @ts-ignore
  [0x40, 0x47, 0x61, 0x77, 0x5e, 0x32, 0x74, 0x47, 0x51, 0x36, 0x31, 0x2d, 0xce, 0xd2, 0x6e, 0x69],
  'binary'
)
export const decodeLyric = (str: string) =>
  new Promise((resolve, reject) => {
    if (!str.length) return
    const bufStr = Buffer.from(str, 'base64').slice(4)
    for (let i = 0, len = bufStr.length; i < len; i++) {
      bufStr[i] = bufStr[i] ^ encKey[i % 16]
    }
    inflate(bufStr, (err, result) => {
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

const aesEncrypt = (
  buffer: Buffer | BinaryLike,
  mode: string,
  key: Buffer | CipherKey,
  iv: Buffer | BinaryLike
) => {
  const cipher = createCipheriv(mode, key, iv)
  return Buffer.concat([cipher.update(buffer), cipher.final()])
}

const rsaEncrypt = (buffer: any, key: string) => {
  buffer = Buffer.concat([Buffer.alloc(128 - buffer.length), buffer])
  return publicEncrypt({ key, padding: constants.RSA_NO_PADDING }, buffer)
}

export const encryptParams = (object: { c: string; ids: string }) => {
  const text = JSON.stringify(object)
  const secretKey = randomBytes(16).map((n) => base62.charAt(n % 62).charCodeAt(0))
  return {
    params: aesEncrypt(
      Buffer.from(aesEncrypt(Buffer.from(text), 'aes-128-cbc', presetKey, iv).toString('base64')),
      'aes-128-cbc',
      secretKey,
      iv
    ).toString('base64'),
    encSecKey: rsaEncrypt(secretKey.reverse(), publicKey).toString('hex'),
  }
}

export const convertToStandardTime = (timeStr: string) => {
  const timeInSec = parseFloat(timeStr)
  const hours = Math.floor(timeInSec / 3600)
  const minutes = Math.floor((timeInSec - hours * 3600) / 60)
  const seconds = Math.floor(timeInSec - hours * 3600 - minutes * 60)
  const milliseconds = Math.round((timeInSec - Math.floor(timeInSec)) * 100)

  const minutesStr = minutes.toString().padStart(2, '0')
  const secondsStr = seconds.toString().padStart(2, '0')
  const millisecondsStr = milliseconds.toString().padStart(2, '0')

  return `${minutesStr}:${secondsStr}.${millisecondsStr}`
}

export const streamToString = async (stream: Request) => {
  const chunks = []
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk))
  }
  return Buffer.concat(chunks).toString('utf-8')
}
