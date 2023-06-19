const { net } = require('electron')
const {getFileType} = require('../utils')

const urls=[
  //https://music.163.com/api/search/get/web?s=jay&type=1&limit=20&offset=0
  `https://music.163.com/api/search/get/web`,
  //https://music.163.com/api/song/enhance/player/url/v1?id=1959432599&ids=[1959432599]&level=standard&encodeType=mp3
  `https://music.163.com/api/song/enhance/player/url/v1`
]

module.exports = {
  async search(args){
    let output = {}
    const normalSearchUrl = `${urls[0]}?s=${encodeURIComponent(args.keyword)}&offset=${Number(args.pageNo-1)*20}&type=1&limit=20`  
    const response = await net.fetch(normalSearchUrl)
    if (response.ok) {
      const res = await response.json()
      if(res.result) {
        const {songs:songResultData} = res.result
        const detailResults = await Promise.all(
          songResultData.map(async ({ id,album_id }) => {
            const detailUrl = `${urls[1]}?id=${id}&ids=[${id}]&&level=standard&encodeType=mp3`
                //console.warn('detailUrl',detailUrl,normalSearchUrl)
            const response = await net.fetch(detailUrl)
            return response.json()
          })
        )
        
        output.total = res.result.songCount
        output.args = args
        
        output.list = (()=>{
          let temp = []
          detailResults.map((item,index)=>{
            const resource = item.data[0]||{}
           const {artists,name:song_name} = songResultData[index]
            if(!resource.url){
                temp.push({
                    disabled:true,
                    name:'fetch error'
                })
            }else{
                const fileType = getFileType(resource.url);
                temp.push(Object.assign({
                    name:`${song_name}-[${artists[0].name||'未知歌手'}].${fileType}` 
                }, {
                  fileType,
                  origin:'wangyi',
                  //   lrc:resource.lrcUrl,
                  id:`wangyi-${resource.id}`,
                  cover:artists[0].img1v1Url,
                  disabled: !resource.size,
                  size: resource.size,
                  url: resource.url,
                }))
            }
          })
          return temp
        })()
        // output.detailResults = detailResults
      }
      // ... use the result.
    }
    return output;
  }
}