import { describe, it, expect, beforeEach } from 'vitest';
import { BadgeRenderer } from './badge';
import { BadgeConfig } from './types';

describe('BadgeRenderer', () => {
  describe('calculatePosition', () => {
    it('should calculate top-left position', () => {
      const pos = BadgeRenderer.calculatePosition('top-left', 32, 16, 2);
      expect(pos.x).toBe(10); // offset + radius
      expect(pos.y).toBe(10);
    });

    it('should calculate top-right position', () => {
      const pos = BadgeRenderer.calculatePosition('top-right', 32, 16, 2);
      expect(pos.x).toBe(22); // 32 - 2 - 8
      expect(pos.y).toBe(10);
    });

    it('should calculate bottom-left position', () => {
      const pos = BadgeRenderer.calculatePosition('bottom-left', 32, 16, 2);
      expect(pos.x).toBe(10);
      expect(pos.y).toBe(22);
    });

    it('should calculate bottom-right position', () => {
      const pos = BadgeRenderer.calculatePosition('bottom-right', 32, 16, 2);
      expect(pos.x).toBe(22);
      expect(pos.y).toBe(22);
    });

    it('should calculate center position', () => {
      const pos = BadgeRenderer.calculatePosition('center', 32, 16, 2);
      expect(pos.x).toBe(16);
      expect(pos.y).toBe(16);
    });
  });

  describe('validateConfig', () => {
    it('should validate correct config', () => {
      const config: Partial<BadgeConfig> = {
        number: 5,
        position: 'top-right'
      };

      const validated = BadgeRenderer.validateConfig(config);
      expect(validated.number).toBe(5);
      expect(validated.position).toBe('top-right');
    });

    it('should apply defaults', () => {
      const validated = BadgeRenderer.validateConfig({
        number: 10,
        position: 'top-left'
      });

      expect(validated.backgroundColor).toBe('#FF0000');
      expect(validated.textColor).toBe('#FFFFFF');
      expect(validated.size).toBe(16);
      expect(validated.fontSize).toBe(12);
    });

    it('should reject invalid position', () => {
      expect(() => {
        BadgeRenderer.validateConfig({
          number: 5,
          position: 'invalid' as any
        });
      }).toThrow();
    });

    it('should enforce minimum size', () => {
      const validated = BadgeRenderer.validateConfig({
        number: 5,
        position: 'top-right',
        size: 2
      });

      expect(validated.size).toBeGreaterThanOrEqual(8);
    });

    it('should enforce minimum font size', () => {
      const validated = BadgeRenderer.validateConfig({
        number: 5,
        position: 'top-right',
        fontSize: 2
      });

      expect(validated.fontSize).toBeGreaterThanOrEqual(6);
    });

    it('should enforce non-negative offset', () => {
      const validated = BadgeRenderer.validateConfig({
        number: 5,
        position: 'top-right',
        offset: -5
      });

      expect(validated.offset).toBeGreaterThanOrEqual(0);
    });
  });

  describe('drawBadge', () => {
    it('should draw badge on canvas', () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d')!;

      const config: BadgeConfig = {
        number: 5,
        position: 'top-right',
        backgroundColor: '#FF0000',
        textColor: '#FFFFFF',
        size: 16,
        fontSize: 12
      };

      expect(() => {
        BadgeRenderer.drawBadge(ctx, config, 32);
      }).not.toThrow();
    });

    it('should handle string numbers', () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d')!;

      const config: BadgeConfig = {
        number: '99+',
        position: 'top-right',
        size: 16,
        fontSize: 12
      };

      expect(() => {
        BadgeRenderer.drawBadge(ctx, config, 32);
      }).not.toThrow();
    });
  });
});
