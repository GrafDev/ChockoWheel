import * as PIXI from 'pixi.js'

export class Logo2 {
  constructor(app) {
    this.app = app
    this.container = new PIXI.Container()
    this.part1 = null
    this.part2 = null
    this.flameAnimation = null
    this.ticker = null
  }

  create() {
    this.createLogoParts()
    this.startFlameAnimation()
    this.resize()
    return this.container
  }

  createLogoParts() {
    // Try to load from cache first (if assets were loaded), otherwise fallback to direct path
    let part1Texture, part2Texture
    
    try {
      part1Texture = PIXI.Assets.cache.get('eu_logo2Part1') || PIXI.Texture.from('/assets/images/common/logo2-part1.png')
      part2Texture = PIXI.Assets.cache.get('eu_logo2Part2') || PIXI.Texture.from('/assets/images/common/logo2-part2.png')
    } catch (error) {
      console.warn('Using direct texture loading for logo2 parts')
      part1Texture = PIXI.Texture.from('/assets/images/common/logo2-part1.png')
      part2Texture = PIXI.Texture.from('/assets/images/common/logo2-part2.png')
    }
    
    this.part1 = new PIXI.Sprite(part1Texture)
    this.part1.anchor.set(0, 0) // Top-left anchor
    this.container.addChild(this.part1)
    
    this.part2 = new PIXI.Sprite(part2Texture)
    this.part2.anchor.set(0, 0) // Top-left anchor
    this.container.addChild(this.part2)
  }

  startFlameAnimation() {
    if (!this.part2) return
    
    // Create flame animation ticker
    this.ticker = new PIXI.Ticker()
    let time = 0
    const baseX = 20
    const baseY = 100
    
    this.ticker.add(() => {
      time += 0.05
      
      // Create flame-like movement with multiple sine waves (small movements)
      const baseWave = Math.sin(time) * 0.01
      const fastWave = Math.sin(time * 3) * 0.005
      const slowWave = Math.sin(time * 0.5) * 0.008
      
      const horizontalOffset = (baseWave + fastWave) * 3
      const verticalOffset = (slowWave + Math.sin(time * 2) * 0.003) * 2
      const scaleVariation = 1 + (Math.sin(time * 2.5) * 0.015)
      const rotation = (Math.sin(time * 1.5) * 0.02)
      
      this.part2.x = baseX + horizontalOffset
      this.part2.y = baseY + verticalOffset
      this.part2.scale.set(scaleVariation)
      this.part2.rotation = rotation
    })
    
    this.ticker.start()
  }

  resize() {
    // Position logo2 parts exactly as original logo was positioned
    if (this.part1) {
      this.part1.x = 20 // Left margin  
      this.part1.y = 100 // Under header (header height ~80px + margin)
    }
    
    // Part2 at same position as part1 (will be animated from there)
    if (this.part2) {
      this.part2.x = 20
      this.part2.y = 100
    }
  }

  destroy() {
    if (this.ticker) {
      this.ticker.stop()
      this.ticker.destroy()
      this.ticker = null
    }
  }
}