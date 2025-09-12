import * as PIXI from 'pixi.js'

export class LeafAnimation {
  constructor() {
    this.app = null
    this.container = null
    this.leaves = []
    this.leafTexture = null
    this.isInitialized = false
    this.animationId = null
  }

  async init() {
    console.log('LeafAnimation.init() called')
    try {
      // Find container for leaves - place in road-container after lanes
      const targetElement = document.querySelector('.road-container')
      console.log('Found road container:', targetElement)
      if (!targetElement) {
        console.warn('Road container not found for leaf animation')
        return false
      }

      // Get road background dimensions
      const rect = targetElement.getBoundingClientRect()
      
      // Create PIXI application
      this.app = new PIXI.Application()
      await this.app.init({
        width: rect.width,
        height: rect.height,
        backgroundColor: 0x000000,
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1
      })

      // Add canvas to DOM - positioned over entire road area but below lanes
      this.app.canvas.style.position = 'absolute'
      this.app.canvas.style.top = '0'
      this.app.canvas.style.left = '0'
      this.app.canvas.style.width = '100%'
      this.app.canvas.style.height = '100%'
      this.app.canvas.style.pointerEvents = 'none'
      this.app.canvas.style.zIndex = '15' // Below lanes but above road background
      // this.app.canvas.style.border = '5px solid yellow' // Debug border removed
      targetElement.style.position = 'relative'
      targetElement.appendChild(this.app.canvas)
      
      console.log('Canvas added to:', targetElement)
      console.log('Canvas size:', rect.width, 'x', rect.height)
      console.log('Canvas element:', this.app.canvas)
      console.log('Canvas styles:', {
        position: this.app.canvas.style.position,
        zIndex: this.app.canvas.style.zIndex,
        width: this.app.canvas.style.width,
        height: this.app.canvas.style.height,
        border: this.app.canvas.style.border
      })

      // Load leaf texture
      this.leafTexture = await PIXI.Assets.load('./assets/images/leaf.png')
      console.log('Leaf texture loaded:', this.leafTexture)
      
      // Create container for leaves
      this.container = new PIXI.Container()
      this.app.stage.addChild(this.container)

      // Create 50 leaves
      this.createLeaves()
      console.log('Created', this.leaves.length, 'leaves')
      
      // Start PIXI ticker instead of manual animation loop  
      this.app.ticker.add(() => {
        this.updateLeaves()
      })
      
      console.log('PIXI ticker started')
      
      this.isInitialized = true
      console.log('Leaf animation initialized successfully')
      return true

    } catch (error) {
      console.error('Failed to initialize leaf animation:', error)
      return false
    }
  }

  createLeaves() {
    for (let i = 0; i < 25; i++) {
      const leaf = new PIXI.Sprite(this.leafTexture)
      
      // Make leaves smaller - about 3% of screen height
      const baseSize = this.app.screen.height * 0.03 // 3% of screen height (3x smaller)
      const leafSize = baseSize / this.leafTexture.height // Scale to texture height
      const scale = leafSize * (0.5 + Math.random() * 1.0) // 0.5x to 1.5x variation  
      leaf.scale.set(scale)
      // console.log('Leaf scale:', scale, 'final size:', scale * this.leafTexture.height, 'px')
      
      // Set anchor to center for better rotation
      leaf.anchor.set(0.5)
      
      // Random starting position (spread across screen width)
      leaf.x = Math.random() * (this.app.screen.width + 200) - 100 // From left edge to right edge
      leaf.y = Math.random() * this.app.screen.height
      
      // Random rotation
      leaf.rotation = Math.random() * Math.PI * 2
      
      // Physics properties
      const leafData = {
        sprite: leaf,
        velocityX: 2.5 + Math.random() * 3.5, // Base horizontal speed - faster
        velocityY: (Math.random() - 0.5) * 1.0, // Vertical drift
        rotationSpeed: (Math.random() - 0.5) * 0.1, // Rotation speed - faster
        windOffset: Math.random() * Math.PI * 2, // For sine wave wind effect
        tumbleSpeed: (Math.random() - 0.5) * 0.02, // Tumbling effect
        scale: scale,
        initialY: leaf.y
      }
      
      this.leaves.push(leafData)
      this.container.addChild(leaf)
      
      // Debug: log first few leaves
      // if (i < 5) {
      //   console.log(`Leaf ${i}: x=${leaf.x}, y=${leaf.y}, scale=${scale}, visible=${leaf.x > -50 && leaf.x < this.app.screen.width}`)
      // }
    }
  }

  updateLeaves() {
    if (!this.isInitialized) return
    
    const time = Date.now() * 0.001 // Convert to seconds
    
    this.leaves.forEach((leafData, index) => {
      const leaf = leafData.sprite
      
      // Wind effect - sine wave movement
      const windStrength = 1.5
      const windY = Math.sin(time * 2 + leafData.windOffset) * windStrength
      
      // Update position
      leaf.x += leafData.velocityX
      leaf.y += leafData.velocityY + windY
      
      // Rotation and tumbling
      leaf.rotation += leafData.rotationSpeed
      
      // No scale changes - keep original size
      // const tumble = Math.sin(time * 3 + leafData.windOffset) * 0.05
      // const scaleX = leafData.scale + tumble
      // const scaleY = leafData.scale + Math.sin(time * 2.5 + leafData.windOffset) * 0.03
      // leaf.scale.set(scaleX, scaleY)
      
      // Reset leaf when it goes off screen to the right
      if (leaf.x > this.app.screen.width + 50) {
        leaf.x = -50 - Math.random() * 100 // Reset to left side off-screen
        leaf.y = Math.random() * this.app.screen.height
        leafData.velocityY = (Math.random() - 0.5) * 1.0 // More vertical variation
        leafData.windOffset = Math.random() * Math.PI * 2
      }
      
      // Keep leaves within vertical bounds with some drift
      if (leaf.y < -50) {
        leaf.y = this.app.screen.height + 50
      } else if (leaf.y > this.app.screen.height + 50) {
        leaf.y = -50
      }
    })
  }

  resize() {
    if (!this.app) return
    
    const targetElement = document.querySelector('.road-container')
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect()
      this.app.renderer.resize(rect.width, rect.height)
    }
  }

  destroy() {
    this.isInitialized = false
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    
    if (this.app) {
      this.app.destroy(true, true)
      this.app = null
    }
    
    this.leaves = []
    this.container = null
    this.leafTexture = null
  }
}