/**
 * CORS and canvas taint handling for animated favicons
 */

/**
 * Check if canvas is tainted (can't export to data URL)
 */
export function isCanvasTainted(canvas: HTMLCanvasElement): boolean {
  try {
    canvas.toDataURL();
    return false;
  } catch (error) {
    return true;
  }
}

/**
 * Test if an image can be loaded with CORS
 */
export async function testCorsImage(url: string, corsMode: 'cors' | 'no-cors' | 'same-origin' = 'cors'): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = corsMode === 'cors' ? 'anonymous' : 'use-credentials';

    img.onload = () => {
      // Try to draw on canvas to verify CORS
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(false);
          return;
        }

        ctx.drawImage(img, 0, 0);
        canvas.toDataURL();
        resolve(true);
      } catch (error) {
        resolve(false);
      }
    };

    img.onerror = () => {
      resolve(false);
    };

    img.src = url;
  });
}

/**
 * Get appropriate CORS mode for URL
 */
export async function getCorsMode(url: string): Promise<'cors' | 'no-cors' | 'same-origin'> {
  // Same origin URLs don't need CORS
  if (isSameOrigin(url)) {
    return 'same-origin';
  }

  // Test CORS
  if (await testCorsImage(url, 'cors')) {
    return 'cors';
  }

  // Fallback to no-cors (will work but canvas will be tainted)
  return 'no-cors';
}

/**
 * Check if URL is same origin
 */
export function isSameOrigin(url: string): boolean {
  if (url.startsWith('data:')) {
    return true;
  }

  if (url.startsWith('/')) {
    return true;
  }

  try {
    const urlObj = new URL(url, window.location.href);
    return urlObj.origin === window.location.origin;
  } catch {
    return false;
  }
}

/**
 * Log CORS warning
 */
export function logCorsWarning(url: string, error: Error): void {
  console.warn(
    `[favicon-animate] CORS issue with favicon: ${url}\n` +
    `Error: ${error.message}\n` +
    `Falling back to static image. To fix:\n` +
    `1. Ensure the image server sends Access-Control-Allow-Origin header\n` +
    `2. Or use a same-origin image\n` +
    `3. Or set corsMode: 'no-cors' (but canvas will be tainted)`
  );
}
