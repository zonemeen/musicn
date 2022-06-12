import prettyBytes from 'pretty-bytes'

const names = (
  { name, singers, rateFormats, newRateFormats, lyricUrl },
  index,
  options
) => {
  let singersName = ''
  for (const singer of singers) {
    singersName += `${singer.name},`
  }
  const song = newRateFormats.length
    ? newRateFormats[newRateFormats.length - 1]
    : rateFormats[rateFormats.length - 1]

  const size = song.androidSize || song.size
  const fileType = song.androidFileType || song.fileType

  const { pathname } = new URL(song.androidUrl || song.url)

  const downloadUrl = `https://freetyst.nf.migu.cn${pathname}`

  const songName = `${singersName.slice(0, -1)} - ${name}.${fileType}`

  return {
    title: `${index + 1}. ${songName} - ${prettyBytes(Number(size))}`,
    value: {
      songName,
      downloadUrl,
      lyricUrl,
      size,
      options,
    },
  }
}

export default names
