export function removePunctuation(str) {
  return str
    .replace(/[.?,\/#!$%\^&\*;:{}+=\-_`'"~<>()]/g, '')
    .replace(/\s{2,}/g, ' ')
}

export function joinSingersName(singers) {
  let singersName = ''
  for (let i = 0; i < singers.length; i++) {
    if (i > 1) break
    singersName += `${singers[i].name},`
  }
  singersName = singersName.slice(0, -1)
  if (singers.length > 2) {
    singersName += '等'
  }
  return singersName
}
