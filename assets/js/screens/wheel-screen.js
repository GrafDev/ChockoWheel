import * as PIXI from 'pixi.js'
import { regionsConfig } from '../config.js'
import { Header } from '../components/header.js'

export class WheelScreen {
  constructor(app, region) {
    this.app = app
    this.region = region
    this.container = new PIXI.Container()
    this.header = null
    this.wheel = null
    this.spinButton = null
    this.chicken = null
    this.isSpinning = false
  }

  async show() {
    // Wait for assets to be available in cache
    await this.waitForAssets()
    
    // Create UI elements
    this.createHeader()
    this.createBackground()
    this.createWheel()
    this.createChicken() 
    this.createSpinButton()
    this.createFingerAnimation()
    
    // Position elements
    this.resize()
  }

  async waitForAssets() {
    // Wait for assets to appear in cache
    let retries = 10
    while (retries > 0) {
      const wheelTexture = PIXI.Assets.cache.get(`${this.region}_wheel`)
      if (wheelTexture) {
        console.log(`Assets ready for region: ${this.region}`)
        break
      }
      await new Promise(resolve => setTimeout(resolve, 100))
      retries--
    }
    
    if (retries === 0) {
      console.warn(`Assets not ready for region: ${this.region}, proceeding anyway`)
    }
  }

  createHeader() {
    this.header = new Header(this.app, this.region)
    const headerContainer = this.header.create()
    this.container.addChild(headerContainer)
  }

  createBackground() {
    // Background will be handled by CSS for now
  }

  createWheel() {
    const wheelTexture = PIXI.Assets.cache.get(`${this.region}_wheel`)
    if (wheelTexture) {
      this.wheel = new PIXI.Sprite(wheelTexture)
      this.wheel.anchor.set(0.5)
      this.container.addChild(this.wheel)
    } else {
      console.warn(`Wheel texture not found for region: ${this.region}`)
      // Create fallback placeholder
      const placeholder = new PIXI.Graphics()
      placeholder.circle(0, 0, 150).fill(0xFFD700)
      this.wheel = placeholder
      this.container.addChild(this.wheel)
    }
  }

  createChicken() {
    const chickenTexture = PIXI.Assets.cache.get(`${this.region}_chicken`)
    if (chickenTexture) {
      this.chicken = new PIXI.Sprite(chickenTexture)
      this.chicken.anchor.set(0.5)
      this.container.addChild(this.chicken)
    } else {
      console.warn(`Chicken texture not found for region: ${this.region}`)
      // Create fallback placeholder
      const placeholder = new PIXI.Graphics()
      placeholder.circle(0, 0, 50).fill(0xFFFFFF)
      this.chicken = placeholder
      this.container.addChild(this.chicken)
    }
  }

  createSpinButton() {
    // Create button graphics
    const buttonGraphics = new PIXI.Graphics()
    buttonGraphics.roundRect(-75, -25, 150, 50, 25).fill(0x4CAF50)
    
    // Create button sprite
    const buttonTexture = this.app.renderer.generateTexture(buttonGraphics)
    this.spinButton = new PIXI.Sprite(buttonTexture)
    this.spinButton.anchor.set(0.5)
    this.spinButton.eventMode = 'static'
    this.spinButton.cursor = 'pointer'
    
    // Create button text as separate container
    const buttonText = new PIXI.Text({
      text: 'SPIN',
      style: {
        fontSize: 24,
        fill: 0xFFFFFF,
        fontWeight: 'bold'
      }
    })
    buttonText.anchor.set(0.5)
    
    // Create button container to hold sprite and text
    const buttonContainer = new PIXI.Container()
    buttonContainer.addChild(this.spinButton)
    buttonContainer.addChild(buttonText)
    
    // Add click handler to container
    buttonContainer.eventMode = 'static'
    buttonContainer.cursor = 'pointer'
    buttonContainer.on('pointerdown', () => this.onSpinClick())
    
    this.spinButton = buttonContainer // Replace reference
    this.container.addChild(buttonContainer)
  }

  createFingerAnimation() {
    // Finger animation placeholder - will be implemented later
  }

  onSpinClick() {
    if (this.isSpinning) return
    
    this.isSpinning = true
    this.spinWheel()
  }

  spinWheel() {
    // Basic spin animation - will be enhanced later
    const totalRotation = (Math.random() * 360) + (360 * 3) // 3+ full rotations
    
    // Simple rotation animation using PIXI's built-in ticker
    let currentRotation = 0
    const duration = 3000 // 3 seconds
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function (ease-out)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      currentRotation = totalRotation * easedProgress
      
      this.wheel.rotation = (currentRotation * Math.PI) / 180
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        this.isSpinning = false
        this.showResult()
      }
    }
    
    animate()
  }

  showResult() {
    // Show x5 result modal - will be implemented later
    console.log('Wheel stopped - showing x5 result')
  }

  updateRegion(newRegion) {
    this.region = newRegion
    // Update region-specific content
    console.log(`Wheel screen updated to region: ${newRegion}`)
  }

  resize() {
    const screenWidth = this.app.screen.width
    const screenHeight = this.app.screen.height
    
    // Resize header
    if (this.header) {
      this.header.resize()
    }
    
    // Position wheel in center (slightly lower to account for header)
    this.wheel.x = screenWidth / 2
    this.wheel.y = screenHeight / 2 + 20
    
    // Position chicken to the left
    this.chicken.x = screenWidth * 0.2
    this.chicken.y = screenHeight / 2 + 20
    
    // Position spin button at bottom
    this.spinButton.x = screenWidth / 2
    this.spinButton.y = screenHeight * 0.8
  }

  hide() {
    // Cleanup when screen is hidden
    this.container.visible = false
  }
}