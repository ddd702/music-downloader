const { contextBridge,ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('App', {
  node: process.versions.node,
  chrome: process.versions.chrome,
  electron: process.versions.electron,
  isDev: !!process.env.VITE_DEV_SERVER_URL,
  platform: process.platform,
  getIsDarkMode:()=> ipcRenderer.invoke('themeMode:get'),
  openDevTool: () => ipcRenderer.send('openDevTool'),
  toggleThemeMode:()=> ipcRenderer.invoke('themeMode:toggle'),
  searchSong:(args)=> ipcRenderer.invoke('search:song',args)
  // we can also expose variables, not just functions
})
