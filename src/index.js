'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'

import devtools from './devtools'

// if (process.env.NODE_ENV === 'development') {
//   devtools()
// }

app.on('before-quit', () => {
  console.log('before-quit')
})

app.on('ready', () => {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'Hola mundo',
    center: true,
    // maximizable: false,
    maximizable: true,
    show: false,
    border: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.on('closed', () => {
    win = null
    console.log('Saliendo...')
    app.quit()
  })

  win.on('move', () => {
    const position = win.getPosition()
    console.log(`La posicion es: ${position}`)
  })

  win.once('ready-to-show', () => {
    win.show()
  })

  // win.loadURL('https://devdocs.io/')
  win.loadFile(`${__dirname}/renderer/index.html`)
  // win.toggleDevTools()
})

ipcMain.on('ping', (event, arg) => {
  console.log(`se recibio ping - ${arg}`)
  event.sender.send('pong', new Date())
})