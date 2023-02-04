import fs from 'fs'

function applyFilter (filter, currentImage) {

  let imgObj = new Image()
  imgObj.src = currentImage.dataset.original

  filterous.importImage(imgObj, {})
    .applyInstaFilter(filter)
    .renderHtml(currentImage)
}

function saveImage (file, callback) {
  let fileSrc = document.getElementById('image-displayed').src

  if (fileSrc.indexOf(';base64,') !== -1) {
    fileSrc = fileSrc.replace(/^data:([A-Za-z-+/]+);base64,/, '')
    fs.writeFile(file.filePath, fileSrc, 'base64', callback)
  } else {
    fileSrc = fileSrc.replace('file:///', '')
    fs.copyFile(fileSrc, file.filePath, callback)
  }

}

module.exports = { applyFilter, saveImage }