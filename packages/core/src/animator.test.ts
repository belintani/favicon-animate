import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FaviconAnimator } from './animator';

describe('FaviconAnimator', () => {
  let animator: FaviconAnimator;

  beforeEach(() => {
    animator = new FaviconAnimator({
      favicon: 'data:image/svg+xml,<svg></svg>'
    });
  });

  afterEach(() => {
    animator.destroy();
  });

  describe('initialization', () => {
    it('should create animator instance', () => {
      expect(animator).toBeDefined();
    });

    it('should set favicon on init', async () => {
      const favicon = animator.getFavicon();
      expect(favicon).toBeDefined();
    });

    it('should set initial badge if provided', () => {
      const animatorWithBadge = new FaviconAnimator({
        favicon: 'data:image/svg+xml,<svg></svg>',
        badge: { number: 5, position: 'top-right' }
      });

      const badge = animatorWithBadge.getBadge();
      expect(badge).toBeDefined();
      expect(badge?.number).toBe(5);

      animatorWithBadge.destroy();
    });
  });

  describe('setFavicon', () => {
    it('should set favicon URL', async () => {
      await animator.setFavicon('data:image/svg+xml,<svg></svg>');
      const favicon = animator.getFavicon();
      expect(favicon?.url).toBeDefined();
    });

    it('should handle favicon config object', async () => {
      await animator.setFavicon({
        url: 'data:image/svg+xml,<svg></svg>',
        size: 32
      });

      const favicon = animator.getFavicon();
      expect(favicon?.size).toBe(32);
    });

    it('should detect image format', async () => {
      await animator.setFavicon('data:image/gif;base64,R0lGOD');
      const favicon = animator.getFavicon();
      expect(favicon?.format).toBe('gif');
    });
  });

  describe('badge management', () => {
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
          position: 'invalid' as any
        });
      }).toThrow();
    });
  });

  describe('animation control', () => {
    it('should pause animation', () => {
      animator.pause();
      expect(animator.getIsAnimating()).toBe(false);
    });

    it('should resume animation', () => {
      animator.pause();
      animator.resume();
      expect(animator.getIsAnimating()).toBe(true);
    });

    it('should track animation state', () => {
      const isAnimating = animator.getIsAnimating();
      expect(typeof isAnimating).toBe('boolean');
    });
  });

  describe('cleanup', () => {
    it('should destroy animator', () => {
      animator.destroy();
      // Should not throw on subsequent operations
      expect(() => {
        animator.destroy();
      }).not.toThrow();
    });
  });

  describe('badge positions', () => {
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
