// IMPORTS
import { GameManager } from './game-manager.js'

// CONFIGURATION
const isDevelopment = import.meta.env.DEV;

// GAME INITIALIZATION
let gameManager = null;
let wheelAnimations = null;
let wheelLightAnimation = null;
let fireSparksAnimation = null;

// Initialize game
async function initGame() {
  try {
    console.log('Starting game initialization...');
    
    // Show dev panel in development mode
    if (isDevelopment) {
      const devPanel = document.getElementById('devPanel');
      if (devPanel) {
        devPanel.style.display = 'block';
      }
    }
    
    // Wait a bit for DOM to settle
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Initialize Wheel Animations
    if (window.WheelAnimations) {
      wheelAnimations = new window.WheelAnimations();
      wheelAnimations.init();
      console.log('Wheel animations initialized');
    }
    
    // Initialize Wheel Light Animation
    if (window.WheelLightAnimation) {
      wheelLightAnimation = new window.WheelLightAnimation();
      wheelLightAnimation.init();
      console.log('Wheel light animation initialized');
    }
    
    // Initialize Fire Sparks Animation
    if (window.FireSparksAnimation) {
      fireSparksAnimation = new window.FireSparksAnimation();
      await fireSparksAnimation.init();
      console.log('Fire sparks animation initialized');
    }
    
    // Initialize GameManager
    gameManager = new GameManager();
    await gameManager.init();
    console.log('Game initialized successfully');
  } catch (error) {
    console.error('Failed to initialize game:', error);
  }
}

// Wait for DOM to be ready, then start the game
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}