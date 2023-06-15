const { contextBridge,ipcRenderer,shell } = require('electron');

contextBridge.exposeInMainWorld('App', {
  node: process.versions.node,
  chrome: process.versions.chrome,
  electron: process.versions.electron,
  isDev: !!process.env.VITE_DEV_SERVER_URL,
  platform: process.platform,
  getIsDarkMode:()=> ipcRenderer.invoke('themeMode:get'),
  openDevTool: () => ipcRenderer.send('openDevTool'),
  toggleThemeMode:()=> ipcRenderer.invoke('themeMode:toggle'),
  searchSong:(args)=> ipcRenderer.invoke('search:song',args),
  downloadSong:(args)=> ipcRenderer.send('download:song',args),
  getDownloadPath:()=> ipcRenderer.invoke('downloadPath:get'),
  setDownloadPath:()=> ipcRenderer.invoke('downloadPath:set'),
  onDownloadProcess:(callback) => ipcRenderer.on('download:process', callback),
  clipboard:(args)=> ipcRenderer.invoke('clipboard:write',args),
  openPath:(args)=> ipcRenderer.send('openPath',args),
  openLink:(url)=> ipcRenderer.send('openLink',url),
  // we can also expose variables, not just functions
})
