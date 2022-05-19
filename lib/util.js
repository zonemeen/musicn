export default function removePunctuation(str) {
  return str
    .replace(/[.?,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .replace(/\s{2,}/g, ' ')
}
