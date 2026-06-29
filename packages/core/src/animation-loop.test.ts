import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnimationLoop } from './animation-loop';
import { DecodedFrame } from './frame-decoder';

describe('AnimationLoop', () => {
  let mockFrames: DecodedFrame[];
  let mockBitmap: ImageBitmap;

  beforeEach(() => {
    // Mock ImageBitmap
    mockBitmap = {
      width: 32,
      height: 32,
      close: vi.fn()
    } as unknown as ImageBitmap;

    mockFrames = [
      { bitmap: mockBitmap, durationMs: 100 },
      { bitmap: mockBitmap, durationMs: 150 },
      { bitmap: mockBitmap, durationMs: 100 }
    ];
  });

  describe('play/pause/resume', () => {
    it('should start animation', () => {
      const loop = new AnimationLoop({
        frames: mockFrames,
        faviconSize: 32
      });

      loop.play();
      expect(loop.getIsPlaying()).toBe(true);
    });

    it('should pause animation', () => {
      const loop = new AnimationLoop({
        frames: mockFrames,
        faviconSize: 32
      });

      loop.play();
      loop.pause();
      expect(loop.getIsPlaying()).toBe(false);
    });

    it('should resume animation', () => {
      const loop = new AnimationLoop({
        frames: mockFrames,
        faviconSize: 32
      });

      loop.play();
      loop.pause();
      loop.resume();
      expect(loop.getIsPlaying()).toBe(true);
    });
  });

  describe('frame management', () => {
    it('should return correct frame count', () => {
      const loop = new AnimationLoop({
        frames: mockFrames,
        faviconSize: 32
      });

      expect(loop.getFrameCount()).toBe(3);
    });

    it('should track current frame index', () => {
      const loop = new AnimationLoop({
        frames: mockFrames,
        faviconSize: 32
      });

      expect(loop.getCurrentFrameIndex()).toBe(0);
    });

    it('should handle single frame (no animation)', () => {
      const singleFrame: DecodedFrame[] = [
        { bitmap: mockBitmap, durationMs: 100 }
      ];

      const loop = new AnimationLoop({
        frames: singleFrame,
        faviconSize: 32
      });

      loop.play();
      expect(loop.getFrameCount()).toBe(1);
    });
  });

  describe('loop count', () => {
    it('should support infinite loop (loopCount = 0)', () => {
      const onAnimationEnd = vi.fn();
      const loop = new AnimationLoop({
        frames: mockFrames,
        faviconSize: 32,
        loopCount: 0,
        onAnimationEnd
      });

      loop.play();
      // Infinite loop should not call onAnimationEnd
      expect(onAnimationEnd).not.toHaveBeenCalled();
    });

    it('should support finite loop', () => {
      const onAnimationEnd = vi.fn();
      const loop = new AnimationLoop({
        frames: mockFrames,
        faviconSize: 32,
        loopCount: 1,
        onAnimationEnd
      });

      loop.play();
      expect(loop.getIsPlaying()).toBe(true);
    });
  });

  describe('callbacks', () => {
    it('should call onFrameChange callback', () => {
      const onFrameChange = vi.fn();
      const loop = new AnimationLoop({
        frames: mockFrames,
        faviconSize: 32,
        onFrameChange
      });

      loop.play();
      // Frame change should be called
      expect(onFrameChange).toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('should cleanup resources on destroy', () => {
      const loop = new AnimationLoop({
        frames: mockFrames,
        faviconSize: 32
      });

      loop.play();
      loop.destroy();

      expect(loop.getIsPlaying()).toBe(false);
    });

    it('should stop animation on stop', () => {
      const loop = new AnimationLoop({
        frames: mockFrames,
        faviconSize: 32
      });

      loop.play();
      loop.stop();

      expect(loop.getIsPlaying()).toBe(false);
      expect(loop.getCurrentFrameIndex()).toBe(0);
    });
  });
});
