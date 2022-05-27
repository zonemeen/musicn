import prompts from 'prompts'
import names from './names.js'

const choose = async ({ songs, options }) =>
  await prompts([
    {
      type: 'multiselect',
      name: 'songs',
      message: '按下a键全选，按下空格或→键单选，按下回车键下载',
      instructions: false,
      choices: songs.map((item, index) => names(item, index, options)),
    },
  ])

export default choose
