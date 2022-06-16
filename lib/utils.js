import fs from 'fs'
import { red } from 'colorette'

export function removePunctuation(str) {
  return str
    .replace(/[.?,\/#!$%\^&\*;:{}+=\-_`'"~<>()]/g, '')
    .replace(/\s{2,}/g, ' ')
}

export function joinSingersName(singers) {
  let singersName = ''
  for (const singer of singers) {
    singersName += `${singer.name},`
  }
  singersName = singersName.slice(0, -1)
  return singersName
}

// 删除已创建但未下载完全的文件
export function delUnfinishedFiles(targetDir, unfinishedPaths) {
  for (const item of unfinishedPaths) {
    if (fs.existsSync(item)) {
      fs.unlinkSync(item)
    }
  }
  const files = fs.readdirSync(targetDir)
  if (!files.length) {
    fs.rmdirSync(targetDir)
  }
}

export function checkFileExist(filePath, fileName) {
  const isLrcExist = fs.existsSync(filePath)
  if (isLrcExist) {
    console.error(red(`文件 ${fileName} 已存在`))
    process.exit(1)
  }
}
