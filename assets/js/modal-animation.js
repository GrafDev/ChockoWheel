import { Application, Assets, Sprite } from 'pixi.js'

export class ModalAnimation {
  constructor() {
    this.app = null
    this.modalSprite = null
    this.container = null
    this.modalImage = null
    this.isAnimating = false
    this.currentImagePath = null
  }

  async init() {
    try {
      // Find modal container and image
      this.container = document.getElementById('bonusModal')
      this.modalImage = document.getElementById('bonusModalImage')
      if (!this.container || !this.modalImage) {
        console.warn('Modal container or image not found')
        return false
      }

      // Keep the original image visible but temporarily

      // Create PixiJS application - same size as modal image container
      this.app = new Application()
      await this.app.init({
        width: 800, // Will be resized dynamically
        height: 600, // Will be resized dynamically
        backgroundColor: 0x000000,
        backgroundAlpha: 0,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true
      })

      // Initially hide canvas
      this.app.canvas.style.pointerEvents = 'auto'
      this.app.canvas.style.display = 'none'

      // Add canvas to modal container
      this.container.appendChild(this.app.canvas)

      console.log('Modal animation initialized')
      return true
    } catch (error) {
      console.error('Failed to initialize modal animation:', error)
      return false
    }
  }

  async show(imagePath) {
    if (!this.app || this.isAnimating) return
    
    this.isAnimating = true
    this.currentImagePath = imagePath

    try {
      // Show modal container first
      this.container.style.display = 'flex'
      
      // Update original image src but keep it hidden
      this.modalImage.src = imagePath
      this.modalImage.style.opacity = '0'
      this.modalImage.style.visibility = 'hidden' // Hide completely to prevent flicker
      
      // Wait for image to load and get proper dimensions
      await new Promise(resolve => {
        if (this.modalImage.complete) {
          resolve()
        } else {
          this.modalImage.onload = resolve
        }
      })
      
      // Temporarily make visible just to get dimensions (single frame)
      this.modalImage.style.visibility = 'visible'
      this.modalImage.style.opacity = '1'
      
      // Get the actual rendered size and position
      const modalRect = this.modalImage.getBoundingClientRect()
      const containerRect = this.container.getBoundingClientRect()
      
      // Immediately hide again before any animation starts
      this.modalImage.style.opacity = '0'
      this.modalImage.style.visibility = 'hidden'
      
      // Make canvas size of full container to avoid clipping
      this.app.renderer.resize(containerRect.width, containerRect.height)
      
      // Position canvas to cover entire container
      this.app.canvas.style.position = 'absolute'
      this.app.canvas.style.left = '0'
      this.app.canvas.style.top = '0'
      this.app.canvas.style.width = '100%'
      this.app.canvas.style.height = '100%'
      
      // Load the modal image
      const texture = await Assets.load(imagePath)
      
      // Create sprite
      this.modalSprite = new Sprite(texture)
      this.modalSprite.anchor.set(0.5)
      
      // Position sprite exactly where the original image was
      const imageCenterX = (modalRect.left - containerRect.left) + modalRect.width / 2
      const imageCenterY = (modalRect.top - containerRect.top) + modalRect.height / 2
      this.modalSprite.position.set(imageCenterX, imageCenterY)
      
      // Scale to fit modal image area (same size as original)
      const scaleX = modalRect.width / texture.width
      const scaleY = modalRect.height / texture.height
      const finalScale = Math.min(scaleX, scaleY)
      
      // Create epic entrance animation
      await this.createEpicEntrance(finalScale, imageCenterX, imageCenterY)

    } catch (error) {
      console.error('Failed to show modal:', error)
      this.isAnimating = false
    }
  }

