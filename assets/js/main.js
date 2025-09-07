// IMPORTS
import { GameManager } from './game-manager.js'
import { ChickenRotationAnimation } from './chicken-rotation-animation.js'
import { CanvasFlameDistortion } from './canvas-flame-distortion.js'
import { Logo1BounceAnimation } from './logo1-bounce-animation.js'
import { SpinButtonBulgeAnimation } from './spin-button-bulge-animation.js'
import { WheelAnimations } from './animations.js'
import { WheelLightAnimation } from './wheel-light-animation.js'

// CONFIGURATION
const isDevelopment = import.meta.env.DEV;

// GAME INITIALIZATION
let gameManager = null;
let wheelAnimations = null;
let wheelLightAnimation = null;
let fireSparksAnimation = null;
let chickenRotationAnimation = null;
let canvasFlameDistortion = null;
let logo1BounceAnimation = null;
let spinButtonBulgeAnimation = null;

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
    wheelAnimations = new WheelAnimations();
    wheelAnimations.init();
    console.log('Wheel animations initialized');
    
    // Initialize Wheel Light Animation
    wheelLightAnimation = new WheelLightAnimation();
    wheelLightAnimation.init();
    console.log('Wheel light animation initialized');
    
    // Original fire sparks animation now runs via SimpleEntranceAnimations
    
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
    
    // Initialize Logo1 Bounce Animation
    logo1BounceAnimation = new Logo1BounceAnimation();
    if (logo1BounceAnimation.init()) {
      logo1BounceAnimation.start();
      console.log('Logo1 bounce animation initialized');
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
    console.log('Game initialized successfully');
    
    // Make animations globally accessible for stopping
    window.wheelLightAnimation = wheelLightAnimation;
    window.fireSparksAnimation = fireSparksAnimation;
    window.chickenRotationAnimation = chickenRotationAnimation;
    window.logo1BounceAnimation = logo1BounceAnimation;
    window.spinButtonBulgeAnimation = spinButtonBulgeAnimation;
    window.canvasFlameDistortion = canvasFlameDistortion;
    window.logo2FlameAnimation = window.logo2FlameAnimation;
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