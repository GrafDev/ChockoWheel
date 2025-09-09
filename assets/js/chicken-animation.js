import { gsap } from 'gsap'

export class ChickenAnimation {
  constructor() {
    this.element = null
    this.part2Element = null
    this.part3Element = null
    this.scaleX = 1
    this.isIdleAnimating = false
    this.isRotationAnimating = false
    
    // Animation controls
    this.idleAnimationTimeout = null
    this.rotationAnimation = null
  }
  
  init(element, scaleX = 1) {
    this.element = element
    this.part2Element = document.querySelector('.chicken-part2')
    this.part3Element = document.querySelector('.chicken-part3')
    this.scaleX = scaleX
    
    if (!this.element) {
      console.warn('Chicken container element not found')
      return false
    }
    
    if (!this.part2Element) {
      console.warn('Chicken part2 element not found')
    }
    
    if (!this.part3Element) {
      console.warn('Chicken part3 element not found')
    }
    
    return true
  }
  
  // IDLE ANIMATION (jumping with part3 sync)
  startIdleAnimation() {
    if (!this.element) return
    
    this.stopIdleAnimation()
    this.isIdleAnimating = true
    this.continuousJumping()
  }
  
  stopIdleAnimation() {
    this.isIdleAnimating = false
    if (this.idleAnimationTimeout) {
      clearTimeout(this.idleAnimationTimeout)
      this.idleAnimationTimeout = null
    }
  }
  
  continuousJumping() {
    if (!this.isIdleAnimating) return
    
    // Make 5 quick jumps with synchronized part3
    this.makeJumpSequence(5, () => {
      // Pause before next sequence
      this.idleAnimationTimeout = setTimeout(() => {
        this.continuousJumping()
      }, 2000) // 2 second pause
    })
  }
  
  makeJumpSequence(jumpCount, onComplete) {
    let currentJump = 0
    
    const doJump = () => {
      if (currentJump >= jumpCount || !this.isIdleAnimating) {
        if (onComplete) onComplete()
        return
      }
      
      // Synchronize main body and part3 jump
      this.animateJumpWithPart3(() => {
        currentJump++
        setTimeout(() => doJump(), 60) // Small pause between jumps
      })
    }
    
    doJump()
  }
  
  animateJumpWithPart3(onComplete) {
    const jumpDuration = 100 // Up phase
    const downDuration = 80  // Down phase
    const jumpHeight = -25
    const part3JumpHeight = -15
    
    const baseY = 0 // Always jump from ground level
    const startTime = Date.now()
    
    // Phase 1: Jump up (both main body and part3)
    const animateUp = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / jumpDuration, 1)
      const easedProgress = this.easeOutQuad(progress)
      
      // Main body
      const currentY = baseY + jumpHeight * easedProgress
      const currentX = this.getCurrentX()
      this.element.style.setProperty(
        'transform', 
        `translateX(${currentX}px) translateY(${currentY}px) scaleX(${this.scaleX})`, 
        'important'
      )
      
      // Part3 synchronized movement
      if (this.part3Element) {
        const part3Y = part3JumpHeight * easedProgress
        this.updatePart3Transform(part3Y)
      }
      
