import got from 'got'
import ora from 'ora'
import { red, cyan } from 'colorette'
import removePunctuation from './utils.js'

const spinner = ora({
  text: cyan('搜索ing'),
  spinner: process.argv[2],
})

const search = async ({ text, options }) => {
  if (text === '') {
    console.error(red(`请输入歌曲名称或歌手名字`))
    process.exit(1)
  }

  const searchUrl = `https://pd.musicapp.migu.cn/MIGUM3.0/v1.0/content/search_all.do?&text=${removePunctuation(
    text
  )}&pageSize=1&searchSwitch={song:1}`

  spinner.start()
  const { body } = await got(searchUrl)
  const songs = JSON.parse(body).songResultData?.result

  if (!songs) {
    spinner.fail(red(`没搜索到 ${text} 的相关结果`))
    process.exit(1)
  }
  spinner.stop()
  return { songs, options }
}

export default search
