
/**
 * Entrance Animations - анимации появления элементов
 */

export class EntranceAnimations {
  constructor() {
    this.isReady = false
  }
  
  async start(onComplete) {
    
    // Start all entrance animations
    this.animateHeader()
    this.animateSpinButtons()
    this.animateLogo2()
    this.animateWheel()
    this.animateChicken()
    this.animateHandAppearance()
    
    // Complete after 1 second - button becomes active
    setTimeout(() => {
      this.isReady = true
      this.enableSpinButton()
      if (onComplete) onComplete()
    }, 1000)
    
    // Handle window resize to restart chicken
    this.setupResizeHandler()
  }
  
  animateHeader() {
    const element = document.querySelector('.header')
    if (!element) {
      console.warn('Header element not found for entrance animation')
      return
    }
    
    // Start from above screen
    element.style.transform = 'translateY(-100%)'
    element.style.opacity = '1'
    
    // Slide down animation
    const animation = { y: -100 }
    this.animate(animation, { y: 0 }, 800, this.easeOutQuad, (values) => {
      element.style.transform = `translateY(${values.y}%)`
    })
    
  }

  animateSpinButtons() {
    const button = document.querySelector('.game-content .spin-btn')
    if (!button) {
      console.warn('Spin button not found for entrance animation')
      return
    }
    
    // Set button as disabled initially
    button.disabled = true
    
    // Start animation immediately - CSS already sets initial state
    const animation = { opacity: 0, scale: 0 }
    this.animate(animation, { opacity: 1, scale: 1 }, 400, this.easeOutBack, (values) => {
      button.style.opacity = values.opacity
      button.style.transform = `scale(${values.scale})`
    }, () => {
      // Add visible class to maintain shown state
      button.classList.add('visible')
      // Reset inline styles to allow CSS control
      button.style.opacity = ''
      button.style.transform = ''
    })
    
  }

  enableSpinButton() {
    const button = document.querySelector('.game-content .spin-btn')
    if (button) {
      button.disabled = false
    }
  }

