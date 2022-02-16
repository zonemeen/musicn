module.exports = ({ name, singers, newRateFormats }, index) => {
  const option = newRateFormats[newRateFormats.length - 1]

  const { pathname } = new URL(option.androidUrl || option.url)

  const downloadUrl = `https://freetyst.nf.migu.cn/${pathname}`

  return {
    name: `${index + 1}. ${name} -[ ${singers[0].name} ]`,
    value: { name, downloadUrl },
  }
}
