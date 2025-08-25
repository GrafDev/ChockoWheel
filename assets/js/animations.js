/**
 * Wheel Animations using PixiJS
 * Handles wheel-light rotation animation
 */

class WheelAnimations {
    constructor() {
        this.wheelLightElement = null;
    }

    /**
     * Initialize wheel light rotation
     */
    init() {
        this.wheelLightElement = document.querySelector('.wheel-light');
        this.startLightRotation();
    }

    /**
     * Start continuous light rotation using CSS transform
     */
    startLightRotation() {
        // Rotation disabled
        return;
    }
}

// Export for use in main.js
window.WheelAnimations = WheelAnimations;