# API Reference

## FaviconAnimator

Main class for managing favicons with badges and animations.

### Constructor

```typescript
new FaviconAnimator(options?: AnimatorOptions)
```

**Options:**
- `favicon?: FaviconConfig | string` - Initial favicon URL or config
- `badge?: BadgeConfig` - Initial badge configuration
- `pauseOnHidden?: boolean` - Pause animation when tab is hidden (default: true)
- `updateInterval?: number` - Update interval in ms (default: 100)

**Example:**
```javascript
const animator = new FaviconAnimator({
  favicon: '/favicon.png',
  badge: { number: 5, position: 'top-right' },
  pauseOnHidden: true
});
```

### Methods

#### setFavicon(config)

Set or change the favicon.

```typescript
setFavicon(config: FaviconConfig | string): Promise<void>
```

**Parameters:**
- `config.url` - URL or data URL of the favicon
- `config.size` - Size in pixels (default: 32)

**Example:**
```javascript
await animator.setFavicon('/favicon.png');
// or
await animator.setFavicon({
  url: '/favicon.png',
  size: 32
});
```

#### setBadge(config)

Add or update a badge on the favicon.

```typescript
setBadge(config: BadgeConfig): void
```

**Parameters:**
- `number` (required) - Number or string to display
- `position` (required) - Badge position: `'top-left'`, `'top-right'`, `'bottom-left'`, `'bottom-right'`, `'center'`
- `backgroundColor` - Badge circle color (default: `'#FF0000'`)
- `textColor` - Number text color (default: `'#FFFFFF'`)
- `size` - Badge circle size in pixels (default: 16)
- `fontSize` - Number font size in pixels (default: 12)
- `offset` - Distance from edge in pixels (default: 2)
- `fontWeight` - Font weight (default: `'bold'`)
- `fontFamily` - Font family (default: `'Arial, sans-serif'`)

**Example:**
```javascript
animator.setBadge({
  number: 5,
  position: 'top-right',
  backgroundColor: '#FF0000',
  textColor: '#FFFFFF',
  size: 16,
  fontSize: 12
});
```

#### updateBadge(number)

Update the badge number without changing other properties.

```typescript
updateBadge(number: number | string): void
```

**Example:**
```javascript
animator.updateBadge(10);
animator.updateBadge('99+');
```

#### removeBadge()

Remove the badge from the favicon.

```typescript
removeBadge(): void
```

**Example:**
```javascript
animator.removeBadge();
```

#### pause()

Pause the favicon animation.

```typescript
pause(): void
```

#### resume()

Resume the favicon animation.

```typescript
resume(): void
```

#### getFavicon()

Get the current favicon data.

```typescript
getFavicon(): FaviconData | null
```

**Returns:**
```typescript
{
  url: string;
  size: number;
  isAnimated: boolean;
  format: 'gif' | 'webp' | 'png' | 'ico' | 'svg' | 'unknown';
}
```

#### getBadge()

Get the current badge configuration.

```typescript
getBadge(): BadgeConfig | null
```

#### getIsAnimating()

Check if the favicon is currently animating.

```typescript
getIsAnimating(): boolean
```

#### destroy()

Clean up and remove event listeners.

```typescript
destroy(): void
```

---

## BadgeRenderer (Utilities)

Utility class for badge rendering operations.

### Static Methods

#### drawBadge(ctx, config, faviconSize)

Draw a badge on a canvas context.

```typescript
static drawBadge(
  ctx: CanvasRenderingContext2D,
  config: BadgeConfig,
  faviconSize: number
): void
```

#### calculatePosition(position, faviconSize, badgeSize, offset)

Calculate badge position coordinates.

```typescript
static calculatePosition(
  position: BadgePosition,
  faviconSize: number,
  badgeSize: number,
  offset?: number
): { x: number; y: number }
```

#### validateConfig(config)

Validate and normalize badge configuration.

```typescript
static validateConfig(config: Partial<BadgeConfig>): BadgeConfig
```

---

## CanvasAnimator (Utilities)

Advanced class for custom canvas-based favicon animations.

### Constructor

```typescript
new CanvasAnimator(options: CanvasAnimatorOptions)
```

**Options:**
- `size` - Canvas size in pixels (default: 32)
- `frame` (required) - Animation frame callback function
- `duration` - Animation duration in ms (0 = infinite, default: 0)
- `fps` - Frame rate (default: 60)
- `badge` - Badge configuration (optional)
- `loop` - Whether to loop animation (default: true)
- `pauseOnHidden` - Pause when tab is hidden (default: true)

