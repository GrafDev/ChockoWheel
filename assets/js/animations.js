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
        if (!this.wheelLightElement) return;
        
        let rotation = 0;
        
        const animate = () => {
            rotation += 0.3; // Degrees per frame (slower rotation)
            this.wheelLightElement.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
            requestAnimationFrame(animate);
        };
        
        animate();
    }
}

// Export for use in main.js
window.WheelAnimations = WheelAnimations;