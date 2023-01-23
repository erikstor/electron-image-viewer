import url from 'url'
import path from 'path'

window.addEventListener('load', () => {
  addImagesEvents()
  searchImageEvent()
})

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

  if (selected) {
    selected.classList.remove('selected')
  }
  node.classList.add('selected')
  document.getElementById('image-displayed').src = node.querySelector('img').src
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

function selectFirstImage () {

  const image = document.querySelector('li.list-group-item:not(.hidden)')
  changeImage(image)

}