const inquirer = require('inquirer')
const names = require('./names')

module.exports = async (songs) => {
  const choices = songs.map((i, index) => names(i, index))

  return await inquirer.prompt([
    {
      type: 'list',
      name: 'song',
      message: '共有 ' + songs.length + ' 个结果, 按下空格试听，按下回车下载',
      choices,
    },
  ])
}
