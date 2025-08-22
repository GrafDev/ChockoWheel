import { setupDevPanel } from './dev-panel.js'

export class GameManager {
  constructor() {
    this.currentPage = 'wheelPage'
    this.currentRegion = 'eu'
    this.isDevelopment = import.meta.env.DEV
  }

  async init() {
    // Get region from localStorage or URL params or default
    this.currentRegion = this.getInitialRegion()

    // Setup page navigation
    this.setupPageNavigation()
    
    // Setup game interactions
    this.setupGameInteractions()

    // Setup dev panel
    if (this.isDevelopment) {
      setupDevPanel(this.currentRegion, (region) => this.updateRegion(region), this.isDevelopment)
    }

    // Show initial page
    this.showPage('wheelPage')
  }

  setupPageNavigation() {
    // Setup page switching logic
    this.pages = ['wheelPage', 'roadPage', 'bankPage', 'downloadPage']
  }

  setupGameInteractions() {
    // Setup button clicks and interactions
    // This will be implemented later for each specific element
  }

  showPage(pageId) {
    // Hide all pages
    this.pages.forEach(id => {
      const page = document.getElementById(id)
      if (page) {
        page.style.display = 'none'
      }
    })
    
    // Show target page
    const targetPage = document.getElementById(pageId)
    if (targetPage) {
      targetPage.style.display = 'block'
      this.currentPage = pageId
    }
  }

  getInitialRegion() {
    // Priority: localStorage > URL param > env variable > default
    const savedRegion = localStorage.getItem('chockoWheel_region')
    const urlRegion = new URLSearchParams(window.location.search).get('region')
    const envRegion = import.meta.env.VITE_REGION
    
    return savedRegion || urlRegion || envRegion || 'eu'
  }

  async updateRegion(newRegion) {
    if (this.currentRegion !== newRegion) {
      this.currentRegion = newRegion
      
      // Update region-specific content in HTML
      this.updateRegionContent(newRegion)
      
      // Dev panel will automatically show new region
      
      // Save to localStorage
      localStorage.setItem('chockoWheel_region', newRegion)
      
      console.log(`Region updated to: ${newRegion}`)
    }
  }

  updateRegionContent(region) {
    // Update counter, currency displays, etc. based on region
    // This will be implemented later
    console.log(`Updating content for region: ${region}`)
  }

  destroy() {
    // Cleanup event listeners if needed
  }
}