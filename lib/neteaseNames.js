import prettyBytes from 'pretty-bytes'

const neteaseNames = (
  { id, name, artists, size, extension },
  index,
  options,
  serviceName
) => {
  let singersName = ''
  for (let i = 0; i < artists.length; i++) {
    if (i > 1) break
    singersName += `${artists[i].name},`
  }
  singersName = singersName.slice(0, -1)
  if (artists.length > 2) {
    singersName += '等'
  }

  const downloadUrl = `http://music.163.com/song/media/outer/url?id=${id}`

  const lyricUrl = `https://music.163.com/api/song/lyric?id=${id}&lv=1`

  const songName = `${singersName} - ${name}.${extension}`

  return {
    title: `${index + 1}. ${songName} - ${prettyBytes(Number(size))}`,
    value: {
      songName,
      downloadUrl,
      lyricUrl,
      size,
      options,
      serviceName,
    },
  }
}

export default neteaseNames
