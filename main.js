'use strict'

const { app, BrowserWindow, shell } = require('electron')
const path = require('node:path')

// La app de escritorio de MABRIONA STUDIO es una ventana nativa que
// carga la plataforma real ya publicada en producción
// (mabriona.com) — la misma web que usa cualquier navegador. No
// duplica ningún código de Studio: siempre queda igual de actualizada
// que la web, sin mantener una segunda copia.
const STUDIO_URL = 'https://www.mabriona.com/'

process.on('uncaughtException', (err) => {
  console.error('[MABRIONA STUDIO] error no manejado:', err)
})

let mainWindow = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#000000',
    title: 'MABRIONA STUDIO',
    icon: path.join(__dirname, 'build', 'icon.icns'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  mainWindow.loadURL(STUDIO_URL)

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
