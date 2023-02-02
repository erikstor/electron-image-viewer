'use strict'

import { app, BrowserWindow } from 'electron'

import devtools from './devtools'

import { setupErrors } from './handle-error'
import { setMainIpc } from './ipcMainEvents'

if (process.env.NODE_ENV === 'development') {
  console.log('devtools')
  // devtools()
}

global.win

app.on('before-quit', () => {
  console.log('before-quit')
})

app.on('ready', () => {
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

  // global.win.loadURL('https://devdocs.io/')
  global.win.loadFile(`${__dirname}/renderer/index.html`).then()
  // global.win.toggleDevTools()
})
