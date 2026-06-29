import { AnimatorOptions, BadgeConfig, FaviconConfig, FaviconData } from './types';
import { BadgeRenderer } from './badge';
import { getVisibilityManager } from './visibility';
import {
  getFaviconLink,
  createCanvas,
  loadImage,
  detectImageFormat,
  canvasToDataUrl,
  isBrowser
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

  constructor(options: AnimatorOptions = {}) {
    if (!isBrowser()) {
      throw new Error('FaviconAnimator can only be used in browser environment');
    }

    this.faviconLink = getFaviconLink();
    this.pauseOnHidden = options.pauseOnHidden !== false;
    this.updateInterval = options.updateInterval || 100;

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

    const { url, size = 32 } = faviconConfig;
    this.faviconSize = size;

    try {
      // Detect format
      const format = detectImageFormat(url);

      // Create favicon data
      this.currentFavicon = {
        url,
        size,
        isAnimated: format === 'gif' || format === 'webp',
        format
      };

      // Update favicon link
      await this.updateFaviconDisplay();
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
    this.isAnimating = false;
  }

  /**
   * Resume animation
   */
  resume(): void {
    if (this.isVisible) {
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
    this.pause();
    if (this.unsubscribeVisibility) {
      this.unsubscribeVisibility();
    }
  }
}
