# Examples

## Basic Usage

### Simple Badge

```javascript
import { FaviconAnimator } from 'favicon-animate';

const animator = new FaviconAnimator({
  favicon: '/favicon.png'
});

// Add a badge
animator.setBadge({
  number: 5,
  position: 'top-right'
});

// Update badge
animator.updateBadge(10);

// Remove badge
animator.removeBadge();
```

### Animated GIF with Badge

```javascript
import { FaviconAnimator } from 'favicon-animate';

const animator = new FaviconAnimator({
  favicon: '/animated-favicon.gif',
  badge: {
    number: 3,
    position: 'bottom-right',
    backgroundColor: '#FF6B6B'
  }
});
```

---

## Advanced Examples

### Custom Canvas Animation

```javascript
import { CanvasAnimator } from 'favicon-animate-utils';

const animator = new CanvasAnimator({
  size: 32,
  fps: 60,
  frame: (ctx, progress) => {
    // Clear canvas
    ctx.fillStyle = '#667eea';
    ctx.fillRect(0, 0, 32, 32);

    // Draw rotating circle
    ctx.save();
    ctx.translate(16, 16);
    ctx.rotate(progress * Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(-2, 8, 4, 8);
    ctx.restore();
  },
  badge: {
    number: 5,
    position: 'top-right'
  }
});

animator.start();
```

### Using Animation Presets

```javascript
import { CanvasAnimator, getPreset } from 'favicon-animate-utils';

// Spinning loader
const spinningAnimator = new CanvasAnimator({
  frame: getPreset('spinningLoader'),
  fps: 60
});

spinningAnimator.start();

// Pulsing animation
const pulsingAnimator = new CanvasAnimator({
  frame: getPreset('pulsing'),
  fps: 60,
  badge: { number: '!', position: 'center' }
});

pulsingAnimator.start();
```

### Theme Support

```javascript
import { FaviconAnimator } from 'favicon-animate';
import { ThemeManager } from 'favicon-animate-utils';

const themeManager = new ThemeManager();
const animator = new FaviconAnimator();

// Register theme
themeManager.registerTheme('default', {
  light: '/favicon-light.png',
  dark: '/favicon-dark.png'
});

// Listen to theme changes
themeManager.on('theme-change', (theme) => {
  const url = themeManager.getFaviconUrl({
    light: '/favicon-light.png',
    dark: '/favicon-dark.png'
  });
  animator.setFavicon(url);
});

// Set theme
themeManager.setTheme('auto'); // auto, light, or dark
```

---

## Framework Integration

### React

```jsx
import { useEffect, useRef } from 'react';
import { FaviconAnimator } from 'favicon-animate';

export function NotificationBadge() {
  const animatorRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    animatorRef.current = new FaviconAnimator({
      favicon: '/favicon.png'
    });

    return () => animatorRef.current?.destroy();
  }, []);

  useEffect(() => {
    if (count > 0) {
      animatorRef.current?.setBadge({
        number: count,
        position: 'top-right'
      });
    } else {
      animatorRef.current?.removeBadge();
    }
  }, [count]);

  return (
    <button onClick={() => setCount(count + 1)}>
      Increment ({count})
    </button>
  );
}
```

### Vue 3

```vue
<template>
  <div>
    <button @click="addNotification">
      Add Notification ({{ count }})
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
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

watch(count, (newCount) => {
  if (newCount > 0) {
    animator.value?.setBadge({
      number: newCount,
      position: 'top-right'
    });
  } else {
    animator.value?.removeBadge();
  }
});

const addNotification = () => {
  count.value++;
};
</script>
```

### Svelte

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import { FaviconAnimator } from 'favicon-animate';

  let animator;
  let count = 0;

  onMount(() => {
    animator = new FaviconAnimator({
      favicon: '/favicon.png'
    });
  });

  onDestroy(() => {
    animator?.destroy();
  });

  function addNotification() {
    count++;
    animator?.setBadge({
      number: count,
      position: 'top-right'
    });
  }

  function clearNotifications() {
    count = 0;
    animator?.removeBadge();
  }
</script>

<button on:click={addNotification}>
  Add Notification ({count})
</button>

<button on:click={clearNotifications}>
  Clear
</button>
```

---

## Real-World Use Cases

### Chat Application

```javascript
import { FaviconAnimator } from 'favicon-animate';

class ChatNotificationManager {
  constructor() {
    this.animator = new FaviconAnimator({
      favicon: '/favicon.png'
    });
    this.unreadCount = 0;
  }

  onNewMessage(message) {
    this.unreadCount++;
    this.updateBadge();
    this.playSound();
  }

  onMessagesRead() {
    this.unreadCount = 0;
    this.animator.removeBadge();
  }

  updateBadge() {
    const displayCount = this.unreadCount > 99 ? '99+' : this.unreadCount;
    this.animator.setBadge({
      number: displayCount,
      position: 'top-right',
      backgroundColor: '#FF6B6B'
    });
  }

  destroy() {
    this.animator.destroy();
  }
}
```

### Email Client

```javascript
import { FaviconAnimator, CanvasAnimator, getPreset } from 'favicon-animate-utils';

class EmailNotificationManager {
  constructor() {
    this.animator = new FaviconAnimator({
      favicon: '/favicon.png'
    });
    this.pulseAnimator = new CanvasAnimator({
      frame: getPreset('pulsing'),
      fps: 60
    });
  }

  onNewEmail(count) {
    // Show badge with count
    this.animator.setBadge({
      number: count,
      position: 'top-right',
      backgroundColor: '#4ECDC4'
    });

    // Start pulsing animation
    this.pulseAnimator.start();
  }

  onEmailsRead() {
    this.animator.removeBadge();
    this.pulseAnimator.stop();
  }

  destroy() {
    this.animator.destroy();
    this.pulseAnimator.destroy();
  }
}
```

### Task Manager

```javascript
import { FaviconAnimator } from 'favicon-animate';

class TaskNotificationManager {
  constructor() {
    this.animator = new FaviconAnimator({
      favicon: '/favicon.png'
    });
  }

  updateTaskCount(pending, completed) {
    if (pending > 0) {
      this.animator.setBadge({
        number: pending,
        position: 'top-right',
        backgroundColor: '#FF9F43'
      });
    } else {
      this.animator.removeBadge();
    }
  }

  destroy() {
    this.animator.destroy();
  }
}
```

---

## Performance Tips

### 1. Pause on Hidden Tab

```javascript
const animator = new FaviconAnimator({
  favicon: '/favicon.png',
  pauseOnHidden: true // Automatically pauses when tab is not visible
});
```

### 2. Debounce Badge Updates

```javascript
import { debounce } from 'favicon-animate';

const updateBadge = debounce((count) => {
  animator.updateBadge(count);
}, 300);

// Rapid updates will be debounced
for (let i = 0; i < 100; i++) {
  updateBadge(i);
}
```

### 3. Use Static Favicons for Badges

For best performance, use static favicons (PNG, SVG) with badges rather than animated GIFs when possible.

```javascript
// Good - static favicon + badge
animator.setFavicon('/favicon.png');
animator.setBadge({ number: 5, position: 'top-right' });

// Less optimal - animated favicon + badge
animator.setFavicon('/animated-favicon.gif');
animator.setBadge({ number: 5, position: 'top-right' });
```

### 4. Destroy When Not Needed

```javascript
// Clean up resources when component unmounts
useEffect(() => {
  const animator = new FaviconAnimator({ favicon: '/favicon.png' });
  
  return () => animator.destroy();
}, []);
```
