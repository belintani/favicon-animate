import { AnimatorOptions, BadgeConfig, FaviconConfig, FaviconData } from './types';
import { BadgeRenderer } from './badge';
import { getVisibilityManager } from './visibility';
import { decodeImageFrames, releaseFrames, DecodedFrame } from './frame-decoder';
import { AnimationLoop } from './animation-loop';
import {
  getFaviconLink,
  createCanvas,
  loadImage,
  detectImageFormat,
  canvasToDataUrl,
  isBrowser,
  normalizeLinks
} from './utils';

/**
 * Main FaviconAnimator class
 */
export class FaviconAnimator {
  private faviconLink: HTMLLinkElement;
  private currentFavicon: FaviconData | null = null;
  private currentBadge: BadgeConfig | null = null;
  private isAnimating: boolean = false;
  private pauseOnHidden: boolean = true;
  private isVisible: boolean = true;
  private unsubscribeVisibility: (() => void) | null = null;
  private faviconSize: number = 32;
  private updateInterval: number = 100;
  private enableAnimation: boolean = true;
  private animationLoop: AnimationLoop | null = null;
  private decodedFrames: DecodedFrame[] = [];
  private animationFrameId: number | null = null;

  constructor(options: AnimatorOptions = {}) {
    if (!isBrowser()) {
      throw new Error('FaviconAnimator can only be used in browser environment');
    }

    this.faviconLink = getFaviconLink();
    this.pauseOnHidden = options.pauseOnHidden !== false;
    this.updateInterval = options.updateInterval || 100;
    this.enableAnimation = options.enableAnimation !== false;
    
    // Normalize favicon links (remove duplicates)
    normalizeLinks();

    // Setup visibility manager
    if (this.pauseOnHidden) {
      const visibilityManager = getVisibilityManager();
      this.unsubscribeVisibility = visibilityManager.onChange(isVisible => {
        this.isVisible = isVisible;
        if (isVisible) {
          this.resume();
        } else {
          this.pause();
        }
      });
    }

    // Set initial favicon if provided
    if (options.favicon) {
      const faviconConfig = typeof options.favicon === 'string' 
        ? { url: options.favicon }
        : options.favicon;
      this.setFavicon(faviconConfig);
    }

    // Set initial badge if provided
    if (options.badge) {
      this.setBadge(options.badge);
    }
  }

  /**
   * Set favicon
   */
  async setFavicon(config: FaviconConfig | string): Promise<void> {
    const faviconConfig: FaviconConfig = typeof config === 'string' 
      ? { url: config }
      : config;

    const { url, size = 32, animate = true, corsMode = 'cors', loopCount = 0 } = faviconConfig;
    this.faviconSize = size;

    try {
      // Stop any existing animation
      this.stopAnimation();

      // Detect format
      const format = detectImageFormat(url);
      const isAnimated = format === 'gif' || format === 'webp';

      // Create favicon data
      this.currentFavicon = {
        url,
        size,
        isAnimated,
        format
      };

      // Try to decode and animate if enabled
      if (isAnimated && animate && this.enableAnimation) {
        try {
          await this.startAnimation(url, corsMode, loopCount);
        } catch (error) {
          console.warn('Animation failed, falling back to static image:', error);
          // Fallback to static image
          await this.updateFaviconDisplay();
        }
      } else {
        // Static favicon
        await this.updateFaviconDisplay();
      }
    } catch (error) {
      console.error('Error setting favicon:', error);
    }
  }

  /**
   * Set badge
   */
  setBadge(config: BadgeConfig): void {
    this.currentBadge = BadgeRenderer.validateConfig(config);
    this.updateFaviconDisplay();
  }

  /**
   * Update badge
   */
  updateBadge(number: number | string): void {
    if (!this.currentBadge) {
      console.warn('No badge configured. Call setBadge first.');
      return;
    }

    this.currentBadge.number = number;
    this.updateFaviconDisplay();
  }

  /**
   * Remove badge
   */
  removeBadge(): void {
    this.currentBadge = null;
    this.updateFaviconDisplay();
  }

  /**
   * Start animation for GIF/WebP
   */
  private async startAnimation(
    url: string,
    corsMode: 'cors' | 'no-cors' | 'same-origin',
    loopCount: number
  ): Promise<void> {
    try {
      // Decode frames
      this.decodedFrames = await decodeImageFrames(url, { corsMode });

      if (this.decodedFrames.length <= 1) {
        // Not animated or single frame
        await this.updateFaviconDisplay();
        return;
      }

      // Create animation loop
      this.animationLoop = new AnimationLoop({
        frames: this.decodedFrames,
        faviconSize: this.faviconSize,
        badge: this.currentBadge,
        loopCount,
        onFrameChange: (frameIndex) => {
          this.updateAnimationFrame();
        },
        onAnimationEnd: () => {
          this.isAnimating = false;
        }
      });

      // Start animation if visible
      if (this.isVisible) {
        this.animationLoop.play();
        this.isAnimating = true;
        this.updateAnimationFrame();
      }
    } catch (error) {
      console.error('Failed to start animation:', error);
      throw error;
    }
  }

  /**
   * Stop animation and cleanup
   */
  private stopAnimation(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.animationLoop) {
      this.animationLoop.destroy();
      this.animationLoop = null;
    }

    if (this.decodedFrames.length > 0) {
      releaseFrames(this.decodedFrames);
      this.decodedFrames = [];
    }

    this.isAnimating = false;
  }

  /**
   * Update animation frame on favicon
   */
  private updateAnimationFrame(): void {
    if (!this.animationLoop) return;

    try {
      const dataUrl = this.animationLoop.getCurrentFrameDataUrl();
      this.faviconLink.href = dataUrl;
    } catch (error) {
      console.error('Error updating animation frame:', error);
    }
  }

  /**
   * Update favicon display (with badge if configured)
   */
  private async updateFaviconDisplay(): Promise<void> {
    if (!this.currentFavicon) return;

    try {
      let displayUrl = this.currentFavicon.url;

      // If badge is configured, render it on canvas
      if (this.currentBadge) {
        const canvas = createCanvas(this.faviconSize);
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        // Load and draw favicon image
        const img = await loadImage(this.currentFavicon.url);
        ctx.drawImage(img, 0, 0, this.faviconSize, this.faviconSize);

        // Draw badge on top
        BadgeRenderer.drawBadge(ctx, this.currentBadge, this.faviconSize);

        // Convert to data URL
        displayUrl = canvasToDataUrl(canvas);
      }

      // Update favicon link
      this.faviconLink.href = displayUrl;
    } catch (error) {
      console.error('Error updating favicon display:', error);
    }
  }

  /**
   * Pause animation
   */
  pause(): void {
    if (this.animationLoop) {
      this.animationLoop.pause();
    }
    this.isAnimating = false;
  }

  /**
   * Resume animation
   */
  resume(): void {
    if (this.isVisible && this.animationLoop) {
      this.animationLoop.resume();
      this.isAnimating = true;
    }
  }

  /**
   * Get current favicon data
   */
  getFavicon(): FaviconData | null {
    return this.currentFavicon;
  }

  /**
   * Get current badge config
   */
  getBadge(): BadgeConfig | null {
    return this.currentBadge;
  }

  /**
   * Check if currently animating
   */
  getIsAnimating(): boolean {
    return this.isAnimating;
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.stopAnimation();
    this.pause();
    if (this.unsubscribeVisibility) {
      this.unsubscribeVisibility();
    }
  }
}
