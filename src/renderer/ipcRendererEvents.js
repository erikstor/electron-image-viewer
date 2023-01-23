import { ipcRenderer } from 'electron'

function setIpc () {
  ipcRenderer.on('pong', (event, arg) => {
    console.log(`Pong recibdo - ${arg}`)
  })
}

function sendIpc () {
  ipcRenderer.send('ping', new Date())
}

module.exports = {
  setIpc: setIpc,
  sendIpc: sendIpc,
}