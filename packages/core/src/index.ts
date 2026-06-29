/**
 * favicon-animate - Lightweight favicon animation library
 * @version 0.1.0
 * @license MIT
 */

// Main exports
export { FaviconAnimator } from './animator';
export { BadgeRenderer } from './badge';
export { getVisibilityManager, VisibilityManager } from './visibility';

// Type exports
export type {
  BadgePosition,
  BadgeConfig,
  FaviconConfig,
  AnimatorOptions,
  VisibilityState,
  FaviconData
} from './types';

// Utility exports
export {
  getFaviconLink,
  createCanvas,
  loadImage,
  detectImageFormat,
  supportsPageVisibility,
  debounce,
  throttle,
  canvasToDataUrl,
  isBrowser
} from './utils';
