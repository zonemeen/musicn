// @ts-ignore
import checkbox from '@inquirer/checkbox'
import { cyan, bold } from 'colorette'
import names from './names'
import { SongInfo } from './types'

const choose = async ({ searchSongs, options }: SongInfo) =>
  await checkbox({
    message: '选择歌曲',
    instructions: ` (按下 ${bold(cyan('<空格键>'))} 单选, ${bold(cyan('<a键>'))} 全选, ${bold(
      cyan('<i键>')
    )} 反选, ${bold(cyan('<回车键>'))} 确认)`,
    pageSize: 20,
    choices: searchSongs.map((song, index) => names(song, index, options)),
  })

export default choose
