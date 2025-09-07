import { ChickenRotationAnimation } from './chicken-rotation-animation.js'
import { CanvasFlameDistortion } from './canvas-flame-distortion.js'
import { Logo1BounceAnimation } from './logo1-bounce-animation.js'
import { SpinButtonBulgeAnimation } from './spin-button-bulge-animation.js'
import { WheelAnimations } from './animations.js'
import { WheelLightAnimation } from './wheel-light-animation.js'

export class PersistentAnimations {
  constructor() {
    this.wheelAnimations = null
    this.wheelLightAnimation = null
    this.chickenRotationAnimation = null
    this.canvasFlameDistortion = null
    this.logo1BounceAnimation = null
    this.spinButtonBulgeAnimation = null
  }

  async init() {
    try {
      console.log('Initializing persistent animations...')

      // Initialize Wheel Animations
      this.wheelAnimations = new WheelAnimations()
      this.wheelAnimations.init()
      console.log('Wheel animations initialized')
      
      // Initialize Wheel Light Animation
      this.wheelLightAnimation = new WheelLightAnimation()
      this.wheelLightAnimation.init()
      console.log('Wheel light animation initialized')
      
      // Initialize Chicken Rotation Animation
      this.chickenRotationAnimation = new ChickenRotationAnimation()
      if (this.chickenRotationAnimation.init()) {
        this.chickenRotationAnimation.start()
        console.log('Chicken rotation animation initialized')
      }
      
      // Initialize Canvas Flame Distortion
      this.canvasFlameDistortion = new CanvasFlameDistortion()
      if (await this.canvasFlameDistortion.init()) {
        this.canvasFlameDistortion.start()
        console.log('Canvas flame distortion initialized')
      }
      
      // Initialize Logo1 Bounce Animation
      this.logo1BounceAnimation = new Logo1BounceAnimation()
      if (this.logo1BounceAnimation.init()) {
        this.logo1BounceAnimation.start()
        console.log('Logo1 bounce animation initialized')
      }
      
      // Initialize Spin Button Bulge Animation
      this.spinButtonBulgeAnimation = new SpinButtonBulgeAnimation()
      if (await this.spinButtonBulgeAnimation.init()) {
        this.spinButtonBulgeAnimation.start()
        console.log('Spin button bulge animation initialized')
      }

      console.log('All persistent animations initialized')
      return true
    } catch (error) {
      console.error('Failed to initialize persistent animations:', error)
      return false
    }
  }

}