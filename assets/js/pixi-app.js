import * as PIXI from 'pixi.js'
import { regionsConfig } from './config.js'

export class PixiApp {
  constructor() {
    this.app = null
    this.currentRegion = 'eu'
    this.currentScreen = null
    this.screens = new Map()
  }

  async init(container) {
    // Create PIXI Application
    this.app = new PIXI.Application()
    await this.app.init({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x363755,
      resizeTo: window
    })

    // Add canvas to container
    container.appendChild(this.app.canvas)

    // Setup resize handler
    window.addEventListener('resize', () => {
      this.handleResize()
    })

    return this.app
  }

  handleResize() {
    if (this.app) {
      this.app.renderer.resize(window.innerWidth, window.innerHeight)
      if (this.currentScreen && this.currentScreen.resize) {
        this.currentScreen.resize()
      }
    }
  }

  setRegion(region) {
    if (regionsConfig[region]) {
      this.currentRegion = region
      if (this.currentScreen && this.currentScreen.updateRegion) {
        this.currentScreen.updateRegion(region)
      }
    }
  }

  addScreen(name, screenClass) {
    this.screens.set(name, screenClass)
  }

  async showScreen(screenName) {
    if (!this.screens.has(screenName)) {
      console.error(`Screen ${screenName} not found`)
      return
    }

    // Hide current screen
    if (this.currentScreen) {
      this.currentScreen.hide()
      this.app.stage.removeChild(this.currentScreen.container)
    }

    // Create and show new screen
    const ScreenClass = this.screens.get(screenName)
    this.currentScreen = new ScreenClass(this.app, this.currentRegion)
    
    this.app.stage.addChild(this.currentScreen.container)
    await this.currentScreen.show()
  }

  destroy() {
    if (this.app) {
      this.app.destroy(true, true)
    }
  }
}