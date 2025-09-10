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
    
    // Calculate widths for 12 lanes to fit exactly in container width
    // First lane 10% wider than base, last lane 10% of total width
    // Formula: 1.1x + 10x + 10% = 100%
    // 11.1x = 90%
    // x = 90% / 11.1 ≈ 8.108%
    const baseLaneWidth = containerWidth * 0.08108 // Base lane width
    const firstLaneWidth = containerWidth * 0.08919 // 10% wider than base
    const lastLaneWidth = containerWidth * 0.10 // Last lane is 10%
    
    let currentX = 0
    
    this.lanes.forEach((lane, index) => {
      let laneWidth
      
      if (index === 0) {
        // First lane is 10% wider
        laneWidth = firstLaneWidth
      } else if (index === this.lanes.length - 1) {
        // Last lane is 10% width
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