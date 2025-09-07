
/**
 * Entrance Animations - анимации появления элементов
 */

export class EntranceAnimations {
  constructor() {
    this.isReady = false
  }
  
  async start(onComplete) {
    console.log('Starting entrance animations...')
    
    // Start all entrance animations
    this.animateLogo2()
    this.animateChicken()
    this.animateHandAppearance()
    
    // Complete after chicken animation (~1.5s + bounces)
    setTimeout(() => {
      this.isReady = true
      console.log('All entrance animations completed')
      if (onComplete) onComplete()
    }, 2500)
    
    // Handle window resize to restart chicken
    this.setupResizeHandler()
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
    
    // Start with opacity 0
    element.style.opacity = '0'
    
    // Fade in animation
    const animation = { opacity: 0 }
    this.animate(animation, { opacity: 1 }, 800, this.easeOutQuad, (values) => {
      element.style.opacity = values.opacity
    })
    
    console.log('Logo2 entrance animation started')
  }
  
  animateChicken() {
    const element = document.querySelector('.chicken-container')
    if (!element) return
    
    const isMobile = window.innerWidth <= 667
    const isTablet = window.innerWidth <= 1400 && window.innerWidth > 667
    const isLandscape = window.innerWidth > window.innerHeight
    
    // Move from RIGHT in: mobile landscape OR tablet portrait
    const moveFromRight = (isMobile && isLandscape) || (isTablet && !isLandscape)
    
    console.log('DEVICE CHECK:', {
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      isMobile,
      isTablet,
      isLandscape,
      moveFromRight
    })
    const startX = moveFromRight ? window.innerWidth + 200 : -(window.innerWidth + 200)
    
    // Flip chicken only when moving from right (opposite to movement direction)
    const scaleX = moveFromRight ? -1 : 1
    
    console.log('CHICKEN DEBUG:', {
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      isMobile: isMobile,
      isTablet: isTablet,
      isLandscape: isLandscape,
      moveFromRight: moveFromRight,
      scaleX: scaleX,
      startX: startX
    })
    
    element.style.transform = `translateX(${startX}px) translateY(0px) scaleX(${scaleX})`
    
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
            console.log('Chicken entrance animation complete')
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
    
    console.log('Found hands for animation:', hands.length)
    
    hands.forEach(hand => {
      hand.style.opacity = '0'
      hand.style.transform = 'scale(2.5)'
      
      const animation = { opacity: 0, scale: 2.5 }
      setTimeout(() => {
        this.animate(animation, { opacity: 1, scale: 1 }, 1000, this.easeOutBack, (values) => {
          hand.style.opacity = values.opacity
          hand.style.transform = `scale(${values.scale})`
        }, () => {
          console.log('Hand appearance animation complete')
          // Start persistent hand tapping animation
          if (window.persistentAnimations) {
            window.persistentAnimations.startHandTapping()
          }
        })
      }, 600)
    })
  }

  easeOutBack(t) {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  }
}