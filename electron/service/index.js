const { ipcMain,BrowserWindow,dialog,nativeTheme,app } = require('electron')
const Store = require('electron-store')
const path = require('path');
const Migu  = require('./migu')

const store = new Store()
module.exports={
  IpcMainEvents(){
    ipcMain.on('openDevTool', (event) => {
      const webContents = event.sender;
      const win = BrowserWindow.fromWebContents(webContents)
      if(process.env.VITE_DEV_SERVER_URL){
        webContents.openDevTools();
      }else{
        dialog.showMessageBoxSync(win,{
          message:'该功能仅在开发调试模式下可用'
        })
      }
    })
    ipcMain.on('download:song', (event,args={url:'',name:''}) => {
      const {url,name} = args
      // console.warn('app.getPath downloads',app.getPath('downloads'),args)
      const webContents = event.sender;
      webContents.downloadURL(url);
      webContents.session.once('will-download', (event, item, webContents) => {
        //设置保存路径
        const filePath = path.join(store.get('downloadPath')||app.getPath('downloads'), `${name}`);
        item.setSavePath(filePath);
        item.on('updated', (event, state) => {
          webContents.send('download:process',{state,done:false, received:item.getReceivedBytes()})
          if (state === 'interrupted') {
            console.log('Download is interrupted but can be resumed')
            
          } else if (state === 'progressing') {
            if (item.isPaused()) {
              console.log('Download is paused')
            } else {
              console.log(`Received bytes: ${item.getReceivedBytes()}`)
            }
          }
        })
        item.once('done', (event, state) => {
          webContents.send('download:process',{state,done:true, received:0})
          if (state === 'completed') {
            console.log('Download successfully')
          } else {
            console.log(`Download failed: ${state}`)
          }
        })
      })
     
    })
    ipcMain.handle('themeMode:toggle',()=>{
      if (nativeTheme.shouldUseDarkColors) {
        nativeTheme.themeSource = 'light'
      } else {
        nativeTheme.themeSource = 'dark'
      }
      store.set('themeMode',nativeTheme.shouldUseDarkColors?'dark':'light')
      return nativeTheme.shouldUseDarkColors
    })
    ipcMain.handle('themeMode:get',()=>{
      //如果存储有的话返回存储的
      if(store.get('themeMode')){
        nativeTheme.themeSource = store.get('themeMode')
      }
      console.warn('store.get(\'themeMode\')',store.get('themeMode'))
      return nativeTheme.shouldUseDarkColors 
     
    })
    ipcMain.handle('search:song',async (event,args)=>{
      const result = await Migu.search(args)
     // console.warn('search:song start',args,result)
      return result
    })
  }
}