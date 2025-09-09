// IMPORTS
import { GameManager } from './game-manager.js'
import { PersistentAnimations } from './persistent-animations.js'
import { CanvasFlameDistortion } from './canvas-flame-distortion.js'
import { WheelAnimations } from './animations.js'
import { WheelLightAnimation } from './wheel-light-animation.js'
import { imagePreloader } from './image-preloader.js'

// CONFIGURATION
const isDevelopment = import.meta.env.DEV;

// GAME INITIALIZATION
let gameManager = null;
let persistentAnimations = null;
let wheelAnimations = null;
let wheelLightAnimation = null;
let canvasFlameDistortion = null;
let spinButtonBulgeAnimation = null;

// Preload images function
async function preloadAllImages() {
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  
  // Get region from URL params or default to 'eu'
  const urlParams = new URLSearchParams(window.location.search);
  const region = urlParams.get('region') || 'eu';
  
  console.log(`Preloading images for region: ${region}`);
  
  return new Promise((resolve) => {
    imagePreloader.preloadImages(
      region,
      // onProgress callback
      (progress, loaded, total) => {
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${progress}%`;
        console.log(`Image preload progress: ${progress}% (${loaded}/${total})`);
      },
      // onComplete callback
      () => {
        console.log('Image preloading completed');
        setTimeout(resolve, 500); // Small delay for smooth transition
      }
    );
  });
}

// Hide loading screen and show app
function showApp() {
  const loadingScreen = document.getElementById('loadingScreen');
  const app = document.getElementById('app');
  
  // Fade out loading screen
  loadingScreen.style.opacity = '0';
  loadingScreen.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    loadingScreen.style.display = 'none';
    app.style.display = 'block';
    
    // Fade in app
    app.style.opacity = '0';
    app.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
      app.style.opacity = '1';
    }, 50);
  }, 500);
}

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

// Main entry point
async function startApp() {
  try {
    // First preload all images
    await preloadAllImages();
    
    // Then show the app
    showApp();
    
    // Wait a moment for transition, then init game
    setTimeout(() => {
      initGame();
    }, 600);
    
  } catch (error) {
    console.error('Failed to start app:', error);
    // Show app anyway if preloading fails
    showApp();
    setTimeout(() => {
      initGame();
    }, 600);
  }
}

// Wait for DOM to be ready, then start the app
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}