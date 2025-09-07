/**
 * Test ParticleContainer implementation for sparks
 */

import * as PIXI from '/node_modules/pixi.js/dist/pixi.mjs'

export class TestParticleSparks {
    constructor() {
        this.app = null;
        this.particleContainer = null;
        this.sparkTexture = null;
        this.particles = [];
    }

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

        // Load spark texture
        try {
            this.sparkTexture = await PIXI.Assets.load('/assets/images/common/spark.png');
            console.log('✅ Spark texture loaded:', this.sparkTexture.width, 'x', this.sparkTexture.height);
        } catch (error) {
            console.error('❌ Failed to load spark texture:', error);
            return false;
        }

        // Use regular Container like in PixiJS v8 documentation
        this.particleContainer = new PIXI.Container();

        this.app.stage.addChild(this.particleContainer);
        console.log('✅ Container created and added to stage');
        console.log('📦 PixiJS version:', PIXI.VERSION);

        // Create test particles immediately
        this.createTestParticles();

        // Start animation loop
        this.app.ticker.add(() => this.animate());

        return true;
    }

    createTestParticles() {
        console.log('🚀 Creating test particles...');
        
        // Create 50 static particles first
        for (let i = 0; i < 50; i++) {
            const particle = new PIXI.Sprite(this.sparkTexture);
            
            // Set anchor
            particle.anchor.set(0.5);
            
            // Random position
            particle.x = Math.random() * this.app.screen.width;
            particle.y = Math.random() * this.app.screen.height;
            
            // Bigger scale so we can see them
            particle.scale.set(2.0);
            
            // Full alpha
            particle.alpha = 1.0;
            
            // Add to Container using addChild (like in documentation)
            this.particleContainer.addChild(particle);
            
            // Store reference
            this.particles.push({
                sprite: particle,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2
            });
            
            console.log(`Particle ${i} created at (${Math.round(particle.x)}, ${Math.round(particle.y)})`);
        }
        
        console.log('✅ Total particles in container:', this.particleContainer.children.length);
        console.log('✅ Total particles we stored:', this.particles.length);
        
        // Test: Try to make particles VERY visible
        setTimeout(() => {
            console.log('🔍 Making particles more visible...');
            for (const particle of this.particles) {
                particle.sprite.scale.set(5.0); // HUGE scale
                particle.sprite.alpha = 1.0;    // Max alpha
                console.log(`Particle at (${particle.sprite.x}, ${particle.sprite.y}) scale: ${particle.sprite.scale.x}`);
            }
        }, 1000);
    }

    animate() {
        // Move particles
        for (const particle of this.particles) {
            particle.sprite.x += particle.vx;
            particle.sprite.y += particle.vy;
            
            // Bounce off edges
            if (particle.sprite.x < 0 || particle.sprite.x > this.app.screen.width) {
                particle.vx *= -1;
            }
            if (particle.sprite.y < 0 || particle.sprite.y > this.app.screen.height) {
                particle.vy *= -1;
            }
        }
    }

    stop() {
        if (this.app) {
            this.app.ticker.stop();
            this.app.destroy(true);
        }
    }
}

// Export for ES modules
if (typeof window !== 'undefined') {
    window.TestParticleSparks = TestParticleSparks;
}