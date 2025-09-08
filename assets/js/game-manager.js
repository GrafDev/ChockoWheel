import { setupDevPanel } from './dev-panel.js'
import { EntranceAnimations } from './entrance-animations.js'
import { ModalAnimation } from './modal-animation.js'
import { getModalImagePath, getWheelTextPath, getHeaderButtonPaths } from './config.js'

export class GameManager {
  constructor() {
    this.currentPage = 'wheelPage'
    this.currentRegion = 'eu'
    this.isDevelopment = import.meta.env.DEV
    this.isSpinning = false
    this.isReady = false
    this.entranceAnimations = null
    this.modalAnimation = null
    this.currentAnimationFrame = null
  }

  async init() {
    // Get region from localStorage or URL params or default
    this.currentRegion = this.getInitialRegion()

    // Setup page navigation
    this.setupPageNavigation()
    
    // Setup game interactions
    this.setupGameInteractions()

    // Setup dev panel
    if (this.isDevelopment) {
      setupDevPanel(this.currentRegion, (region) => this.updateRegion(region), this.isDevelopment)
    }

    // Show initial page
    this.showPage('wheelPage')
    
    // Update region content on init
    this.updateRegionContent(this.currentRegion)
    
    // Initialize modal animation
    this.modalAnimation = new ModalAnimation()
    await this.modalAnimation.init()
    
    // Start entrance animations
    this.entranceAnimations = new EntranceAnimations()
    await this.entranceAnimations.start(() => {
      this.isReady = true
    })
  }

  setupPageNavigation() {
    // Setup page switching logic
    this.pages = ['wheelPage', 'roadPage', 'bankPage', 'downloadPage']
  }

  setupGameInteractions() {
    // Setup spin button clicks
    this.setupSpinButtons()
    
    // Setup bonus modal
    this.setupBonusModal()
  }
  
  setupSpinButtons() {
    // Regular spin button
    const spinBtn = document.querySelector('.game-content .spin-btn')
    if (spinBtn) {
      spinBtn.addEventListener('click', () => this.handleSpin())
    }
    
    // Landscape spin button
    const spinBtnLandscape = document.querySelector('.box2 .spin-btn-landscape')
    if (spinBtnLandscape) {
      spinBtnLandscape.addEventListener('click', () => this.handleSpin())
    }
  }
  
  handleSpin() {
    if (this.isSpinning || !this.isReady) {
      return
    }
    
    this.isSpinning = true
    this.disableSpinButtons()
    
    // Fade out hand when spinning starts
    this.fadeOutHand()
    
    
    // Get wheel element
    const wheelElements = document.querySelectorAll('.wheel-wrapper')
    const wheelElement = wheelElements[0]
    
    if (!wheelElement) {
      console.warn('Wheel element not found')
      this.isSpinning = false
      return
    }
    
    // Get current rotation
    const currentRotation = this.getCurrentRotation(wheelElement)
    
    // Choose random target: 180 or 45 degrees
    const targetPositions = [180, 45]
    const targetPosition = targetPositions[Math.floor(Math.random() * targetPositions.length)]
    
    // Calculate target rotation (multiple full spins + target position + small overshoot)
    const fullSpins = 360 * 3 // 3 full spins
    const overshoot = 5 + Math.random() * 5 // 5-10 degrees overshoot
    const targetRotation = currentRotation + fullSpins + targetPosition + overshoot
    
    // Stop any existing animation
    if (this.currentAnimationFrame) {
      cancelAnimationFrame(this.currentAnimationFrame)
      this.currentAnimationFrame = null
    }
    
    // Animate rotation
    const finalTargetRotation = currentRotation + fullSpins + targetPosition // Exact target without overshoot
    this.animateWheelRotation(wheelElement, currentRotation, targetRotation, finalTargetRotation)
  }
  
