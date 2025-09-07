/**
 * Fire Sparks Animation using PixiJS
 * Creates flying sparks from center to screen edges with perspective effect
 */

import * as PIXI from '/node_modules/pixi.js/dist/pixi.mjs'

export class FireSparksAnimation {
    constructor() {
        this.app = null;
        this.container = null;
        this.sparks = [];
        this.sparkPool = [];
        this.maxSparks = 750;
        this.sparkFrequency = 6; // Maximum sparks per frame
        this.startTime = null;
        this.speedMultiplier = 2.67; // Start with 2.67x speed (4.0 / 1.5)
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

        // Try to load spark texture
        try {
            this.sparkTexture = await PIXI.Assets.load('/assets/images/common/spark.png');
            console.log('Spark texture loaded:', this.sparkTexture.width, 'x', this.sparkTexture.height);
        } catch (error) {
            console.error('Failed to load spark texture:', error);
            // Fallback to regular container
            this.container = new PIXI.Container();
            this.container.zIndex = 0;
            this.app.stage.addChild(this.container);
            return;
        }
        
        // Use regular Container (ParticleContainer has issues in our setup)
        this.container = new PIXI.Container();
        this.container.zIndex = 0; // Base layer for sparks
        this.app.stage.addChild(this.container);
        
        // Enable sorting by zIndex
        this.app.stage.sortableChildren = true;

        // Create initial sparks
        for (let i = 0; i < 15; i++) {
            this.createSpark();
        }

        // Initialize start time
        this.startTime = Date.now();
        
        // Start animation loop
        this.app.ticker.add(this.animate.bind(this));
    }

    /**
     * Simple ParticleContainer test
     */
    testParticleContainer() {
        if (!this.sparkTexture) {
            console.error('No spark texture loaded!');
            return;
        }
        
        console.log('Testing ParticleContainer with texture:', this.sparkTexture);
        
        // Store references to test sprites
        this.testSprites = [];
        
        // Create 50 simple sprites like in documentation
        for (let i = 0; i < 50; i++) {
            const spark = new PIXI.Sprite(this.sparkTexture);
            spark.anchor.set(0.5);
            spark.scale.set(1.0); // Normal size
            
            // Random position
            spark.x = Math.random() * this.app.screen.width;
            spark.y = Math.random() * this.app.screen.height;
            
            // Don't use tint with ParticleContainer initially
            spark.alpha = 1.0; // Fully visible
            
            this.container.addParticle(spark); // ParticleContainer requires addParticle
            this.testSprites.push(spark); // Store reference
            console.log(`Spark ${i} added at ${spark.x}, ${spark.y}`);
        }
        
        console.log('ParticleContainer children count:', this.container.children.length);
        
        console.log('Test sprites stored:', this.testSprites.length);
        
        // Test if sprites are actually rendered by moving them
        setTimeout(() => {
            console.log('Moving test sprites...');
            for (let i = 0; i < this.testSprites.length; i++) {
                this.testSprites[i].x += 100;
                this.testSprites[i].y += 100;
            }
        }, 2000);
    }

    /**
     * Create a test spark (simplified like in documentation)
     */
    createTestSpark() {
        if (!this.sparkTexture) return;
        
        const spark = new PIXI.Sprite(this.sparkTexture);
        spark.anchor.set(0.5);
        spark.scale.set(0.5 + Math.random() * 0.5);
        
        // Position randomly on screen
        spark.x = Math.random() * this.app.screen.width;
        spark.y = Math.random() * this.app.screen.height;
        
        // Random tint
        spark.tint = 0xFFFFFF;
        spark.alpha = 0.5 + Math.random() * 0.5;
        
        this.container.addParticle(spark);
        console.log('Test spark created at:', spark.x, spark.y);
    }

    /**
     * Create a single spark
     */
    createSpark() {
        // Always create new sprite for ParticleContainer (no pooling of mixed types)
        if (!this.sparkTexture) {
            console.warn('No spark texture available for ParticleContainer');
            return;
        }
        
        const spark = new PIXI.Sprite(this.sparkTexture);
        spark.anchor.set(0.5);

        // Reset spark properties
        const centerX = this.app.screen.width / 2;
        const centerY = this.app.screen.height / 2;
        
        // Random direction from center
        const angle = Math.random() * Math.PI * 2;
        const baseSpeed = Math.random() * 3.75 + 2.25; // Base speed: 2.25-6 (halved)
        const speed = baseSpeed * this.speedMultiplier;
        
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
        spark.size = Math.random() * 12 + 12; // Much bigger size 12-24px
        spark.brightness = Math.random() * 0.3 + 0.7; // 0.7-1.0
        
        // Trail properties
        spark.trail = [];
        spark.maxTrailLength = 8; // Number of trail points
        
        // Flickering properties - 40% chance to be flickering
        spark.isFlickering = Math.random() < 0.4;
        spark.flickerSpeed = Math.random() * 0.05 + 0.02; // 0.02-0.07 (faster for TV-like flicker)
        spark.flickerTime = 0;
        spark.nextFlickerChange = 0;
        spark.currentFlickerBrightness = 1.0; // Initial brightness multiplier
        
        // Draw spark as small circle
        this.drawSpark(spark);
        
        // Add spark to container
        this.container.addChild(spark);
        this.sparks.push(spark);
        
    }

