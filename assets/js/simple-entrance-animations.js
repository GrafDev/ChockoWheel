import { FireSparksAnimation } from './fire-sparks-animation.js'
import { ChickenIdleAnimation } from './chicken-idle-animation.js'

export class SimpleEntranceAnimations {
  constructor() {
    this.isReady = false
    this.activeAnimations = []
    this.fireSparksAnimation = null
    this.chickenIdleAnimation = null
  }
  
  async start(onComplete) {
    console.log('Starting simple entrance animations...')
    
    // Initialize and start fire sparks animation
    this.fireSparksAnimation = new FireSparksAnimation()
    await this.fireSparksAnimation.init()
    
    // Initialize chicken idle animation
    this.chickenIdleAnimation = new ChickenIdleAnimation()
    
    
    // Start all animations simultaneously
    this.animateHeader()
    this.animateBox1()
    this.animateWheelContainer()
    this.animateWheelWrapper()
    this.animateWheelCenter()
    this.animateChicken()
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
    const element = document.querySelector('.box1 img')
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
  
  animateChicken() {
    const element = document.querySelector('.box2 img')
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
    const jumpDuration = 150 // ms per jump (even faster)
    let currentJump = 0
    let currentX = startX
    
    const makeJump = () => {
      if (currentJump >= totalJumps) {
        element.style.setProperty('transform', `translateX(0px) translateY(0px) scaleX(${scaleX})`, 'important')
        setTimeout(() => {
          this.chickenFinalBounces(element, scaleX, () => {
            // Start continuous jumping after entrance animation
            this.chickenIdleAnimation.init(element, scaleX)
            this.chickenIdleAnimation.start()
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
          setTimeout(makeJump, 20) // Even smaller pause between jumps
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
      
      // Restart chicken animation on resize/orientation change
      setTimeout(() => {
        this.animateChicken()
      }, 200)
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