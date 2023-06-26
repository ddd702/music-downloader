const https = require('https')
const removePunctuation = (str) => {
  return str.replace(/[.?\/#|$%\^&\*;:{}+=_`'"~<>]/g, '').replace(/\s{2,}/g, ' ')
}

const joinSingersName = (singers) => {
  const singersNames = singers.map((singer) => singer.name)
  return singersNames.join(',')
}
const getFileType = (url)=>{
  const ext = url.split('.').pop().split('?')[0]
  return ext.toLowerCase()
}
const getKgSongReq = (url) =>{
  if (!url) return Promise.resolve(null)
  return new Promise(async (resolve) => {
    https
      .get(
        url,
        {
          headers: {
            'referer': 'https://www.kugou.com/',
            'authority': 'wwwapi.kugou.com',
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.51',
          },
        },
        (res) => {
          let output = ''
          res.on('data', (data) =>{
            output+=data
          })
          res.on('end',()=>{
            resolve(output)
          })
         
        }
      )
      .on('error', () => {
        resolve(null)
      })
  })
}
const getSongSizeByUrl = (url) => {
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
module.exports = {
  getFileType,
  getKgSongReq,
  getSongSizeByUrl,
  removePunctuation,
  joinSingersName
}