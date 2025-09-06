import * as PIXI from 'pixi.js'

export class Logo2FlameAnimation {
  constructor() {
    this.app = null
    this.container = null
    this.part2Sprite = null
    this.ticker = null
    this.htmlElement = null
    this.isAnimating = false
  }
  
  async init() {
    // Find the HTML element for logo2-part2
    this.htmlElement = document.querySelector('.logo2-part2')
    if (!this.htmlElement) {
      console.warn('Logo2-part2 element not found')
      return false
    }
    
    // Create PixiJS app with transparent background
    this.app = new PIXI.Application()
    await this.app.init({ 
      width: 300, 
      height: 300, 
      backgroundAlpha: 0,
      antialias: true
    })
    
    // Position the PixiJS canvas over the HTML element
    this.app.canvas.style.position = 'absolute'
    this.app.canvas.style.top = '0'
    this.app.canvas.style.left = '0'
    this.app.canvas.style.width = '100%'
    this.app.canvas.style.height = '100%'
    this.app.canvas.style.pointerEvents = 'none'
    this.app.canvas.style.zIndex = '25'
    
    // Add canvas to logo2-part2 parent container
    const logo2Container = document.querySelector('.logo2')
    if (logo2Container) {
      logo2Container.appendChild(this.app.canvas)
    }
    
    // Create sprite for part2 image - no filters first
    const texture = PIXI.Texture.from('/assets/images/common/logo2-part2.png')
    this.part2Sprite = new PIXI.Sprite(texture)
    this.part2Sprite.anchor.set(0, 0)
    
    this.app.stage.addChild(this.part2Sprite)
    
    // Keep HTML element visible - PixiJS not working
    this.htmlElement.style.opacity = '1'
    
    return true
  }
  
  createNoiseTexture(width, height) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    const imageData = ctx.createImageData(width, height)
    
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i] = Math.random() * 255     // Red
      imageData.data[i + 1] = Math.random() * 255 // Green  
      imageData.data[i + 2] = 128                 // Blue
      imageData.data[i + 3] = 255                 // Alpha
    }
    
    ctx.putImageData(imageData, 0, 0)
    return PIXI.Texture.from(canvas)
  }
  
  start() {
    if (!this.app || !this.part2Sprite) {
      console.warn('Cannot start animation: not initialized')
      return
    }
    
    this.isAnimating = true
    this.resize()
    let time = 0
    
    // Simple movement animation for now
    this.app.ticker.add(() => {
      time += 0.02
      
      // Simple flame-like movement
      this.part2Sprite.x = Math.sin(time * 0.5) * 2
      this.part2Sprite.y = Math.cos(time * 0.7) * 1
      this.part2Sprite.rotation = Math.sin(time * 1.5) * 0.02
      this.part2Sprite.scale.set(1 + Math.sin(time * 2) * 0.01)
    })
  }
  
  resize() {
    if (!this.app || !this.part2Sprite) return
    
    const logo2Container = document.querySelector('.logo2')
    if (!logo2Container) return
    
    const rect = logo2Container.getBoundingClientRect()
    
    // Resize PixiJS app to match container
    this.app.renderer.resize(rect.width, rect.height)
    
    // Scale sprite to match container
    this.part2Sprite.width = rect.width
    this.part2Sprite.height = rect.height
    
    // Make displacement sprite cover the area too
    if (this.displacementSprite) {
      this.displacementSprite.width = rect.width
      this.displacementSprite.height = rect.height
    }
  }
  
  stop() {
    this.isAnimating = false
    if (this.ticker) {
      this.ticker.stop()
      this.ticker.destroy()
      this.ticker = null
    }
  }
  
  destroy() {
    this.stop()
    
    // Show HTML element back
    if (this.htmlElement) {
      this.htmlElement.style.opacity = '1'
    }
    
    if (this.app) {
      this.app.destroy()
      this.app = null
    }
  }
}