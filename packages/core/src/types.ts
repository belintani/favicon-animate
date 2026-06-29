/**
 * Badge position options
 */
export type BadgePosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';

/**
 * Badge configuration
 */
export interface BadgeConfig {
  /** Number to display in the badge */
  number: number | string;
  /** Position of the badge */
  position: BadgePosition;
  /** Background color of the badge circle */
  backgroundColor?: string;
  /** Text color of the badge number */
  textColor?: string;
  /** Size of the badge circle in pixels */
  size?: number;
  /** Font size of the badge number */
  fontSize?: number;
  /** Offset from the edge in pixels */
  offset?: number;
  /** Font weight */
  fontWeight?: string | number;
  /** Font family */
  fontFamily?: string;
}

/**
 * Favicon configuration
 */
export interface FaviconConfig {
  /** URL or data URL of the favicon */
  url: string;
  /** Size of the favicon in pixels (default: 32) */
  size?: number;
  /** Whether to use the favicon as-is or process it */
  raw?: boolean;
}

/**
 * Animator options
 */
export interface AnimatorOptions {
  /** Initial favicon URL or config */
  favicon?: FaviconConfig | string;
  /** Initial badge configuration */
  badge?: BadgeConfig;
  /** Whether to pause animation when tab is not visible */
  pauseOnHidden?: boolean;
  /** Update interval for badge changes (ms) */
  updateInterval?: number;
  /** Custom favicon link element selector */
  linkSelector?: string;
}

/**
 * Page visibility state
 */
export interface VisibilityState {
  isVisible: boolean;
  wasVisible: boolean;
}

/**
 * Favicon data for rendering
 */
export interface FaviconData {
  url: string;
  size: number;
  isAnimated: boolean;
  format: 'gif' | 'webp' | 'png' | 'ico' | 'svg' | 'unknown';
}
