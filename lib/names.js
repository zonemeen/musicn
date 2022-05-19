import prettyBytes from 'pretty-bytes'

const names = (
  { name, singers, rateFormats, newRateFormats, lyricUrl },
  index,
  options
) => {
  const song = newRateFormats.length
    ? newRateFormats[newRateFormats.length - 1]
    : rateFormats[rateFormats.length - 1]

  const size = song.androidSize || song.size

  const { pathname } = new URL(song.androidUrl || song.url)

  const downloadUrl = `https://freetyst.nf.migu.cn${pathname}`

  return {
    title: `${index + 1}. ${name} - [ ${singers[0].name} ] - ${prettyBytes(
      Number(size)
    )}`,
    value: { name, downloadUrl, lyricUrl, size, options },
  }
}

export default names