  getCurrentRotation(element) {
    const style = element.style.transform
    if (style && style.includes('rotate(')) {
      const match = style.match(/rotate\(([^)]+)deg\)/)
      if (match) {
        return parseFloat(match[1])
      }
    }
    return 0
  }
  
  animateWheelRotation(element, startRotation, endRotation, finalTarget) {
    const duration = 3000 // 3 seconds
    const startTime = Date.now()
    
    const easeWithSpring = (t) => {
      if (t < 0.9) {
        // Normal ease out to overshoot position
        return 1 - Math.pow(1 - t / 0.9, 3)
      } else {
        // More visible spring back from overshoot to exact target
        const springT = (t - 0.9) / 0.1
        const overshootAmount = (endRotation - finalTarget) / (endRotation - startRotation)
        const bounce = Math.sin(springT * Math.PI * 3) * Math.pow(1 - springT, 1.5) // 1.5 oscillations
        
        // Start from full position, spring back with more visible bounce
        return 1 - overshootAmount * springT + bounce * overshootAmount * 1.2
      }
    }
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      const easedProgress = easeWithSpring(progress)
      const currentRotation = startRotation + (endRotation - startRotation) * easedProgress
      
      element.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`
      
      if (progress < 1) {
        this.currentAnimationFrame = requestAnimationFrame(animate)
      } else {
        this.currentAnimationFrame = null
        this.isSpinning = false
        const finalPosition = currentRotation % 360
        
        // Show bonus modal after wheel stops
        this.showBonusModal()
      }
    }
    
    animate()
  }
  
  setupBonusModal() {
    // Setup click handler for modal animation
    if (this.modalAnimation) {
      this.modalAnimation.handleClick(() => {
        this.hideBonusModal()
      })
      
      // Handle window resize
      window.addEventListener('resize', () => {
        if (this.modalAnimation) {
          this.modalAnimation.resize()
        }
        if (window.persistentAnimations) {
          window.persistentAnimations.resize()
        }
      })
    }
  }
  
  showBonusModal() {
    // Stop all animations
    this.stopAllAnimations()
    
    // Show modal with PixiJS animation
    if (this.modalAnimation) {
      const imagePath = getModalImagePath(this.currentRegion)
      this.modalAnimation.show(imagePath)
    }
  }

  stopAllAnimations() {
    // Stop global animations
    if (window.wheelLightAnimation) window.wheelLightAnimation.stop()
    if (window.fireSparksAnimation) window.fireSparksAnimation.stop()
    if (window.chickenRotationAnimation) window.chickenRotationAnimation.stop()
    if (window.logo1BounceAnimation) window.logo1BounceAnimation.stop()
    if (window.spinButtonBulgeAnimation) window.spinButtonBulgeAnimation.stop()
    if (window.canvasFlameDistortion) window.canvasFlameDistortion.stop()
    if (window.logo2FlameAnimation) window.logo2FlameAnimation.stop()
    
    // Stop all chicken animations
    if (window.chickenIdleAnimation) window.chickenIdleAnimation.stop()
    if (window.chickenMouseTracking) window.chickenMouseTracking.stop()
    
    // Stop hand tapping animation
    if (window.persistentAnimations) window.persistentAnimations.stopHandTapping()
    
  }
  
  hideBonusModal() {
    if (this.modalAnimation) {
      this.modalAnimation.hide(() => {
        // Reset spinning state and enable buttons for new spins
        this.isSpinning = false
        this.enableSpinButtons()
      })
    } else {
      // Fallback
      this.isSpinning = false
      this.enableSpinButtons()
    }
  }
  
  disableSpinButtons() {
    const spinBtn = document.querySelector('.game-content .spin-btn')
    const spinBtnLandscape = document.querySelector('.box2 .spin-btn-landscape')
    
    if (spinBtn) spinBtn.disabled = true
    if (spinBtnLandscape) spinBtnLandscape.disabled = true
  }
  
  enableSpinButtons() {
    const spinBtn = document.querySelector('.game-content .spin-btn')
    const spinBtnLandscape = document.querySelector('.box2 .spin-btn-landscape')
    
    if (spinBtn) spinBtn.disabled = false
    if (spinBtnLandscape) spinBtnLandscape.disabled = false
  }

  fadeOutHand() {
    const hands = [
      document.querySelector('.hand-pointer'),
      ...document.querySelectorAll('.hand-pointer')
    ].filter(Boolean)
    
    // Stop hand tapping animation first
    if (window.persistentAnimations) {
      window.persistentAnimations.stopHandTapping()
    }
    
    // Fade out all hands
    hands.forEach(hand => {
      hand.style.transition = 'opacity 0.5s ease-out'
      hand.style.opacity = '0'
    })
  }

  showPage(pageId) {
    // Hide all pages
    this.pages.forEach(id => {
      const page = document.getElementById(id)
      if (page) {
        page.style.display = 'none'
      }
    })
    
    // Show target page
    const targetPage = document.getElementById(pageId)
    if (targetPage) {
      targetPage.style.display = 'block'
      this.currentPage = pageId
    }
  }

  getInitialRegion() {
    // Priority: localStorage > URL param > env variable > default
    const savedRegion = localStorage.getItem('chockoWheel_region')
    const urlRegion = new URLSearchParams(window.location.search).get('region')
    const envRegion = import.meta.env.VITE_REGION
    
    return savedRegion || urlRegion || envRegion || 'eu'
  }

  async updateRegion(newRegion) {
    if (this.currentRegion !== newRegion) {
      this.currentRegion = newRegion
      
      // Update region-specific content in HTML
      this.updateRegionContent(newRegion)
      
      // Dev panel will automatically show new region
      
      // Save to localStorage
      localStorage.setItem('chockoWheel_region', newRegion)
      
    }
  }

  updateRegionContent(region) {
    // Update wheel text image for current region
    const wheelTextImage = document.querySelector('.wheel-text')
    if (wheelTextImage) {
      wheelTextImage.src = getWheelTextPath(region)
    }
    
    // Update header buttons for current region
    const headerButtonPaths = getHeaderButtonPaths(region)
    
    const headerBtn1 = document.querySelector('.header-btn-1')
    if (headerBtn1) {
      headerBtn1.src = headerButtonPaths.button1
    }
    
    const headerBtn2 = document.querySelector('.header-btn-2')
    if (headerBtn2) {
      headerBtn2.src = headerButtonPaths.button2
    }
    
    const headerBtn3 = document.querySelector('.header-btn-3')
    if (headerBtn3) {
      headerBtn3.src = headerButtonPaths.button3
    }
    
    // Update counter, currency displays, etc. based on region
  }

  destroy() {
    // Cleanup modal animation
    if (this.modalAnimation) {
      this.modalAnimation.destroy()
      this.modalAnimation = null
    }
    
    // Cleanup event listeners if needed
  }
}