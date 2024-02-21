import command from './command'
import choose from './choose'
import searchMusic from './searchMusic'
import download from './download'
import qrcodeGenerator from './qrcode'
import type { SongInfo, CommandOptions } from './types'

!(async () => {
  const { options } = command
  if (options.qrcode) {
    return await qrcodeGenerator(options as CommandOptions)
  }
  const result = await searchMusic(<SongInfo>command)
  const { songs = [] } = await choose(<SongInfo>result)
  await download(songs)
})()
