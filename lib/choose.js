const prompts = require('prompts')
const names = require('./names')

module.exports = async (songs) =>
  await prompts([
    {
      type: 'select',
      name: 'song',
      message: '共有 ' + songs.length + ' 个结果, 按下空格或回车下载',
      choices: songs.map((i, index) => names(i, index)),
    },
  ])
