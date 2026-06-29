/**
 * Simple Event Emitter for favicon-animate
 */

export type EventListener<T extends unknown[] = unknown[]> = (...args: T) => void;

export class EventEmitter<Events extends Record<string, unknown[]> = Record<string, unknown[]>> {
  private events: Map<string, Set<EventListener>> = new Map();

  /**
   * Register event listener
   */
  on<K extends keyof Events>(event: K, listener: EventListener<Events[K] extends unknown[] ? Events[K] : [Events[K]]>): () => void {
    const eventKey = String(event);
    if (!this.events.has(eventKey)) {
      this.events.set(eventKey, new Set());
    }

    this.events.get(eventKey)!.add(listener as EventListener);

    // Return unsubscribe function
    return () => {
      this.off(event, listener);
    };
  }

  /**
   * Register one-time event listener
   */
  once<K extends keyof Events>(event: K, listener: EventListener<Events[K] extends unknown[] ? Events[K] : [Events[K]]>): () => void {
    const wrapper: EventListener = (...args: unknown[]) => {
      (listener as EventListener)(...args);
      this.off(event, listener);
    };

    return this.on(event, wrapper as EventListener<Events[K] extends unknown[] ? Events[K] : [Events[K]]>);
  }

  /**
   * Remove event listener
   */
  off<K extends keyof Events>(event: K, listener: EventListener<Events[K] extends unknown[] ? Events[K] : [Events[K]]>): void {
    const eventKey = String(event);
    if (!this.events.has(eventKey)) return;

    this.events.get(eventKey)!.delete(listener as EventListener);

    if (this.events.get(eventKey)!.size === 0) {
      this.events.delete(eventKey);
    }
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners(event?: keyof Events): void {
    if (event !== undefined) {
      this.events.delete(String(event));
    } else {
      this.events.clear();
    }
  }

  /**
   * Emit event
   */
  emit<K extends keyof Events>(event: K, ...args: Events[K] extends unknown[] ? Events[K] : [Events[K]]): boolean {
    const eventKey = String(event);
    if (!this.events.has(eventKey)) return false;

    this.events.get(eventKey)!.forEach(listener => {
      try {
        listener(...(args as unknown[]));
      } catch (error) {
        console.error(`Error in listener for event "${String(event)}":`, error);
      }
    });

    return true;
  }

  /**
   * Get listener count for event
   */
  listenerCount(event: keyof Events): number {
    return this.events.get(String(event))?.size || 0;
  }

  /**
   * Get all event names
   */
  eventNames(): (keyof Events)[] {
    return Array.from(this.events.keys()) as (keyof Events)[];
  }
}
