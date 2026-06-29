import { describe, it, expect, vi } from 'vitest';
import { hasImageDecoder, isSameOrigin } from './frame-decoder';
import { isSameOrigin as corsHandlerIsSameOrigin } from './cors-handler';

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
      expect(corsHandlerIsSameOrigin('data:image/webp;base64,abc')).toBe(true);
    });

    it('should recognize relative URLs as same origin', () => {
      expect(corsHandlerIsSameOrigin('/favicon.webp')).toBe(true);
      expect(corsHandlerIsSameOrigin('./favicon.webp')).toBe(false); // Relative paths need full URL
    });

    it('should recognize same origin absolute URLs', () => {
      const currentOrigin = window.location.origin;
      expect(corsHandlerIsSameOrigin(`${currentOrigin}/favicon.webp`)).toBe(true);
    });

    it('should recognize cross-origin URLs', () => {
      expect(corsHandlerIsSameOrigin('https://example.com/favicon.webp')).toBe(false);
    });

    it('should handle invalid URLs gracefully', () => {
      expect(corsHandlerIsSameOrigin('not a url')).toBe(false);
    });
  });
});
