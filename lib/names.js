module.exports = (
  { name, singers, newRateFormats, lyricUrl },
  index,
  options
) => {
  const option = newRateFormats[newRateFormats.length - 1]

  const { pathname } = new URL(option.androidUrl || option.url)

  const downloadUrl = `https://freetyst.nf.migu.cn/${pathname}`

  return {
    title: `${index + 1}. ${name} -[ ${singers[0].name} ]`,
    value: { name, downloadUrl, lyricUrl, options },
  }
}