  easeOutQuad(t) {
    return 1 - (1 - t) * (1 - t)
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
  
  animateLogo2() {
    const element = document.querySelector('.logo2')
    if (!element) {
      console.warn('Logo2 element not found for entrance animation')
      return
    }
    
    // Force visibility and start animation
    element.style.opacity = '0'
    
    // Animate logo2 container and all its images
    const logo2Images = element.querySelectorAll('img')
    logo2Images.forEach(img => {
      img.style.opacity = '0'
    })
    
    // Fade in animation for container and images
    const animation = { opacity: 0 }
    this.animate(animation, { opacity: 1 }, 600, this.easeOutQuad, (values) => {
      element.style.opacity = values.opacity
      logo2Images.forEach(img => {
        img.style.opacity = values.opacity
      })
    })
    
  }

  animateWheel() {
    const element = document.querySelector('.wheel-container')
    if (!element) {
      console.warn('Wheel container element not found for entrance animation')
      return
    }
    
    // Start with opacity 0 and small scale
    element.style.opacity = '0'
    element.style.transform = 'scale(0.5)'
    
    // Scale up and fade in animation
    const animation = { opacity: 0, scale: 0.5 }
    this.animate(animation, { opacity: 1, scale: 1 }, 800, this.easeOutBack, (values) => {
      element.style.opacity = values.opacity
      element.style.transform = `scale(${values.scale})`
    }, () => {
      // Reset transform to avoid conflicts with existing wheel animations
      element.style.transform = 'scale(1)'
    })
    
  }
  
  animateChicken() {
    const element = document.querySelector('.chicken-container')
    if (!element) return
    
    const isMobile = window.innerWidth <= 667
    const isTablet = window.innerWidth <= 1400 && window.innerWidth > 667
    const isLandscape = window.innerWidth > window.innerHeight
    
    // Move from RIGHT in: mobile (any orientation) OR tablet portrait
    const moveFromRight = isMobile || (isTablet && !isLandscape)
    
    const startX = moveFromRight ? window.innerWidth + 200 : -(window.innerWidth + 200)
    
    // Flip chicken only when moving from right (opposite to movement direction)
    const scaleX = moveFromRight ? -1 : 1
    
    // Make chicken visible and set initial position
    element.style.setProperty('opacity', '1', 'important')
    element.style.setProperty('transform', `translateX(${startX}px) translateY(0px) scaleX(${scaleX})`, 'important')
    
    const animation = { x: startX, y: 0 }
    let startTime = Date.now()
    
    // Chicken hops in discrete steps
    const totalJumps = 8
    const jumpDistance = Math.abs(startX) / totalJumps
    const jumpDuration = 150 // ms per jump
    let currentJump = 0
    let currentX = startX
    
    const makeJump = () => {
      if (currentJump >= totalJumps) {
        element.style.setProperty('transform', `translateX(0px) translateY(0px) scaleX(${scaleX})`, 'important')
        setTimeout(() => {
          this.chickenFinalBounces(element, scaleX, () => {
            // Entrance animation complete - persistent animations handle continuous jumping
          })
        }, 100)
        return
      }
      
      // Calculate next position
      const targetX = moveFromRight ? 
        startX - (jumpDistance * (currentJump + 1)) :
        startX + (jumpDistance * (currentJump + 1))
      
      // Jump animation
      const jumpStart = Date.now()
      const animateJump = () => {
        const elapsed = Date.now() - jumpStart
        const progress = Math.min(elapsed / jumpDuration, 1)
        
        const jumpHeight = Math.sin(progress * Math.PI) * 25
        const x = currentX + (targetX - currentX) * progress
        
        element.style.transform = `translateX(${x}px) translateY(${-jumpHeight}px) scaleX(${scaleX})`
        element.style.setProperty('transform', `translateX(${x}px) translateY(${-jumpHeight}px) scaleX(${scaleX})`, 'important')
        
        if (progress < 1) {
          requestAnimationFrame(animateJump)
        } else {
          currentX = targetX
          currentJump++
          setTimeout(makeJump, 20) // Small pause between jumps
        }
      }
      
      animateJump()
    }
    
    makeJump()
  }
  
  chickenFinalBounces(element, scaleX = 1, onComplete = null) {
    const bounces = [
      { y: -10, duration: 200 },
      { y: 0, duration: 100 },
      { y: -12, duration: 100 },
      { y: 0, duration: 100 },
      { y: -8, duration: 100 },
      { y: 0, duration: 100 }
    ]
    
    let delay = 0
    bounces.forEach((bounce, index) => {
      setTimeout(() => {
        const animation = { y: parseFloat(element.style.transform.match(/translateY\(([^)]+)px\)/)?.[1] || 0) }
        this.animate(animation, { y: bounce.y }, bounce.duration, this.easeOutQuad, (values) => {
          const currentX = element.style.transform.match(/translateX\(([^)]+)px\)/)?.[1] || 0
          element.style.setProperty('transform', `translateX(${currentX}px) translateY(${values.y}px) scaleX(${scaleX})`, 'important')
        }, () => {
          // Call onComplete after last bounce
          if (index === bounces.length - 1 && onComplete) {
            onComplete()
          }
        })
      }, delay)
      delay += bounce.duration
    })
  }
  
  setupResizeHandler() {
    window.addEventListener('resize', () => {
      // Restart chicken animation on resize/orientation change
      setTimeout(() => {
        this.animateChicken()
      }, 200)
    })
  }

  animateHandAppearance() {
    const hands = [
      document.querySelector('.hand-pointer'),
      ...document.querySelectorAll('.hand-pointer')
    ].filter(Boolean)
    
    hands.forEach(hand => {
      hand.style.opacity = '0'
      hand.style.transform = 'scale(2.5)'
      
      const animation = { opacity: 0, scale: 2.5 }
      // Start immediately, no delay
      this.animate(animation, { opacity: 1, scale: 1 }, 800, this.easeOutBack, (values) => {
        hand.style.opacity = values.opacity
        hand.style.transform = `scale(${values.scale})`
      }, () => {
        // Start persistent hand tapping animation
        if (window.persistentAnimations) {
          window.persistentAnimations.startHandTapping()
        }
      })
    })
  }

  easeOutBack(t) {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  }
}