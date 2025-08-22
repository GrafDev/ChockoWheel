// IMPORTS
import '../css/main.css'
import { generateHTML } from './html-template.js'
import { GameManager } from './game-manager.js'

// CONFIGURATION
const isDevelopment = import.meta.env.DEV;

// GAME INITIALIZATION
let gameManager = null;

// Initialize game
async function initGame() {
  try {
    console.log('Starting game initialization...');
    
    // First generate HTML
    document.querySelector('#app').innerHTML = generateHTML(isDevelopment);
    
    // Wait a bit for DOM to settle
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Then initialize GameManager
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