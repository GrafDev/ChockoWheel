export class ChickenIdleAnimation {
  constructor() {
    this.element = null
    this.scaleX = 1
    this.isAnimating = false
  }
  
  init(element, scaleX = 1) {
    this.element = element
    this.scaleX = scaleX
  }
  
  start() {
    if (!this.element || this.isAnimating) return
    
    this.isAnimating = true
    this.continuousJumping()
  }
  
  stop() {
    this.isAnimating = false
  }
  
  continuousJumping() {
    if (!this.isAnimating) return
    
    // Make 5 quick jumps
    this.makeJumpSequence(5, () => {
      // Pause before next sequence
      setTimeout(() => {
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
}