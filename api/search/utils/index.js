import https from 'https'

export const removePunctuation = (str) => {
  return str.replace(/[.?\/#|$%\^&\*;:{}+=_`'"~<>]/g, '').replace(/\s{2,}/g, ' ')
}

export const joinSingersName = (singers) => {
  const singersNames = singers.map((singer) => singer.name)
  return singersNames.join(',')
}

export const getSongSizeByUrl = (url) => {
  if (!url) return Promise.resolve(0)
  return new Promise(async (resolve) => {
    https
      .get(
        url,
        {
          rejectUnauthorized: false,
        },
        (res) => {
          const length = parseInt(res.headers['content-length'])
          if (!isNaN(length) && res.statusCode === 200) {
            resolve(length)
          } else {
            resolve(0)
          }
        }
      )
      .on('error', () => {
        resolve(0)
      })
  })
}
