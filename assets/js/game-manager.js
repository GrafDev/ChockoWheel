import { setupDevPanel } from './dev-panel.js'
import { SimpleEntranceAnimations } from './simple-entrance-animations.js'

export class GameManager {
  constructor() {
    this.currentPage = 'wheelPage'
    this.currentRegion = 'eu'
    this.isDevelopment = import.meta.env.DEV
    this.isSpinning = false
    this.isReady = false
    this.entranceAnimations = null
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
    
    // Start entrance animations
    this.entranceAnimations = new SimpleEntranceAnimations()
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
      console.log('Spin blocked - already spinning or not ready')
      return
    }
    
    this.isSpinning = true
    console.log('Starting wheel spin...')
    
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
        console.log('Wheel stopped at', finalPosition, 'degrees')
      }
    }
    
    animate()
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
      
      console.log(`Region updated to: ${newRegion}`)
    }
  }

  updateRegionContent(region) {
    // Update counter, currency displays, etc. based on region
    // This will be implemented later
    console.log(`Updating content for region: ${region}`)
  }

  destroy() {
    // Cleanup event listeners if needed
  }
}