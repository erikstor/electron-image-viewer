'use strict'

import { app, BrowserWindow, Tray, globalShortcut, protocol } from 'electron'
import os from 'os'
import path from 'path'

import devtools from './devtools'

import { setupErrors } from './handle-error'
import { setMainIpc } from './ipcMainEvents'

if (process.env.NODE_ENV === 'development') {
  console.log('devtools')
  devtools()
}

global.win
global.tray

app.on('before-quit', () => {
  console.log('before-quit')
})

app.on('ready', () => {

  protocol.registerFileProtocol('ep', (request, callback) => {
    const filePath = url.fileURLToPath('file://' + request.url.slice('ep://'.length))
    console.log(filePath)
    callback(filePath)
  }, error => {
    if (error) throw error
  })

  global.win = new BrowserWindow({
    width: 800, height: 600, title: 'Hola mundo', center: true, // maximizable: false,
    maximizable: true, show: false, border: false, webPreferences: {
      nodeIntegration: true
    }
  })

  setMainIpc(global.win)
  setupErrors(global.win)

  global.win.on('closed', () => {
    global.win = null
    console.log('Saliendo...')
    app.quit()
  })

  global.win.on('move', () => {
    const position = global.win.getPosition()
    console.log(`La posicion es: ${position}`)
  })

  global.win.once('ready-to-show', () => {
    global.win.show()
  })

  let icon
  if (os.platform() !== 'win32') {
    icon = path.join(__dirname, 'assets', 'icons', 'tray-icon.png')
  } else {
    icon = path.join(__dirname, 'assets', 'icons', 'tray-icon.ico')
  }

  console.log(icon)

  global.tray = new Tray(icon)
  global.tray.setToolTip('Electron viewer images')
  global.tray.on('click', () => {
      global.win.isVisible() ? global.win.hide() : global.win.show()
    }
  )

  // global.win.loadURL('https://devdocs.io/')
  global.win.loadFile(`${__dirname}/renderer/index.html`).then()
  // global.win.toggleDevTools()
})
