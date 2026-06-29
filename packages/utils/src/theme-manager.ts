/**
 * Theme Manager for favicon-animate
 * Handles light/dark mode and custom themes
 */

import { EventEmitter } from './event-emitter';

export type Theme = 'light' | 'dark' | 'auto';

export interface ThemeConfig {
  light: string;
  dark: string;
}

export class ThemeManager extends EventEmitter {
  private currentTheme: Theme = 'auto';
  private themes: Map<string, ThemeConfig> = new Map();
  private mediaQuery: MediaQueryList | null = null;
  private boundHandleMediaChange: ((e: MediaQueryListEvent) => void) | null = null;

  constructor() {
    super();
    this.initializeMediaQuery();
  }

  private initializeMediaQuery(): void {
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.boundHandleMediaChange = this.handleMediaChange.bind(this);

      if (this.mediaQuery.addEventListener) {
        this.mediaQuery.addEventListener('change', this.boundHandleMediaChange);
      } else {
        // Fallback for older browsers
        this.mediaQuery.addListener(this.boundHandleMediaChange);
      }
    }
  }

  private handleMediaChange(): void {
    if (this.currentTheme === 'auto') {
      this.emit('theme-change', this.getEffectiveTheme());
    }
  }

  /**
   * Register a theme
   */
  registerTheme(name: string, config: ThemeConfig): void {
    this.themes.set(name, config);
  }

  /**
   * Get registered theme
   */
  getTheme(name: string): ThemeConfig | undefined {
    return this.themes.get(name);
  }

  /**
   * Set current theme
   */
  setTheme(theme: Theme): void {
    if (this.currentTheme !== theme) {
      this.currentTheme = theme;
      this.emit('theme-change', this.getEffectiveTheme());
    }
  }

  /**
   * Get current theme setting
   */
  getCurrentTheme(): Theme {
    return this.currentTheme;
  }

  /**
   * Get effective theme (resolves 'auto')
   */
  getEffectiveTheme(): 'light' | 'dark' {
    if (this.currentTheme === 'auto') {
      return this.getSystemTheme();
    }
    return this.currentTheme;
  }

  /**
   * Get system theme preference
   */
  getSystemTheme(): 'light' | 'dark' {
    if (this.mediaQuery) {
      return this.mediaQuery.matches ? 'dark' : 'light';
    }
    return 'light';
  }

  /**
   * Get favicon URL for current theme
   */
  getFaviconUrl(themeConfig: ThemeConfig): string {
    const effectiveTheme = this.getEffectiveTheme();
    return effectiveTheme === 'dark' ? themeConfig.dark : themeConfig.light;
  }

  /**
   * Toggle between light and dark
   */
  toggle(): void {
    const current = this.getEffectiveTheme();
    this.setTheme(current === 'light' ? 'dark' : 'light');
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.mediaQuery && this.boundHandleMediaChange) {
      if (this.mediaQuery.removeEventListener) {
        this.mediaQuery.removeEventListener('change', this.boundHandleMediaChange);
      } else {
        // Fallback for older browsers
        this.mediaQuery.removeListener(this.boundHandleMediaChange);
      }
    }
    this.removeAllListeners();
  }
}
