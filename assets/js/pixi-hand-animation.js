// PixiJS hand pointer animation using local package
import * as PIXI from '/node_modules/pixi.js/dist/pixi.mjs'

export class PixiHandAnimation {
  constructor() {
    this.app = null
    this.handSprite = null
    this.isInitialized = false
    this.currentButton = null
    this.resizeObserver = null
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
      const handTexture = await PIXI.Assets.load('/assets/images/hand-pointer.png')
      
      // Create hand sprite
      this.handSprite = new PIXI.Sprite(handTexture)
      this.handSprite.anchor.set(0, 0.8) // Anchor at bottom part of hand for rotation axis
      this.handSprite.alpha = 0 // Start hidden
      this.handSprite.scale.set(10) // Start at large scale
      
      this.app.stage.addChild(this.handSprite)
      
      console.log('Hand sprite created:', this.handSprite)
      
      // Hide DOM hand completely - using ONLY PixiJS now
      const domHand = document.querySelector('.hand-pointer')
      if (domHand) {
        domHand.style.display = 'none'
        console.log('DOM hand completely hidden - using PIXI only')
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

    // Position and start immediately - no delay needed since called from animation sync
    this.positionAndStartAnimation()
    
    // Start monitoring for button changes
    this.startButtonMonitoring()
  }

  positionAndStartAnimation() {
    // Find ALL spin buttons and check their positions
    const allSpinBtns = document.querySelectorAll('.spin-btn, .spin-btn-landscape')
    let buttonCenterX = window.innerWidth * 0.5
    let buttonCenterY = window.innerHeight * 0.8
    let foundButton = null
    
    console.log('Found spin buttons:', allSpinBtns.length)
    
    allSpinBtns.forEach((btn, index) => {
      const rect = btn.getBoundingClientRect()
      const isVisible = rect.width > 0 && rect.height > 0 && 
                       getComputedStyle(btn).display !== 'none' && 
                       getComputedStyle(btn).visibility !== 'hidden'
      
      console.log(`Button ${index}:`, {
        element: btn,
        rect: rect,
        visible: isVisible,
        display: getComputedStyle(btn).display,
        visibility: getComputedStyle(btn).visibility
      })
      
      // Use the first visible button
      if (isVisible && !foundButton) {
        foundButton = btn
        this.currentButton = btn // Store current button
        buttonCenterX = rect.left + rect.width * 0.5
        buttonCenterY = rect.top + rect.height * 0.5
      }
    })
    
    if (!foundButton) {
      console.warn('No visible spin button found, using fallback position')
    } else {
      console.log('Using button:', foundButton, 'at position:', buttonCenterX, buttonCenterY)
    }

    // Calculate hand position so finger points to button center
    // Hand anchor is now at (0, 0.8) - bottom part for rotation axis
    const handWidth = this.handSprite.texture.width * 3 // Final scale
    const handHeight = this.handSprite.texture.height * 3
    
    // Adjust finger position for new anchor point (0, 0.8)
    const fingerOffsetX = handWidth * -0.1 // Negative offset - hand appears even more to the right
    const fingerOffsetY = handHeight * -0.6 // Finger tip is 60% above anchor point (20% from top - 80% anchor = -60%)
    
    const handTargetX = buttonCenterX - fingerOffsetX
    const handTargetY = buttonCenterY - fingerOffsetY

    console.log('Hand animation setup (updated):')
    console.log('Button center:', buttonCenterX, buttonCenterY)
    console.log('Hand texture size:', this.handSprite.texture.width, this.handSprite.texture.height)
    console.log('Hand scaled size:', handWidth, handHeight)
    console.log('Finger offset:', fingerOffsetX, fingerOffsetY)
    console.log('Hand target position:', handTargetX, handTargetY)


    // Set initial position - same target but large scale
    this.handSprite.x = handTargetX
    this.handSprite.y = handTargetY
    this.handSprite.scale.set(10) // Large initial scale
    this.handSprite.alpha = 0

    // Start immediately
    this.startTapping()
    
    // Animate appearance: scale down and fade in
    this.animateSprite(this.handSprite, {
      'scale.x': 3,
      'scale.y': 3,
      alpha: 1
    }, 800)
    
    console.log('Hand animation started!')
  }

  startTapping() {
    if (!this.handSprite) return

    const doTap = () => {
      // Press down - rotate around X axis (away from user) by squashing Y scale
      this.animateSprite(this.handSprite, { 
        'scale.y': 2.4 // Compress vertically = rotation away from user around X axis
      }, 200, null, () => {
        // Hold pressed position briefly
        setTimeout(() => {
          // Release - rotate back (toward user) by stretching Y scale  
          this.animateSprite(this.handSprite, { 
            'scale.y': 3.2 // Stretch vertically = rotation toward user around X axis
          }, 200, null, () => {
            // Back to neutral
            this.animateSprite(this.handSprite, { 
              'scale.y': 3 // Back to normal scale
            }, 150, null, () => {
              // Pause before next tap
              setTimeout(() => {
                doTap()
              }, 800) // Pause between taps
            })
          })
        }, 50) // Brief hold
      })
    }

    // Start first tap immediately
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


  startButtonMonitoring() {
    // Monitor for window resize and button visibility changes
    window.addEventListener('resize', () => this.checkButtonChange())
    
    // Check for button changes periodically
    setInterval(() => this.checkButtonChange(), 1000)
  }
  
  checkButtonChange() {
    const allSpinBtns = document.querySelectorAll('.spin-btn, .spin-btn-landscape')
    let activeButton = null
    
    allSpinBtns.forEach(btn => {
      const rect = btn.getBoundingClientRect()
      const isVisible = rect.width > 0 && rect.height > 0 && 
                       getComputedStyle(btn).display !== 'none' && 
                       getComputedStyle(btn).visibility !== 'hidden'
      
      if (isVisible && !activeButton) {
        activeButton = btn
      }
    })
    
    // If active button changed, reposition hand
    if (activeButton !== this.currentButton) {
      console.log('Button changed from', this.currentButton, 'to', activeButton)
      this.currentButton = activeButton
      this.repositionHand()
    }
  }
  
  repositionHand() {
    if (!this.handSprite || !this.currentButton) return
    
    const rect = this.currentButton.getBoundingClientRect()
    const buttonCenterX = rect.left + rect.width * 0.5
    const buttonCenterY = rect.top + rect.height * 0.5
    
    // Calculate new hand position
    const handWidth = this.handSprite.texture.width * 3
    const handHeight = this.handSprite.texture.height * 3
    const fingerOffsetX = handWidth * -0.1
    const fingerOffsetY = handHeight * -0.6
    
    const newHandX = buttonCenterX - fingerOffsetX
    const newHandY = buttonCenterY - fingerOffsetY
    
    console.log('Repositioning hand to:', newHandX, newHandY)
    
    // Smoothly animate to new position
    this.animateSprite(this.handSprite, {
      x: newHandX,
      y: newHandY
    }, 500)
  }

  destroy() {
    if (this.app) {
      this.app.destroy(true)
    }
  }
}