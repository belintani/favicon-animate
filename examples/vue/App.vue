<template>
  <div class="container">
    <div class="card">
      <h1>favicon-animate</h1>
      <p class="subtitle">Dynamic favicon management with Vue</p>

      <!-- Badge Section -->
      <div class="section">
        <h2 class="section-title">🎯 Badge Control</h2>

        <div class="input-group">
          <input
            v-model.number="badgeNumber"
            type="number"
            placeholder="Enter badge number"
            min="0"
            max="999"
            @input="updateBadgeNumber"
          />
          <button class="btn btn-primary" @click="toggleBadge">
            {{ hasBadge ? 'Remove' : 'Add' }} Badge
          </button>
        </div>

        <div class="button-group">
          <button
            class="btn btn-secondary"
            @click="changeBadgePosition('top-left')"
            :disabled="!hasBadge"
          >
            Top Left
          </button>
          <button
            class="btn btn-secondary"
            @click="changeBadgePosition('top-right')"
            :disabled="!hasBadge"
          >
            Top Right
          </button>
          <button
            class="btn btn-secondary"
            @click="changeBadgePosition('bottom-left')"
            :disabled="!hasBadge"
          >
            Bottom Left
          </button>
          <button
            class="btn btn-secondary"
            @click="changeBadgePosition('bottom-right')"
            :disabled="!hasBadge"
          >
            Bottom Right
          </button>
        </div>
      </div>

      <!-- Favicon Section -->
      <div class="section">
        <h2 class="section-title">🎨 Favicon Control</h2>

        <div class="button-group">
          <button class="btn btn-primary" @click="changeFavicon('blue')">
            Blue
          </button>
          <button class="btn btn-primary" @click="changeFavicon('red')">
            Red
          </button>
          <button class="btn btn-primary" @click="changeFavicon('green')">
            Green
          </button>
          <button class="btn btn-primary" @click="changeFavicon('purple')">
            Purple
          </button>
        </div>
      </div>

      <!-- Status Section -->
      <div class="section">
        <h2 class="section-title">📊 Status</h2>

        <div class="status">
          <div class="status-item">
            <span class="status-label">Current Badge:</span>
            <span class="status-value">{{ hasBadge ? badgeNumber : 'None' }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">Badge Position:</span>
            <span class="status-value">{{ hasBadge ? badgePosition : '-' }}</span>
          </div>
          <div class="status-item">
            <span class="status-label">Page Visible:</span>
            <span class="status-value">{{ isVisible ? 'Yes' : 'No' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { FaviconAnimator } from 'favicon-animate';

const animator = ref(null);
const badgeNumber = ref(5);
const badgePosition = ref('top-right');
const hasBadge = ref(true);
const isVisible = ref(true);

const faviconColors = {
  blue: '%23667eea',
  red: '%23ff6b6b',
  green: '%2351cf66',
  purple: '%23a78bfa'
};

onMounted(() => {
  // Initialize animator
  animator.value = new FaviconAnimator({
    favicon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect fill="%23667eea" width="32" height="32"/></svg>',
    pauseOnHidden: true
  });

  // Set initial badge
  animator.value.setBadge({
    number: badgeNumber.value,
    position: badgePosition.value,
    backgroundColor: '#FF0000',
    textColor: '#FFFFFF'
  });

  // Track visibility
  const handleVisibilityChange = () => {
    isVisible.value = !document.hidden;
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    animator.value?.destroy();
  });
});

const updateBadgeNumber = () => {
  if (animator.value && hasBadge.value) {
    animator.value.updateBadge(badgeNumber.value);
  }
};

const changeBadgePosition = (position) => {
  badgePosition.value = position;
  const badge = animator.value?.getBadge();
  if (badge && animator.value && hasBadge.value) {
    badge.position = position;
    animator.value.setBadge(badge);
  }
};

const toggleBadge = () => {
  if (hasBadge.value) {
    animator.value?.removeBadge();
    hasBadge.value = false;
  } else {
    animator.value?.setBadge({
      number: badgeNumber.value,
      position: badgePosition.value,
      backgroundColor: '#FF0000',
      textColor: '#FFFFFF'
    });
    hasBadge.value = true;
  }
};

const changeFavicon = (color) => {
  animator.value?.setFavicon(
    `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect fill="${faviconColors[color]}" width="32" height="32"/></svg>`
  );
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:global(body) {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 40px;
  max-width: 500px;
  width: 100%;
}

h1 {
  color: #333;
  margin-bottom: 10px;
  font-size: 28px;
}

.subtitle {
  color: #666;
  margin-bottom: 30px;
  font-size: 14px;
}

.section {
  margin-bottom: 30px;
}

.section-title {
  color: #333;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.button-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 15px;
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-secondary:hover:not(:disabled) {
  background: #e0e0e0;
}

.status {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  font-size: 13px;
  color: #666;
}

.status-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.status-item:last-child {
  margin-bottom: 0;
}

.status-label {
  font-weight: 500;
  color: #333;
}

.status-value {
  color: #667eea;
  font-weight: 600;
}
</style>
