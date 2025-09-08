export class ChickenIdleAnimation {
  constructor() {
    this.element = null
    this.part3Element = null
    this.scaleX = 1
    this.isAnimating = false
    this.animationTimeout = null
  }
  
  init(element, scaleX = 1) {
    this.element = element
    this.part3Element = document.querySelector('.chicken-part3')
    this.scaleX = scaleX
  }
  
  start() {
    if (!this.element) return
    
    // Stop any existing animation first
    this.stop()
    
    this.isAnimating = true
    this.continuousJumping()
  }
  
  stop() {
    this.isAnimating = false
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout)
      this.animationTimeout = null
    }
  }
  
  continuousJumping() {
    if (!this.isAnimating) return
    
    // Make 5 quick jumps
    this.makeJumpSequence(5, () => {
      // Pause before next sequence
      this.animationTimeout = setTimeout(() => {
        this.continuousJumping()
      }, 2000) // 2 second pause
    })
  }
  
  makeJumpSequence(jumpCount, onComplete) {
    let currentJump = 0
    
    const doJump = () => {
      if (currentJump >= jumpCount) {
        if (onComplete) onComplete()
        return
      }
      
      // Jump up
      this.animateJump(-25, 100, () => {
        // Jump down
        this.animateJump(0, 80, () => {
          currentJump++
          setTimeout(() => doJump(), 60) // Small pause between jumps
        })
      })
      
      // Animate part3 upward during jump
      if (this.part3Element) {
        this.animatePart3Jump()
      }
    }
    
    doJump()
  }
  
  animateJump(targetY, duration, onComplete) {
    const startY = this.getCurrentY()
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = this.easeOutQuad(progress)
      
      const currentY = startY + (targetY - startY) * easedProgress
      const currentX = this.getCurrentX()
      
      this.element.style.setProperty(
        'transform', 
        `translateX(${currentX}px) translateY(${currentY}px) scaleX(${this.scaleX})`, 
        'important'
      )
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else if (onComplete) {
        onComplete()
      }
    }
    
    requestAnimationFrame(animate)
  }
  
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
  
  animatePart3Jump() {
    if (!this.part3Element) return
    
    const startTime = Date.now()
    const jumpDuration = 240 // Total jump duration (up and down) - match main animation timing
    const maxHeight = -15 // Maximum upward movement
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / jumpDuration, 1)
      
      // Create a bounce curve: up then down
      let yOffset = 0
      if (progress <= 0.5) {
        // Going up (first half)
        const upProgress = progress * 2 // 0 to 1
        yOffset = maxHeight * this.easeOutQuad(upProgress)
      } else {
        // Coming down (second half)
        const downProgress = (progress - 0.5) * 2 // 0 to 1
        yOffset = maxHeight * (1 - this.easeOutQuad(downProgress))
      }
      
      // Apply transform
      const currentTransform = this.part3Element.style.transform || ''
      const newTransform = currentTransform.includes('translateY')
        ? currentTransform.replace(/translateY\([^)]*\)/, `translateY(${yOffset}px)`)
        : currentTransform + ` translateY(${yOffset}px)`
      
      this.part3Element.style.transform = newTransform
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    
    requestAnimationFrame(animate)
  }
}