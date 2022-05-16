const got = require('got')
const colors = require('colorette')

module.exports = async (text) => {
  if (text === '') {
    console.error(colors.red(`请输入歌曲名称或歌手名字`))
    process.exit(1)
  }
  const finalText = text
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .replace(/\s{2,}/g, ' ')

  const searchUrl = `https://pd.musicapp.migu.cn/MIGUM3.0/v1.0/content/search_all.do?&text=${finalText}&pageSize=1&searchSwitch={song:1}`

  const { body } = await got(searchUrl)
  const songs = JSON.parse(body).songResultData?.result

  if (!songs) {
    console.error(colors.red(`没搜索到 ${text} 的相关结果`))
    process.exit(1)
  }
  return songs
}
