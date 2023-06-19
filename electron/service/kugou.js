const { net } = require('electron')

const {getKgSongReq,getFileType} = require('../utils')

const urls=[
  //http://msearchcdn.kugou.com/api/v3/search/song?pagesize=20&keyword=213&page=1
  `http://msearchcdn.kugou.com/api/v3/search/song`,
  //https://wwwapi.kugou.com/yy/index.php?r=play/getdata&hash=966c718da96ee29b3b466f773bfa9e2f&album_id=958812
  `https://wwwapi.kugou.com/yy/index.php`
]

module.exports = {
  async search(args){
    let output = {}
    const normalSearchUrl = `${urls[0]}?keyword=${encodeURIComponent(args.keyword)}&page=${args.pageNo}&pagesize=20`  
    const response = await net.fetch(normalSearchUrl)
    if (response.ok) {
      const res = await response.json()
      if(res.data) {
        const {data:songResultData} = res
        const detailResults = await Promise.all(
          songResultData.info.map(async ({ hash,album_id }) => {
            const detailUrl = `${urls[1]}?r=play/getdata&album_id=${album_id}&hash=${hash}&platid=4&dfid=0Q0Clh1IcZaG3ey1J70RaTiL&mid=b6cf66837b18642cc269390b066649dc`
                // console.warn('detailUrl',detailUrl,normalSearchUrl)
            const response = await getKgSongReq(detailUrl)
            // console.warn('detailResponse',JSON.parse(response))
            return JSON.parse(response)
          })
        )
        
        output.total = songResultData.total
        output.args = args
        output.list = (()=>{
          let temp = []
          detailResults.map((item,index)=>{
            const resource = item.data||{}
           
            if(!resource.play_url){
                temp.push({
                    disabled:true,
                    name:'fetch error'
                })
            }else{
                const fileType = getFileType(resource.play_url);
                temp.push(Object.assign({
                    name:`${resource.song_name}-[${resource.author_name||'未知歌手'}].${fileType}` 
                }, {
                fileType,
                origin:'kugou',
                //   lrc:resource.lrcUrl,
                id:`kugou-${resource.audio_id}`,
                cover:resource.img,
                disabled: !resource.filesize,
                size: resource.filesize,
                fragment:!!resource.is_free_part,
                url: resource.play_url,
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