/**
 * favicon-animate - Lightweight favicon animation library
 * @version 0.1.0
 * @license MIT
 */

// Main exports
export { FaviconAnimator } from './animator';
export { BadgeRenderer } from './badge';
export { getVisibilityManager, VisibilityManager } from './visibility';
export { decodeImageFrames, releaseFrames, hasImageDecoder } from './frame-decoder';
export { AnimationLoop } from './animation-loop';
export { isCanvasTainted, testCorsImage, getCorsMode, isSameOrigin, logCorsWarning } from './cors-handler';

// Type exports
export type {
  BadgePosition,
  BadgeConfig,
  FaviconConfig,
  AnimatorOptions,
  VisibilityState,
  FaviconData
} from './types';
export type { DecodedFrame, FrameDecoderOptions } from './frame-decoder';
export type { AnimationLoopOptions } from './animation-loop';

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
  isBrowser,
  normalizeLinks
} from './utils';
