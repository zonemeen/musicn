import prompts from 'prompts'
import names from './names.js'

const choose = async ({ songs, options }) =>
  await prompts([
    {
      type: 'multiselect',
      name: 'songs',
      message:
        '共有 ' +
        songs.length +
        ' 个结果, 按下a键全选(再按一次a键全取消)，按下空格或→键单选(再按一次空格键或←键取消)，按下回车键下载',
      instructions: false,
      choices: songs.map((item, index) => names(item, index, options)),
    },
  ])

export default choose
