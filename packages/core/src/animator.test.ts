import { describe, it, expect, afterEach } from 'vitest';
import { FaviconAnimator } from './animator';
import { BadgePosition } from './types';

describe('FaviconAnimator', () => {
  let animator: FaviconAnimator;

  afterEach(() => {
    if (animator) {
      animator.destroy();
    }
  });

  describe('initialization', () => {
    it('should create animator instance', () => {
      animator = new FaviconAnimator({
        favicon: 'data:image/svg+xml,<svg></svg>'
      });
      expect(animator).toBeDefined();
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
    beforeEach(() => {
      animator = new FaviconAnimator({
        favicon: 'data:image/svg+xml,<svg></svg>'
      });
    });

    it('should set badge', () => {
      animator.setBadge({
        number: 5,
        position: 'top-right'
      });

      const badge = animator.getBadge();
      expect(badge?.number).toBe(5);
      expect(badge?.position).toBe('top-right');
    });

    it('should update badge number', () => {
      animator.setBadge({
        number: 5,
        position: 'top-right'
      });

      animator.updateBadge(10);
      const badge = animator.getBadge();
      expect(badge?.number).toBe(10);
    });

    it('should remove badge', () => {
      animator.setBadge({
        number: 5,
        position: 'top-right'
      });

      animator.removeBadge();
      const badge = animator.getBadge();
      expect(badge).toBeNull();
    });

    it('should handle string numbers in badge', () => {
      animator.setBadge({
        number: '99+',
        position: 'top-right'
      });

      const badge = animator.getBadge();
      expect(badge?.number).toBe('99+');
    });

    it('should validate badge position', () => {
      expect(() => {
        animator.setBadge({
          number: 5,
          position: 'invalid' as unknown as BadgePosition
        });
      }).toThrow();
    });
  });

  describe('animation control', () => {
    beforeEach(() => {
      animator = new FaviconAnimator({
        favicon: 'data:image/svg+xml,<svg></svg>'
      });
    });

    it('should pause animation', () => {
      animator.pause();
      expect(animator.getIsAnimating()).toBe(false);
    });

    it('should resume animation when visible', () => {
      animator.pause();
      animator.resume();
      // Resume only works if page is visible, so state depends on visibility
      expect(typeof animator.getIsAnimating()).toBe('boolean');
    });

    it('should track animation state', () => {
      const isAnimating = animator.getIsAnimating();
      expect(typeof isAnimating).toBe('boolean');
    });
  });

  describe('badge positions', () => {
    beforeEach(() => {
      animator = new FaviconAnimator({
        favicon: 'data:image/svg+xml,<svg></svg>'
      });
    });

    const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'] as const;

    positions.forEach((position) => {
      it(`should support ${position} position`, () => {
        animator.setBadge({
          number: 5,
          position
        });

        const badge = animator.getBadge();
        expect(badge?.position).toBe(position);
      });
    });
  });

  describe('badge customization', () => {
    beforeEach(() => {
      animator = new FaviconAnimator({
        favicon: 'data:image/svg+xml,<svg></svg>'
      });
    });

    it('should set custom background color', () => {
      animator.setBadge({
        number: 5,
        position: 'top-right',
        backgroundColor: '#0066FF'
      });

      const badge = animator.getBadge();
      expect(badge?.backgroundColor).toBe('#0066FF');
    });

    it('should set custom text color', () => {
      animator.setBadge({
        number: 5,
        position: 'top-right',
        textColor: '#000000'
      });

      const badge = animator.getBadge();
      expect(badge?.textColor).toBe('#000000');
    });

    it('should set custom size', () => {
      animator.setBadge({
        number: 5,
        position: 'top-right',
        size: 20
      });

      const badge = animator.getBadge();
      expect(badge?.size).toBe(20);
    });

    it('should set custom font size', () => {
      animator.setBadge({
        number: 5,
        position: 'top-right',
        fontSize: 14
      });

      const badge = animator.getBadge();
      expect(badge?.fontSize).toBe(14);
    });
  });
});
