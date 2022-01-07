const inquirer = require('inquirer')
const names = require('./names')

module.exports = (songs) =>
    inquirer.prompt([
        {
            type: 'list',
            name: 'song',
            message: '共有 ' + songs.length + ' 个结果, 按下回车下载',
            choices: songs.map((i, index) => names(i, index)),
        },
    ])
