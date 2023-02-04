import { remote } from 'electron'
import settings from 'electron-settings'

window.addEventListener('load', () => {
  cancelButton()
  saveButton()

  console.log(settings.getAll())
  if (settings.has('cloudup.user')) {
    document.getElementById('cloudup-user').value = settings.get('cloudup.user')
  }

  if (settings.has('cloudup.pwd')) {
    console.log(settings.get('cloudup.pwd'))
    // const decrypted = decrypt(settings.get('cloudup.pwd'))
    const decrypted = settings.get('cloudup.pwd')
    document.getElementById('cloudup-passwd').value = decrypted
  }

})

function cancelButton () {

  const cancelButton = document.getElementById('cancel-button')

  cancelButton.addEventListener('click', () => {
    closeWindow()
  })

}

function saveButton () {

  const saveButton = document.getElementById('save-button')
  const prefsForm = document.getElementById('preferences-form')

  saveButton.addEventListener('click', () => {

    if (prefsForm.reportValidity()) {

      // let encrypted = encrypt(document.getElementById('cloudup-passwd').value)
      let encrypted = document.getElementById('cloudup-passwd').value
      console.log(encrypted)
      settings.set('cloudup.user', document.getElementById('cloudup-user').value)
      settings.set('cloudup.pwd', encrypted)
      closeWindow()
    } else {
      ipcRenderer.send('show-dialog', {
        type: 'error', title: 'Ups', message: 'Por favor verifica los campos requeridos'
      })
    }

  })

}

function closeWindow () {
  const prefsWindow = remote.getCurrentWindow()
  prefsWindow.close()

}