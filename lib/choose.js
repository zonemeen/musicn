import prompts from 'prompts'
import miguNames from './miguNames.js'
import neteaseNames from './neteaseNames.js'

const choose = ({ songs, options, serviceName }) =>
  prompts([
    {
      type: 'multiselect',
      name: 'songs',
      message: '按下a键全选，按下空格或→键单选，按下回车键下载',
      instructions: false,
      choices: songs.map((item, index) => {
        if (serviceName === 'netease') {
          return neteaseNames(item, index, options, serviceName)
        }
        return miguNames(item, index, options, serviceName)
      }),
    },
  ])

export default choose
