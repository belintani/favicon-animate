# Advanced Guide

Deep dives into favicon-animate patterns and techniques.

## Performance optimization

### Debouncing badge updates

When badge numbers change rapidly, debounce the updates:

```javascript
import { debounce } from 'favicon-animate';

const updateBadge = debounce((count) => {
  favicon.updateBadge(count);
}, 300);

// Rapid updates get debounced
for (let i = 0; i < 100; i++) {
  updateBadge(i);
}
```

### Pausing on hidden tabs

The library automatically pauses animations when your tab isn't visible. This saves CPU and battery:

```javascript
const favicon = new FaviconAnimator({
  pauseOnHidden: true  // Default behavior
});
```

To disable this (not recommended):

```javascript
const favicon = new FaviconAnimator({
  pauseOnHidden: false
});
```

### Static favicons with badges

For best performance, use static favicons with badges instead of animated GIFs:

```javascript
// Good - static favicon + badge
favicon.setFavicon('/favicon.png');
favicon.setBadge({ number: 5, position: 'top-right' });

// Less optimal - animated favicon + badge
favicon.setFavicon('/animated-favicon.gif');
favicon.setBadge({ number: 5, position: 'top-right' });
```

## Advanced animations

### Creating complex animations

Combine multiple drawing operations:

```javascript
import { CanvasAnimator } from 'favicon-animate-utils';

const animator = new CanvasAnimator({
  frame: (ctx, progress) => {
    const size = ctx.canvas.width;
    
    // Background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, size, size);
    
    // Rotating element
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate(progress * Math.PI * 2);
    ctx.fillStyle = '#667eea';
    ctx.fillRect(-4, 8, 8, 8);
    ctx.restore();
    
    // Counter
    ctx.fillStyle = '#333';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(Math.floor(progress * 100), size / 2, size - 2);
  },
  fps: 60,
  duration: 3000  // 3 seconds
});

animator.start();
```

### Animation with badge

Combine animations with badges:

```javascript
const animator = new CanvasAnimator({
  frame: getPreset('pulsing'),
  badge: {
    number: '!',
    position: 'center',
    backgroundColor: '#FF6B6B',
    size: 12
  }
});

animator.start();
```

### Stopping and resuming

Control animation lifecycle:

```javascript
const animator = new CanvasAnimator({
  frame: getPreset('spinningLoader')
});

animator.start();
// ... later ...
animator.pause();
// ... even later ...
animator.resume();
// ... when done ...
animator.stop();
```

## Event handling

### Custom events with EventEmitter

```javascript
import { EventEmitter } from 'favicon-animate-utils';

class NotificationManager extends EventEmitter {
  constructor(favicon) {
    super();
    this.favicon = favicon;
    this.count = 0;
  }

  addNotification() {
    this.count++;
    this.favicon.setBadge({
      number: this.count,
      position: 'top-right'
    });
    this.emit('notification-added', this.count);
  }

  clear() {
    this.count = 0;
    this.favicon.removeBadge();
    this.emit('notifications-cleared');
  }
}

const manager = new NotificationManager(favicon);

manager.on('notification-added', (count) => {
  console.log(`Now showing ${count} notifications`);
});

manager.on('notifications-cleared', () => {
  console.log('All notifications cleared');
});

manager.addNotification();
manager.addNotification();
manager.clear();
```

## Theme management

### Automatic theme detection

The library detects system theme preference:

```javascript
import { ThemeManager } from 'favicon-animate-utils';

const themes = new ThemeManager();

// Automatically uses system preference
themes.setTheme('auto');

// Check current effective theme
const current = themes.getEffectiveTheme(); // 'light' or 'dark'
```

### Manual theme switching

```javascript
themes.setTheme('light');
themes.setTheme('dark');

// Toggle between light and dark
themes.toggle();
```

### Listening to theme changes

```javascript
themes.on('theme-change', (theme) => {
  console.log(`Theme changed to: ${theme}`);
  
  // Update favicon based on theme
  const url = theme === 'dark' 
    ? '/favicon-dark.png' 
    : '/favicon-light.png';
  
  favicon.setFavicon(url);
});
```

## Real-world patterns

### Notification queue

```javascript
class NotificationQueue {
  constructor(favicon) {
    this.favicon = favicon;
    this.queue = [];
  }

  add(notification) {
    this.queue.push(notification);
    this.update();
  }

  remove(id) {
    this.queue = this.queue.filter(n => n.id !== id);
    this.update();
  }

  update() {
    const count = this.queue.length;
    
    if (count === 0) {
      this.favicon.removeBadge();
    } else {
      this.favicon.setBadge({
        number: count > 99 ? '99+' : count,
        position: 'top-right',
        backgroundColor: '#FF6B6B'
      });
    }
  }
}
```

### Loading indicator

```javascript
import { CanvasAnimator, getPreset } from 'favicon-animate-utils';

class LoadingIndicator {
  constructor(favicon) {
    this.favicon = favicon;
    this.animator = new CanvasAnimator({
      frame: getPreset('spinningLoader'),
      fps: 60
    });
  }

  start() {
    this.animator.start();
  }

  stop() {
    this.animator.stop();
  }

  async loadData(fn) {
    this.start();
    try {
      return await fn();
    } finally {
      this.stop();
    }
  }
}

// Usage
const loader = new LoadingIndicator(favicon);

await loader.loadData(async () => {
  const response = await fetch('/api/data');
  return response.json();
});
```

### Status indicator

```javascript
class StatusIndicator {
  constructor(favicon) {
    this.favicon = favicon;
    this.status = 'idle';
  }

  setStatus(status) {
    this.status = status;
    
    const colors = {
      idle: '#999999',
      loading: '#4ECDC4',
      success: '#51CF66',
      error: '#FF6B6B'
    };

    if (status === 'idle') {
      this.favicon.removeBadge();
    } else {
      this.favicon.setBadge({
        number: status.charAt(0).toUpperCase(),
        position: 'top-right',
        backgroundColor: colors[status]
      });
    }
  }
}
```

## Cleanup and memory management

### Always destroy when done

```javascript
const favicon = new FaviconAnimator({ favicon: '/favicon.png' });

// ... use it ...

// Clean up when component unmounts or page unloads
favicon.destroy();
```

### In React

```jsx
useEffect(() => {
  const favicon = new FaviconAnimator({ favicon: '/favicon.png' });
  
  return () => {
    favicon.destroy();  // Cleanup on unmount
  };
}, []);
```

### In Vue

```vue
<script setup>
onUnmounted(() => {
  animator.value?.destroy();
});
</script>
```

## Troubleshooting

### Badge not showing

Make sure you have a favicon set before adding a badge:

```javascript
// Wrong - badge without favicon
const favicon = new FaviconAnimator();
favicon.setBadge({ number: 5, position: 'top-right' });

// Right - favicon first, then badge
const favicon = new FaviconAnimator({ favicon: '/favicon.png' });
favicon.setBadge({ number: 5, position: 'top-right' });
```

### Animation not running

Check if the tab is visible. The library pauses animations on hidden tabs by default:

```javascript
// Disable auto-pause if needed
const animator = new CanvasAnimator({
  frame: getPreset('spinningLoader'),
  pauseOnHidden: false
});
```

### High CPU usage

Reduce the frame rate:

```javascript
const animator = new CanvasAnimator({
  frame: getPreset('spinningLoader'),
  fps: 30  // Instead of 60
});
```

### Memory leaks

Always call `destroy()` when done:

```javascript
// Bad - memory leak
const favicon = new FaviconAnimator({ favicon: '/favicon.png' });

// Good - clean up
favicon.destroy();
```
