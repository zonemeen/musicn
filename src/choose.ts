import inquirer from 'inquirer'
import names from './names'
import { SongInfo } from './types'

const choose = ({ searchSongs, options, serviceName }: SongInfo) =>
  inquirer.prompt([
    {
      type: 'checkbox',
      name: 'songs',
      message: '选择歌曲',
      pageSize: 20,
      dontShowHints: false,
      choices: searchSongs.map((song, index) =>
        names(song, index, options, serviceName)
      ),
    },
  ])

export default choose
