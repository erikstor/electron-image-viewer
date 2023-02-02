import url from 'url'
import path from 'path'

function addImagesEvents () {

  const thumbs = document.querySelectorAll('li.list-group-item')

  for (const element of thumbs) {
    element.addEventListener('click', function () {
      changeImage(this)
    })
  }

}

function changeImage (node) {

  const selected = document.querySelector('li.selected')
  document.getElementById('filters').selectedIndex = 0

  if (selected) {
    selected.classList.remove('selected')
  }

  if (node) {
    node.classList.add('selected')
    const image = document.getElementById('image-displayed')

    image.src = node.querySelector('img').src
    image.dataset.original = image.src

  } else {
    document.getElementById('image-displayed').src = ''
  }

}

function selectFirstImage () {

  const image = document.querySelector('li.list-group-item:not(.hidden)')
  changeImage(image)

}

function searchImageEvent () {

  const searchBox = document.getElementById('searchBox')

  searchBox.addEventListener('keyup', function () {

    const regex = new RegExp(this.value.toLowerCase(), 'gi')
    const thumbs = document.querySelectorAll('li.list-group-item img')

    if (this.value.length > 0) {

      for (const element of thumbs) {
        const fileURL = url.parse(element.src)
        const fileName = path.basename(fileURL.pathname)

        if (fileName.match(regex)) {
          element.parentNode.classList.remove('hidden')
        } else {
          element.parentNode.classList.add('hidden')
        }

      }

    } else {
      for (const element of thumbs) {
        element.parentNode.classList.remove('hidden')
      }
    }

    selectFirstImage()
  })
}

function clearImages () {
  const oldImages = document.querySelectorAll('li.list-group-item')

  for (const oldImage of oldImages) {
    oldImage.parentNode.removeChild(oldImage)
  }

}

function loadImages (images) {

  const imagesList = document.querySelector('ul.list-group')

  for (const image of images) {
    const node = `
    <li class="list-group-item">
        <img class="media-object pull-left"
             src="${image.src}"
             height="32" alt="">
        <div class="media-body">
            <strong>${image.filename}</strong>
            <p>${image.size}</p>
        </div>
    </li>
  `

    imagesList.insertAdjacentHTML('beforeend', node)
  }

}

module.exports = {
  addImagesEvents,
  changeImage,
  selectFirstImage,
  searchImageEvent,
  clearImages,
  loadImages
}