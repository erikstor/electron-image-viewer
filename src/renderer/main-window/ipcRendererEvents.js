import { ipcRenderer, clipboard, remote, Notification, shell } from 'electron'
import path from 'path'
import settings from 'electron-settings'
import { addImagesEvents, clearImages, loadImages, selectFirstImage } from './images-ui'
import { saveImage } from './filters'
import Cloudup from 'cloudup-client'

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
    document.getElementById('directory').innerHTML = dir.filePaths[0]
  })

  ipcRenderer.on('save-image', (event, file) => {
    if (!file.canceled) {
      saveImage(file, (err) => {
        if (err) {
          showDialog('error', 'Error', `Ocurrió un problema guardando la imagen: ${err.message}`)
        } else {
          document.getElementById('image-displayed').dataset.filtered = file
          showDialog('info', 'Genial!', `La imagen fue guardada!`)
        }
      })
    }
  })
}

function openPreferences () {
  document.getElementById('preferences').disabled = true
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
  preferencesWindow.on('close', () => {
    document.getElementById('preferences').disabled = false
    console.log(settings.getAll())
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

function uploadImage () {

  let imageNode = document.getElementById('image-displayed')
  let image
  if (imageNode.dataset.filtered) {
    image = imageNode.dataset.filtered
  } else {
    image = imageNode.src
  }

  image = image.replace('file://', '')
  let fileName = path.basename(image)

  if (settings.has('cloudup.user') && settings.has('cloudup.pwd')) {

    document.getElementById('overlay').classList.toggle('hidden')

    const client = Cloudup({
      user: settings.get('cloudup.user'),
      pass: settings.get('cloudup.pwd'),
    })

    const stream = client.stream({
      title: 'Electron Viewer',
    })

    stream.file(image).save((err) => {
      document.getElementById('overlay').classList.toggle('hidden')
      if (err) {
        showDialog(
          'error',
          'Ups',
          'Verifique su conexión y/o las credenciales de cloudup')
      } else {
        clipboard.writeText(stream.url)
        const notify = new Notification('Electron viewer', {
          body: 'Imagen cargada con exito' + stream.url + ' de clic para copiar la URL',
          silent: false
        })

        notify.onclick = () => {
          shell.openExternal('https://media.istockphoto.com/id/1222792338/photo/view-of-the-city-center-of-cali-in-colombia.jpg?s=612x612&w=0&k=20&c=ir0I1ETGp-8UoTlIqA-IoRyhq4vM2tUPDPWlJle--Bk=')
        }
      }
    })

  } else {
    showDialog('error', 'Ups', 'Completa el formulario de preferencias para conectarte con Cloudup')
  }

}

function pasteImage () {
  const image = clipboard.readImage()
  const data = image.toDataURL()

  console.log('image data64', data.indexOf('data:image/png;data64'))
  console.log('image empty', !image.isEmpty())

  if (data.indexOf('data:image/png;base64') !== -1 && !image.isEmpty()) {
    const mainImage = document.getElementById('image-displayed')
    mainImage.src = data
    mainImage.dataset.original = data
  } else {
    showDialog('error', 'Ups', 'No hay una imagen valida en el portapapeles')
  }

}

module.exports = {
  setIpc: setIpc, openDirectory: openDirectory, saveFile, openPreferences, uploadImage,
  pasteImage
}