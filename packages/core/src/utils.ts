/**
 * Utility functions
 */

/**
 * Get or create favicon link element
 */
export function getFaviconLink(): HTMLLinkElement {
  let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement;

  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    document.head.appendChild(link);
  }

  return link;
}

/**
 * Create canvas element
 */
export function createCanvas(size: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  return canvas;
}

/**
 * Load image from URL
 */
export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

/**
 * Detect image format from URL or data URL
 */
export function detectImageFormat(url: string): 'gif' | 'webp' | 'png' | 'ico' | 'svg' | 'unknown' {
  if (url.startsWith('data:')) {
    const mimeType = url.split(';')[0].split(':')[1];
    if (mimeType.includes('gif')) return 'gif';
    if (mimeType.includes('webp')) return 'webp';
    if (mimeType.includes('svg')) return 'svg';
    if (mimeType.includes('png')) return 'png';
    if (mimeType.includes('icon')) return 'ico';
  } else {
    const ext = url.split('.').pop()?.toLowerCase();
    if (ext === 'gif') return 'gif';
    if (ext === 'webp') return 'webp';
    if (ext === 'svg') return 'svg';
    if (ext === 'ico') return 'ico';
    if (ext === 'png') return 'png';
  }
  return 'unknown';
}

/**
 * Check if browser supports Page Visibility API
 */
export function supportsPageVisibility(): boolean {
  return typeof document.hidden !== 'undefined';
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Convert canvas to data URL
 */
export function canvasToDataUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png');
}

/**
 * Check if running in browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}
