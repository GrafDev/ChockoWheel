export class RoadLanes {
  constructor() {
    this.lanes = []
    this.laneWidth = 80
    this.chickenWidth = 60 // Default chicken width
    this.container = null
  }

  init() {
    this.container = document.querySelector('.road-lanes')
    if (!this.container) {
      console.warn('Road lanes container not found')
      return false
    }

    this.lanes = Array.from(document.querySelectorAll('.lane'))
    if (this.lanes.length === 0) {
      console.warn('No lanes found')
      return false
    }

    // Initialize lane positioning
    this.updateLanes()
    
    // Setup resize handler
    window.addEventListener('resize', () => this.updateLanes())
    
    return true
  }

  updateLanes() {
    if (!this.container || this.lanes.length === 0) return

    const containerRect = this.container.getBoundingClientRect()
    const containerWidth = containerRect.width
    
    // Calculate base lane width
    // Formula: 1.1x + 10x + 0.1x = 100% (first lane 10% wider, last lane 10% of base, 10 middle lanes)
    // 11.2x = 100%
    // x = 100% / 11.2 ≈ 8.93%
    const baseLaneWidth = containerWidth / 11.2
    const firstLaneWidth = baseLaneWidth * 1.1  // 10% wider than base
    const lastLaneWidth = baseLaneWidth * 0.1   // 10% of base (90% smaller)
    
    let currentX = 0
    
    this.lanes.forEach((lane, index) => {
      let laneWidth
      
      if (index === 0) {
        // First lane is 10% wider than base
        laneWidth = firstLaneWidth
      } else if (index === this.lanes.length - 1) {
        // Last lane is 10% of base width (90% smaller)
        laneWidth = lastLaneWidth
      } else {
        // Middle lanes have base width
        laneWidth = baseLaneWidth
      }
      
      lane.style.left = `${currentX}px`
      lane.style.width = `${laneWidth}px`
      
      // Remove border from last lane
      if (index === this.lanes.length - 1) {
        lane.style.borderRight = 'none'
      }
      
      currentX += laneWidth
    })
  }

  setChickenWidth(width) {
    this.chickenWidth = width
    this.updateLanes()
  }

  getLanePosition(laneIndex) {
    if (laneIndex < 0 || laneIndex >= this.lanes.length) {
      console.warn(`Invalid lane index: ${laneIndex}`)
      return 0
    }

    const lane = this.lanes[laneIndex]
    const rect = lane.getBoundingClientRect()
    const containerRect = this.container.getBoundingClientRect()
    
    // Return center X position of the lane relative to container
    return (rect.left + rect.width / 2) - containerRect.left
  }

  getLaneCount() {
    return this.lanes.length
  }

  hideLanes() {
    this.lanes.forEach(lane => {
      lane.style.opacity = '0'
      lane.style.transform = 'scaleX(0)'
    })
  }

  showLanes() {
    console.log('showLanes() called, lanes count:', this.lanes.length)
    
    this.lanes.forEach((lane, index) => {
      // Reset transform and opacity for animation
      lane.style.transformOrigin = 'left center'
      lane.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out'
      
      // Staggered animation delay
      const delay = 600 + (index * 50)
      console.log(`Lane ${index} will show in ${delay}ms`)
      
      setTimeout(() => {
        console.log(`Showing lane ${index}`)
        lane.style.opacity = '1'
        lane.style.transform = 'scaleX(1)'
      }, delay)
    })
  }

  hide() {
    if (this.container) {
      this.container.style.display = 'none'
    }
  }

  show() {
    if (this.container) {
      this.container.style.display = 'block'
      this.updateLanes() // Recalculate positions when showing
    }
  }

  destroy() {
    window.removeEventListener('resize', () => this.updateLanes())
    this.lanes = []
    this.container = null
  }
}