const { net } = require('electron')

const urls=[
  //https://pd.musicapp.migu.cn/MIGUM3.0/v1.0/content/search_all.do?text=jay&pageNo=20&pageSize=20&searchSwitch={song:1}
  `https://pd.musicapp.migu.cn/MIGUM3.0/v1.0/content/search_all.do`,
  //https://c.musicapp.migu.cn/MIGUM2.0/v1.0/content/resourceinfo.do?copyrightId=${copyrightId}&resourceType=2
  `https://c.musicapp.migu.cn/MIGUM2.0/v1.0/content/resourceinfo.do`
]

module.exports = {
  async search(args){
    let output = {}
    const normalSearchUrl = `${urls[0]}?text=${encodeURIComponent(args.keyword)}&pageNo=${args.pageNo}&pageSize=20&searchSwitch={song:1}`  
    const response = await net.fetch(normalSearchUrl)
    if (response.ok) {
      const res = await response.json()
      // console.warn('res',res.songResultData)
      if(res.songResultData) {
        const {songResultData} = res
        const detailResults = await Promise.all(
          songResultData.result.map(async ({ copyrightId }) => {
            const detailUrl = `${urls[1]}?copyrightId=${copyrightId}&resourceType=2`
            const response = await net.fetch(detailUrl)
            return response.json()
          })
        )
        output.total = songResultData.totalCount
        output.args = args
        output.list = (()=>{
          let temp = []
          detailResults.map(item=>{
            const resource = item.resource[0]||{}
            const { rateFormats = [], newRateFormats = [] } = resource || {}
            const {
              androidSize = 0,
              size = 0,
              androidFileType = '',
              fileType = '',
              androidUrl = '',
              url = '',
            } = newRateFormats.length
              ? newRateFormats[newRateFormats.length - 1]
              : newRateFormats.length
              ? rateFormats[rateFormats.length - 1]
              : {}
            const { pathname } = new URL(url || androidUrl || 'https://music.migu.cn/')
            temp.push(Object.assign({
              lrcName:`${resource.songName}-[${resource.singer||'未知歌手'}].lrc`,
              name:`${resource.songName}-[${resource.singer||'未知歌手'}].${fileType||androidFileType}` 
            }, {
              androidFileType,
              fileType,
              origin:'migu',
              lrc:resource.lrcUrl,
              id:`migu-${resource.songId}`,
              cover:resource.landscapImg,
              disabled: !androidSize && !size,
              size: size || androidSize,
              url: `https://freetyst.nf.migu.cn${pathname}`,
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