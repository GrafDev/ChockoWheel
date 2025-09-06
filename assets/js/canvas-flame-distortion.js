export class CanvasFlameDistortion {
  constructor() {
    this.canvas = null
    this.ctx = null
    this.htmlElement = null
    this.originalImageData = null
    this.isAnimating = false
    this.animationFrame = null
  }
  
  async init() {
    // Find the HTML element
    this.htmlElement = document.querySelector('.logo2-part2')
    if (!this.htmlElement) {
      console.warn('Logo2-part2 element not found')
      return false
    }
    
    // Create canvas and position it over the HTML element
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    
    // Style canvas to overlay the HTML element
    this.canvas.style.position = 'absolute'
    this.canvas.style.top = '0'
    this.canvas.style.left = '0'
    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'
    this.canvas.style.pointerEvents = 'none'
    this.canvas.style.zIndex = '25'
    
    // Add canvas to parent container
    const logo2Container = document.querySelector('.logo2')
    if (logo2Container) {
      logo2Container.appendChild(this.canvas)
    }
    
    // Load the image
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    return new Promise((resolve) => {
      img.onload = () => {
        // Set canvas size to match image
        this.canvas.width = img.width
        this.canvas.height = img.height
        
        // Draw image to canvas and get original pixel data
        this.ctx.drawImage(img, 0, 0)
        this.originalImageData = this.ctx.getImageData(0, 0, img.width, img.height)
        
        // Hide HTML element
        this.htmlElement.style.opacity = '0'
        
        resolve(true)
      }
      
      img.onerror = () => {
        console.warn('Failed to load image')
        resolve(false)
      }
      
      img.src = '/assets/images/common/logo2-part2.png'
    })
  }
  
  start() {
    if (!this.originalImageData) {
      console.warn('Cannot start: image not loaded')
      return
    }
    
    this.isAnimating = true
    this.animate()
  }
  
  animate() {
    if (!this.isAnimating) return
    
    const time = Date.now() * 0.003
    
    // Create new image data for distorted image
    const distortedData = new ImageData(
      new Uint8ClampedArray(this.originalImageData.data),
      this.originalImageData.width,
      this.originalImageData.height
    )
    
    // Apply wave distortion
    for (let y = 0; y < distortedData.height; y++) {
      for (let x = 0; x < distortedData.width; x++) {
        // Calculate wave distortion
        const waveX = Math.sin(y * 0.05 + time * 2.2) * 2
        const waveY = Math.sin(x * 0.03 + time * 1.8) * 1.5
        
        // Get source pixel position
        const srcX = Math.round(x + waveX)
        const srcY = Math.round(y + waveY)
        
        // Bounds check
        if (srcX >= 0 && srcX < this.originalImageData.width && 
            srcY >= 0 && srcY < this.originalImageData.height) {
          
          const srcIndex = (srcY * this.originalImageData.width + srcX) * 4
          const destIndex = (y * distortedData.width + x) * 4
          
          // Copy pixel data
          distortedData.data[destIndex] = this.originalImageData.data[srcIndex]         // R
          distortedData.data[destIndex + 1] = this.originalImageData.data[srcIndex + 1] // G
          distortedData.data[destIndex + 2] = this.originalImageData.data[srcIndex + 2] // B
          distortedData.data[destIndex + 3] = this.originalImageData.data[srcIndex + 3] // A
        }
      }
    }
    
    // Draw distorted image
    this.ctx.putImageData(distortedData, 0, 0)
    
    // Continue animation
    this.animationFrame = requestAnimationFrame(() => this.animate())
  }
  
  resize() {
    if (!this.canvas) return
    
    const logo2Container = document.querySelector('.logo2')
    if (!logo2Container) return
    
    const rect = logo2Container.getBoundingClientRect()
    
    // Scale canvas to match container
    this.canvas.style.width = rect.width + 'px'
    this.canvas.style.height = rect.height + 'px'
  }
  
  stop() {
    this.isAnimating = false
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }
  }
  
  destroy() {
    this.stop()
    
    // Show HTML element back
    if (this.htmlElement) {
      this.htmlElement.style.opacity = '1'
    }
    
    // Remove canvas
    if (this.canvas) {
      this.canvas.remove()
      this.canvas = null
    }
  }
}