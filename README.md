# favicon-animate

> Complete favicon management library with dynamic animations, badges, and multi-format support

[![npm version](https://img.shields.io/npm/v/favicon-animate.svg)](https://www.npmjs.com/package/favicon-animate)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

✨ **Dynamic Favicons** - Animate favicons with GIF, WebP, or custom canvas animations  
🎯 **Badge Support** - Add notification badges with customizable position, color, and styling  
⚡ **Performance Optimized** - Automatic pause when tab is hidden, minimal CPU usage  
🎨 **Multiple Formats** - Support for GIF, WebP, PNG, SVG, and ICO formats  
📦 **Two Versions** - Lightweight core (~8KB) or feature-rich utils (~18KB)  
🔧 **Easy Integration** - Works with vanilla JS, React, Vue, and any framework  
♿ **Accessible** - Fallback support for older browsers  

## Quick Start

### Installation

```bash
# Core version (lightweight)
npm install favicon-animate

# With utilities (advanced features)
npm install favicon-animate-utils
```

### Basic Usage

```javascript
import { FaviconAnimator } from 'favicon-animate';

// Create animator instance
const animator = new FaviconAnimator({
  favicon: '/favicon.png',
  pauseOnHidden: true
});

// Add a badge
animator.setBadge({
  number: 5,
  position: 'top-right',
  backgroundColor: '#FF0000',
  textColor: '#FFFFFF'
});

// Update badge number
animator.updateBadge(10);

// Remove badge
animator.removeBadge();
```

### With GIF Animation

```javascript
import { FaviconAnimator } from 'favicon-animate';

const animator = new FaviconAnimator({
  favicon: '/animated-favicon.gif'
});

// Add badge to animated favicon
animator.setBadge({
  number: 3,
  position: 'bottom-right'
});
```

## Documentation

- [API Reference](./docs/api.md)
- [Examples](./docs/examples.md)
- [Advanced Guide](./docs/guide.md)

## Examples

### React

```jsx
import { useEffect, useRef } from 'react';
import { FaviconAnimator } from 'favicon-animate';

export function App() {
  const animatorRef = useRef(null);

  useEffect(() => {
    animatorRef.current = new FaviconAnimator({
      favicon: '/favicon.png'
    });

    return () => animatorRef.current?.destroy();
  }, []);

  const handleNotification = (count) => {
    animatorRef.current?.setBadge({
      number: count,
      position: 'top-right'
    });
  };

  return (
    <button onClick={() => handleNotification(5)}>
      Show Badge
    </button>
  );
}
```

### Vue

```vue
<template>
  <button @click="showBadge">Show Badge</button>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { FaviconAnimator } from 'favicon-animate';

const animator = ref(null);

onMounted(() => {
  animator.value = new FaviconAnimator({
    favicon: '/favicon.png'
  });
});

onUnmounted(() => {
  animator.value?.destroy();
});

const showBadge = () => {
  animator.value?.setBadge({
    number: 5,
    position: 'top-right'
  });
};
</script>
```

## Badge Configuration

```javascript
animator.setBadge({
  // Required
  number: 5,                          // Number or string to display
  position: 'top-right',              // Position: top-left, top-right, bottom-left, bottom-right, center

  // Optional
  backgroundColor: '#FF0000',         // Badge circle color
  textColor: '#FFFFFF',               // Number text color
  size: 16,                           // Badge circle size (px)
  fontSize: 12,                       // Number font size (px)
  offset: 2,                          // Distance from edge (px)
  fontWeight: 'bold',                 // Font weight
  fontFamily: 'Arial, sans-serif'     // Font family
});
```

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | Latest | ✅ Full |
| Firefox | Latest | ✅ Full |
| Safari | Latest | ✅ Full |
| Edge | Latest | ✅ Full |
| IE | 11 | ⚠️ Fallback |

## Performance

- **Automatic pause** when tab is not visible (Page Visibility API)
- **Minimal CPU usage** - only updates when needed
- **Optimized rendering** - efficient canvas operations
- **Small bundle size** - core is only ~8KB gzipped

## License

MIT © [Daniel Belintani](https://github.com/belintani)

## Contributing

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

## Support

- 📖 [Documentation](./docs)
- 💬 [GitHub Discussions](https://github.com/belintani/favicon-animate/discussions)
- 🐛 [Report Issues](https://github.com/belintani/favicon-animate/issues)
