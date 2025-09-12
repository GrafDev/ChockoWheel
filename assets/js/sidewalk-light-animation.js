import { gsap } from 'gsap'

export class SidewalkLightAnimation {
  constructor() {
    this.lightElement = document.querySelector('.sidewalk-part2')
    this.isActive = false
    this.currentTimeout = null
    this.init()
  }

  init() {
    if (!this.lightElement) {
      console.warn('sidewalk-part2 element not found')
      return
    }
    
    this.startFlickeringCycle()
  }

  startFlickeringCycle() {
    this.scheduleNextFlicker()
  }

  scheduleNextFlicker() {
    // Clear existing timeout
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout)
    }

    // Random delay between 500ms and 2000ms
    const delay = Math.random() * 1500 + 500
    
    this.currentTimeout = setTimeout(() => {
      this.doFlickerSequence()
    }, delay)
  }

  doFlickerSequence() {
    const timeline = gsap.timeline({
      onComplete: () => {
        this.scheduleNextFlicker()
      }
    })

    // Create random flicker pattern like broken streetlight
    const flickerDuration = Math.random() * 2 + 1 // 1-3 seconds total
    const steps = Math.floor(Math.random() * 8) + 4 // 4-12 flicker steps
    
    let currentTime = 0
    
    for (let i = 0; i < steps; i++) {
      const stepDuration = Math.random() * 0.3 + 0.05 // 0.05-0.35s per step
      const opacity = Math.random() < 0.6 ? Math.random() : 0 // 60% chance to be on
      
      timeline.to(this.lightElement, {
        opacity: opacity,
        duration: stepDuration * 0.3, // Quick transitions
        ease: "none"
      }, currentTime)
      
      currentTime += stepDuration
    }
    
    // Always end with off
    timeline.to(this.lightElement, {
      opacity: 0,
      duration: 0.1,
      ease: "none"
    }, currentTime)
  }

  destroy() {
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout)
    }
    if (this.lightElement) {
      gsap.killTweensOf(this.lightElement)
    }
  }
}