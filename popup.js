document.addEventListener('DOMContentLoaded', () => {
  const dropArea = document.getElementById('dropArea')
  const fileInput = document.getElementById('fileInput')
  const previewArea = document.getElementById('previewArea')
  const previewImage = document.getElementById('previewImage')
  const closeButton = document.getElementById('closeButton')
  const fileName = document.getElementById('fileName')
  const uploadButton = document.getElementById('uploadButton')
  const imageUrl = document.getElementById('imageUrl')
  const imageURLCopy = document.getElementById('imageURLCopy')

  let selectedFile = null

  // 事件监听器
  dropArea.addEventListener('click', () => fileInput.click())
  dropArea.addEventListener('dragover', handleDragOver)
  dropArea.addEventListener('dragleave', handleDragLeave)
  dropArea.addEventListener('drop', handleDrop)
  fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]))
  closeButton.addEventListener('click', resetUpload)
  uploadButton.addEventListener('click', uploadImage)

  // 处理文件拖拽
  function handleDragOver(e) {
    e.preventDefault()
    dropArea.style.borderColor = '#4CAF50'
    dropArea.style.backgroundColor = '#f0f0f0'
  }

  function handleDragLeave() {
    dropArea.style.borderColor = '#ccc'
    dropArea.style.backgroundColor = ''
  }

  function handleDrop(e) {
    e.preventDefault()
    dropArea.style.borderColor = '#ccc'
    dropArea.style.backgroundColor = ''
    handleFile(e.dataTransfer.files[0])
  }

  // 处理文件选择
  function handleFile(file) {
    if (file && isImageFile(file)) {
      selectedFile = file
      previewImage.src = URL.createObjectURL(file)
      fileName.textContent = file.name
      dropArea.style.display = 'none'
      previewArea.style.display = 'block'
      uploadButton.disabled = false
    }
  }

  // 重置上传状态
  function resetUpload() {
    selectedFile = null
    previewImage.src = ''
    fileName.textContent = ''
    dropArea.style.display = 'flex'
    previewArea.style.display = 'none'
    uploadButton.disabled = true
    imageUrl.textContent = ''
    fileInput.value = ''
  }

  // 监听 imageUrl 的内容变化
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'characterData') {
        updateVisibility()
      }
    }
  })

  observer.observe(imageUrl, { characterData: true })

  function updateVisibility() {
    if (imageUrl.textContent.trim() === '') {
      imageURLCopy.style.display = 'none'
    } else {
      imageURLCopy.style.display = 'flex'
    }
  }

  // 初始状态检查
  updateVisibility()

  // 上传图片
  async function uploadImage() {
    if (!selectedFile) return

    const formData = new FormData()
    formData.append('image', selectedFile)

    try {
      uploadButton.disabled = true
      uploadButton.textContent = '上传中...'

      const response = await fetch('https://api.skyshare.pwr.ink/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      imageUrl.textContent = data.url
    } catch (error) {
      console.error('Error:', error)
      alert('上传失败，请重试')
    } finally {
      uploadButton.disabled = false
      uploadButton.textContent = '上传'
    }
  }

  // 检查文件类型
  function isImageFile(file) {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'image/heif',
      'image/avif',
    ]
    return allowedTypes.includes(file.type)
  }
})
