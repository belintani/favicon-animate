/**
 * Frame decoder for animated GIF/WebP using ImageDecoder (WebCodecs)
 * with fallback to img+drawImage for unsupported browsers
 */

import { logCorsWarning } from './cors-handler';

export interface DecodedFrame {
  bitmap: ImageBitmap;
  durationMs: number;
}

export interface FrameDecoderOptions {
  corsMode?: 'cors' | 'no-cors' | 'same-origin';
  onProgress?: (current: number, total: number) => void;
}

/**
 * Check if ImageDecoder is available
 */
export function hasImageDecoder(): boolean {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return typeof (globalThis as any).ImageDecoder !== 'undefined';
}

/**
 * Decode animated image using ImageDecoder (WebCodecs)
 * Returns array of frames with their durations
 */
export async function decodeImageFrames(
  url: string,
  options: FrameDecoderOptions = {}
): Promise<DecodedFrame[]> {
  const { corsMode = 'cors', onProgress } = options;

  try {
    // Fetch the image as ArrayBuffer
    const response = await fetch(url, {
      mode: corsMode as RequestMode,
      credentials: corsMode === 'cors' ? 'omit' : 'same-origin'
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || 'image/webp';
    const arrayBuffer = await response.arrayBuffer();

    // Use ImageDecoder if available
    if (hasImageDecoder()) {
      return await decodeWithImageDecoder(arrayBuffer, contentType, onProgress);
    } else {
      // Fallback to img+drawImage for unsupported browsers
      return await decodeWithImageElement(url, onProgress);
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logCorsWarning(url, err);
    throw error;
  }
}

/**
 * Decode using ImageDecoder (WebCodecs API)
 */
async function decodeWithImageDecoder(
  arrayBuffer: ArrayBuffer,
  contentType: string,
  onProgress?: (current: number, total: number) => void
): Promise<DecodedFrame[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ImageDecoderClass = (globalThis as any).ImageDecoder;

  if (!ImageDecoderClass) {
    throw new Error('ImageDecoder not available');
  }

  const decoder = new ImageDecoderClass({
    data: arrayBuffer,
    type: contentType
  });

  await decoder.tracks.ready;

  const track = decoder.tracks.selectedTrack;
  if (!track) {
    throw new Error('No video track found in image');
  }

  const frameCount = track.frameCount;
  const frames: DecodedFrame[] = [];

  for (let i = 0; i < frameCount; i++) {
    try {
      const { image } = await decoder.decode({ frameIndex: i });

      // Get frame duration (in microseconds, convert to milliseconds)
      const durationMs = image.duration ? image.duration / 1000 : 90;

      // Create ImageBitmap from VideoFrame
      const bitmap = await createImageBitmap(image);

      frames.push({
        bitmap,
        durationMs: Math.max(durationMs, 10) // Minimum 10ms per frame
      });

      image.close();

      if (onProgress) {
        onProgress(i + 1, frameCount);
      }
    } catch (error) {
      console.warn(`Failed to decode frame ${i}:`, error);
      // Continue with other frames
    }
  }

  if (frames.length === 0) {
    throw new Error('No frames could be decoded');
  }

  return frames;
}

/**
 * Fallback: Decode using HTMLImageElement + drawImage
 * This captures the current frame of an animated image
 * Note: Less precise, doesn't give exact frame durations
 */
async function decodeWithImageElement(
  url: string,
  onProgress?: (current: number, total: number) => void
): Promise<DecodedFrame[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = async () => {
      try {
        // Create a canvas and draw the image
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to get canvas context');
        }

        ctx.drawImage(img, 0, 0);

        // Convert to ImageBitmap
        const bitmap = await createImageBitmap(canvas);

        // Return single frame with default duration
        // This is a fallback - we can't get exact frame info without ImageDecoder
        const frames: DecodedFrame[] = [
          {
            bitmap,
            durationMs: 100 // Default 100ms per frame
          }
        ];

        if (onProgress) {
          onProgress(1, 1);
        }

        resolve(frames);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error(`Failed to load image: ${url}`));
    };

    img.src = url;
  });
}

/**
 * Release resources from decoded frames
 */
export function releaseFrames(frames: DecodedFrame[]): void {
  frames.forEach(frame => {
    if (frame.bitmap && typeof frame.bitmap.close === 'function') {
      frame.bitmap.close();
    }
  });
}
