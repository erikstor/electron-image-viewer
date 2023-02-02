import { dialog } from 'electron'

function relaunchApp (window, message = 'Ocurrió un error inesperado, se reiniciará el aplicativo') {
  dialog.showMessageBox(window, {
    type: 'error',
    title: 'Ups, algo salio mal',
    message
  }, () => {
    app.relaunch()
    app.exit(0)
  })
}

function setupErrors (window) {
  window.webContents.on('crashed', () => {
    relaunchApp(window)
  })

  window.on('unresponsive', () => {
    relaunchApp(window)
  })

  window.on('unresponsive', () => {

    dialog.showMessageBox(window, {
      type: 'warning',
      title: 'Advertencia',
      message: 'El proceso está tardando demasiado, puede esperar o reinicar el aplicativo manualmente',
    })

    relaunchApp(window)
  })

  process.on('uncaughtException', () => {
    relaunchApp(window)
  })

}

module.exports = {
  setupErrors
}