import { BadgeConfig, BadgePosition } from './types';

/**
 * Badge rendering utilities
 */

export class BadgeRenderer {
  /**
   * Calculate badge position coordinates
   */
  static calculatePosition(
    position: BadgePosition,
    faviconSize: number,
    badgeSize: number,
    offset: number = 2
  ): { x: number; y: number } {
    const badgeRadius = badgeSize / 2;

    switch (position) {
      case 'top-left':
        return { x: offset + badgeRadius, y: offset + badgeRadius };
      case 'top-right':
        return { x: faviconSize - offset - badgeRadius, y: offset + badgeRadius };
      case 'bottom-left':
        return { x: offset + badgeRadius, y: faviconSize - offset - badgeRadius };
      case 'bottom-right':
        return { x: faviconSize - offset - badgeRadius, y: faviconSize - offset - badgeRadius };
      case 'center':
        return { x: faviconSize / 2, y: faviconSize / 2 };
      default:
        return { x: faviconSize - offset - badgeRadius, y: offset + badgeRadius };
    }
  }

  /**
   * Draw badge on canvas
   */
  static drawBadge(
    ctx: CanvasRenderingContext2D,
    config: BadgeConfig,
    faviconSize: number
  ): void {
    const {
      number,
      position,
      backgroundColor = '#FF0000',
      textColor = '#FFFFFF',
      size = 16,
      fontSize = 12,
      borderRadius = '50%',
      offset = 2,
      fontWeight = 'bold',
      fontFamily = 'Arial, sans-serif'
    } = config;

    const { x, y } = this.calculatePosition(position, faviconSize, size, offset);

    // Draw badge background circle
    ctx.fillStyle = backgroundColor;
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw badge text
    ctx.fillStyle = textColor;
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Ensure number fits in badge
    const numberStr = String(number).substring(0, 3);
    ctx.fillText(numberStr, x, y);
  }

  /**
   * Validate badge configuration
   */
  static validateConfig(config: Partial<BadgeConfig>): BadgeConfig {
    const {
      number = 1,
      position = 'top-right',
      backgroundColor = '#FF0000',
      textColor = '#FFFFFF',
      size = 16,
      fontSize = 12,
      borderRadius = '50%',
      offset = 2,
      fontWeight = 'bold',
      fontFamily = 'Arial, sans-serif'
    } = config;

    // Validate position
    const validPositions: BadgePosition[] = [
      'top-left',
      'top-right',
      'bottom-left',
      'bottom-right',
      'center'
    ];
    if (!validPositions.includes(position as BadgePosition)) {
      throw new Error(`Invalid badge position: ${position}`);
    }

    // Validate number
    if (typeof number !== 'number' && typeof number !== 'string') {
      throw new Error('Badge number must be a number or string');
    }

    return {
      number,
      position: position as BadgePosition,
      backgroundColor,
      textColor,
      size: Math.max(8, size),
      fontSize: Math.max(6, fontSize),
      borderRadius,
      offset: Math.max(0, offset),
      fontWeight,
      fontFamily
    };
  }
}
