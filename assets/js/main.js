// IMPORTS
import { GameManager } from './game-manager.js'
import { PersistentAnimations } from './persistent-animations.js'
import { CanvasFlameDistortion } from './canvas-flame-distortion.js'
import { SpinButtonBulgeAnimation } from './spin-button-bulge-animation.js'
import { WheelAnimations } from './animations.js'
import { WheelLightAnimation } from './wheel-light-animation.js'

// CONFIGURATION
const isDevelopment = import.meta.env.DEV;

// GAME INITIALIZATION
let gameManager = null;
let persistentAnimations = null;
let wheelAnimations = null;
let wheelLightAnimation = null;
let canvasFlameDistortion = null;
let spinButtonBulgeAnimation = null;

// Initialize game
async function initGame() {
  try {
    
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
    wheelAnimations = new WheelAnimations();
    wheelAnimations.init();
    
    // Initialize Wheel Light Animation
    wheelLightAnimation = new WheelLightAnimation();
    wheelLightAnimation.init();
    
    // Initialize persistent animations
    persistentAnimations = new PersistentAnimations();
    await persistentAnimations.init();
    
    // Original fire sparks animation now runs via SimpleEntranceAnimations
    
    // Initialize Canvas Flame Distortion
    canvasFlameDistortion = new CanvasFlameDistortion();
    if (await canvasFlameDistortion.init()) {
      canvasFlameDistortion.start();
    }
    
    // Spin button bulge animation disabled (filter issue)
    // spinButtonBulgeAnimation = new SpinButtonBulgeAnimation();
    // if (await spinButtonBulgeAnimation.init()) {
    //   spinButtonBulgeAnimation.start();
    //   console.log('Spin button bulge animation initialized');
    // }
    
    // Initialize GameManager
    gameManager = new GameManager();
    await gameManager.init();
    
    // Make animations globally accessible for stopping
    window.wheelLightAnimation = wheelLightAnimation;
    window.fireSparksAnimation = persistentAnimations?.fireSparksAnimation;
    window.chickenRotationAnimation = persistentAnimations?.chickenRotationAnimation;
    window.chickenIdleAnimation = persistentAnimations?.chickenIdleAnimation;
    window.chickenMouseTracking = persistentAnimations?.chickenMouseTracking;
    window.logo1BounceAnimation = persistentAnimations?.logo1BounceAnimation;
    window.spinButtonBulgeAnimation = spinButtonBulgeAnimation;
    window.canvasFlameDistortion = canvasFlameDistortion;
    window.logo2FlameAnimation = persistentAnimations?.logo2FlameAnimation;
    window.persistentAnimations = persistentAnimations;
    
    // Add resize handler directly in main.js
    window.addEventListener('resize', () => {
      console.log('RESIZE EVENT TRIGGERED!');
      if (persistentAnimations) {
        console.log('Calling persistentAnimations.resize()');
        persistentAnimations.resize();
      } else {
        console.log('persistentAnimations is null!');
      }
      if (gameManager && gameManager.modalAnimation) {
        gameManager.modalAnimation.resize();
      }
    });
    
    // Also add orientationchange for mobile devices
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        if (persistentAnimations) {
          persistentAnimations.resize();
        }
        if (gameManager && gameManager.modalAnimation) {
          gameManager.modalAnimation.resize();
        }
      }, 100);
    });
    
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