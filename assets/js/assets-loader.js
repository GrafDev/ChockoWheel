import * as PIXI from 'pixi.js'
import { regionsConfig } from './config.js'

export class AssetsLoader {
  constructor() {
    this.loadedRegions = new Set()
  }

  async loadRegionAssets(region) {
    if (this.loadedRegions.has(region)) {
      return // Already loaded
    }

    console.log(`Loading assets for region: ${region}`)

    // Define asset paths for each region
    const assetPaths = this.getAssetPaths(region)
    
    // Load all assets for this region
    await this.loadAssets(assetPaths, region)
    
    this.loadedRegions.add(region)
  }

  getAssetPaths(region) {
    // Base paths - will be organized by region later
    const basePath = '/assets/images'
    
    return {
      // Wheel screen assets
      wheel: `${basePath}/${region}/wheel.png`,
      chicken: `${basePath}/${region}/chicken.png`,
      spinButton: `${basePath}/${region}/spin-button.png`,
      finger: `${basePath}/common/finger.png`,
      
      // Background assets
      background: `${basePath}/${region}/background.png`,
      
      // UI elements
      logo: `${basePath}/${region}/logo.png`,
      
      // Result modal assets
      resultModal: `${basePath}/${region}/result-modal.png`,
      
      // For now, create fallback placeholders
      _placeholder: true
    }
  }

  async loadAssets(assetPaths, region) {
    const loader = PIXI.Assets

    try {
      // For development - create placeholder textures
      if (assetPaths._placeholder) {
        await this.createPlaceholders(region)
        return
      }

      // Real asset loading logic
      const loadPromises = Object.entries(assetPaths).map(([key, path]) => {
        const assetKey = `${region}_${key}`
        return loader.load({ alias: assetKey, src: path })
          .then(texture => {
            console.log(`Loaded: ${assetKey}`)
            return { key: assetKey, texture }
          })
          .catch(async (error) => {
            console.warn(`Failed to load ${assetKey}:`, error)
            // Create fallback texture
            return await this.createFallbackTexture(key, assetKey)
          })
      })

      await Promise.all(loadPromises)
      
    } catch (error) {
      console.error(`Error loading assets for region ${region}:`, error)
      // Create fallback textures
      await this.createPlaceholders(region)
    }
  }

  async createPlaceholders(region) {
    // Create placeholder app for generating textures
    const tempApp = new PIXI.Application()
    await tempApp.init({ width: 300, height: 300 })
    
    // Wheel placeholder
    const wheelGraphics = new PIXI.Graphics()
    wheelGraphics.circle(0, 0, 150).fill(0xFFD700)
    const wheelTexture = tempApp.renderer.generateTexture(wheelGraphics)
    PIXI.Assets.cache.set(`${region}_wheel`, wheelTexture)
    
    // Chicken placeholder
    const chickenGraphics = new PIXI.Graphics()
    chickenGraphics.circle(0, 0, 50).fill(0xFFFFFF)
    const chickenTexture = tempApp.renderer.generateTexture(chickenGraphics)
    PIXI.Assets.cache.set(`${region}_chicken`, chickenTexture)
    
    // Spin button placeholder
    const buttonGraphics = new PIXI.Graphics()
    buttonGraphics.roundRect(-75, -25, 150, 50, 25).fill(0x4CAF50)
    const buttonTexture = tempApp.renderer.generateTexture(buttonGraphics)
    PIXI.Assets.cache.set(`${region}_spinButton`, buttonTexture)
    
    // Logo placeholder
    const logoGraphics = new PIXI.Graphics()
    logoGraphics.rect(-100, -30, 200, 60).fill(0xFF6B6B)
    const logoTexture = tempApp.renderer.generateTexture(logoGraphics)
    PIXI.Assets.cache.set(`${region}_logo`, logoTexture)
    
    // Cleanup temp app
    tempApp.destroy()
    
    console.log(`Created placeholder textures for region: ${region}`)
  }

  async createFallbackTexture(type, assetKey) {
    // Create temporary app for texture generation
    const tempApp = new PIXI.Application()
    await tempApp.init({ width: 300, height: 300 })
    
    const graphics = new PIXI.Graphics()
    
    // Create different fallback based on asset type
    switch (type) {
      case 'wheel':
        graphics.circle(0, 0, 150).fill(0xFFD700)
        break
      case 'chicken':
        graphics.circle(0, 0, 50).fill(0xFFFFFF)
        break
      case 'spinButton':
        graphics.roundRect(-75, -25, 150, 50, 25).fill(0x4CAF50)
        break
      default:
        graphics.rect(-50, -50, 100, 100).fill(0xCCCCCC)
    }
    
    const texture = tempApp.renderer.generateTexture(graphics)
    PIXI.Assets.cache.set(assetKey, texture)
    
    // Cleanup temp app
    tempApp.destroy()
    
    return { key: assetKey, texture }
  }

  getTexture(region, assetName) {
    const key = `${region}_${assetName}`
    return PIXI.Assets.cache.get(key)
  }

  async preloadAllRegions() {
    const regions = Object.keys(regionsConfig)
    const loadPromises = regions.map(region => this.loadRegionAssets(region))
    await Promise.all(loadPromises)
  }
}