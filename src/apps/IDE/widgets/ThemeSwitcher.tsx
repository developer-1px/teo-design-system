/**
 * ThemeSwitcher - Theme Configuration UI
 *
 * 3가지 테마 설정:
 * 1. Light/Dark Toggle
 * 2. Color Scheme Selection
 * 3. Density Selection
 */

import { Moon as MoonIcon, Sun as SunIcon, X as XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Block } from '@/components/types/Block/Block.tsx';
import { Action } from '@/components/types/Element/Action/Action.tsx';
import { Text } from '@/components/types/Element/Text/Text.tsx';
import { Section } from '@/components/types/Section/Section.tsx';
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
    <Section role="Container" prominence="Hero" width="320" padding="md" elevation="overlay">
      {/* Header */}
      <Block role="Header" direction="horizontal" align="center" justify="between" padding="sm">
        <Text role="Title" prominence="Strong" content="Theme Settings" />
        {onClose && (
          <Action role="IconButton" icon="X" label="Close" density="Compact" onClick={onClose} />
        )}
      </Block>

      {/* Light/Dark Toggle */}
      <Block role="Stack" gap="sm" padding="sm">
        <Text role="Label" prominence="Subtle" content="Appearance" />
        <Block role="Grid" template="custom" gridCols={2} gap="xs">
          <Block
            clickable
            layout="inline"
            align="center"
            justify="center"
            padding="sm"
            gap="xs"
            interactive
            selected={config.theme === 'light'}
            onClick={() => {
              const newConfig: typeof config = { ...config, theme: 'light' };
              applyThemeConfig(newConfig);
              setConfig(newConfig);
            }}
          >
            <SunIcon size={16} />
            <Text role="Body" content="Light" />
          </Block>
          <Block
            clickable
            layout="inline"
            align="center"
            justify="center"
            padding="sm"
            gap="xs"
            interactive
            selected={config.theme === 'dark'}
            onClick={() => {
              const newConfig: typeof config = { ...config, theme: 'dark' };
              applyThemeConfig(newConfig);
              setConfig(newConfig);
            }}
          >
            <MoonIcon size={16} />
            <Text role="Body" content="Dark" />
          </Block>
        </Block>
      </Block>

      {/* Color Scheme */}
      <Block role="Stack" gap="sm" padding="sm">
        <Text role="Label" prominence="Subtle" content="Color Scheme" />
        <Block role="Grid" template="custom" gridCols={2} gap="xs">
          {colorSchemes.map((scheme) => (
            <Block
              key={scheme.value}
              clickable
              layout="inline"
              align="center"
              padding="sm"
              gap="xs"
              interactive
              selected={config.colorScheme === scheme.value}
              onClick={() => handleColorSchemeChange(scheme.value)}
            >
              <Block
                width="16"
                height="16"
                rounded="full"
                style={{ backgroundColor: scheme.color }}
              />
              <Text role="Body" content={scheme.label} />
            </Block>
          ))}
        </Block>
      </Block>

      {/* Density */}
      <Block role="Stack" gap="sm" padding="sm">
        <Text role="Label" prominence="Subtle" content="Density" />
        <Block role="List" gap="xs">
          {densities.map((density) => (
            <Block
              key={density.value}
              clickable
              layout="inline"
              align="center"
              justify="between"
              padding="sm"
              interactive
              selected={config.density === density.value}
              onClick={() => handleDensityChange(density.value)}
            >
              <Block gap="xs">
                <Text role="Body" prominence="Strong" content={density.label} weight="medium" />
                <Text role="Body" prominence="Subtle" content={density.description} size="sm" />
              </Block>
              {config.density === density.value && (
                <Block width="8" height="8" rounded="full" intent="Brand" prominence="Strong" />
              )}
            </Block>
          ))}
        </Block>
      </Block>
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
