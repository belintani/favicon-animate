import { describe, it, expect } from 'vitest';
import { hasImageDecoder } from './frame-decoder';
import { isSameOrigin } from './cors-handler';

describe('Frame Decoder', () => {
  describe('hasImageDecoder', () => {
    it('should detect ImageDecoder availability', () => {
      const result = hasImageDecoder();
      expect(typeof result).toBe('boolean');
    });
  });
});

describe('CORS Handler', () => {
  describe('isSameOrigin', () => {
    it('should recognize data URLs as same origin', () => {
      expect(isSameOrigin('data:image/webp;base64,abc')).toBe(true);
    });

    it('should recognize relative URLs as same origin', () => {
      expect(isSameOrigin('/favicon.webp')).toBe(true);
      // Relative paths like ./favicon.webp are treated as same origin by URL constructor
      expect(isSameOrigin('./favicon.webp')).toBe(true);
    });

    it('should recognize same origin absolute URLs', () => {
      const currentOrigin = window.location.origin;
      expect(isSameOrigin(`${currentOrigin}/favicon.webp`)).toBe(true);
    });

    it('should recognize cross-origin URLs', () => {
      expect(isSameOrigin('https://example.com/favicon.webp')).toBe(false);
    });

    it('should handle invalid URLs gracefully', () => {
      // Invalid URLs are treated as relative paths, so they're same origin
      expect(isSameOrigin('not a url')).toBe(true);
    });
  });
});
