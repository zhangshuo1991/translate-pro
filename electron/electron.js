// electron/electron.js
const path = require('path');
const { app, BrowserWindow,Menu,dialog,globalShortcut } = require('electron');
app.commandLine.appendArgument("--enable-features=Metal");

const isDev = process.env.IS_DEV == "true" ? true : false;

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
            spellcheck: true
        },
    });

    // and load the index.html of the app.
    // win.loadFile("index.html");
    mainWindow.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../dist/index.html')}`
    );

    // Open the DevTools.
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
    return mainWindow
}
function testBody() {
    console.log('testBody')
}
app.commandLine.appendSwitch('disable-web-security');

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    // if(process.platform === 'darwin'){
    //     app.dock.setMenu(dockMenu)
    // }
    const window=createWindow()
    const menuBar = [
        {
            label: '文件',
            submenu: [
                {
                    label: 'About Translate Pro',
                    click:  () => {
                        dialog.showMessageBox({
                            message: '这是我开发的一个桌面程序'
                        })
                    }
                }
            ],
        },
        {
            label: '操作',
            submenu: [
                {
                    label: '收藏',
                    accelerator: 'CmdOrCtrl+Shift+C',
                    click: () => {
                        window.webContents.send('send-message-to-render-test', '这是主进程的主动搭讪')
                    }
                },
                {
                    label: '设置',
                    accelerator: 'CmdOrCtrl+Shift+F',
                    click: () => {
                        window.webContents.send('send-message-font', '这是主进程的主动搭讪')
                    }
                },
                {
                    label: 'forceReload',
                    role: 'forceReload'
                }
            ]
        }
    ];
// 构建菜单项
   const menu = Menu.buildFromTemplate(menuBar);
// 设置一个顶部菜单栏
    Menu.setApplicationMenu(menu);
    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
