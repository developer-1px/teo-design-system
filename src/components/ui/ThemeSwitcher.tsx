/**
 * ThemeSwitcher - Theme Configuration UI
 *
 * 3가지 테마 설정:
 * 1. Light/Dark Toggle
 * 2. Color Scheme Selection
 * 3. Density Selection
 */

import { useState, useEffect } from 'react';
import { Section } from '@/components/dsl/Section';
import { IconButton } from '@/components/ui';
import {
  Sun as SunIcon,
  Moon as MoonIcon,
  X as XIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  type Theme,
  type ColorScheme,
  type Density,
  getThemeConfig,
  applyThemeConfig,
  toggleTheme as toggleThemeUtil,
} from '@/lib/theme';

interface ThemeSwitcherProps {
  onClose?: () => void;
}

const colorSchemes: { value: ColorScheme; label: string; color: string }[] = [
  { value: 'emerald', label: 'Emerald', color: '#10b981' },
  { value: 'blue', label: 'Blue', color: '#3b82f6' },
  { value: 'purple', label: 'Purple', color: '#a855f7' },
  { value: 'red', label: 'Red', color: '#ef4444' },
];

const densities: { value: Density; label: string; description: string }[] = [
  { value: 'compact', label: 'Compact', description: 'Tighter spacing' },
  { value: 'normal', label: 'Normal', description: 'Default spacing' },
  { value: 'comfortable', label: 'Comfortable', description: 'More spacious' },
];

export const ThemeSwitcher = ({ onClose }: ThemeSwitcherProps) => {
  const [config, setConfig] = useState(getThemeConfig());

  // Sync with system on mount
  useEffect(() => {
    setConfig(getThemeConfig());
  }, []);

  const handleColorSchemeChange = (scheme: ColorScheme) => {
    const newConfig = { ...config, colorScheme: scheme };
    applyThemeConfig(newConfig);
    setConfig(newConfig);
  };

  const handleDensityChange = (density: Density) => {
    const newConfig = { ...config, density };
    applyThemeConfig(newConfig);
    setConfig(newConfig);
  };

  return (
    <Section role="Container" prominence="Hero" className="w-80 p-4 z-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Theme Settings</h3>
        {onClose && (
          <IconButton size="sm" onClick={onClose} title="Close">
            <XIcon size={16} />
          </IconButton>
        )}
      </div>

      {/* Light/Dark Toggle */}
      <div className="mb-6">
        <div className="text-xs font-medium text-muted mb-2">
          Appearance
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              const newConfig: typeof config = { ...config, theme: 'light' };
              applyThemeConfig(newConfig);
              setConfig(newConfig);
            }}
            className={cn(
              'flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm',
              config.theme === 'light'
                ? 'bg-primary text-inverse'
                : 'bg-surface-sunken hover:bg-surface-elevated/50 active:bg-surface-elevated transition-colors'
            )}
          >
            <SunIcon size={16} />
            <span>Light</span>
          </button>
          <button
            onClick={() => {
              const newConfig: typeof config = { ...config, theme: 'dark' };
              applyThemeConfig(newConfig);
              setConfig(newConfig);
            }}
            className={cn(
              'flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm',
              config.theme === 'dark'
                ? 'bg-primary text-inverse'
                : 'bg-surface-sunken hover:bg-surface-elevated/50 active:bg-surface-elevated transition-colors'
            )}
          >
            <MoonIcon size={16} />
            <span>Dark</span>
          </button>
        </div>
      </div>

      {/* Color Scheme */}
      <div className="mb-6">
        <div className="text-xs font-medium text-muted mb-2">
          Color Scheme
        </div>
        <div className="grid grid-cols-2 gap-2">
          {colorSchemes.map((scheme) => (
            <button
              key={scheme.value}
              onClick={() => handleColorSchemeChange(scheme.value)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-md text-sm',
                config.colorScheme === scheme.value
                  ? 'bg-primary text-inverse'
                  : 'bg-surface-sunken hover:bg-surface-elevated/50 active:bg-surface-elevated transition-colors'
              )}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: scheme.color }}
              />
              <span>{scheme.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Density */}
      <div>
        <div className="text-xs font-medium text-muted mb-2">
          Density
        </div>
        <div className="space-y-1">
          {densities.map((density) => (
            <button
              key={density.value}
              onClick={() => handleDensityChange(density.value)}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm',
                config.density === density.value
                  ? 'bg-primary text-inverse'
                  : 'bg-surface-sunken hover:bg-surface-elevated/50 active:bg-surface-elevated transition-colors'
              )}
            >
              <div>
                <div className="font-medium">{density.label}</div>
                <div className="text-xs opacity-70">{density.description}</div>
              </div>
              {config.density === density.value && (
                <div className="w-2 h-2 rounded-full bg-current" />
              )}
            </button>
          ))}
        </div>
      </div>
    </Section>
  );
};

/**
 * Compact Theme Toggle Button
 * Quick theme toggle for toolbar
 */
export const ThemeToggleButton = () => {
  const [theme, setTheme] = useState<Theme>(getThemeConfig().theme);

  const handleToggle = () => {
    const newTheme = toggleThemeUtil();
    setTheme(newTheme);
  };

  return (
    <IconButton onClick={handleToggle} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
      {theme === 'light' ? <MoonIcon size={16} /> : <SunIcon size={16} />}
    </IconButton>
  );
};
