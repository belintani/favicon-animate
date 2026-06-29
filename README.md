# favicon-animate

[![npm version](https://img.shields.io/npm/v/favicon-animate.svg)](https://www.npmjs.com/package/favicon-animate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Favicon management library that actually works. Add animations, badges, and dynamic updates to your favicon without the headache.

## Why favicon-animate?

Your favicon is real estate. Most sites waste it. With favicon-animate, you can show notifications, animations, and status updates right in the browser tab. Users see it before they even click.

## What you get

- **Lightweight core** (8KB) - Just the essentials
- **Feature-rich utils** (18KB) - Canvas animations, themes, presets
- **Works everywhere** - Vanilla JS, React, Vue, Svelte
- **No dependencies** - Just import and use
- **Badge support** - Numbers, colors, positions
- **Animations** - 7 built-in presets or write your own
- **Smart performance** - Pauses when tab is hidden
- **TypeScript ready** - Full type definitions

## Installation

```bash
# Core version
npm install favicon-animate

# With advanced features
npm install favicon-animate-utils
```

## Quick start

```javascript
import { FaviconAnimator } from 'favicon-animate';

const favicon = new FaviconAnimator({
  favicon: '/favicon.png'
});

// Add a notification badge
favicon.setBadge({
  number: 5,
  position: 'top-right'
});

// Update it
favicon.updateBadge(10);

// Remove it
favicon.removeBadge();
```

## Real-world examples

### Chat app with unread count

```javascript
import { FaviconAnimator } from 'favicon-animate';

const favicon = new FaviconAnimator({ favicon: '/favicon.png' });

function onNewMessage() {
  unreadCount++;
  favicon.setBadge({
    number: unreadCount > 99 ? '99+' : unreadCount,
    position: 'top-right',
    backgroundColor: '#FF6B6B'
  });
}

function onMessagesRead() {
  unreadCount = 0;
  favicon.removeBadge();
}
```

### Animated loading state

```javascript
import { CanvasAnimator, getPreset } from 'favicon-animate-utils';

const loader = new CanvasAnimator({
  frame: getPreset('spinningLoader'),
  fps: 60
});

loader.start();
// ... do work ...
loader.stop();
```

### With React

```jsx
import { useEffect, useRef } from 'react';
import { FaviconAnimator } from 'favicon-animate';

export function NotificationBadge() {
  const faviconRef = useRef(null);

  useEffect(() => {
    faviconRef.current = new FaviconAnimator({
      favicon: '/favicon.png'
    });

    return () => faviconRef.current?.destroy();
  }, []);

  const showNotification = (count) => {
    faviconRef.current?.setBadge({
      number: count,
      position: 'top-right'
    });
  };

  return (
    <button onClick={() => showNotification(5)}>
      Show notification
    </button>
  );
}
```

### With Vue 3

```vue
<template>
  <button @click="addNotification">
    Add notification ({{ count }})
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { FaviconAnimator } from 'favicon-animate';

const animator = ref(null);
const count = ref(0);

onMounted(() => {
  animator.value = new FaviconAnimator({
    favicon: '/favicon.png'
  });
});

onUnmounted(() => {
  animator.value?.destroy();
});

const addNotification = () => {
  count.value++;
  animator.value?.setBadge({
    number: count.value,
    position: 'top-right'
  });
};
</script>
```

## Badge options

Position your badge anywhere:

```javascript
favicon.setBadge({
  number: 5,                      // What to show
  position: 'top-right',          // top-left, top-right, bottom-left, bottom-right, center
  backgroundColor: '#FF0000',     // Badge color
  textColor: '#FFFFFF',           // Number color
  size: 16,                       // Badge size
  fontSize: 12,                   // Number size
  offset: 2                       // Distance from edge
});
```

## Animation presets

Seven animations ready to use:

```javascript
import { CanvasAnimator, getPreset } from 'favicon-animate-utils';

const animator = new CanvasAnimator({
  frame: getPreset('spinningLoader')  // or: pulsing, bouncingDot, rotatingSquare, wave, gradientFade, blinking
});

animator.start();
```

## Custom animations

Write your own animation:

```javascript
import { CanvasAnimator } from 'favicon-animate-utils';

const animator = new CanvasAnimator({
  frame: (ctx, progress) => {
    // progress goes from 0 to 1
    ctx.fillStyle = '#667eea';
    ctx.fillRect(0, 0, 32, 32);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(16, 16, 8 * progress, 0, Math.PI * 2);
    ctx.fill();
  },
  fps: 60
});

animator.start();
```

## Theme support

Automatically switch between light and dark favicons:

```javascript
import { ThemeManager } from 'favicon-animate-utils';
import { FaviconAnimator } from 'favicon-animate';

const themes = new ThemeManager();
const favicon = new FaviconAnimator();

themes.registerTheme('default', {
  light: '/favicon-light.png',
  dark: '/favicon-dark.png'
});

themes.on('theme-change', (theme) => {
  const url = themes.getFaviconUrl({
    light: '/favicon-light.png',
    dark: '/favicon-dark.png'
  });
  favicon.setFavicon(url);
});

themes.setTheme('auto'); // auto, light, or dark
```

## Performance

The library is built for performance:

- Automatically pauses animations when your tab isn't visible
- Minimal CPU usage even with multiple animations
- Efficient canvas rendering
- Small bundle size

## Browser support

| Browser | Support |
|---------|---------|
| Chrome | Latest |
| Firefox | Latest |
| Safari | Latest |
| Edge | Latest |
| IE 11 | Fallback |

## Documentation

- [API Reference](./docs/api.md) - Complete method documentation
- [Examples](./docs/examples.md) - Real-world use cases
- [Advanced Guide](./docs/guide.md) - Deep dives and patterns

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Format code
pnpm format

# Lint
pnpm lint
```

## Contributing

We welcome contributions. See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

MIT - Use it however you want.

---

Made by [Daniel Belintani](https://github.com/belintani)
