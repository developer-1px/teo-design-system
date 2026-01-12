import { Frame } from '@/components/dsl/shared/Frame';
/**
 * ThemeSwitcher - Theme Configuration UI
 *
 * 3가지 테마 설정:
 * 1. Light/Dark Toggle
 * 2. Color Scheme Selection
 * 3. Density Selection
 */

import { Moon as MoonIcon, Sun as SunIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Action } from '@/components/dsl/Element/Action/Action.tsx';
import { Text } from '@/components/dsl/Element/Text/Text.tsx';
import { Section } from '@/components/dsl/Section/Section.tsx';
import {
  applyThemeConfig,
  type ColorScheme,
  type Density,
  getThemeConfig,
  type Theme,
  toggleTheme as toggleThemeUtil,
} from '@/shared/lib/theme';

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
    <Section role="Container" prominence="Hero" width="320" elevation="overlay">
      {/* Header */}
      <Frame.Row align="center" justify="between">
        <Text role="Title" prominence="Strong" content="Theme Settings" />
        {onClose && (
          <Action role="IconButton" icon="X" label="Close" density="Compact" onClick={onClose} />
        )}
      </Frame.Row>

      {/* Light/Dark Toggle */}
      <Frame.Stack gap={2}>
        <Text role="Label" prominence="Subtle" content="Appearance" />
        <Frame.Grid columns={2} gap={2}>
          <Frame.Row
            align="center"
            justify="center"
            padding={2}
            className={`cursor-pointer rounded-lg border transition-all ${config.theme === 'light'
              ? 'bg-surface-raised border-primary-default text-primary-default'
              : 'bg-surface-sunken border-transparent hover:bg-surface-raised'
              }`}
            onClick={() => {
              const newConfig: typeof config = { ...config, theme: 'light' };
              applyThemeConfig(newConfig);
              setConfig(newConfig);
            }}
          >
            <SunIcon size={16} className="mr-2" />
            <Text role="Body" content="Light" />
          </Frame.Row>
          <Frame.Row
            align="center"
            justify="center"
            padding={2}
            className={`cursor-pointer rounded-lg border transition-all ${config.theme === 'dark'
              ? 'bg-surface-raised border-primary-default text-primary-default'
              : 'bg-surface-sunken border-transparent hover:bg-surface-raised'
              }`}
            onClick={() => {
              const newConfig: typeof config = { ...config, theme: 'dark' };
              applyThemeConfig(newConfig);
              setConfig(newConfig);
            }}
          >
            <MoonIcon size={16} className="mr-2" />
            <Text role="Body" content="Dark" />
          </Frame.Row>
        </Frame.Grid>
      </Frame.Stack>

      {/* Color Scheme */}
      <Frame.Stack gap={2}>
        <Text role="Label" prominence="Subtle" content="Color Scheme" />
        <Frame.Grid columns={2} gap={2}>
          {colorSchemes.map((scheme) => (
            <Frame.Row
              key={scheme.value}
              align="center"
              gap={2}
              padding={2}
              className={`cursor-pointer rounded-lg border transition-all ${config.colorScheme === scheme.value
                ? 'bg-surface-raised border-primary-default shadow-sm'
                : 'bg-surface-sunken border-transparent hover:bg-surface-raised'
                }`}
              onClick={() => handleColorSchemeChange(scheme.value)}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: scheme.color }}
              />
              <Text role="Body" content={scheme.label} />
            </Frame.Row>
          ))}
        </Frame.Grid>
      </Frame.Stack>

      {/* Density */}
      <Frame.Stack gap={2}>
        <Text role="Label" prominence="Subtle" content="Density" />
        <Frame.Stack gap={1}>
          {densities.map((density) => (
            <Frame.Row
              key={density.value}
              align="center"
              justify="between"
              padding={3}
              className={`cursor-pointer rounded-xl border transition-all ${config.density === density.value
                ? 'bg-surface-raised border-primary-default shadow-md'
                : 'bg-surface-sunken border-transparent hover:bg-surface-raised'
                }`}
              onClick={() => handleDensityChange(density.value)}
            >
              <Frame.Stack gap={0}>
                <Text role="Body" prominence="Strong" content={density.label} className="font-bold text-sm" />
                <Text role="Body" prominence="Subtle" content={density.description} className="text-xs opacity-60" />
              </Frame.Stack>
              {config.density === density.value && (
                <div className="w-2 h-2 rounded-full bg-primary-default shadow-[0_0_8px_rgba(var(--primary-default),0.5)]" />
              )}
            </Frame.Row>
          ))}
        </Frame.Stack>
      </Frame.Stack>
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
    <Action
      role="IconButton"
      icon={theme === 'light' ? 'Moon' : 'Sun'}
      label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      density="Compact"
      onClick={handleToggle}
    />
  );
};
