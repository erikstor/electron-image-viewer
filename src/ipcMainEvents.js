import fs from 'fs'
import isImage from 'is-image'
import path from 'path'
import { filesize } from 'filesize'

import { ipcMain, dialog } from 'electron'

function setMainIpc (win) {

  ipcMain.on('open-directory', (event) => {

    dialog.showOpenDialog(win, {
      title: 'Seleccione la nueva ubicación', buttonLabel: 'Abrir ubicación', properties: ['openDirectory']
    }).then((dir) => {

      const images = []

      if (!dir.canceled) {

        fs.readdir(dir.filePaths[0], (err, files) => {

          if (err) throw err

          for (const file of files) {
            if (isImage(file)) {
              let imageFile = path.join(dir.filePaths[0], file)
              let stats = fs.statSync(imageFile)
              let size = filesize(stats.size, { round: 0 })

              images.push({ filename: file, src: `file:/${imageFile}`, size })
            }

            event.sender.send('load-images', images)
          }
        })
      }

    })

  })

  ipcMain.on('open-save-dialog', (event, extention) => {
    dialog.showSaveDialog(win, {
      title: 'Guardar la nueva imagen',
      buttonLabel: 'Guardar',
      filters: [
        {
          name: 'Images',
          extensions: [
            extention.substr(1)
          ]
        }
      ]
    }).then((file) => {
      if (!file.canceled) {
        event.sender.send('save-image', file)
      }
    })

  })

  ipcMain.on('show-dialog', (event, options) => {
    dialog.showMessageBox(win, options)
      .then((file) => {
        if (!file.canceled) {
          event.sender.send('save-image', file)
        }
      })

  })

}

module.exports = { setMainIpc }