      if (progress < 1) {
        requestAnimationFrame(animateUp)
      } else {
        // Phase 2: Jump down
        const downStartTime = Date.now()
        const animateDown = () => {
          const elapsed = Date.now() - downStartTime
          const progress = Math.min(elapsed / downDuration, 1)
          const easedProgress = this.easeOutQuad(progress)
          
          // Main body - return to base position
          const currentY = baseY + jumpHeight * (1 - easedProgress)
          const currentX = this.getCurrentX()
          this.element.style.setProperty(
            'transform', 
            `translateX(${currentX}px) translateY(${currentY}px) scaleX(${this.scaleX})`, 
            'important'
          )
          
          // Part3 synchronized movement - return to base
          if (this.part3Element) {
            const part3Y = part3JumpHeight * (1 - easedProgress)
            this.updatePart3Transform(part3Y)
          }
          
          if (progress < 1) {
            requestAnimationFrame(animateDown)
          } else if (onComplete) {
            onComplete()
          }
        }
        requestAnimationFrame(animateDown)
      }
    }
    
    requestAnimationFrame(animateUp)
  }
  
  updatePart3Transform(yOffset) {
    if (!this.part3Element) return
    
    const currentTransform = this.part3Element.style.transform || ''
    const newTransform = currentTransform.includes('translateY')
      ? currentTransform.replace(/translateY\([^)]*\)/, `translateY(${yOffset}px)`)
      : currentTransform + ` translateY(${yOffset}px)`
    
    this.part3Element.style.transform = newTransform
  }
  
  // ROTATION ANIMATION (part2 head)
  startRotationAnimation() {
    if (!this.part2Element) return
    
    this.stopRotationAnimation()
    
    // Set transform origin for rotation
    gsap.set(this.part2Element, {
      transformOrigin: "center center"
    })
    
    this.isRotationAnimating = true
    this.animateRandomRotation()
  }
  
  stopRotationAnimation() {
    this.isRotationAnimating = false
    if (this.rotationAnimation) {
      this.rotationAnimation.kill()
      this.rotationAnimation = null
    }
  }
  
  animateRandomRotation() {
    if (!this.isRotationAnimating) return
    
    // Generate random angle between 70 and 170 degrees
    const randomAngle = 70 + Math.random() * (170 - 70)
    
    // Rotate to the random angle
    this.rotationAnimation = gsap.to(this.part2Element, {
      rotation: randomAngle,
      duration: 0.3,
      ease: "power2.out",
      onComplete: () => {
        // Generate random delay between 0.2 and 0.7 seconds
        const randomDelay = Math.random() * (0.7 - 0.2) + 0.2
        
        setTimeout(() => {
          this.animateRandomRotation()
        }, randomDelay * 1000)
      }
    })
  }
  
  pauseRotationAnimation() {
    this.isRotationAnimating = false
    if (this.rotationAnimation) {
      this.rotationAnimation.pause()
    }
  }
  
  resumeRotationAnimation() {
    this.isRotationAnimating = true
    if (this.rotationAnimation) {
      this.rotationAnimation.resume()
    } else {
      this.animateRandomRotation()
    }
  }
  
  
  // ENTRANCE ANIMATION (hopping from side)
  animateEntrance(moveFromRight = false, onComplete = null) {
    if (!this.element) return
    
    const startX = moveFromRight ? window.innerWidth + 200 : -(window.innerWidth + 200)
    const scaleX = moveFromRight ? -1 : 1
    
    // Make chicken visible and set initial position
    this.element.style.setProperty('opacity', '1', 'important')
    this.element.style.setProperty('transform', `translateX(${startX}px) translateY(0px) scaleX(${scaleX})`, 'important')
    
    // Chicken hops in discrete steps
    const totalJumps = 8
    const jumpDistance = Math.abs(startX) / totalJumps
    const jumpDuration = 150 // ms per jump
    let currentJump = 0
    let currentX = startX
    
    const makeJump = () => {
      if (currentJump >= totalJumps) {
        this.element.style.setProperty('transform', `translateX(0px) translateY(0px) scaleX(${scaleX})`, 'important')
        setTimeout(() => {
          this.entranceFinalBounces(scaleX, onComplete)
        }, 100)
        return
      }
      
      // Calculate next position
      const targetX = moveFromRight ? 
        startX - (jumpDistance * (currentJump + 1)) :
        startX + (jumpDistance * (currentJump + 1))
      
      // Jump animation with part3 sync
      this.animateEntranceJump(currentX, targetX, scaleX, jumpDuration, () => {
        currentX = targetX
        currentJump++
        setTimeout(makeJump, 20) // Small pause between jumps
      })
    }
    
    makeJump()
  }
  
  animateEntranceJump(currentX, targetX, scaleX, jumpDuration, onComplete) {
    const jumpStart = Date.now()
    const jumpHeight = 25
    const part3JumpHeight = -15
    
    const animateJump = () => {
      const elapsed = Date.now() - jumpStart
      const progress = Math.min(elapsed / jumpDuration, 1)
      
      const bodyJumpHeight = Math.sin(progress * Math.PI) * jumpHeight
      const x = currentX + (targetX - currentX) * progress
      
      // Main body
      this.element.style.setProperty(
        'transform', 
        `translateX(${x}px) translateY(${-bodyJumpHeight}px) scaleX(${scaleX})`, 
        'important'
      )
      
      // Part3 synchronized movement
      if (this.part3Element) {
        const part3Y = Math.sin(progress * Math.PI) * part3JumpHeight
        this.updatePart3Transform(part3Y)
      }
      
      if (progress < 1) {
        requestAnimationFrame(animateJump)
      } else if (onComplete) {
        onComplete()
      }
    }
    
    animateJump()
  }
  
  entranceFinalBounces(scaleX, onComplete) {
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
        const animation = { y: parseFloat(this.element.style.transform.match(/translateY\(([^)]+)px\)/)?.[1] || 0) }
        this.animate(animation, { y: bounce.y }, bounce.duration, this.easeOutQuad, (values) => {
          const currentX = this.element.style.transform.match(/translateX\(([^)]+)px\)/)?.[1] || 0
          this.element.style.setProperty('transform', `translateX(${currentX}px) translateY(${values.y}px) scaleX(${scaleX})`, 'important')
          
          // Sync part3 movement
          if (this.part3Element) {
            const part3Y = values.y * 0.6 // Part3 moves 60% of main body movement
            this.updatePart3Transform(part3Y)
          }
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
  
  // UTILITY METHODS
  getCurrentX() {
    const match = this.element.style.transform.match(/translateX\(([^)]+)px\)/)
    return match ? parseFloat(match[1]) : 0
  }
  
  getCurrentY() {
    const match = this.element.style.transform.match(/translateY\(([^)]+)px\)/)
    return match ? parseFloat(match[1]) : 0
  }
  
  easeOutQuad(t) {
    return 1 - (1 - t) * (1 - t)
  }
  
  easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3)
  }
  
  easeInCubic(t) {
    return t * t * t
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
  
  // CONTROL METHODS
  stopAll() {
    this.stopIdleAnimation()
    this.stopRotationAnimation()
  }
  
  destroy() {
    this.stopAll()
    this.element = null
    this.part2Element = null
    this.part3Element = null
  }
}