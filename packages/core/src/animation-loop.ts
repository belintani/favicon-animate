/**
 * Animation loop manager for favicon frame playback
 */

import { DecodedFrame } from './frame-decoder';
import { BadgeConfig } from './types';
import { BadgeRenderer } from './badge';
import { createCanvas, canvasToDataUrl } from './utils';

export interface AnimationLoopOptions {
  frames: DecodedFrame[];
  faviconSize: number;
  badge?: BadgeConfig | null;
  loopCount?: number; // 0 = infinite, >0 = finite
  onFrameChange?: (frameIndex: number) => void;
  onAnimationEnd?: () => void;
}

/**
 * Manages animation loop for favicon frames
 */
export class AnimationLoop {
  private frames: DecodedFrame[];
  private faviconSize: number;
  private badge: BadgeConfig | null;
  private loopCount: number;
  private currentFrameIndex: number = 0;
  private currentLoop: number = 0;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private nextFrameTimeout: number | null = null;
  private onFrameChange: ((frameIndex: number) => void) | null;
  private onAnimationEnd: (() => void) | null;

  constructor(options: AnimationLoopOptions) {
    this.frames = options.frames;
    this.faviconSize = options.faviconSize;
    this.badge = options.badge || null;
    this.loopCount = options.loopCount || 0;
    this.onFrameChange = options.onFrameChange || null;
    this.onAnimationEnd = options.onAnimationEnd || null;
  }

  /**
   * Start animation loop
   */
  play(): void {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.isPaused = false;
    this.currentFrameIndex = 0;
    this.currentLoop = 0;

    this.scheduleNextFrame();
  }

  /**
   * Pause animation
   */
  pause(): void {
    if (!this.isPlaying) return;

    this.isPaused = true;
    this.clearScheduledFrame();
  }

  /**
   * Resume animation
   */
  resume(): void {
    if (!this.isPaused) return;

    this.isPaused = false;
    this.scheduleNextFrame();
  }

  /**
   * Stop animation and cleanup
   */
  stop(): void {
    this.isPlaying = false;
    this.isPaused = false;
    this.clearScheduledFrame();
    this.currentFrameIndex = 0;
    this.currentLoop = 0;
  }

  /**
   * Get current frame data URL
   */
  getCurrentFrameDataUrl(): string {
    if (this.currentFrameIndex >= this.frames.length) {
      this.currentFrameIndex = 0;
    }

    const frame = this.frames[this.currentFrameIndex];
    const canvas = createCanvas(this.faviconSize);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Draw the frame bitmap
    ctx.drawImage(frame.bitmap, 0, 0, this.faviconSize, this.faviconSize);

    // Draw badge if configured
    if (this.badge) {
      BadgeRenderer.drawBadge(ctx, this.badge, this.faviconSize);
    }

    return canvasToDataUrl(canvas);
  }

  /**
   * Schedule next frame
   */
  private scheduleNextFrame(): void {
    if (!this.isPlaying || this.isPaused) return;

    // Check if animation should end
    if (this.loopCount > 0 && this.currentLoop >= this.loopCount) {
      this.stop();
      if (this.onAnimationEnd) {
        this.onAnimationEnd();
      }
      return;
    }

    const frame = this.frames[this.currentFrameIndex];
    const duration = frame.durationMs;

    // Notify frame change
    if (this.onFrameChange) {
      this.onFrameChange(this.currentFrameIndex);
    }

    // Schedule next frame
    this.nextFrameTimeout = window.setTimeout(() => {
      this.currentFrameIndex++;

      // Check if we've reached the end of frames
      if (this.currentFrameIndex >= this.frames.length) {
        this.currentFrameIndex = 0;
        this.currentLoop++;

        // Check loop count
        if (this.loopCount > 0 && this.currentLoop >= this.loopCount) {
          this.stop();
          if (this.onAnimationEnd) {
            this.onAnimationEnd();
          }
          return;
        }
      }

      // Schedule next frame
      this.scheduleNextFrame();
    }, duration);
  }

  /**
   * Clear scheduled frame timeout
   */
  private clearScheduledFrame(): void {
    if (this.nextFrameTimeout !== null) {
      clearTimeout(this.nextFrameTimeout);
      this.nextFrameTimeout = null;
    }
  }

  /**
   * Check if animation is playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying && !this.isPaused;
  }

  /**
   * Get current frame index
   */
  getCurrentFrameIndex(): number {
    return this.currentFrameIndex;
  }

  /**
   * Update badge during animation
   */
  setBadge(badge: BadgeConfig | null): void {
    this.badge = badge || null;
  }

  /**
   * Get current badge
   */
  getBadge(): BadgeConfig | null {
    return this.badge;
  }

  /**
   * Get total frames
   */
  getFrameCount(): number {
    return this.frames.length;
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stop();
  }
}
