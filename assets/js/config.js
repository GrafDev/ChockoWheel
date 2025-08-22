// Region configurations
export const regionsConfig = {
  eu: {
    // European region settings - to be filled
  },
  kr: {
    // Korean region settings - to be filled  
  },
  ca: {
    // Canadian region settings - to be filled
  }
}

export const gameConfig = {
  // Base wheel size coefficient (300px base)
  baseWheelSize: 300,
  
  // Wheel spinning configuration
  spinning: {
    // Array of target sectors (0-11) for each spin
    targetSectors: [11, 8],
    currentSpinIndex: 0,
    sectorAngle: 360 / 12, // degrees per sector (12 sectors total)
    baseDuration: 3, // base animation duration in seconds
    minRotations: 3, // minimum number of full rotations
    maxRotations: 5, // maximum number of full rotations
    currentSector: 0, // current sector position (starts at 0)
    isSpinning: false // flag to prevent multiple spins
  },
  
  // Responsive breakpoints and multipliers
  responsive: {
    mobile: {
      maxWidth: 768,
      wheelMultiplier: 0.7,  // 70% of base size for mobile
    },
    tablet: {
      maxWidth: 1024,
      wheelMultiplier: 0.7, // 70% of base size for tablet
    },
    desktop: {
      wheelMultiplier: 1.0,  // 100% base size for desktop
    }
  },
  
  // Element size ratios relative to wheel size
  elements: {
    logo1: {
      widthRatio: 0.7,   // 70% of wheel size (увеличено в 2 раза)
      heightRatio: 0.35,  // 35% of wheel size (оставляем исходную высоту)
    },
    logo2: {
      widthRatio: 0.35,   // 35% of wheel size
      heightRatio: 0.35,  // 35% of wheel size
    },
    man: {
      widthRatio: 0.35,   // 35% of wheel size  
      heightRatio: 0.5,   // 50% of wheel size
    },
    manMobile: {
      widthRatio: 0.45,   // 45% of wheel size for mobile
      heightRatio: 0.6,   // 60% of wheel size for mobile
    },
    title: {
      widthRatio: 0.8,    // 80% of wheel size
      heightRatio: 0.15,  // 15% of wheel size
    },
    wheel: {
      widthRatio: 1.0,    // 100% of wheel size
      heightRatio: 1.0,   // 100% of wheel size
    }
  }
};

// Calculate current wheel size based on screen dimensions
export function calculateWheelSize() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const aspectRatio = screenWidth / screenHeight;
  
  let availableSpace;
  
  if (aspectRatio < 0.6) {
    // Mobile portrait: 80% of screen width
    availableSpace = screenWidth * 0.8;
  } else {
    // Tablet/Desktop: 90% of smaller dimension
    availableSpace = Math.min(screenWidth, screenHeight) * 0.9;
    
    if (aspectRatio >= 0.6 && aspectRatio < 1.3) {
      // Tablet: reduce to 75%
      availableSpace = availableSpace * 0.75;
    } else if (aspectRatio >= 1.3) {
      // Desktop: reduce to 80%
      availableSpace = availableSpace * 0.8;
    }
  }
  
  return Math.round(availableSpace);
}

// Get element dimensions based on wheel size
export function getElementSize(elementType) {
  const wheelSize = calculateWheelSize();
  const elementConfig = gameConfig.elements[elementType];
  
  if (!elementConfig) {
    console.warn(`Unknown element type: ${elementType}`);
    return { width: wheelSize * 0.2, height: wheelSize * 0.2 };
  }
  
  return {
    width: Math.round(wheelSize * elementConfig.widthRatio),
    height: Math.round(wheelSize * elementConfig.heightRatio)
  };
}

// Calculate rotation angle to reach target sector
export function calculateRotationAngle(targetSector, currentTotalRotation = 0) {
  const config = gameConfig.spinning;
  const currentRotation = config.currentSector * config.sectorAngle;
  const targetRotation = targetSector * config.sectorAngle;
  
  // Calculate angle difference
  let angleDifference = targetRotation - currentRotation;
  
  // Random number of FULL rotations between min and max (integer values only)
  const randomFullRotations = Math.floor(Math.random() * (config.maxRotations - config.minRotations + 1)) + config.minRotations;
  const fullRotations = randomFullRotations * 360;
  
  // Calculate final angle: current total rotation + full rotations + angle to target
  const finalAngle = currentTotalRotation + fullRotations + angleDifference;
  
  return finalAngle;
}

// Get next target sector and increment index
export function getNextTargetSector() {
  const config = gameConfig.spinning;
  if (config.currentSpinIndex >= config.targetSectors.length) {
    return null; // No more spins available
  }
  
  const targetSector = config.targetSectors[config.currentSpinIndex];
  config.currentSpinIndex++;
  
  return targetSector;
}