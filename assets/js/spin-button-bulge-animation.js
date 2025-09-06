import * as PIXI from 'pixi.js'

export class SpinButtonBulgeAnimation {
  constructor() {
    this.app = null
    this.container = null
    this.sprite = null
    this.bulgeFilter = null
  }
  
  async init() {
    // Find spin button element
    this.buttonElement = document.querySelector('.spin-btn')
    if (!this.buttonElement) {
      console.warn('Spin button element not found')
      return false
    }
    
    
    // Create PIXI application (v8 API)
    const rect = this.buttonElement.getBoundingClientRect()
    this.app = new PIXI.Application()
    
    await this.app.init({
      width: rect.width,
      height: rect.height,
      backgroundColor: 0x000000,
      backgroundAlpha: 0,
      antialias: true
    })
    
    // Position canvas over button
    this.app.canvas.style.position = 'absolute'
    this.app.canvas.style.top = '0'
    this.app.canvas.style.left = '0'
    this.app.canvas.style.width = '100%'
    this.app.canvas.style.height = '100%'
    this.app.canvas.style.pointerEvents = 'none'
    this.app.canvas.style.zIndex = '1'
    
    // Make button container relative
    this.buttonElement.style.position = 'relative'
    this.buttonElement.appendChild(this.app.canvas)
    
    // Load spin button texture
    try {
      const texture = await PIXI.Assets.load('/assets/images/common/spin-button.png')
      
      // Create sprite
      this.sprite = new PIXI.Sprite(texture)
      this.sprite.anchor.set(0.5)
      this.sprite.x = this.app.screen.width / 2
      this.sprite.y = this.app.screen.height / 2
      
      // Scale to fit
      const scaleX = this.app.screen.width / texture.width
      const scaleY = this.app.screen.height / texture.height
      const scale = Math.min(scaleX, scaleY)
      this.sprite.scale.set(scale)
      
      // Create bulge filter
      this.bulgeFilter = new PIXI.filters.BulgePinchFilter()
      this.bulgeFilter.center = [0.5, 0.5]
      this.bulgeFilter.radius = 0.8
      this.bulgeFilter.strength = 0
      
      this.sprite.filters = [this.bulgeFilter]
      this.app.stage.addChild(this.sprite)
      
      // Hide original button background
      this.buttonElement.style.backgroundImage = 'none'
      
      return true
    } catch (error) {
      console.error('Failed to load spin button texture:', error)
      return false
    }
  }
  
  start() {
    if (!this.bulgeFilter) {
      console.warn('Cannot start animation: bulge filter not initialized')
      return
    }
    
    // Create continuous bulge animation
    this.bulgeAnimation = PIXI.Ticker.shared.add(() => {
      const time = Date.now() * 0.002
      this.bulgeFilter.strength = Math.sin(time) * 0.3 + 0.1
    })
  }
  
  stop() {
    if (this.bulgeAnimation) {
      PIXI.Ticker.shared.remove(this.bulgeAnimation)
      this.bulgeAnimation = null
    }
    
    if (this.bulgeFilter) {
      this.bulgeFilter.strength = 0
    }
  }
  
  destroy() {
    this.stop()
    
    if (this.app) {
      this.app.destroy(true, true)
      this.app = null
    }
    
    // Restore original button
    if (this.buttonElement) {
      this.buttonElement.style.backgroundImage = "url('/assets/images/common/spin-button.png')"
    }
  }
}