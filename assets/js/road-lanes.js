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

    // Calculate how many lanes to show based on aspect ratio
    this.calculateVisibleLanes()
    
    // Initialize lane positioning
    this.updateLanes()
    
    // Setup resize handler
    window.addEventListener('resize', () => this.handleResize())
    
    return true
  }

  calculateVisibleLanes() {
    // Ensure container is visible before calculating
    if (!this.container.offsetWidth || !this.container.offsetHeight) {
      console.warn('Container not visible yet, skipping calculation')
      return
    }

    const containerRect = this.container.getBoundingClientRect()
    const containerWidth = containerRect.width
    const containerHeight = containerRect.height

    console.log(`Container dimensions: ${containerWidth}x${containerHeight}`)
    
    let visibleCount = 12
    let bestCount = 12
    let bestAspectRatio = 0
    const targetAspectRatio = 0.1 // Target 1:10 ratio

    // Find lane count with aspect ratio closest to 1:10
    for (let count = 6; count <= 12; count++) {
      // Formula: first(1.1x) + middle((count-2)x) + last(0.1x) = containerWidth
      // So: x * (1.1 + count - 2 + 0.1) = containerWidth
      // Therefore: x = containerWidth / (count - 0.8)
      const baseLaneWidth = containerWidth / (count - 0.8)
      const aspectRatio = baseLaneWidth / containerHeight

      console.log(`Count: ${count}, baseLaneWidth: ${baseLaneWidth.toFixed(2)}, aspectRatio: ${aspectRatio.toFixed(4)} (1:${(1/aspectRatio).toFixed(1)})`)

      // Accept ratios between 1:30 and 1:3, but prefer closest to 1:10
      if (aspectRatio >= 0.033 && aspectRatio <= 0.33) {
        const distanceFromTarget = Math.abs(aspectRatio - targetAspectRatio)
        const currentBestDistance = Math.abs(bestAspectRatio - targetAspectRatio)

        if (bestAspectRatio === 0 || distanceFromTarget < currentBestDistance) {
          bestCount = count
          bestAspectRatio = aspectRatio
        }
      }
    }

    visibleCount = bestCount
    console.log(`✓ Best aspect ratio: ${bestAspectRatio.toFixed(4)} (1:${(1/bestAspectRatio).toFixed(1)}) with ${bestCount} lanes`)
    
    // Show/hide lanes - hide from the end (keep first lanes visible)
    this.lanes.forEach((lane, index) => {
      if (index < visibleCount) {
        lane.style.display = 'block'
      } else {
        lane.style.display = 'none'
      }
    })
    
    console.log(`Showing ${visibleCount} of 12 lanes`)
    this.visibleLaneCount = visibleCount
  }

  handleResize() {
    this.calculateVisibleLanes()
    this.updateLanes()
  }

  updateLanes() {
    if (!this.container || this.lanes.length === 0) return
    
    // Set default if not calculated yet
    if (!this.visibleLaneCount) {
      this.visibleLaneCount = this.lanes.length
    }

    const containerRect = this.container.getBoundingClientRect()
    const containerWidth = containerRect.width
    
    // Calculate base lane width using visible lane count
    // Formula: first(1.1x) + middle((count-2)x) + last(0.1x) = containerWidth
    const baseLaneWidth = containerWidth / (this.visibleLaneCount - 0.8)
    
    let currentX = 0
    
    this.lanes.forEach((lane, index) => {
      if (index >= this.visibleLaneCount) return // Skip hidden lanes
      
      let laneWidth
      
      if (index === 0) {
        // First lane is 1.1x (10% wider than base)
        laneWidth = baseLaneWidth * 1.1
      } else if (index === this.visibleLaneCount - 1) {
        // Last visible lane is 0.1x 
        laneWidth = baseLaneWidth * 0.1
      } else {
        // Middle lanes have base width
        laneWidth = baseLaneWidth
      }
      
      lane.style.left = `${currentX}px`
      lane.style.width = `${laneWidth}px`
      
      // Create custom dashed border through JS
      if (index === 0 || index === this.visibleLaneCount - 1) {
        // First and last visible lane - no border
        lane.style.borderRight = 'none'
        // Don't override background for sidewalk lane
        if (!lane.classList.contains('lane-sidewalk')) {
          lane.style.backgroundImage = 'none'
        }
      } else {
        // Calculate dash parameters based on lane width
        const dashThickness = laneWidth / 30  // толщина в 30 раз меньше ширины полосы
        const dashLength = dashThickness * 10  // длина в 10 раз больше толщины
        const dashSpacing = dashLength / 2     // расстояние в 2 раза меньше длины
        const totalCycle = dashLength + dashSpacing
        
        lane.style.borderRight = `${dashThickness}px solid transparent`
        lane.style.backgroundImage = `
          repeating-linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.6) 0,
            rgba(255, 255, 255, 0.6) ${dashLength}px,
            transparent ${dashLength}px,
            transparent ${totalCycle}px
          )
        `
        lane.style.backgroundPosition = 'right'
        lane.style.backgroundSize = `${dashThickness}px 100%`
        lane.style.backgroundRepeat = 'no-repeat'
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