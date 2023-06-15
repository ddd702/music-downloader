const { ipcMain,BrowserWindow,dialog,shell, nativeTheme,app,clipboard } = require('electron')
const Store = require('electron-store')
const path = require('path');
const Migu  = require('./migu')

const store = new Store()
function getDownLoadPath(){
  return  path.join(store.get('downloadPath')||app.getPath('downloads'));
}
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
    ipcMain.on('openPath', (event,args) => {
      shell.openPath(args);
    })
    ipcMain.on('openLink', (event,url) => {
      shell.openExternal(url);
    })
    ipcMain.on('download:song', (event,args={url:'',name:'',size:100}) => {
      const {url,name,size} = args
      const filename=name.replaceAll( /\\|\//ig,'\~');
      console.warn('filename',filename);
      // console.warn('app.getPath downloads',app.getPath('downloads'),args)
      const webContents = event.sender;
      webContents.downloadURL(url);
      webContents.session.once('will-download', (event, item, webContents) => {
        //设置保存路径
        const filePath = path.join(getDownLoadPath(), `${filename}`);
        item.setSavePath(filePath);
        item.on('updated', (event, state) => {
          webContents.send('download:process',{state,done:false,percent:Math.floor((item.getReceivedBytes()/size)*100),filename, received:item.getReceivedBytes()})
          if (state === 'interrupted') {
            // console.log('Download is interrupted but can be resumed')
            webContents.send('download:process',{state,done:true,msg:'下载中断,请重试',filename, percent:0, received:0})
          } else if (state === 'progressing') {
            if (item.isPaused()) {
              console.log('Download is paused')
            } else {
              console.log(`Received bytes: ${item.getReceivedBytes()}`)
            }
          }
        })
        item.once('done', (event, state) => {
          webContents.send('download:process',{state,done:true,filename, percent:100, received:0})
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
      return nativeTheme.shouldUseDarkColors 
     
    })
    ipcMain.handle('search:song',async (event,args)=>{
      let result = {total:0,list:[],args,msg:'未开放的平台'}
      switch(args.origin){
        case 'migu':
          result = await Migu.search(args);
          break;
      }
      //console.warn('search:song start',args,result)
      return result
    })
    ipcMain.handle('downloadPath:get',(event)=>{
      return  getDownLoadPath();
    })
    ipcMain.handle('clipboard:write',(event,args={text:''})=>{
      clipboard.writeText(args.text);
      return true;
    })
    ipcMain.handle('downloadPath:set',async (event)=>{
      try{
        const result = await dialog.showOpenDialog({
          properties:['openDirectory']
        })
        if(result.filePaths){
          store.set('downloadPath',result.filePaths[0])
        }
        console.log('downloadPath:set result,', result.filePaths[0])
      }catch(e){
        console.log('downloadPath err:set result,', e.message)
      }
     
      return  getDownLoadPath();
    })
  }
}