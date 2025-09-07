import { FireSparksAnimation } from './fire-sparks-animation.js'
import { EntranceAnimations } from './entrance-animations.js'

export class SimpleEntranceAnimations {
  constructor() {
    this.isReady = false
    this.activeAnimations = []
    this.fireSparksAnimation = null
    this.entranceAnimations = null
  }
  
  async start(onComplete) {
    console.log('Starting simple entrance animations...')
    
    // Initialize and start fire sparks animation
    this.fireSparksAnimation = new FireSparksAnimation()
    await this.fireSparksAnimation.init()
    
    // Initialize entrance animations (chicken)
    this.entranceAnimations = new EntranceAnimations()
    
    
    // Start all animations simultaneously
    this.animateHeader()
    this.animateBox1()
    this.animateWheelContainer()
    this.animateWheelWrapper()
    this.animateWheelCenter()
    // Start chicken entrance animations
    this.entranceAnimations.start()
    // Animate spin buttons and hand together
    this.animateSpinButtonsAndHand()
    
    // Complete after longest animation (chicken = ~1.5s + bounces)
    setTimeout(() => {
      this.isReady = true
      console.log('All entrance animations completed')
      if (onComplete) onComplete()
    }, 2500)
    
    // Handle window resize to restart sparks
    this.setupResizeHandler()
  }
  
  easeOutQuad(t) {
    return 1 - (1 - t) * (1 - t)
  }
  
  easeOutBack(t) {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  }
  
  animate(obj, target, duration, easing = this.easeOutQuad, onUpdate = null, onComplete = null) {
    const startTime = Date.now()
    const startValues = { ...obj }
    
    const update = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easing(progress)
      
      Object.keys(target).forEach(key => {
        obj[key] = startValues[key] + (target[key] - startValues[key]) * easedProgress
      })
      
      if (onUpdate) onUpdate(obj)
      
      if (progress < 1) {
        requestAnimationFrame(update)
      } else {
        if (onComplete) onComplete()
      }
    }
    
    requestAnimationFrame(update)
  }
  
  animateHeader() {
    const element = document.querySelector('.header')
    if (!element) return
    
    element.style.opacity = '0'
    
    const animation = { opacity: 0 }
    this.animate(animation, { opacity: 1 }, 800, this.easeOutQuad, (values) => {
      element.style.opacity = values.opacity
    })
  }
  
  animateBox1() {
    const element = document.querySelector('.logo2')
    console.log('animateBox1 found element:', element)
    if (!element) return
    
    element.style.opacity = '0'
    
    const animation = { opacity: 0 }
    this.animate(animation, { opacity: 1 }, 800, this.easeOutQuad, (values) => {
      element.style.opacity = values.opacity
    })
  }
  
  animateWheelContainer() {
    const element = document.querySelector('.wheel-container')
    if (!element) return
    
    element.style.opacity = '0'
    
    const animation = { opacity: 0 }
    this.animate(animation, { opacity: 1 }, 600, this.easeOutQuad, (values) => {
      element.style.opacity = values.opacity
    })
  }
  
  animateWheelWrapper() {
    const element = document.querySelector('.wheel-wrapper')
    if (!element) return
    
    element.style.opacity = '0'
    
    const animation = { opacity: 0 }
    this.animate(animation, { opacity: 1 }, 800, this.easeOutQuad, (values) => {
      element.style.opacity = values.opacity
    })
  }
  
  animateWheelCenter() {
    const element = document.querySelector('.wheel-center')
    if (!element) return
    
    element.style.opacity = '0'
    
    const animation = { opacity: 0 }
    this.animate(animation, { opacity: 1 }, 600, this.easeOutQuad, (values) => {
      element.style.opacity = values.opacity
    })
  }
  
  animateSpinButtonsAndHand() {
    const elements = [
      document.querySelector('.spin-btn'),
      document.querySelector('.spin-btn-landscape')
    ].filter(Boolean)
    
    elements.forEach(element => {
      element.style.opacity = '0'
      element.disabled = true // Make button inactive
      element.style.pointerEvents = 'none' // Disable clicks
      element.style.filter = 'grayscale(0.5)' // Visual indication
      
      const animation = { opacity: 0 }
      this.animate(animation, { opacity: 1 }, 800, this.easeOutQuad, (values) => {
        element.style.opacity = values.opacity
      })
    })
    
    // Animate hands with scale-down effect
    const hands = [
      document.querySelector('.hand-pointer'),
      ...document.querySelectorAll('.hand-pointer')
    ].filter(Boolean)
    
    console.log('Found hands for animation:', hands.length)
    
    hands.forEach(hand => {
      hand.style.opacity = '0'
      hand.style.transform = 'scale(2.5)'
      
      const animation = { opacity: 0, scale: 2.5 }
      setTimeout(() => {
        this.animate(animation, { opacity: 1, scale: 1 }, 800, this.easeOutBack, (values) => {
          hand.style.opacity = values.opacity
          hand.style.transform = `scale(${values.scale})`
        }, () => {
          // Start tapping animation after hand appears
          this.startHandTapping(hand)
        })
      }, 600) // Start hand animation after buttons start appearing
    })
  }
  
  setupResizeHandler() {
    window.addEventListener('resize', () => {
      if (this.fireSparksAnimation) {
        // Stop current animation
        this.fireSparksAnimation.stop()
        
        // Restart after short delay to allow layout to settle
        setTimeout(async () => {
          this.fireSparksAnimation = new FireSparksAnimation()
          await this.fireSparksAnimation.init()
        }, 100)
      }
      
      // Chicken animation restart handled by EntranceAnimations class
    })
  }
  
  startHandTapping(hand) {
    const tapAnimation = () => {
      // Tap down
      const downAnimation = { rotateX: 0 }
      this.animate(downAnimation, { rotateX: 30 }, 300, this.easeOutQuad, (values) => {
        hand.style.transform = `scale(1) rotateX(${values.rotateX}deg)`
      }, () => {
        // Tap up
        const upAnimation = { rotateX: 30 }
        this.animate(upAnimation, { rotateX: 0 }, 300, this.easeOutQuad, (values) => {
          hand.style.transform = `scale(1) rotateX(${values.rotateX}deg)`
        }, () => {
          // Immediately start next tap
          tapAnimation()
        })
      })
    }
    
    // Start continuous tapping
    tapAnimation()
  }
  
}