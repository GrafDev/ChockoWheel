/**
 * Fire Sparks Animation using PixiJS
 * Creates flying sparks from center to screen edges with perspective effect
 */

// PixiJS will be available globally or imported by build system

class FireSparksAnimation {
    constructor() {
        this.app = null;
        this.container = null;
        this.sparks = [];
        this.sparkPool = [];
        this.maxSparks = 800;
        this.sparkFrequency = 3.5; // Maximum sparks per frame
    }

    /**
     * Initialize the animation
     */
    async init() {
        // Create PIXI application
        this.app = new PIXI.Application();
        
        await this.app.init({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundAlpha: 0,
            antialias: true
        });

        // Add canvas to fire-sparks-layer element
        const sparkLayer = document.querySelector('.fire-sparks-layer');
        if (sparkLayer) {
            sparkLayer.appendChild(this.app.canvas);
            this.app.canvas.style.position = 'absolute';
            this.app.canvas.style.top = '0';
            this.app.canvas.style.left = '0';
            this.app.canvas.style.width = '100%';
            this.app.canvas.style.height = '100%';
            this.app.canvas.style.pointerEvents = 'none';
        }

        // Create container for sparks
        this.container = new PIXI.Container();
        this.container.zIndex = 0; // Base layer for sparks
        this.app.stage.addChild(this.container);
        
        // Enable sorting by zIndex
        this.app.stage.sortableChildren = true;

        // Create a few test sparks immediately
        for (let i = 0; i < 5; i++) {
            this.createSpark();
        }

        // Start animation loop
        this.app.ticker.add(this.animate.bind(this));
    }

    /**
     * Create a single spark
     */
    createSpark() {
        let spark = this.sparkPool.pop();
        
        if (!spark) {
            spark = new PIXI.Graphics();
        }

        // Reset spark properties
        const centerX = this.app.screen.width / 2;
        const centerY = this.app.screen.height / 2;
        
        // Random direction from center
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2.5 + 1.5; // Faster: 1.5-4
        
        // Start at center (will be invisible until halfway)
        spark.x = centerX;
        spark.y = centerY;
        
        // Store direction and distance info
        spark.angle = angle;
        spark.totalDistance = 0;
        
        // Random appearance point between 80% and 95%
        spark.appearPoint = Math.random() * 0.15 + 0.8; // 0.8-0.95
        spark.vx = Math.cos(angle) * speed;
        spark.vy = Math.sin(angle) * speed;
        
        // Spark properties
        spark.life = 1.0;
        spark.maxLife = 10.0; // Long life to reach screen edges
        spark.size = Math.random() * 3 + 3; // Fixed size 3-6px
        spark.brightness = Math.random() * 0.3 + 0.7; // 0.7-1.0
        
        // Flickering properties - 40% chance to be flickering
        spark.isFlickering = Math.random() < 0.4;
        spark.flickerSpeed = Math.random() * 0.05 + 0.02; // 0.02-0.07 (faster for TV-like flicker)
        spark.flickerTime = 0;
        spark.nextFlickerChange = 0;
        spark.currentFlickerBrightness = 1.0; // Initial brightness multiplier
        
        // Draw spark as small circle
        this.drawSpark(spark);
        
        this.container.addChild(spark);
        this.sparks.push(spark);
    }

    /**
     * Draw spark graphics
     */
    drawSpark(spark) {
        spark.clear();
        
        // Calculate distance to screen edge using individual spark's appearance point
        const maxDistance = Math.min(this.app.screen.width, this.app.screen.height) / 2;
        const appearDistance = maxDistance * spark.appearPoint;
        
        // Invisible until reach individual appearance point, then fade in
        if (spark.totalDistance < appearDistance) {
            return; // Invisible
        }
        
        // Fade in effect after appear point
        const fadeDistance = maxDistance * 0.1; // Fade over 10% of screen
        const fadeProgress = Math.min(1, (spark.totalDistance - appearDistance) / fadeDistance);
        
        // Calculate brightness with optional flickering
        let currentBrightness = spark.brightness;
        if (spark.isFlickering) {
            // TV-like flickering - random sharp changes
            if (spark.flickerTime >= spark.nextFlickerChange) {
                // Random brightness between 0.2 and 1.0
                spark.currentFlickerBrightness = Math.random() * 0.8 + 0.2;
                // Next change in 1-4 frames (very rapid like TV interference)
                spark.nextFlickerChange = spark.flickerTime + (Math.random() * 3 + 1) * (1/60);
            }
            currentBrightness = spark.brightness * spark.currentFlickerBrightness;
        } else {
            currentBrightness = spark.brightness;
        }
        
        const alpha = spark.life * currentBrightness * fadeProgress;
        
        // Fixed size throughout journey
        const size = spark.size;
        
        // White spark with yellow glow
        const color = 0xFFFFFF; // White core
        
        // Draw white spark
        spark.beginFill(color, alpha);
        spark.drawCircle(0, 0, size);
        spark.endFill();
    }

    /**
     * Animation loop
     */
    animate() {
        // Create new sparks
        if (Math.random() < this.sparkFrequency) {
            if (this.sparks.length < this.maxSparks) {
                this.createSpark();
            }
        }

        // Update existing sparks
        for (let i = this.sparks.length - 1; i >= 0; i--) {
            const spark = this.sparks[i];
            
            // Move spark
            spark.x += spark.vx;
            spark.y += spark.vy;
            
            // Track distance from center
            const centerX = this.app.screen.width / 2;
            const centerY = this.app.screen.height / 2;
            spark.totalDistance = Math.sqrt(
                Math.pow(spark.x - centerX, 2) + 
                Math.pow(spark.y - centerY, 2)
            );
            
            // Update flicker time for flickering sparks
            if (spark.isFlickering) {
                spark.flickerTime += spark.flickerSpeed;
            }
            
            // Decrease life
            spark.life -= 0.016 / spark.maxLife; // ~60fps
            
            // Update appearance
            this.drawSpark(spark);
            
            // Remove only when completely off screen (with buffer)
            if (spark.x < -100 || spark.x > this.app.screen.width + 100 ||
                spark.y < -100 || spark.y > this.app.screen.height + 100) {
                
                this.container.removeChild(spark);
                this.sparks.splice(i, 1);
                this.sparkPool.push(spark);
            }
        }
    }

    /**
     * Handle window resize
     */
    resize() {
        if (this.app) {
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
        }
    }

    /**
     * Stop animation
     */
    stop() {
        if (this.app) {
            this.app.ticker.stop();
            this.app.destroy(true);
        }
    }
}

// Export for ES modules or make global for standalone usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FireSparksAnimation };
} else if (typeof window !== 'undefined') {
    window.FireSparksAnimation = FireSparksAnimation;
}