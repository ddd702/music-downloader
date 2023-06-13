const { app, BrowserWindow, Menu,Tray } = require('electron');
const path = require('path');
const { IpcMainEvents } = require('./service');

const vueDevToolsPath = path.resolve(__dirname, './extensions/vue-tools/6.5.0_0/');
const createWindow = async () => {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    movable: true,
    show: true,
    icon: path.resolve(__dirname, '../public/icons/png/16x16.png'),
    titleBarStyle: 'hiddenInset',
    //vibrancy: 'dark',  // 'light', 'medium-light' etc
    // visualEffectState: "active"
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  // win.once('ready-to-show', () => {
  //   win.show();
  // });
  const ses = win.webContents.session;
  if (process.env.VITE_DEV_SERVER_URL) {
    // win.loadFile('./dist/index.html',{hash:'/'});
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    await ses.loadExtension(vueDevToolsPath);
    win.webContents.openDevTools();
  } else {
    // Load your file
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
