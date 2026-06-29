/**
 * favicon-animate-utils - Advanced utilities for favicon-animate
 * @version 0.1.0
 * @license MIT
 */

// Re-export everything from core
export * from 'favicon-animate';

// Advanced utilities
export { EventEmitter, type EventListener } from './event-emitter';
export { CanvasAnimator, type AnimationFrame, type CanvasAnimatorOptions } from './canvas-animator';
export { ThemeManager, type Theme, type ThemeConfig } from './theme-manager';
export {
  animationPresets,
  getPreset,
  spinningLoader,
  pulsing,
  bouncingDot,
  rotatingSquare,
  wave,
  gradientFade,
  blinking,
  type PresetName
} from './presets';
