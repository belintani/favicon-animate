# Animated Favicon Support

favicon-animate now supports animated GIF and WebP favicons with frame-by-frame control and badge composition.

## How It Works

The library uses two approaches for animation:

### 1. ImageDecoder (WebCodecs) - Primary Method
- **Browsers**: Chromium, Firefox (recent versions)
- **Advantages**: Precise frame control, exact frame durations, full compositing
- **Method**: Decodes all frames upfront and caches them as ImageBitmaps

### 2. Fallback: HTMLImageElement + drawImage
- **Browsers**: Safari, older browsers, when ImageDecoder unavailable
- **Advantages**: Works everywhere, simple implementation
- **Limitations**: Can't control exact frames or durations, samples current frame

## Basic Usage

```javascript
import { FaviconAnimator } from 'favicon-animate';

const animator = new FaviconAnimator({
  enableAnimation: true, // Enable animated favicon support
  pauseOnHidden: true    // Pause when tab is not visible
});

// Set an animated favicon
await animator.setFavicon({
  url: '/path/to/animated.webp',
  animate: true,        // Enable animation (default: true for GIF/WebP)
  corsMode: 'cors',     // CORS mode for cross-origin images
  loopCount: 0          // 0 = infinite loop, >0 = finite
});
```

## Configuration Options

### FaviconConfig

```typescript
interface FaviconConfig {
  url: string;                                    // Image URL
  size?: number;                                  // Favicon size (default: 32)
  animate?: boolean;                              // Enable animation (default: true)
  corsMode?: 'cors' | 'no-cors' | 'same-origin'; // CORS mode (default: 'cors')
  loopCount?: number;                             // Loop count (default: 0 = infinite)
}
```

### AnimatorOptions

```typescript
interface AnimatorOptions {
  favicon?: FaviconConfig | string;
  badge?: BadgeConfig;
  pauseOnHidden?: boolean;      // Pause when tab hidden (default: true)
  enableAnimation?: boolean;    // Enable animation globally (default: true)
  updateInterval?: number;      // Update interval in ms
  linkSelector?: string;        // Custom favicon link selector
}
```

## Animation with Badges

Badges automatically compose with animated frames:

```javascript
const animator = new FaviconAnimator();

// Set animated favicon
await animator.setFavicon({
  url: '/animated.webp',
  animate: true
});

// Add badge - it will appear on every frame
animator.setBadge({
  number: 5,
  position: 'top-right',
  backgroundColor: '#ff0000',
  textColor: '#ffffff'
});

// Update badge number (updates all frames)
animator.updateBadge(10);
```

## Pause/Resume

Animation automatically pauses when tab is hidden (if `pauseOnHidden: true`):

```javascript
// Manual pause
animator.pause();

// Manual resume
animator.resume();

// Check if animating
if (animator.getIsAnimating()) {
  console.log('Animation is running');
}
```

## CORS Handling

For cross-origin animated images, the server must include CORS headers:

```
Access-Control-Allow-Origin: *
```

If CORS fails, the library falls back to static image with a warning:

```
[favicon-animate] CORS issue with favicon: https://example.com/animated.webp
Error: Failed to fetch image
Falling back to static image. To fix:
1. Ensure the image server sends Access-Control-Allow-Origin header
2. Or use a same-origin image
3. Or set corsMode: 'no-cors' (but canvas will be tainted)
```

## Performance Considerations

### Memory
- All frames are decoded and cached in memory
- For large GIFs/WebPs with many frames, this can use significant memory
- Frames are released when animation stops or animator is destroyed

### CPU
- Animation loop respects frame durations (no fixed interval)
- Pauses automatically when tab is hidden
- Minimal CPU usage when paused

### Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| GIF Animation | ✅ | ✅ | ⚠️ | ✅ |
| WebP Animation | ✅ | ✅ | ❌ | ✅ |
| ImageDecoder | ✅ | ✅ | ❌ | ✅ |
| Fallback | ✅ | ✅ | ✅ | ✅ |

⚠️ = Works but with limitations (fallback method)
❌ = Not supported

## Examples

### Simple Animated Favicon

```javascript
const animator = new FaviconAnimator();
await animator.setFavicon('/spinner.webp');
```

### Animated Favicon with Badge

```javascript
const animator = new FaviconAnimator({
  favicon: {
    url: '/loading.gif',
    animate: true
  },
  badge: {
    number: 3,
    position: 'top-right'
  }
});
```

### Finite Loop Animation

```javascript
const animator = new FaviconAnimator();
await animator.setFavicon({
  url: '/animation.webp',
  loopCount: 2  // Play twice then stop
});
```

### React Example

```jsx
import { useEffect, useRef } from 'react';
import { FaviconAnimator } from 'favicon-animate';

export function AnimatedFavicon() {
  const animatorRef = useRef(null);

  useEffect(() => {
    const animator = new FaviconAnimator({
      enableAnimation: true,
      pauseOnHidden: true
    });
    animatorRef.current = animator;

    animator.setFavicon({
      url: '/animated.webp',
      animate: true
    });

    return () => animator.destroy();
  }, []);

  const updateBadge = (count) => {
    animatorRef.current?.updateBadge(count);
  };

  return (
    <button onClick={() => updateBadge(5)}>
      Update Badge
    </button>
  );
}
```

## Troubleshooting

### Animation not playing

1. Check browser console for CORS warnings
2. Verify image format is GIF or WebP
3. Check if `animate: true` is set
4. Verify `enableAnimation: true` in animator options

### Canvas tainted error

This happens when loading cross-origin images without CORS headers.

**Solution**: Ensure server sends `Access-Control-Allow-Origin` header.

### High memory usage

For large animated images with many frames, memory usage can be high.

**Solution**: Use smaller images or reduce frame count.

### Animation stuttering

This can happen if:
- Browser is under heavy load
- Tab is not visible (animation pauses)
- JavaScript execution is blocked

**Solution**: Reduce other page load, ensure smooth JavaScript execution.

## API Reference

See [API.md](./api.md) for complete API documentation.
