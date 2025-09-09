import { getRegionConfig } from './config.js'

export class ImagePreloader {
  constructor() {
    this.images = new Map()
    this.loadedCount = 0
    this.totalCount = 0
    this.onProgress = null
    this.onComplete = null
  }

  // Get all images for specific region
  getImageList(region = 'eu') {
    const config = getRegionConfig(region)
    
    return [
      // Common images
      './assets/images/common/bg-part1.png',
      './assets/images/common/arrow.png',
      './assets/images/common/sound-button.png',
      './assets/images/common/hand-pointer.png',
      './assets/images/common/spin-button.png',
      './assets/images/common/wheel-light.png',
      './assets/images/common/wheel-border.png',
      './assets/images/common/wheel-center.png',
      './assets/images/common/wheel-sectors.png',
      './assets/images/common/logo1-part1.png',
      './assets/images/common/logo1-part2.png',
      './assets/images/common/logo1-part3.png',
      './assets/images/common/logo2-part1.png',
      './assets/images/common/logo2-part2.png',
      './assets/images/common/chicken-part1.png',
      './assets/images/common/chicken-part2.png',
      './assets/images/common/chicken-part3.png',
      './assets/images/common/spark.png',
      './assets/images/common/button3-header.png',
      
      // Region-specific images
      '.' + config.modalImage,
      '.' + config.wheelText,
      '.' + config.button1Header,
      '.' + config.button2Header
    ].filter((url, index, self) => self.indexOf(url) === index) // Remove duplicates
  }

  async preloadImages(region = 'eu', onProgress = null, onComplete = null) {
    this.onProgress = onProgress
    this.onComplete = onComplete
    this.loadedCount = 0
    
    const imageUrls = this.getImageList(region)
    this.totalCount = imageUrls.length
    
    console.log(`Starting preload of ${this.totalCount} images for region: ${region}`)
    
    const promises = imageUrls.map(url => this.loadImage(url))
    
    try {
      await Promise.all(promises)
      console.log('All images preloaded successfully!')
      
      if (this.onComplete) {
        this.onComplete()
      }
      
      return true
    } catch (error) {
      console.error('Error preloading images:', error)
      
      // Even if some images fail, continue - better to show something than nothing
      if (this.onComplete) {
        this.onComplete()
      }
      
      return false
    }
  }

  loadImage(url) {
    return new Promise((resolve, reject) => {
      if (this.images.has(url)) {
        this.onImageLoaded()
        resolve(this.images.get(url))
        return
      }

      const img = new Image()
      
      img.onload = () => {
        this.images.set(url, img)
        this.onImageLoaded()
        resolve(img)
      }
      
      img.onerror = (error) => {
        console.warn(`Failed to load image: ${url}`, error)
        this.onImageLoaded() // Count as loaded to continue progress
        resolve(null) // Resolve with null instead of rejecting
      }
      
      img.src = url
    })
  }

  onImageLoaded() {
    this.loadedCount++
    const progress = Math.round((this.loadedCount / this.totalCount) * 100)
    
    if (this.onProgress) {
      this.onProgress(progress, this.loadedCount, this.totalCount)
    }
  }

  getImage(url) {
    // Try with and without leading slash
    const normalizedUrl = url.replace(/^\//, '')
    const withSlashUrl = '/' + normalizedUrl
    
    return this.images.get(normalizedUrl) || this.images.get(withSlashUrl) || this.images.get(url)
  }

  isImageLoaded(url) {
    // Try with and without leading slash
    const normalizedUrl = url.replace(/^\//, '')
    const withSlashUrl = '/' + normalizedUrl
    
    return this.images.has(normalizedUrl) || this.images.has(withSlashUrl) || this.images.has(url)
  }

  getProgress() {
    return Math.round((this.loadedCount / this.totalCount) * 100)
  }
}

// Create global instance
export const imagePreloader = new ImagePreloader()