  hide(onComplete = null) {
    if (!this.app || !this.modalSprite || this.isAnimating) {
      // Fallback - hide modal container
      this.container.style.display = 'none'
      if (onComplete) onComplete()
      return
    }
    
    this.isAnimating = true
    
    // Animate disappearance - scale up and fade out
    this.animateSprite(this.modalSprite, {
      'scale.x': this.modalSprite.scale.x * 1.2,
      'scale.y': this.modalSprite.scale.y * 1.2,
      alpha: 0
    }, 400, this.easeInQuad, () => {
      // Hide canvas and modal container
      this.app.canvas.style.display = 'none'
      this.container.style.display = 'none'
      
      // Clean up sprite
      if (this.modalSprite) {
        this.app.stage.removeChild(this.modalSprite)
        this.modalSprite.destroy()
        this.modalSprite = null
      }
      
      this.isAnimating = false
      if (onComplete) onComplete()
    })
  }

  easeOutBack(t) {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  }

  easeInQuad(t) {
    return t * t
  }

  animateSprite(sprite, targetProps, duration, easing, onComplete) {
    const startTime = Date.now()
    const startProps = {}
    
    // Store initial values
    Object.keys(targetProps).forEach(prop => {
      const keys = prop.split('.')
      if (keys.length === 2) {
        startProps[prop] = sprite[keys[0]][keys[1]]
      } else {
        startProps[prop] = sprite[prop]
      }
    })
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easing ? easing(progress) : progress
      
      // Update sprite properties
      Object.keys(targetProps).forEach(prop => {
        const startVal = startProps[prop]
        const targetVal = targetProps[prop]
        const currentVal = startVal + (targetVal - startVal) * easedProgress
        
        const keys = prop.split('.')
        if (keys.length === 2) {
          sprite[keys[0]][keys[1]] = currentVal
        } else {
          sprite[prop] = currentVal
        }
      })
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        if (onComplete) onComplete()
      }
    }
    
    requestAnimationFrame(animate)
  }

  handleClick(callback) {
    if (this.app && this.app.canvas) {
      this.app.canvas.addEventListener('click', callback)
    }
  }

  resize() {
    if (this.app && this.modalImage && this.container) {
      const modalRect = this.modalImage.getBoundingClientRect()
      const containerRect = this.container.getBoundingClientRect()
      
      // Resize canvas to full container
      this.app.renderer.resize(containerRect.width, containerRect.height)
      
      if (this.modalSprite) {
        // Reposition sprite to match image position
        const imageCenterX = (modalRect.left - containerRect.left) + modalRect.width / 2
        const imageCenterY = (modalRect.top - containerRect.top) + modalRect.height / 2
        this.modalSprite.position.set(imageCenterX, imageCenterY)
      }
    }
  }

  async createEpicEntrance(finalScale, centerX, centerY) {
    // Stage 1: Start from far away with rotation and distortion
    this.modalSprite.scale.set(0.1)
    this.modalSprite.alpha = 0
    this.modalSprite.rotation = Math.PI * 2 // Full rotation
    this.modalSprite.position.set(centerX - 500, centerY - 300) // Start off-screen
    
    // No distortion filter needed
    
    this.app.stage.addChild(this.modalSprite)
    
    // Show canvas
    this.app.canvas.style.display = 'block'
    
    // Stage 1: Fly in with rotation (600ms - быстрее)
    await new Promise(resolve => {
      this.animateSprite(this.modalSprite, {
        'position.x': centerX,
        'position.y': centerY,
        'scale.x': finalScale * 1.3, // Overshoot
        'scale.y': finalScale * 1.3,
        alpha: 1,
        rotation: 0
      }, 600, this.easeOutQuad, resolve)
    })
    
    // Stage 2: Settle (300ms - быстрее)
    await new Promise(resolve => {
      this.animateSprite(this.modalSprite, {
        'scale.x': finalScale * 0.95, // Undershoot
        'scale.y': finalScale * 0.95
      }, 300, this.easeOutQuad, resolve)
    })
    
    // Stage 3: Final bounce (200ms - быстрее)
    await new Promise(resolve => {
      this.animateSprite(this.modalSprite, {
        'scale.x': finalScale,
        'scale.y': finalScale
      }, 200, this.easeOutBack, resolve)
    })
    
    // Animation complete
    
    this.isAnimating = false
    console.log('Epic modal animation complete!')
  }



  destroy() {
    if (this.app) {
      this.app.destroy(true, true)
      this.app = null
    }
    this.modalSprite = null
    this.container = null
    this.modalImage = null
    this.isAnimating = false
  }
}