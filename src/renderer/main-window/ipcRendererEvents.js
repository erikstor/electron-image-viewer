import { ipcRenderer, remote } from 'electron'
import path from 'path'
import settings from 'electron-settings'
import { addImagesEvents, clearImages, loadImages, selectFirstImage } from './images-ui'
import { saveImage } from './filters'

function setIpc () {

  if (settings.has('directory')) {
    ipcRenderer.send('load-directory', settings.get('directory'))
  }

  ipcRenderer.on('load-images', (event, dir, images) => {
    clearImages()
    loadImages(images)
    addImagesEvents()
    selectFirstImage()
    settings.set('directory', dir)

  })

  ipcRenderer.on('save-image', (event, file) => {
    if (!file.canceled) {
      saveImage(file, (err) => {
        if (err) {
          showDialog('error', 'Error', `Ocurrió un problema guardando la imagen: ${err.message}`)
        } else {
          showDialog('info', 'Genial!', `La imagen fue guardada!`)
        }
      })
    }
  })
}

function openPreferences () {
  const browserWindows = remote.BrowserWindow
  const mainWindow = remote.getGlobal('win')
  const preferencesWindow = new browserWindows({
    width: 500,
    height: 300,
    title: 'Preferencias',
    center: true,
    modal: true,
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  preferencesWindow.setParentWindow(mainWindow)
  preferencesWindow.once('ready-to-show', () => {
    preferencesWindow.show()
    preferencesWindow.focus()
  })
  preferencesWindow.loadURL(`file://${path.join(__dirname, '..')}/preferences.html`)

}

function openDirectory () {
  ipcRenderer.send('open-directory')
}

function saveFile () {
  const image = document.getElementById('image-displayed').dataset.original
  const ext = path.extname(image)
  ipcRenderer.send('open-save-dialog', ext)
}

function showDialog (type, title, message) {

  ipcRenderer.send('show-dialog', { type, title, message })

}

module.exports = {
  setIpc: setIpc, openDirectory: openDirectory, saveFile, openPreferences
}