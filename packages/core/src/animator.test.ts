import { describe, it, expect, afterEach } from 'vitest';
import { FaviconAnimator } from './animator';

describe('FaviconAnimator', () => {
  let animator: FaviconAnimator;

  afterEach(() => {
    animator.destroy();
  });

  describe('initialization', () => {
    it('should create animator instance', () => {
      animator = new FaviconAnimator({
        favicon: 'data:image/svg+xml,<svg></svg>'
      });
      expect(animator).toBeDefined();
    });

    it('should set favicon on init', async () => {
      animator = new FaviconAnimator({
        favicon: 'data:image/svg+xml,<svg></svg>'
      });
      const favicon = animator.getFavicon();
      expect(favicon).toBeDefined();
    });

    it('should set initial badge if provided', () => {
      animator = new FaviconAnimator({
        favicon: 'data:image/svg+xml,<svg></svg>',
        badge: { number: 5, position: 'top-right' }
      });

      const badge = animator.getBadge();
      expect(badge).toBeDefined();
      expect(badge?.number).toBe(5);
    });
  });

  describe('badge management', () => {
    it('should set badge', () => {
      animator = new FaviconAnimator({
        favicon: 'data:image/svg+xml,<svg></svg>'
      });
      animator.setBadge({
        number: 5,
        position: 'top-right'
      });

      const badge = animator.getBadge();
      expect(badge?.number).toBe(5);
      expect(badge?.position).toBe('top-right');
    });

    it('should update badge number', () => {
      animator = new FaviconAnimator({
        favicon: 'data:image/svg+xml,<svg></svg>'
      });
      animator.setBadge({
        number: 5,
        position: 'top-right'
      });

      animator.updateBadge(10);
      const badge = animator.getBadge();
      expect(badge?.number).toBe(10);
    });

    it('should remove badge', () => {
      animator = new FaviconAnimator({
        favicon: 'data:image/svg+xml,<svg></svg>'
      });
      animator.setBadge({
        number: 5,
        position: 'top-right'
      });

      animator.removeBadge();
      const badge = animator.getBadge();
      expect(badge).toBeNull();
    });
  });

  describe('animation control', () => {
    it('should pause animation', () => {
      animator = new FaviconAnimator({
        favicon: 'data:image/svg+xml,<svg></svg>'
      });
      animator.pause();
      expect(animator.getIsAnimating()).toBe(false);
    });

    it('should resume animation', () => {
      animator = new FaviconAnimator({
        favicon: 'data:image/svg+xml,<svg></svg>'
      });
      animator.pause();
      animator.resume();
      expect(animator.getIsAnimating()).toBe(true);
    });
  });
});
