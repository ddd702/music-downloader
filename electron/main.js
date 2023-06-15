const { app, BrowserWindow } = require('electron');
const path = require('path');
const { IpcMainEvents } = require('./service');

const vueDevToolsPath = path.resolve(__dirname, './extensions/vue-tools/6.5.0_0/');
const createWindow = async () => {
  const loadingWin = new BrowserWindow({
    show: false,
    frame: false, // 无边框（窗口、工具栏等），只包含网页内容
    width: 400,
    height: 325,
    resizable: false,
    transparent: true
  })
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    movable: true,
    show: false,
    icon: path.resolve(__dirname, '../public/icons/png/16x16.png'),
    titleBarStyle: 'hiddenInset',
    //vibrancy: 'dark',  // 'light', 'medium-light' etc
    // visualEffectState: "active"
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  loadingWin.show();
  win.once('ready-to-show', () => {//添加启动动画
    win.show();
    loadingWin.hide();
    loadingWin.close();
  });
  const ses = win.webContents.session;
  if (process.env.VITE_DEV_SERVER_URL) {
    loadingWin.loadURL(`${process.env.VITE_DEV_SERVER_URL}/loading.gif`)
    // win.loadFile('./dist/index.html',{hash:'/'});
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    await ses.loadExtension(vueDevToolsPath);
    win.webContents.openDevTools();
  } else {
    // Load your file
    loadingWin.loadFile('./dist/loading.gif')
    win.loadFile('./dist/index.html', { hash: '/' });
  }
};
app.whenReady().then(() => {
  createWindow();
  IpcMainEvents();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
