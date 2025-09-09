import { gsap } from 'gsap'

export class Logo1BounceAnimation {
  constructor() {
    this.element = null
    this.part3Element = null
    this.bounceAnimation = null
    this.brightnessAnimation = null
    this.part3Animation = null
    this.bounceCount = 0
  }
  
  init() {
    this.element = document.querySelector('.logo1-animated-parts')
    this.part3Element = document.querySelector('.logo1-part3')
    
    if (!this.element) {
      console.warn('Logo1 animated parts container not found')
      return false
    }
    
    if (!this.part3Element) {
      console.warn('Logo1-part3 element not found')
      return false
    }
    
    return true
  }
  
  start() {
    if (!this.element) {
      console.warn('Cannot start animation: missing element')
      return
    }
    
    // Set initial state
    gsap.set(this.element, {
      transformOrigin: "center bottom",
      filter: "brightness(1)"
    })
    
    // Set part3 initial state (hidden)
    gsap.set(this.part3Element, {
      opacity: 0
    })
    
    this.bounceCount = 0
    
    // Create bounce animation with callback to track bounces
    this.bounceAnimation = gsap.timeline({ repeat: -1 })
      .to(this.element, {
        y: -5,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          this.bounceCount++
          if (this.bounceCount === 9) {
            this.showPart3()
          }
        }
      })
      .to(this.element, {
        y: 0,
        duration: 0.4,
        ease: "power2.in"
      })
    
    // Create brightness animation using fromTo for explicit control
    this.brightnessAnimation = gsap.fromTo(this.element, 
      { filter: "brightness(1)" },
      { 
        filter: "brightness(1.4)",
        duration: 2,
        ease: "power2.inOut", 
        yoyo: true,
        repeat: -1
      }
    )
  }
  
  showPart3() {
    // Show part3 with fade in for 1 bounce duration
    this.part3Animation = gsap.to(this.part3Element, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.inOut",
      onComplete: () => {
        // Hide both part2 and part3 together
        gsap.to(this.element, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.inOut",
          onComplete: () => {
            // Wait 0.5 seconds then show them again
            gsap.delayedCall(0.5, () => {
              // Show the container back (part2 visible)
              gsap.to(this.element, {
                opacity: 1,
                duration: 0.8,
                ease: "power2.inOut"
              })
              // Hide part3 again
              gsap.to(this.part3Element, {
                opacity: 0,
                duration: 0.1
              })
            })
          }
        })
      }
    })
    
    // Reset bounce count for next cycle
    this.bounceCount = 0
  }
  
  stop() {
    if (this.bounceAnimation) {
      this.bounceAnimation.kill()
      this.bounceAnimation = null
    }
    
    if (this.brightnessAnimation) {
      this.brightnessAnimation.kill()
      this.brightnessAnimation = null
    }
    
    if (this.part3Animation) {
      this.part3Animation.kill()
      this.part3Animation = null
    }
    
    // Reset elements to original state
    if (this.element) {
      gsap.set(this.element, {
        y: 0,
        filter: "brightness(1)"
      })
    }
    
    if (this.part3Element) {
      gsap.set(this.part3Element, {
        opacity: 0
      })
    }
    
    this.bounceCount = 0
  }
  
  pause() {
    if (this.bounceAnimation) {
      this.bounceAnimation.pause()
    }
    if (this.brightnessAnimation) {
      this.brightnessAnimation.pause()
    }
    if (this.part3Animation) {
      this.part3Animation.pause()
    }
  }
  
  resume() {
    if (this.bounceAnimation) {
      this.bounceAnimation.resume()
    }
    if (this.brightnessAnimation) {
      this.brightnessAnimation.resume()
    }
    if (this.part3Animation) {
      this.part3Animation.resume()
    }
  }
}