module.exports = (item, index) => ({
  name: `${index + 1}. ${item.name} -[ ${item.singers[0].name} ]`,
  value: item.newRateFormats,
})
