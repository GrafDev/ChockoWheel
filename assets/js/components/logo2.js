import * as PIXI from 'pixi.js'

export class Logo2 {
  constructor(app) {
    this.app = app
    this.container = new PIXI.Container()
    this.logo = null
  }

  create() {
    this.createLogo()
    this.resize()
    return this.container
  }

  createLogo() {
    // Load logo2.png from common folder
    const logoTexture = PIXI.Texture.from('/assets/images/common/logo2.png')
    this.logo = new PIXI.Sprite(logoTexture)
    this.logo.anchor.set(0, 0) // Top-left anchor
    this.container.addChild(this.logo)
  }

  resize() {
    const screenWidth = this.app.screen.width
    
    // Position logo2 in top-left, under header
    this.logo.x = 20 // Left margin
    this.logo.y = 100 // Under header (header height ~80px + margin)
  }
}