const {app, BrowserWindow} = require('electron');

function spawnShell() {
    const shell = new BrowserWindow({
        width: 1280,
        height: 800,
        //transparent: false,
        //backgroundColor: '#252f3e',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })

    shell.loadFile('iommu-tool/index.html');

    //shell.openDevTools();
}

app.whenReady().then(async () => {
    spawnShell();
});