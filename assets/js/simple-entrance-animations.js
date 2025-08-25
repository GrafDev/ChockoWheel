// FireSparksAnimation will be available globally

export class SimpleEntranceAnimations {
  constructor() {
    this.isReady = false
    this.activeAnimations = []
    this.fireSparksAnimation = null
  }
  
  async start(onComplete) {
    console.log('Starting simple entrance animations...')
    
    // Initialize and start fire sparks animation
    if (typeof FireSparksAnimation !== 'undefined') {
      this.fireSparksAnimation = new FireSparksAnimation()
      await this.fireSparksAnimation.init()
    }
    
    // Start all animations simultaneously
    this.animateHeader()
    this.animateBox1()
    this.animateWheelContainer()
    this.animateWheelWrapper()
    this.animateWheelCenter()
    this.animateChicken()
    this.animateSpinButtons()
    
    // Complete after longest animation (chicken = ~1.5s + bounces)
    setTimeout(() => {
      this.isReady = true
      console.log('All entrance animations completed')
      if (onComplete) onComplete()
    }, 2500)
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
    element.style.transform = 'scale(0.8)'
    
    const animation = { opacity: 0, scale: 0.8 }
    this.animate(animation, { opacity: 1, scale: 1 }, 600, this.easeOutBack, (values) => {
      element.style.opacity = values.opacity
      element.style.transform = `scale(${values.scale})`
    })
  }
  
  animateWheelWrapper() {
    const element = document.querySelector('.wheel-wrapper')
    if (!element) return
    
    element.style.opacity = '0'
    element.style.transform = 'translate(-50%, -50%) scale(0) rotate(-360deg)'
    
    const animation = { opacity: 0, scale: 0, rotation: -360 }
    this.animate(animation, { opacity: 1, scale: 1, rotation: 0 }, 1200, this.easeOutBack, (values) => {
      element.style.opacity = values.opacity
      element.style.transform = `translate(-50%, -50%) scale(${values.scale}) rotate(${values.rotation}deg)`
    })
  }
  
  animateWheelCenter() {
    // Wheel center should be static - no animation
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
        setTimeout(() => this.chickenFinalBounces(element, scaleX), 100)
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
  
  chickenFinalBounces(element, scaleX = 1) {
    const bounces = [
      { y: -10, duration: 200 },
      { y: 0, duration: 100 },
      { y: -12, duration: 100 },
      { y: 0, duration: 100 },
      { y: -8, duration: 100 },
      { y: 0, duration: 100 }
    ]
    
    let delay = 0
    bounces.forEach(bounce => {
      setTimeout(() => {
        const animation = { y: parseFloat(element.style.transform.match(/translateY\(([^)]+)px\)/)?.[1] || 0) }
        this.animate(animation, { y: bounce.y }, bounce.duration, this.easeOutQuad, (values) => {
          const currentX = element.style.transform.match(/translateX\(([^)]+)px\)/)?.[1] || 0
          element.style.setProperty('transform', `translateX(${currentX}px) translateY(${values.y}px) scaleX(${scaleX})`, 'important')
        })
      }, delay)
      delay += bounce.duration
    })
  }
  
  animateSpinButtons() {
    const elements = [
      document.querySelector('.spin-btn'),
      document.querySelector('.spin-btn-landscape')
    ].filter(Boolean)
    
    elements.forEach(element => {
      element.style.opacity = '0'
      element.style.transform = 'scale(0.9)'
      element.style.filter = 'blur(3px) brightness(2)'
      
      const animation = { opacity: 0, scale: 0.9, blur: 3, brightness: 2 }
      this.animate(animation, { opacity: 1, scale: 1, blur: 0, brightness: 1 }, 1000, this.easeOutQuad, (values) => {
        element.style.opacity = values.opacity
        element.style.transform = `scale(${values.scale})`
        element.style.filter = `blur(${values.blur}px) brightness(${values.brightness})`
      })
    })
  }
}