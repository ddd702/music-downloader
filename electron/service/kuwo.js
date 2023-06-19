
const { net } = require('electron')
const {getSongSizeByUrl,getFileType} = require('../utils')

const urls=[
  //https://search.kuwo.cn/r.s?client=kt&all=%E6%99%B4%E5%A4%A9&pn=0&rn=20&vipver=1&ft=music&encoding=utf8&rformat=json&mobi=1`
  `https://search.kuwo.cn/r.s`,
  //https://c.musicapp.migu.cn/MIGUM2.0/v1.0/content/resourceinfo.do?copyrightId=${copyrightId}&resourceType=2
  `https://www.kuwo.cn/api/v1/www/music/playUrl`
]

module.exports = {
  async search(args){
    let output = {}
    const normalSearchUrl = `${urls[0]}?all=${encodeURIComponent(args.keyword)}&pn=${args.pageNo-1}&rn=20&vipver=1&ft=music&encoding=utf8&rformat=json&mobi=1`  
    const response = await net.fetch(normalSearchUrl)
    if (response.ok) {
      const res = await response.json()
      // console.warn('res',res)
      if(res.abslist) {
        const {abslist} = res
        const detailResults = await Promise.all(
          abslist.map(async (item) => {
            const { DC_TARGETID,id } = item;
            const detailUrl = `${urls[1]}?mid=${DC_TARGETID||id}&type=1`
            const response = await net.fetch(detailUrl)
            const resJson = await response.json()
            const size = await getSongSizeByUrl(resJson.data.url)
            return Object.assign({size},item,resJson)
          })
        )
        output.total = res.TOTAL
        output.args = args
        output.list = (()=>{
          let temp = []
          detailResults.map(resource=>{
            const { DC_TARGETID,id } = resource;
            const fileType = getFileType(resource.data.url);
            temp.push(Object.assign({
              lrcName:``,
              name:`${resource.SONGNAME}-[${resource.ARTIST||'未知歌手'}].${fileType}` 
            }, {
              fileType,
              origin:'kuwo',
              lrc:'',
              id:`kuwo-${DC_TARGETID||id}`,
              cover:`https://img3.kuwo.cn/star/albumcover/${resource.web_albumpic_short||'120/37/2/1034986521.jpg'}`,
              disabled: !!!resource.size,
              size: resource.size,
              url: `${resource.data.url}`,
            }))
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