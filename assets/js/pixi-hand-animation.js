// PixiJS hand pointer animation using local package
import * as PIXI from '/node_modules/pixi.js/dist/pixi.mjs'

export class PixiHandAnimation {
  constructor() {
    this.app = null
    this.handSprite = null
    this.isInitialized = false
  }

  async init() {
    console.log('Initializing PixiJS hand animation with local package...')
    
    try {
      // Create PIXI Application using modern v8 API
      this.app = new PIXI.Application()
      
      await this.app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000,
        backgroundAlpha: 0,
        resolution: window.devicePixelRatio || 1,
        antialias: true
      })

      // Add canvas to main container
      const mainContainer = document.querySelector('.main-container')
      mainContainer.appendChild(this.app.canvas)
      this.app.canvas.style.position = 'absolute'
      this.app.canvas.style.top = '0'
      this.app.canvas.style.left = '0'
      this.app.canvas.style.zIndex = '100'
      this.app.canvas.style.pointerEvents = 'none'

      // Load hand texture using modern Assets API
      const handTexture = await PIXI.Assets.load('/assets/images/common/hand-pointer.png')
      
      // Create hand sprite
      this.handSprite = new PIXI.Sprite(handTexture)
      this.handSprite.anchor.set(0, 1)
      this.handSprite.alpha = 1 // Make visible for testing
      this.handSprite.scale.set(3) // Smaller scale for testing
      
      // Position in center for testing
      this.handSprite.x = window.innerWidth * 0.5
      this.handSprite.y = window.innerHeight * 0.5
      
      this.app.stage.addChild(this.handSprite)
      
      console.log('Hand sprite created:', this.handSprite)
      
      // Keep DOM hand visible as fallback for now
      const domHand = document.querySelector('.hand-pointer')
      if (domHand) {
        console.log('DOM hand found:', domHand)
        // domHand.style.visibility = 'hidden' // Keep visible for debugging
      } else {
        console.warn('DOM hand element not found')
      }
      
      this.isInitialized = true
      console.log('PixiJS hand initialized successfully')
      
    } catch (error) {
      console.error('Failed to initialize PixiJS hand:', error)
    }

    window.addEventListener('resize', () => this.handleResize())
  }

  handleResize() {
    if (this.app) {
      this.app.renderer.resize(window.innerWidth, window.innerHeight)
    }
  }

  async start() {
    if (!this.isInitialized) return

    // Position hand initially (off-screen)
    const spinBtn = document.querySelector('.spin-btn')
    let targetX = window.innerWidth * 0.5
    let targetY = window.innerHeight * 0.8
    
    if (spinBtn) {
      const rect = spinBtn.getBoundingClientRect()
      targetX = rect.left + rect.width * 0.5
      targetY = rect.top + rect.height * 0.5
    }

    this.handSprite.x = targetX + 200
    this.handSprite.y = targetY - 150

    setTimeout(() => {
      // Start tapping immediately
      this.startTapping()
      
      // Move to center
      this.animateSprite(this.handSprite, {
        x: targetX,
        y: targetY,
        'scale.x': 3,
        'scale.y': 3,
        alpha: 1
      }, 800)
    }, 2500)
  }

  startTapping() {
    if (!this.handSprite) return

    let tapState = { skew: 0 }
    
    const doTap = () => {
      // Left skew
      this.animateSprite(tapState, { skew: -0.26 }, 250, null, () => {
        this.handSprite.skew.x = tapState.skew
        
        // Right skew
        this.animateSprite(tapState, { skew: 0.26 }, 300, null, () => {
          this.handSprite.skew.x = tapState.skew
          
          // Back to center
          this.animateSprite(tapState, { skew: 0 }, 250, null, () => {
            this.handSprite.skew.x = tapState.skew
            doTap() // Continue immediately
          })
        })
      })
    }

    doTap()
  }

  animateSprite(target, props, duration, easing, onComplete) {
    const startTime = performance.now()
    const startValues = {}
    
    Object.keys(props).forEach(key => {
      if (key.includes('.')) {
        const [obj, prop] = key.split('.')
        startValues[key] = target[obj][prop]
      } else {
        startValues[key] = target[key]
      }
    })

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easing ? easing(progress) : this.easeOutQuad(progress)

      Object.keys(props).forEach(key => {
        const value = startValues[key] + (props[key] - startValues[key]) * easedProgress
        
        if (key.includes('.')) {
          const [obj, prop] = key.split('.')
          target[obj][prop] = value
        } else {
          target[key] = value
        }
      })

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else if (onComplete) {
        onComplete()
      }
    }

    requestAnimationFrame(animate)
  }

  easeOutQuad(t) {
    return 1 - (1 - t) * (1 - t)
  }

  destroy() {
    if (this.app) {
      this.app.destroy(true)
    }
  }
}