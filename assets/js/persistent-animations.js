/**
 * Persistent Animations - постоянные анимации (логотипы, искры, курица)
 */

import { Logo1BounceAnimation } from './logo1-bounce-animation.js'
import { Logo2FlameAnimation } from './logo2-flame-animation.js'
import { FireSparksAnimation } from './fire-sparks-animation.js'
import { ChickenRotationAnimation } from './chicken-rotation-animation.js'
import { ChickenIdleAnimation } from './chicken-idle-animation.js'
import { ChickenMouseTracking } from './chicken-mouse-tracking.js'

export class PersistentAnimations {
  constructor() {
    this.logo1BounceAnimation = null
    this.logo2FlameAnimation = null
    this.fireSparksAnimation = null
    this.chickenRotationAnimation = null
    this.chickenIdleAnimation = null
    this.chickenMouseTracking = null
    this.handTappingActive = false
    this.resizeTimeout = null
  }

  async init() {
    try {

      // Initialize Logo1 Bounce Animation
      this.logo1BounceAnimation = new Logo1BounceAnimation()
      if (this.logo1BounceAnimation.init()) {
        this.logo1BounceAnimation.start()
      }
      
      // Initialize Logo2 Flame Animation
      this.logo2FlameAnimation = new Logo2FlameAnimation()
      if (await this.logo2FlameAnimation.init()) {
        this.logo2FlameAnimation.start()
      }

      // Initialize Fire Sparks Animation
      this.fireSparksAnimation = new FireSparksAnimation()
      await this.fireSparksAnimation.init()

      // Initialize Chicken Rotation Animation
      this.chickenRotationAnimation = new ChickenRotationAnimation()
      if (this.chickenRotationAnimation.init()) {
        this.chickenRotationAnimation.start()
      }

      // Initialize Chicken Idle Animation (jumping + part3)
      this.chickenIdleAnimation = new ChickenIdleAnimation()
      const chickenElement = document.querySelector('.chicken-container')
      if (chickenElement) {
        const scaleX = this.getChickenScaleX()
        this.chickenIdleAnimation.init(chickenElement, scaleX)
        this.chickenIdleAnimation.start()
      }

      // Initialize Chicken Mouse Tracking (head follows mouse)
      this.chickenMouseTracking = new ChickenMouseTracking()
      if (this.chickenMouseTracking.init()) {
        this.chickenMouseTracking.start()
      }

      // Hand tapping animation will be started after entrance animation completes

      return true
    } catch (error) {
      console.error('Failed to initialize persistent animations:', error)
      return false
    }
  }

  stop() {
    if (this.logo1BounceAnimation) {
      this.logo1BounceAnimation.stop()
    }
    if (this.logo2FlameAnimation) {
      this.logo2FlameAnimation.stop()
    }
    if (this.fireSparksAnimation) {
      this.fireSparksAnimation.stop()
    }
    if (this.chickenRotationAnimation) {
      this.chickenRotationAnimation.stop()
    }
    if (this.chickenIdleAnimation) {
      this.chickenIdleAnimation.stop()
    }
    if (this.chickenMouseTracking) {
      this.chickenMouseTracking.stop()
    }
    this.stopHandTapping()
  }

  resize() {
    // Clear previous timeout to debounce resize events
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout)
    }
    
    this.resizeTimeout = setTimeout(() => {
      if (this.logo2FlameAnimation && this.logo2FlameAnimation.resize) {
        this.logo2FlameAnimation.resize()
      }
      if (this.fireSparksAnimation && this.fireSparksAnimation.resize) {
        this.fireSparksAnimation.resize()
      }
      
      // Update chicken scale when window resizes
      if (this.chickenIdleAnimation) {
        const chickenElement = document.querySelector('.chicken-container')
        if (chickenElement) {
          const scaleX = this.getChickenScaleX()
          // Stop current animation
          this.chickenIdleAnimation.stop()
          // Reinitialize with new scaleX
          this.chickenIdleAnimation.init(chickenElement, scaleX)
          // Restart animation
          this.chickenIdleAnimation.start()
        }
      }
      
    }, 200) // Wait 200ms after last resize event
  }

  startHandTapping() {
    const hands = [
      document.querySelector('.hand-pointer'),
      ...document.querySelectorAll('.hand-pointer')
    ].filter(Boolean)
    
    
    if (hands.length === 0) return
    
    this.handTappingActive = true
    
    hands.forEach(hand => {
      this.animateHandTapping(hand)
      this.setupHandHover(hand)
    })
  }

  stopHandTapping() {
    this.handTappingActive = false
  }

  animateHandTapping(hand) {
    if (!this.handTappingActive) return
    
    const tapAnimation = () => {
      if (!this.handTappingActive) return
      
      // Tap down
      const downAnimation = { rotateX: 0 }
      this.animate(downAnimation, { rotateX: 30 }, 300, this.easeOutQuad, (values) => {
        if (!this.handTappingActive) return
        hand.style.transform = `scale(1) rotateX(${values.rotateX}deg)`
      }, () => {
        if (!this.handTappingActive) return
        // Tap up
        const upAnimation = { rotateX: 30 }
        this.animate(upAnimation, { rotateX: 0 }, 300, this.easeOutQuad, (values) => {
          if (!this.handTappingActive) return
          hand.style.transform = `scale(1) rotateX(${values.rotateX}deg)`
        }, () => {
          // Continue tapping if still active
          if (this.handTappingActive) {
            setTimeout(tapAnimation, 100)
          }
        })
      })
    }
    
    // Start tapping
    tapAnimation()
  }

  easeOutQuad(t) {
    return 1 - (1 - t) * (1 - t)
  }

  animate(obj, target, duration, easing = this.easeOutQuad, onUpdate = null, onComplete = null) {
    const startTime = Date.now()
    const startValues = { ...obj }
    
    const update = () => {
      if (!this.handTappingActive && onUpdate) return
      
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easing(progress)
      
      Object.keys(target).forEach(key => {
        obj[key] = startValues[key] + (target[key] - startValues[key]) * easedProgress
      })
      
      if (onUpdate) onUpdate(obj)
      
      if (progress < 1 && this.handTappingActive) {
        requestAnimationFrame(update)
      } else {
        if (onComplete) onComplete()
      }
    }
    
    requestAnimationFrame(update)
  }

  setupHandHover(hand) {
    // Find spin buttons to detect hover
    const spinButtons = [
      document.querySelector('.spin-btn'),
      document.querySelector('.spin-btn-landscape')
    ].filter(Boolean)
    
    spinButtons.forEach(button => {
      if (!button) return
      
      // Mouse enter - make hand semi-transparent
      button.addEventListener('mouseenter', () => {
        hand.style.transition = 'opacity 0.3s ease'
        hand.style.opacity = '0.3'
      })
      
      // Mouse leave - restore full opacity
      button.addEventListener('mouseleave', () => {
        hand.style.transition = 'opacity 0.3s ease'
        hand.style.opacity = '1'
      })
    })
  }

  getChickenScaleX() {
    const isMobile = window.innerWidth <= 667
    const isTablet = window.innerWidth <= 1400 && window.innerWidth > 667
    const isLandscape = window.innerWidth > window.innerHeight
    
    // Move from RIGHT in: mobile (any orientation) OR tablet portrait
    const moveFromRight = isMobile || (isTablet && !isLandscape)
    
    // Flip chicken only when moving from right (opposite to movement direction)
    return moveFromRight ? -1 : 1
  }
}