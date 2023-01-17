
const { app, BrowserWindow, Menu } = require('electron');
const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';
const path = require('path');
require('./app')
let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        title : "슈퍼메딕",
        width: isDev ? 1200 : 500,
        height: 800,
        icon: path.join(__dirname, './appLogo.png'),
        resizable: isDev,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            // preload: path.join(__dirname, 'preload.js'),
        },
    });
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
    console.log(__dirname)
    mainWindow.loadURL('http://localhost:3000/');
}

app.whenReady().then( () => {
    createMainWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) 
            createMainWindow();
    });
    // const mainMenu = Menu.buildFromTemplate(menu);
    // Menu.setApplicationMenu(mainMenu);

    mainWindow.on('closed', () => (mainWindow = null));
});

// const menu = [
//     ...(isMac
//         ? [
//             {
//                 label: app.name,
//                 submenu: [
//                 {
//                     label: 'About',
//                     click: createDashBoardWindow,
//                 },
//                 ],
//             },
//         ]
//     : []),
//         {
//             role: 'fileMenu',
//         },
//     ...(!isMac
//     ? [
//         {
//             label: 'Help',
//             submenu: [
//                 {
//                     label: 'About',
//                     click: createDashBoardWindow,
//                 },
//             ],
//         },
//         ]
//     : []),
//     // {
//     //   label: 'File',
//     //   submenu: [
//     //     {
//     //       label: 'Quit',
//     //       click: () => app.quit(),
//     //       accelerator: 'CmdOrCtrl+W',
//     //     },
//     //   ],
//     // },
//     ...(isDev
//     ? [
//         {
//             label: 'Developer',
//             submenu: [
//                 { role: 'reload' },
//                 { role: 'forcereload' },
//                 { type: 'separator' },
//                 { role: 'toggledevtools' },
//             ],
//         },
//     ]
//     : []),
// ];

app.once('ready-to-show', () => {
    mainWindow.show()
})

app.on('window-all-closed', () => {
    if (!isMac) 
        app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) 
        createMainWindow();
});