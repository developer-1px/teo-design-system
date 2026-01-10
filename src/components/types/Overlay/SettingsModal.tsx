import {
  Keyboard,
  Layers,
  Monitor,
  Moon,
  Palette,
  Settings as SettingsIcon,
  Sun,
  Type,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/types/Atom/Action/role/Button.tsx';
import { Section } from '@/components/types/Section/Section.tsx';
import { cn } from '@/shared/lib/utils.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsCategory = 'appearance' | 'editor' | 'layers' | 'keymap' | 'general';

interface SettingsItem {
  id: string;
  label: string;
  type: 'select' | 'toggle' | 'slider' | 'color';
  value: any;
  options?: { label: string; value: any }[];
}

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('appearance');
  const [settings, setSettings] = useState<Record<string, any>>({
    theme: 'light',
    colorScheme: 'emerald',
    density: 'normal',
    fontSize: 13,
    lineHeight: 1.5,
    showLineNumbers: true,
  });

  const categories = [
    { id: 'appearance' as const, label: 'Appearance', icon: Palette },
    { id: 'editor' as const, label: 'Editor', icon: Type },
    { id: 'layers' as const, label: 'Layer System', icon: Layers },
    { id: 'keymap' as const, label: 'Keymap', icon: Keyboard },
    { id: 'general' as const, label: 'General', icon: SettingsIcon },
  ];

  const appearanceSettings: SettingsItem[] = [
    {
      id: 'theme',
      label: 'Theme',
      type: 'select',
      value: settings.theme,
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'System', value: 'system' },
      ],
    },
    {
      id: 'colorScheme',
      label: 'Accent Color',
      type: 'select',
      value: settings.colorScheme,
      options: [
        { label: 'Emerald', value: 'emerald' },
        { label: 'Blue', value: 'blue' },
        { label: 'Purple', value: 'purple' },
        { label: 'Red', value: 'red' },
      ],
    },
    {
      id: 'density',
      label: 'UI Density',
      type: 'select',
      value: settings.density,
      options: [
        { label: 'Compact', value: 'compact' },
        { label: 'Normal', value: 'normal' },
        { label: 'Comfortable', value: 'comfortable' },
      ],
    },
  ];

  const editorSettings: SettingsItem[] = [
    {
      id: 'fontSize',
      label: 'Font Size',
      type: 'slider',
      value: settings.fontSize,
    },
    {
      id: 'lineHeight',
      label: 'Line Height',
      type: 'slider',
      value: settings.lineHeight,
    },
    {
      id: 'showLineNumbers',
      label: 'Show Line Numbers',
      type: 'toggle',
      value: settings.showLineNumbers,
    },
  ];

  const getSettingsForCategory = (category: SettingsCategory) => {
    switch (category) {
      case 'appearance':
        return appearanceSettings;
      case 'editor':
        return editorSettings;
      default:
        return [];
    }
  };

  const handleSettingChange = (id: string, value: any) => {
    setSettings((prev) => ({ ...prev, [id]: value }));
  };

  const renderSettingControl = (setting: SettingsItem) => {
    switch (setting.type) {
      case 'select':
        return (
          <select
            value={setting.value}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="px-3 py-1.5 text-sm bg-surface-base text-text rounded-md focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {setting.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'toggle':
        return (
          <button
            onClick={() => handleSettingChange(setting.id, !setting.value)}
            className={cn('relative w-11 h-6 rounded-full', {
              'bg-accent': setting.value,
              'bg-surface-base': !setting.value,
            })}
          >
            <span
              className={cn('absolute top-1 w-4 h-4 bg-white rounded-full', {
                'left-6': setting.value,
                'left-1': !setting.value,
              })}
            />
          </button>
        );
      case 'slider':
        return (
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={setting.id === 'fontSize' ? 10 : 1}
              max={setting.id === 'fontSize' ? 20 : 2}
              step={setting.id === 'fontSize' ? 1 : 0.1}
              value={setting.value}
              onChange={(e) => handleSettingChange(setting.id, parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm text-muted w-12 text-right">
              {setting.value}
              {setting.id === 'fontSize' ? 'px' : ''}
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-8">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <Section
        role="Container"
        prominence="Hero"
        className="relative w-full max-w-4xl h-[600px] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <Section role="Container" prominence="Subtle" className="px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-text">Settings</h2>
            <Button variant="ghost" onClick={onClose} className="h-auto p-1.5">
              <X size={18} className="text-muted" />
            </Button>
          </div>
        </Section>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <Section role="Container" prominence="Subtle" className="w-56 overflow-y-auto">
            <div className="p-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant="ghost"
                    onClick={() => setActiveCategory(category.id)}
                    className={cn('w-full justify-start gap-3 px-3 py-2 h-auto text-sm', {
                      'bg-accent/10 text-accent hover:bg-accent/10': activeCategory === category.id,
                    })}
                  >
                    <Icon size={16} />
                    <span>{category.label}</span>
                  </Button>
                );
              })}
            </div>
          </Section>

          {/* Settings Panel */}
          <div className="flex-1 overflow-y-auto p-6">
            <h3 className="text-base font-semibold text-text mb-4">
              {categories.find((c) => c.id === activeCategory)?.label}
            </h3>

            <div className="space-y-6">
              {getSettingsForCategory(activeCategory).map((setting) => (
                <div key={setting.id} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-text">{setting.label}</label>
                  </div>
                  <div className="w-64">{renderSettingControl(setting)}</div>
                </div>
              ))}

              {getSettingsForCategory(activeCategory).length === 0 && (
                <div className="text-center text-subtle py-12">
                  Settings for this category are coming soon...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <Section role="Container" prominence="Subtle" className="px-6 py-4">
          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="accent" onClick={onClose}>
              Apply
            </Button>
          </div>
        </Section>
      </Section>
    </div>
  );
};
