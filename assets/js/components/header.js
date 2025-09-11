import * as PIXI from 'pixi.js'

export class Header {
  constructor(app, region) {
    this.app = app
    this.region = region
    this.container = new PIXI.Container()
    this.logo = null
    this.howToPlayBtn = null
    this.counter = null
    this.fullscreenBtn = null
  }

  create() {
    this.createHeaderBackground()
    this.createLogo()
    this.createHowToPlayButton()
    this.createCounter()
    this.createFullscreenButton()
    
    this.resize()
    return this.container
  }

  createHeaderBackground() {
    // Create header background bar
    this.headerBg = new PIXI.Graphics()
    this.container.addChild(this.headerBg)
  }

  createLogo() {
    // Load logo1.png from common folder
    const logoTexture = PIXI.Texture.from('./images/logo1.png')
    this.logo = new PIXI.Sprite(logoTexture)
    this.logo.anchor.set(0.5)
    this.container.addChild(this.logo)
  }

  createHowToPlayButton() {
    // Create "How to play?" button
    const buttonContainer = new PIXI.Container()
    
    // Button background
    const buttonBg = new PIXI.Graphics()
    buttonBg.roundRect(-60, -15, 120, 30, 15).fill(0x333333)
    buttonContainer.addChild(buttonBg)
    
    // Button text
    const buttonText = new PIXI.Text({
      text: 'How to play?',
      style: {
        fontSize: 12,
        fill: 0xFFFFFF,
        fontFamily: 'Arial'
      }
    })
    buttonText.anchor.set(0.5)
    buttonContainer.addChild(buttonText)
    
    // Make interactive
    buttonContainer.eventMode = 'static'
    buttonContainer.cursor = 'pointer'
    buttonContainer.on('pointerdown', () => this.onHowToPlayClick())
    
    this.howToPlayBtn = buttonContainer
    this.container.addChild(buttonContainer)
  }

  createCounter() {
    // Create counter display (not interactive)
    const counterContainer = new PIXI.Container()
    
    // Counter background
    const counterBg = new PIXI.Graphics()
    counterBg.roundRect(-50, -15, 100, 30, 15).fill(0x444444)
    counterContainer.addChild(counterBg)
    
    // Counter text - will be updated with actual value
    const counterText = new PIXI.Text({
      text: '627 154: 19',
      style: {
        fontSize: 12,
        fill: 0xFFFFFF,
        fontFamily: 'Arial'
      }
    })
    counterText.anchor.set(0.5)
    counterContainer.addChild(counterText)
    
    this.counter = counterContainer
    this.container.addChild(counterContainer)
  }

  createFullscreenButton() {
    // Create fullscreen toggle button
    const buttonContainer = new PIXI.Container()
    
    // Square button background
    const buttonBg = new PIXI.Graphics()
    buttonBg.roundRect(-15, -15, 30, 30, 5).fill(0x333333)
    buttonContainer.addChild(buttonBg)
    
    // Fullscreen icon (simplified)
    const icon = new PIXI.Graphics()
    icon.rect(-8, -8, 16, 16).stroke({ width: 2, color: 0xFFFFFF })
    icon.rect(-6, -6, 12, 12).stroke({ width: 1, color: 0xFFFFFF })
    buttonContainer.addChild(icon)
    
    // Make interactive
    buttonContainer.eventMode = 'static'
    buttonContainer.cursor = 'pointer'
    buttonContainer.on('pointerdown', () => this.onFullscreenClick())
    
    this.fullscreenBtn = buttonContainer
    this.container.addChild(buttonContainer)
  }

  onHowToPlayClick() {
    console.log('How to play clicked')
    // TODO: Show how to play modal
  }

  onFullscreenClick() {
    console.log('Fullscreen clicked')
    // Toggle fullscreen
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  updateCounter(value) {
    if (this.counter && this.counter.children[1]) {
      this.counter.children[1].text = value
    }
  }

  updateRegion(newRegion) {
    this.region = newRegion
    // TODO: Update logo if needed
  }

  resize() {
    const screenWidth = this.app.screen.width
    const screenHeight = this.app.screen.height
    const isMobile = screenWidth < 800
    
    // Update header background
    const headerHeight = 80
    this.headerBg.clear()
    this.headerBg.rect(0, 0, screenWidth, headerHeight).fill(0x3B4150)
    
    // Position header elements
    const headerY = 40
    
    // Logo on the left
    this.logo.x = 100
    this.logo.y = headerY
    
    // Right side buttons
    const rightX = screenWidth - 100
    let buttonSpacing = 0
    
    // Fullscreen button (rightmost)
    this.fullscreenBtn.x = rightX
    this.fullscreenBtn.y = headerY
    buttonSpacing += 80
    
    // Counter (middle right)
    this.counter.x = rightX - buttonSpacing
    this.counter.y = headerY
    buttonSpacing += 120
    
    // How to play button (hide on mobile)
    if (isMobile) {
      this.howToPlayBtn.visible = false
    } else {
      this.howToPlayBtn.visible = true
      this.howToPlayBtn.x = rightX - buttonSpacing
      this.howToPlayBtn.y = headerY
    }
  }
}