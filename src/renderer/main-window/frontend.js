import { applyFilter } from './main-window/filters'
import { setIpc, openDirectory, saveFile, openPreferences } from './main-window/ipcRendererEvents'
import { addImagesEvents, searchImageEvent, selectFirstImage } from './main-window/images-ui'

window.addEventListener('load', () => {
  setIpc()
  addImagesEvents()
  searchImageEvent()
  selectEvent()
  buttonEvent('openDirectory', openDirectory)
  buttonEvent('saveButton', saveFile)
  buttonEvent('preferences', openPreferences)

  selectFirstImage()
})

function selectEvent () {

  const select = document.getElementById('filters')

  select.addEventListener('change', function () {
    applyFilter(this.value, document.getElementById('image-displayed'))
  })

}

function buttonEvent (id, func) {
  const openDirectory = document.getElementById(id)
  openDirectory.addEventListener('click', func)
}