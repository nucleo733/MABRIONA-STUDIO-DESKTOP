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

  // La ventana no tiene barra de direcciones ni botones de navegador —
  // sin esto no había NINGUNA forma de volver atrás una vez adentro.
  // Atajo de teclado estándar (Cmd+[ / Cmd+] en Mac, Alt+Flecha en
  // Windows/Linux) + botones "atrás/adelante" del mouse en Windows.
  mainWindow.webContents.on('before-input-event', (_event, input) => {
    if (input.type !== 'keyDown') return
    const isMac = process.platform === 'darwin'
    const goesBack = isMac ? input.meta && input.key === '[' : input.alt && input.key === 'ArrowLeft'
    const goesForward = isMac ? input.meta && input.key === ']' : input.alt && input.key === 'ArrowRight'
    if (goesBack && mainWindow.webContents.canGoBack()) mainWindow.webContents.goBack()
    if (goesForward && mainWindow.webContents.canGoForward()) mainWindow.webContents.goForward()
  })

  mainWindow.webContents.on('app-command', (_event, cmd) => {
    if (cmd === 'browser-backward' && mainWindow.webContents.canGoBack()) mainWindow.webContents.goBack()
    if (cmd === 'browser-forward' && mainWindow.webContents.canGoForward()) mainWindow.webContents.goForward()
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
