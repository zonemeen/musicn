import prompts from 'prompts'
import names from './names.js'

const choose = async ({ songs, options }) =>
  await prompts([
    {
      type: 'multiselect',
      name: 'songs',
      message: '共有 ' + songs.length + ' 个结果, 按下空格选择，按下回车下载',
      instructions: false,
      choices: songs.map((item, index) => names(item, index, options)),
    },
  ])

export default choose