**Example:**
```javascript
const animator = new CanvasAnimator({
  size: 32,
  fps: 60,
  frame: (ctx, progress) => {
    // Draw animation frame
    ctx.fillStyle = '#667eea';
    ctx.fillRect(0, 0, 32, 32);
  },
  badge: { number: 5, position: 'top-right' }
});

animator.start();
```

### Methods

#### start()

Start the animation.

```typescript
start(): void
```

#### pause()

Pause the animation.

```typescript
pause(): void
```

#### resume()

Resume the animation.

```typescript
resume(): void
```

#### stop()

Stop the animation completely.

```typescript
stop(): void
```

#### setBadge(badge)

Set or update the badge.

```typescript
setBadge(badge: BadgeConfig | null): void
```

#### updateBadge(number)

Update the badge number.

```typescript
updateBadge(number: number | string): void
```

#### getIsRunning()

Check if animation is running.

```typescript
getIsRunning(): boolean
```

#### getIsPaused()

Check if animation is paused.

```typescript
getIsPaused(): boolean
```

#### destroy()

Clean up resources.

```typescript
destroy(): void
```

---

## Animation Presets (Utilities)

Pre-built animation functions for common patterns.

### Available Presets

- `spinningLoader` - Spinning arc loader
- `pulsing` - Pulsing circle with ripple effect
- `bouncingDot` - Bouncing dot animation
- `rotatingSquare` - Rotating square
- `wave` - Wave animation
- `gradientFade` - Gradient fade effect
- `blinking` - Blinking circle

### Usage

```javascript
import { CanvasAnimator, getPreset } from 'favicon-animate-utils';

const animator = new CanvasAnimator({
  frame: getPreset('spinningLoader'),
  fps: 60
});

animator.start();
```

---

## ThemeManager (Utilities)

Manage light/dark theme support for favicons.

### Constructor

```typescript
new ThemeManager()
```

### Methods

#### registerTheme(name, config)

Register a theme with light and dark variants.

```typescript
registerTheme(name: string, config: ThemeConfig): void
```

**Example:**
```javascript
const themeManager = new ThemeManager();

themeManager.registerTheme('default', {
  light: '/favicon-light.png',
  dark: '/favicon-dark.png'
});
```

#### setTheme(theme)

Set the current theme.

```typescript
setTheme(theme: 'light' | 'dark' | 'auto'): void
```

#### getEffectiveTheme()

Get the current effective theme (resolves 'auto').

```typescript
getEffectiveTheme(): 'light' | 'dark'
```

#### getFaviconUrl(themeConfig)

Get the appropriate favicon URL for current theme.

```typescript
getFaviconUrl(themeConfig: ThemeConfig): string
```

#### toggle()

Toggle between light and dark themes.

```typescript
toggle(): void
```

#### on(event, callback)

Listen to theme change events.

```typescript
on(event: 'theme-change', callback: (theme: 'light' | 'dark') => void): () => void
```

#### destroy()

Clean up resources.

```typescript
destroy(): void
```

---

## EventEmitter (Utilities)

Simple event emitter for custom events.

### Methods

#### on(event, listener)

Register an event listener.

```typescript
on(event: string, listener: EventListener): () => void
```

Returns an unsubscribe function.

#### once(event, listener)

Register a one-time event listener.

```typescript
once(event: string, listener: EventListener): () => void
```

#### off(event, listener)

Remove an event listener.

```typescript
off(event: string, listener: EventListener): void
```

#### emit(event, ...args)

Emit an event.

```typescript
emit(event: string, ...args: any[]): boolean
```

#### removeAllListeners(event?)

Remove all listeners for an event or all events.

```typescript
removeAllListeners(event?: string): void
```

#### listenerCount(event)

Get the number of listeners for an event.

```typescript
listenerCount(event: string): number
```

---

## Utility Functions

### getFaviconLink()

Get or create the favicon link element.

```typescript
getFaviconLink(): HTMLLinkElement
```

### createCanvas(size)

Create a canvas element.

```typescript
createCanvas(size: number): HTMLCanvasElement
```

### loadImage(url)

Load an image from URL.

```typescript
loadImage(url: string): Promise<HTMLImageElement>
```

### detectImageFormat(url)

Detect image format from URL.

```typescript
detectImageFormat(url: string): 'gif' | 'webp' | 'png' | 'ico' | 'svg' | 'unknown'
```

### canvasToDataUrl(canvas)

Convert canvas to data URL.

```typescript
canvasToDataUrl(canvas: HTMLCanvasElement): string
```

### debounce(func, wait)

Debounce a function.

```typescript
debounce<T>(func: T, wait: number): (...args: Parameters<T>) => void
```

### throttle(func, limit)

Throttle a function.

```typescript
throttle<T>(func: T, limit: number): (...args: Parameters<T>) => void
```
