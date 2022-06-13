import prompts from 'prompts'
import names from './names.js'

const choose = ({ searchSongs, options, serviceName }) =>
  prompts([
    {
      type: 'multiselect',
      name: 'songs',
      message: '按下a键全选，按下空格或→键单选，按下回车键下载',
      instructions: false,
      choices: searchSongs.map((song, index) =>
        names(song, index, options, serviceName)
      ),
    },
  ])

export default choose
