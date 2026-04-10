import { app, BrowserWindow } from 'electron'


const isInDev = process.env.NODE_ENV === 'development'

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    if (isInDev) {
        win.loadURL('http://localhost:5173')
        win.webContents.openDevTools()
    }
    else
        win.loadFile('./index.html')
}

app.whenReady().then(() => {
    createWindow()
})