/**
 * Animation presets for favicon-animate
 */

import { AnimationFrame } from './canvas-animator';

/**
 * Spinning loader animation
 */
export const spinningLoader: AnimationFrame = (ctx, progress) => {
  const size = ctx.canvas.width;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 3;

  // Draw background circle
  ctx.fillStyle = '#f0f0f0';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw spinning arc
  ctx.strokeStyle = '#0066cc';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, progress * Math.PI * 2, progress * Math.PI * 2 + Math.PI);
  ctx.stroke();
};

/**
 * Pulsing animation
 */
export const pulsing: AnimationFrame = (ctx, progress) => {
  const size = ctx.canvas.width;
  const centerX = size / 2;
  const centerY = size / 2;

  // Calculate pulsing scale
  const scale = 0.5 + Math.sin(progress * Math.PI * 2) * 0.5;

  // Draw pulsing circle
  ctx.fillStyle = '#ff6b6b';
  ctx.beginPath();
  ctx.arc(centerX, centerY, (size / 3) * scale, 0, Math.PI * 2);
  ctx.fill();

  // Draw outer ring
  ctx.strokeStyle = `rgba(255, 107, 107, ${1 - scale})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, (size / 2) * scale, 0, Math.PI * 2);
  ctx.stroke();
};

/**
 * Bouncing dot animation
 */
export const bouncingDot: AnimationFrame = (ctx, progress) => {
  const size = ctx.canvas.width;

  // Calculate bounce position
  const bounceProgress = Math.abs(Math.sin(progress * Math.PI));
  const y = (size / 4) + bounceProgress * (size / 2);

  // Draw dot
  ctx.fillStyle = '#4ecdc4';
  ctx.beginPath();
  ctx.arc(size / 2, y, size / 6, 0, Math.PI * 2);
  ctx.fill();

  // Draw trail
  ctx.strokeStyle = 'rgba(78, 205, 196, 0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(size / 2, size / 4);
  ctx.lineTo(size / 2, size * 0.75);
  ctx.stroke();
};

/**
 * Rotating square animation
 */
export const rotatingSquare: AnimationFrame = (ctx, progress) => {
  const size = ctx.canvas.width;
  const centerX = size / 2;
  const centerY = size / 2;
  const squareSize = size / 3;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(progress * Math.PI * 2);

  ctx.fillStyle = '#a78bfa';
  ctx.fillRect(-squareSize / 2, -squareSize / 2, squareSize, squareSize);

  ctx.restore();
};

/**
 * Wave animation
 */
export const wave: AnimationFrame = (ctx, progress) => {
  const size = ctx.canvas.width;
  const amplitude = size / 6;
  const frequency = 3;
  const centerY = size / 2;

  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let x = 0; x < size; x += 1) {
    const y = centerY + Math.sin((x / size + progress) * Math.PI * 2 * frequency) * amplitude;
    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.stroke();
};

/**
 * Gradient fade animation
 */
export const gradientFade: AnimationFrame = (ctx, progress) => {
  const size = ctx.canvas.width;

  // Create gradient
  const gradient = ctx.createLinearGradient(0, 0, size, 0);
  gradient.addColorStop(0, `rgba(255, 107, 107, ${progress})`);
  gradient.addColorStop(0.5, `rgba(255, 193, 7, ${progress})`);
  gradient.addColorStop(1, `rgba(76, 175, 80, ${progress})`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
};

/**
 * Blinking animation
 */
export const blinking: AnimationFrame = (ctx, progress) => {
  const size = ctx.canvas.width;

  // Blink effect (on for 0.7 of cycle, off for 0.3)
  const opacity = progress < 0.7 ? 1 : 0;

  ctx.fillStyle = `rgba(100, 200, 255, ${opacity})`;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 3, 0, Math.PI * 2);
  ctx.fill();
};

/**
 * All available presets
 */
export const animationPresets = {
  spinningLoader,
  pulsing,
  bouncingDot,
  rotatingSquare,
  wave,
  gradientFade,
  blinking
} as const;

export type PresetName = keyof typeof animationPresets;

/**
 * Get preset by name
 */
export function getPreset(name: PresetName): AnimationFrame {
  const preset = animationPresets[name];
  if (!preset) {
    throw new Error(`Unknown animation preset: ${name}`);
  }
  return preset;
}
