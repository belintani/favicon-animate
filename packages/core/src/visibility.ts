/**
 * Page Visibility API wrapper for managing favicon animations
 * when the tab is not in focus
 */

export type VisibilityChangeCallback = (isVisible: boolean) => void;

export class VisibilityManager {
  private isVisible: boolean = true;
  private callbacks: Set<VisibilityChangeCallback> = new Set();
  private boundHandleVisibilityChange: () => void;

  constructor() {
    this.boundHandleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.init();
  }

  private init(): void {
    // Check initial visibility state
    this.isVisible = !document.hidden;

    // Listen for visibility changes
    document.addEventListener('visibilitychange', this.boundHandleVisibilityChange);
  }

  private handleVisibilityChange(): void {
    const wasVisible = this.isVisible;
    this.isVisible = !document.hidden;

    // Only notify if state actually changed
    if (wasVisible !== this.isVisible) {
      this.notifyCallbacks();
    }
  }

  private notifyCallbacks(): void {
    this.callbacks.forEach(callback => {
      try {
        callback(this.isVisible);
      } catch (error) {
        console.error('Error in visibility callback:', error);
      }
    });
  }

  /**
   * Subscribe to visibility changes
   */
  onChange(callback: VisibilityChangeCallback): () => void {
    this.callbacks.add(callback);

    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback);
    };
  }

  /**
   * Get current visibility state
   */
  getIsVisible(): boolean {
    return this.isVisible;
  }

  /**
   * Cleanup
   */
  destroy(): void {
    document.removeEventListener('visibilitychange', this.boundHandleVisibilityChange);
    this.callbacks.clear();
  }
}

// Singleton instance
let visibilityManager: VisibilityManager | null = null;

export function getVisibilityManager(): VisibilityManager {
  if (!visibilityManager) {
    visibilityManager = new VisibilityManager();
  }
  return visibilityManager;
}
