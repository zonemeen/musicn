const got = require('got')
const colors = require('colorette')

module.exports = async (text) => {
  const searchUrl = `https://pd.musicapp.migu.cn/MIGUM3.0/v1.0/content/search_all.do?&text=${text}&pageSize=1&searchSwitch={song:1}`

  const { body } = await got(searchUrl)
  const songs = JSON.parse(body).songResultData?.result

  if (!songs) {
    console.error(colors.red(`没搜索到 ${text} 的相关结果`))
    process.exit(1)
  } else {
    return songs
  }
}
