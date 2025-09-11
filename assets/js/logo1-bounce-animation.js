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
    this.updateElements()
    return true
  }

  updateElements() {
    // Find visible logo1 elements (not in hidden page)
    const allAnimatedParts = document.querySelectorAll('.logo1-animated-parts')
    const allPart3Elements = document.querySelectorAll('.logo1-part3')
    
    // Find the visible one
    this.element = null
    this.part3Element = null
    
    for (let i = 0; i < allAnimatedParts.length; i++) {
      if (allAnimatedParts[i].offsetParent !== null) {
        this.element = allAnimatedParts[i]
        this.part3Element = allPart3Elements[i]
        break
      }
    }
    
    if (!this.element) {
      console.warn('No visible logo1 animated parts container found')
      return false
    }
    
    if (!this.part3Element) {
      console.warn('No visible logo1-part3 element found')  
      return false
    }
    
    return true
  }
  
  start() {
    // Update elements to find currently visible ones
    if (!this.updateElements()) {
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
        // Move entire logo up off screen
        gsap.to(this.element, {
          y: -200, // Move far up off screen
          duration: 0.6,
          ease: "power2.in",
          onComplete: () => {
            // Switch parts while off screen
            gsap.set(this.part3Element, { opacity: 0 })
            
            // Move to top of screen and come back down with part2
            gsap.set(this.element, { y: -150 })
            gsap.to(this.element, {
              y: 0,
              duration: 0.8,
              ease: "power2.out"
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