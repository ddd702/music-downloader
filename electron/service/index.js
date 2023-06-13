const { ipcMain,BrowserWindow,dialog,nativeTheme } = require('electron')
const Store = require('electron-store')
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