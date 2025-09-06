export class Logo1BounceAnimation {
  constructor() {
    this.element = null
    this.bounceAnimation = null
    this.brightnessAnimation = null
  }
  
  init() {
    this.element = document.querySelector('.logo1-part2')
    
    if (!this.element) {
      console.warn('Logo1-part2 element not found')
      return false
    }
    
    return true
  }
  
  start() {
    if (!this.element || !window.gsap) {
      console.warn('Cannot start animation: missing element or GSAP')
      return
    }
    
    // Set initial state
    gsap.set(this.element, {
      transformOrigin: "center bottom",
      filter: "brightness(1)"
    })
    
    // Create bounce animation (light impatience movement)
    this.bounceAnimation = gsap.to(this.element, {
      y: -5,
      duration: 0.8,
      ease: "elastic.out(1, 0.3)",
      yoyo: true,
      repeat: -1
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
  
  stop() {
    if (this.bounceAnimation) {
      this.bounceAnimation.kill()
      this.bounceAnimation = null
    }
    
    if (this.brightnessAnimation) {
      this.brightnessAnimation.kill()
      this.brightnessAnimation = null
    }
    
    // Reset element to original state
    if (this.element) {
      gsap.set(this.element, {
        y: 0,
        filter: "brightness(1)"
      })
    }
  }
  
  pause() {
    if (this.bounceAnimation) {
      this.bounceAnimation.pause()
    }
    if (this.brightnessAnimation) {
      this.brightnessAnimation.pause()
    }
  }
  
  resume() {
    if (this.bounceAnimation) {
      this.bounceAnimation.resume()
    }
    if (this.brightnessAnimation) {
      this.brightnessAnimation.resume()
    }
  }
}