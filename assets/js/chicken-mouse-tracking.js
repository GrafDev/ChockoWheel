/**
 * Chicken Mouse Tracking - курица следит за мышкой
 */

export class ChickenMouseTracking {
  constructor() {
    this.chickenPart2 = null
    this.chickenContainer = null
    this.isActive = false
    this.animationFrame = null
    this.currentRotation = 0
    this.targetRotation = 0
    
    this.onMouseMove = this.onMouseMove.bind(this)
    this.update = this.update.bind(this)
  }

  init() {
    this.chickenPart2 = document.querySelector('.chicken-part2')
    this.chickenContainer = document.querySelector('.chicken-container')
    
    if (!this.chickenPart2 || !this.chickenContainer) {
      console.warn('Chicken elements not found for mouse tracking')
      return false
    }
    
    console.log('Chicken mouse tracking initialized')
    return true
  }

  start() {
    if (!this.chickenPart2 || this.isActive) return
    
    this.isActive = true
    document.addEventListener('mousemove', this.onMouseMove)
    this.update()
    
    console.log('Chicken mouse tracking started')
  }

  stop() {
    if (!this.isActive) return
    
    this.isActive = false
    document.removeEventListener('mousemove', this.onMouseMove)
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }
    
    console.log('Chicken mouse tracking stopped')
  }

  onMouseMove(event) {
    if (!this.isActive || !this.chickenContainer || !this.chickenPart2) return
    
    // Get chicken container position
    const containerRect = this.chickenContainer.getBoundingClientRect()
    const centerX = containerRect.left + containerRect.width / 2
    const centerY = containerRect.top + containerRect.height / 2
    
    // Calculate angle to mouse
    const deltaX = event.clientX - centerX
    const deltaY = event.clientY - centerY
    
    // Calculate rotation angle in degrees
    let angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI
    
    // Always add +155 degrees offset to the calculated angle
    angle += 155
    
    this.targetRotation = angle
  }

  update() {
    if (!this.isActive) return
    
    // Normalize angles to avoid 360° jumps
    let rotationDiff = this.targetRotation - this.currentRotation
    
    // Find shortest rotation path
    while (rotationDiff > 180) rotationDiff -= 360
    while (rotationDiff < -180) rotationDiff += 360
    
    // Smooth interpolation to target rotation
    this.currentRotation += rotationDiff * 0.1 // Smooth factor
    
    // Apply rotation to chicken part 2 (head)
    if (this.chickenPart2) {
      this.chickenPart2.style.transform = `rotate(${this.currentRotation}deg)`
      this.chickenPart2.style.transformOrigin = 'center center'
    }
    
    // Continue animation loop
    this.animationFrame = requestAnimationFrame(this.update)
  }

  destroy() {
    this.stop()
    this.chickenPart2 = null
    this.chickenContainer = null
  }
}