// IMPORTS
import { GameManager } from './game-manager.js'
import { ChickenRotationAnimation } from './chicken-rotation-animation.js'
import { CanvasFlameDistortion } from './canvas-flame-distortion.js'

// CONFIGURATION
const isDevelopment = import.meta.env.DEV;

// GAME INITIALIZATION
let gameManager = null;
let wheelAnimations = null;
let wheelLightAnimation = null;
let fireSparksAnimation = null;
let chickenRotationAnimation = null;
let canvasFlameDistortion = null;

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
    
    // Fire sparks animation now handled by SimpleEntranceAnimations
    
    // Initialize Chicken Rotation Animation
    chickenRotationAnimation = new ChickenRotationAnimation();
    if (chickenRotationAnimation.init()) {
      chickenRotationAnimation.start();
      console.log('Chicken rotation animation initialized');
    }
    
    // Initialize Canvas Flame Distortion
    canvasFlameDistortion = new CanvasFlameDistortion();
    if (await canvasFlameDistortion.init()) {
      canvasFlameDistortion.start();
      console.log('Canvas flame distortion initialized');
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