import { gsap } from 'gsap'

export class ChickenRotationAnimation {
  constructor() {
    this.part2Element = null
    this.animation = null
    this.isAnimating = false
  }
  
  init() {
    this.part2Element = document.querySelector('.chicken-part2')
    
    if (!this.part2Element) {
      console.warn('Chicken part 2 element not found')
      return false
    }
    
    return true
  }
  
  start() {
    if (!this.part2Element) {
      console.warn('Cannot start animation: missing element')
      return
    }
    
    // Set transform origin to center for rotation
    gsap.set(this.part2Element, {
      transformOrigin: "center center"
    })
    
    this.isAnimating = true
    this.animateRandomRotation()
  }
  
  animateRandomRotation() {
    if (!this.isAnimating) return
    
    // Generate random angle between 0 and 360 degrees with minimum 70 degree change
    const currentRotation = gsap.getProperty(this.part2Element, "rotation") || 0
    let randomAngle
    
    do {
      randomAngle = Math.random() * 360
    } while (Math.abs(randomAngle - currentRotation) < 70)
    
    // Rotate to the random angle
    this.animation = gsap.to(this.part2Element, {
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
  
  stop() {
    this.isAnimating = false
    if (this.animation) {
      this.animation.kill()
      this.animation = null
    }
  }
  
  pause() {
    this.isAnimating = false
    if (this.animation) {
      this.animation.pause()
    }
  }
  
  resume() {
    this.isAnimating = true
    if (this.animation) {
      this.animation.resume()
    } else {
      this.animateRandomRotation()
    }
  }
}