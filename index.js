const {app, BrowserWindow, Menu} = require('electron');
require('@electron/remote/main').initialize();

const onAppReady = function () {

    const shell = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 1200,
        minHeight: 700,
        //width: 1650,
        //height: 1020,
        titleBarStyle: "hidden",
        frame: false,
        transparent: true,
        //backgroundColor: '#252f3e',
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        }
    })

    /* shell.once('close', () => {
        shell = null;
    }); */

    shell.loadFile('app/index.html');

    //shell.openDevTools();

};

app.on('ready', () => setTimeout(onAppReady, 200));