    /**
     * Update spark appearance (sprites or graphics)
     */
    drawSpark(spark) {
        // Calculate distance to screen edge using individual spark's appearance point
        const maxDistance = Math.min(this.app.screen.width, this.app.screen.height) / 2;
        const appearDistance = maxDistance * spark.appearPoint;
        
        // Skip rendering logic for distant sparks (but keep them visible)
        // ParticleContainer doesn't handle visible=false well, so we use alpha instead
        if (spark.totalDistance < appearDistance) {
            spark.alpha = 0; // Invisible via alpha, not visible property
            return;
        }
        
        // LOD system - simplify distant sparks for better performance
        const centerX = this.app.screen.width / 2;
        const centerY = this.app.screen.height / 2;
        const distanceFromCenter = Math.sqrt(
            Math.pow(spark.x - centerX, 2) + 
            Math.pow(spark.y - centerY, 2)
        );
        const normalizedDistance = distanceFromCenter / maxDistance; // 0 to 1+
        
        // LOD levels: close (0-0.6), medium (0.6-0.9), far (0.9+)
        const isDistant = normalizedDistance > 0.9;
        const isMediumDistance = normalizedDistance > 0.6 && normalizedDistance <= 0.9;
        
        // ParticleContainer doesn't support trails
        
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
        
        // LOD size reduction for distant sparks
        let size = spark.size;
        if (isDistant) {
            size = size * 0.5; // 50% size for distant sparks
        } else if (isMediumDistance) {
            size = size * 0.75; // 75% size for medium distance sparks
        }
        
        // Update main spark sprite
        spark.alpha = alpha;
        const scale = size / this.sparkTexture.width;
        spark.scale.set(scale);
        spark.tint = 0xFFFFFF;
        
        // Create trail graphics if not exists
        if (!spark.trailGraphics) {
            spark.trailGraphics = new PIXI.Graphics();
            this.container.addChild(spark.trailGraphics);
        }
        
        // Clear and redraw trail (sparser - every other point)
        spark.trailGraphics.clear();
        if (spark.trail && spark.trail.length > 1) {
            for (let t = 0; t < spark.trail.length - 1; t += 2) { // Skip every other point
                const point = spark.trail[t];
                
                // Calculate trail alpha (fades from back to front)
                const trailProgress = t / (spark.trail.length - 1); // 0 to 1 (oldest to newest)
                const trailAlpha = alpha * trailProgress * 0.4; // Max 40% of spark alpha
                const trailSize = size * (0.3 + trailProgress * 0.7) * 0.5; // Smaller trail
                
                // Draw trail point
                spark.trailGraphics.circle(point.x, point.y, trailSize);
                spark.trailGraphics.fill({ color: 0xFFFFFF, alpha: trailAlpha });
            }
        }
    }

    /**
     * Animation loop
     */
    animate() {
        // Update speed multiplier based on elapsed time
        const elapsedTime = (Date.now() - this.startTime) / 1000; // in seconds
        if (elapsedTime < 2.0) {
            // First 2 seconds: 2.67x speed (was 4x, now 1.5x slower)
            this.speedMultiplier = 2.67;
        } else if (elapsedTime < 3.0) {
            // Seconds 2-3: smooth transition from 2.67x to 1.5x
            const transitionProgress = elapsedTime - 2.0; // 0.0 to 1.0
            this.speedMultiplier = 2.67 - (1.17 * transitionProgress); // 2.67 to 1.5
        } else {
            // After 3 seconds: 1.5x speed (was 3x, now halved)
            this.speedMultiplier = 1.5;
        }
        
        // Create new sparks
        if (Math.random() < this.sparkFrequency) {
            if (this.sparks.length < this.maxSparks) {
                this.createSpark();
            }
        }

        // Update existing sparks
        for (let i = this.sparks.length - 1; i >= 0; i--) {
            const spark = this.sparks[i];
            
            // Save current position to trail before moving
            spark.trail.push({ x: spark.x, y: spark.y });
            if (spark.trail.length > spark.maxTrailLength) {
                spark.trail.shift(); // Remove oldest trail point
            }
            
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
            
            // More aggressive boundary checking for better performance
            const margin = 50; // Reduced margin from 100 to 50 pixels
            const isOffScreen = spark.x < -margin || spark.x > this.app.screen.width + margin ||
                               spark.y < -margin || spark.y > this.app.screen.height + margin;
            
            // Also check if spark life is depleted
            const isDead = spark.life <= 0;
            
            if (isOffScreen || isDead) {
                // Remove spark from container
                this.container.removeChild(spark);
                
                // Remove trail graphics if exists
                if (spark.trailGraphics) {
                    this.container.removeChild(spark.trailGraphics);
                    spark.trailGraphics.destroy();
                }
                
                this.sparks.splice(i, 1);
                // No pooling - let GC handle cleanup
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