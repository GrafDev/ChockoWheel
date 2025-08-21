import { calculateWheelSize, getElementSize } from './config.js'

// Apply responsive sizing
export function applyResponsiveSizing() {
  const wheelSize = calculateWheelSize();
  
  // Get element sizes
  const logo1Size = getElementSize('logo1');
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const aspectRatio = screenWidth / screenHeight;
  
  // Use bigger mans for mobile (both portrait and landscape)
  const manSize = (aspectRatio < 0.6 || (aspectRatio > 1.6 && Math.min(screenWidth, screenHeight) <= 768)) 
    ? getElementSize('manMobile') 
    : getElementSize('man');
  const titleSize = getElementSize('title');
  const wheelElementSize = getElementSize('wheel');
  
  // Get main-container width
  const mainContainer = document.querySelector('.main-container');
  const mainContainerWidth = mainContainer.offsetWidth;
  
  // Set CSS custom properties
  document.documentElement.style.setProperty('--wheel-size', `${wheelSize}px`);
  document.documentElement.style.setProperty('--logo1-width', `${logo1Size.width}px`);
  document.documentElement.style.setProperty('--logo1-height', `${logo1Size.height}px`);
  document.documentElement.style.setProperty('--man-width', `${manSize.width}px`);
  document.documentElement.style.setProperty('--man-height', `${manSize.height}px`);
  document.documentElement.style.setProperty('--title-width', `${titleSize.width}px`);
  document.documentElement.style.setProperty('--title-height', `${titleSize.height}px`);
  document.documentElement.style.setProperty('--game-container-width', `${wheelElementSize.width}px`);
  document.documentElement.style.setProperty('--game-container-height', `${wheelElementSize.height}px`);
  // Set default media gap
  document.documentElement.style.setProperty('--max-media-gap', `${wheelSize * 1.4}px`);
  
  // Modal sizing removed
  
  console.log(`Wheel size set to: ${wheelSize}px`);
  console.log(`Main container width: ${mainContainerWidth}px`);
}