/**
 * Simple Event Emitter for favicon-animate
 */

export type EventListener = (...args: any[]) => void;

export class EventEmitter {
  private events: Map<string, Set<EventListener>> = new Map();

  /**
   * Register event listener
   */
  on(event: string, listener: EventListener): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    this.events.get(event)!.add(listener);

    // Return unsubscribe function
    return () => {
      this.off(event, listener);
    };
  }

  /**
   * Register one-time event listener
   */
  once(event: string, listener: EventListener): () => void {
    const wrapper = (...args: any[]) => {
      listener(...args);
      this.off(event, wrapper);
    };

    return this.on(event, wrapper);
  }

  /**
   * Remove event listener
   */
  off(event: string, listener: EventListener): void {
    if (!this.events.has(event)) return;

    this.events.get(event)!.delete(listener);

    if (this.events.get(event)!.size === 0) {
      this.events.delete(event);
    }
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners(event?: string): void {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
  }

  /**
   * Emit event
   */
  emit(event: string, ...args: any[]): boolean {
    if (!this.events.has(event)) return false;

    this.events.get(event)!.forEach(listener => {
      try {
        listener(...args);
      } catch (error) {
        console.error(`Error in listener for event "${event}":`, error);
      }
    });

    return true;
  }

  /**
   * Get listener count for event
   */
  listenerCount(event: string): number {
    return this.events.get(event)?.size || 0;
  }

  /**
   * Get all event names
   */
  eventNames(): string[] {
    return Array.from(this.events.keys());
  }
}
