import { gsap } from 'gsap'

export class SidewalkTreeAnimation {
  constructor() {
    this.targetElement = null
    this.isInitialized = false
  }

  init() {
    this.targetElement = document.querySelector('.sidewalk-base .sidewalk-part2')
    
    if (!this.targetElement) {
      console.warn('sidewalk-part2 element not found')
      return false
    }

    try {
      this.startSwayingAnimation()
      this.isInitialized = true
      return true
    } catch (error) {
      console.error('Failed to initialize tree animation:', error)
      return false
    }
  }

  startSwayingAnimation() {
    // Set transform origin to bottom center (like trees rooted at bottom)
    gsap.set(this.targetElement, {
      transformOrigin: "center bottom"
    })
    
    // Constant wind sway - continuous realistic movement
    this.createWindSway()
    
    // Add random gusts and calm periods
    this.addWindVariations()
  }
  
  createWindSway() {
    // Multiple overlapping sine waves for realistic wind movement - FASTER
    gsap.to(this.targetElement, {
      rotation: 2.5,
      duration: 1.5, // Faster from 3.2
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })
    
    // Secondary sway at different frequency - FASTER
    gsap.to(this.targetElement, {
      rotation: "-=1.8",
      duration: 2.2, // Faster from 4.7
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.5
    })
    
    // Tertiary micro-movements - FASTER
    gsap.to(this.targetElement, {
      rotation: "+=0.8",
      duration: 1.0, // Faster from 2.1
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 0.2
    })
    
    // Horizontal "breathing" from wind pressure - FASTER
    gsap.to(this.targetElement, {
      scaleX: 0.97,
      duration: 2.8, // Faster from 6.3
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })
    
    // Slight vertical movement (wind lifting branches) - FASTER
    gsap.to(this.targetElement, {
      y: -2,
      duration: 2.5, // Faster from 5.8
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })
  }
  
  addWindVariations() {
    this.addRandomGusts()
  }
  
  addRandomGusts() {
    const scheduleGust = () => {
      // Random interval between gusts (20-60 seconds - much longer)
      const delay = 20 + Math.random() * 40
      
      gsap.delayedCall(delay, () => {
        // Create gentle wind gust
        const gustStrength = 1.5 + Math.random() * 2 // Reduced from 3-7 to 1.5-3.5
        const gustDirection = Math.random() > 0.5 ? 1 : -1
        
        gsap.to(this.targetElement, {
          rotation: `+=${gustStrength * gustDirection}`,
          duration: 1.2, // Slower from 0.8
          ease: "power2.out",
          onComplete: () => {
            // Return to normal swaying
            gsap.to(this.targetElement, {
              rotation: 0,
              duration: 3, // Slower return
              ease: "elastic.out(1, 0.5)" // Gentler elastic
            })
          }
        })
        
        // Schedule next gust
        scheduleGust()
      })
    }
    
    scheduleGust()
  }

  destroy() {
    this.isInitialized = false
    if (this.targetElement) {
      gsap.killTweensOf(this.targetElement)
      this.targetElement.style.opacity = '1' // Restore original opacity
    }
  }
}