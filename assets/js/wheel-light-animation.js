/**
 * Wheel Light Animation using PixiJS
 * Handles smooth pulsing and flickering effects
 */

export class WheelLightAnimation {
    constructor() {
        this.wheelLightElement = null;
        this.baseOpacity = 0.6;
        this.maxOpacity = 1;
        this.time = 0;
        this.flickerTime = 0;
        this.isFlickering = false;
        this.animationId = null;
        this.nextFlickerTime = this.getRandomFlickerTime();
        this.flickerStartTime = 0;
    }

    /**
     * Initialize wheel light animation
     */
    init() {
        this.wheelLightElement = document.querySelector('.wheel-light');
        if (!this.wheelLightElement) {
            console.warn('wheel-light element not found');
            return;
        }
        
        this.startAnimation();
    }

    /**
     * Start the animation loop
     */
    startAnimation() {
        const animate = (currentTime) => {
            this.time = currentTime * 0.001; // Convert to seconds
            
            let finalOpacity = this.baseOpacity;
            
            // Base pulsing animation (1.5s cycle)
            this.startPulseAnimation();
            
            // Flickering animation (every 4 seconds)  
            this.startFlickerAnimation();
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate(0);
    }

    /**
     * Base pulsing animation
     */
    startPulseAnimation() {
        const pulseOpacity = this.baseOpacity + (this.maxOpacity - this.baseOpacity) * 
            (Math.sin(this.time * 2 * Math.PI / 1.5) * 0.5 + 0.5);
        
        if (!this.isFlickering) {
            this.wheelLightElement.style.opacity = pulseOpacity;
        }
    }

    /**
     * Get random time for next flicker (1-4 seconds)
     */
    getRandomFlickerTime() {
        return Math.random() * 3 + 1; // Random between 1-4 seconds
    }

    /**
     * Flickering animation with random intervals
     */
    startFlickerAnimation() {
        // Check if it's time for next flicker
        if (this.time >= this.nextFlickerTime && !this.isFlickering) {
            this.isFlickering = true;
            this.flickerStartTime = this.time;
        }
        
        if (this.isFlickering) {
            const flickerDuration = 0.24; // 240ms flicker duration
            const flickerElapsed = this.time - this.flickerStartTime;
            
            if (flickerElapsed <= flickerDuration) {
                // Fast flickering pattern - dithering light effect
                const flickerPattern = [0.2, 0.9, 0.1, 0.8, 0.3, 1, 0.1, 0.7, 0.2, 0.9, 0.4, 1];
                const flickerProgress = flickerElapsed / flickerDuration;
                const flickerIndex = Math.floor(flickerProgress * flickerPattern.length);
                const flickerOpacity = flickerPattern[flickerIndex] || 1;
                
                this.wheelLightElement.style.opacity = flickerOpacity;
            } else {
                // Flicker finished, schedule next one
                this.isFlickering = false;
                this.nextFlickerTime = this.time + this.getRandomFlickerTime();
            }
        }
    }

    /**
     * Stop the animation
     */
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

