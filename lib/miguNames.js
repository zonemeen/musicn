import prettyBytes from 'pretty-bytes'

const miguNames = (
  { name, singers, rateFormats, newRateFormats, lyricUrl },
  index,
  options,
  serviceName
) => {
  let singersName = ''
  for (let i = 0; i < singers.length; i++) {
    if (i > 1) break
    singersName += `${singers[i].name},`
  }
  singersName = singersName.slice(0, -1)
  if (singers.length > 2) {
    singersName += '等'
  }

  const song = newRateFormats.length
    ? newRateFormats[newRateFormats.length - 1]
    : rateFormats[rateFormats.length - 1]

  const size = song.androidSize || song.size
  const fileType = song.androidFileType || song.fileType

  const { pathname } = new URL(song.androidUrl || song.url)

  const downloadUrl = `https://freetyst.nf.migu.cn${pathname}`

  const songName = `${singersName} - ${name}.${fileType}`

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

export default miguNames
