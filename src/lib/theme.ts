/**
 * Theme Management System
 *
 * 3가지 독립적인 테마 축:
 * 1. Theme (Light/Dark)
 * 2. Color Scheme (Emerald/Blue/Purple/Red)
 * 3. Density (Compact/Normal/Comfortable)
 */

export type Theme = 'light' | 'dark';
export type ColorScheme = 'emerald' | 'blue' | 'purple' | 'red';
export type Density = 'compact' | 'normal' | 'comfortable';

interface ThemeConfig {
  theme: Theme;
  colorScheme: ColorScheme;
  density: Density;
}

const STORAGE_KEY = 'ui-kit-theme-config';

/**
 * Get current theme configuration
 */
export const getThemeConfig = (): ThemeConfig => {
  // Check localStorage first
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallthrough to defaults
    }
  }

  // Check system preference for theme
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  return {
    theme: prefersDark ? 'dark' : 'light',
    colorScheme: 'emerald',
    density: 'normal',
  };
};

/**
 * Save theme configuration
 */
export const saveThemeConfig = (config: ThemeConfig): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};

/**
 * Apply theme to DOM
 */
export const applyTheme = (theme: Theme): void => {
  document.documentElement.dataset.theme = theme;
};

/**
 * Apply color scheme to DOM
 */
export const applyColorScheme = (scheme: ColorScheme): void => {
  document.documentElement.dataset.colorScheme = scheme;
};

/**
 * Apply density to DOM
 */
export const applyDensity = (density: Density): void => {
  document.documentElement.dataset.density = density;
};

/**
 * Apply full theme configuration
 */
export const applyThemeConfig = (config: ThemeConfig): void => {
  applyTheme(config.theme);
  applyColorScheme(config.colorScheme);
  applyDensity(config.density);
  saveThemeConfig(config);
};

/**
 * Initialize theme on app load
 */
export const initializeTheme = (): ThemeConfig => {
  const config = getThemeConfig();
  applyThemeConfig(config);
  return config;
};

/**
 * Toggle between light and dark theme
 */
export const toggleTheme = (): Theme => {
  const config = getThemeConfig();
  const newTheme: Theme = config.theme === 'light' ? 'dark' : 'light';
  applyThemeConfig({ ...config, theme: newTheme });
  return newTheme;
};

/**
 * Watch for system theme changes
 */
export const watchSystemTheme = (callback: (theme: Theme) => void): (() => void) => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handler = (e: MediaQueryListEvent) => {
    const newTheme: Theme = e.matches ? 'dark' : 'light';
    callback(newTheme);
  };

  mediaQuery.addEventListener('change', handler);

  // Return cleanup function
  return () => mediaQuery.removeEventListener('change', handler);
};
