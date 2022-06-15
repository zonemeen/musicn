import inquirer from 'inquirer'
import names from './names.js'

const choose = ({ searchSongs, options, serviceName }) =>
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
