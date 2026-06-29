/**
 * Canvas Animator for custom favicon animations
 */

import { BadgeConfig } from 'favicon-animate';
import { BadgeRenderer, createCanvas, canvasToDataUrl, getFaviconLink } from 'favicon-animate';

export type AnimationFrame = (ctx: CanvasRenderingContext2D, progress: number) => void;

export interface CanvasAnimatorOptions {
  /** Size of the favicon canvas */
  size?: number;
  /** Animation frame callback */
  frame: AnimationFrame;
  /** Animation duration in ms (0 = infinite) */
  duration?: number;
  /** Frame rate in fps */
  fps?: number;
  /** Badge configuration (optional) */
  badge?: BadgeConfig;
  /** Whether to loop animation */
  loop?: boolean;
  /** Whether to pause when tab is hidden */
  pauseOnHidden?: boolean;
}

export class CanvasAnimator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrameId: number | null = null;
  private startTime: number = 0;
  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private size: number;
  private frame: AnimationFrame;
  private duration: number;
  private fps: number;
  private badge: BadgeConfig | null;
  private loop: boolean;
  private pauseOnHidden: boolean;
  private faviconLink: HTMLLinkElement;

  constructor(options: CanvasAnimatorOptions) {
    const {
      size = 32,
      frame,
      duration = 0,
      fps = 60,
      badge = null,
      loop = true,
      pauseOnHidden = true
    } = options;

    this.size = size;
    this.frame = frame;
    this.duration = duration;
    this.fps = Math.max(1, fps);
    this.badge = badge;
    this.loop = loop;
    this.pauseOnHidden = pauseOnHidden;

    // Create canvas
    this.canvas = createCanvas(size);
    this.ctx = this.canvas.getContext('2d')!;
    this.faviconLink = getFaviconLink();

    // Setup visibility listener if needed
    if (pauseOnHidden) {
      this.setupVisibilityListener();
    }
  }

  private setupVisibilityListener(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else if (this.isRunning) {
        this.resume();
      }
    });
  }

  /**
   * Start animation
   */
  start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.isPaused = false;
    this.startTime = performance.now();
    this.animate();
  }

  /**
   * Pause animation
   */
  pause(): void {
    if (!this.isRunning || this.isPaused) return;

    this.isPaused = true;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Resume animation
   */
  resume(): void {
    if (!this.isRunning || !this.isPaused) return;

    this.isPaused = false;
    this.startTime = performance.now() - (this.startTime || 0);
    this.animate();
  }

  /**
   * Stop animation
   */
  stop(): void {
    this.isRunning = false;
    this.isPaused = false;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Set badge
   */
  setBadge(badge: BadgeConfig | null): void {
    this.badge = badge;
  }

  /**
   * Update badge number
   */
  updateBadge(number: number | string): void {
    if (!this.badge) return;
    this.badge.number = number;
  }

  /**
   * Internal animation loop
   */
  private animate = (): void => {
    if (!this.isRunning || this.isPaused) return;

    const now = performance.now();
    const elapsed = now - this.startTime;

    // Calculate progress (0 to 1)
    const progress = this.duration > 0 ? (elapsed % this.duration) / this.duration : (elapsed % 1000) / 1000;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.size, this.size);

    // Call frame callback
    try {
      this.frame(this.ctx, progress);
    } catch (error) {
      console.error('Error in animation frame:', error);
    }

    // Draw badge if configured
    if (this.badge) {
      try {
        BadgeRenderer.drawBadge(this.ctx, this.badge, this.size);
      } catch (error) {
        console.error('Error drawing badge:', error);
      }
    }

    // Update favicon
    this.faviconLink.href = canvasToDataUrl(this.canvas);

    // Check if animation should continue
    if (this.duration > 0 && elapsed >= this.duration) {
      if (this.loop) {
        this.startTime = now;
      } else {
        this.stop();
        return;
      }
    }

    // Schedule next frame
    const frameInterval = 1000 / this.fps;
    this.animationFrameId = window.setTimeout(() => {
      this.animationFrameId = window.requestAnimationFrame(this.animate);
    }, frameInterval);
  };

  /**
   * Get animation state
   */
  getIsRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Get pause state
   */
  getIsPaused(): boolean {
    return this.isPaused;
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.stop();
  }
}
