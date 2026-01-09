/**
 * SettingsModalDSL - IDDL 기반 설정 모달 (v1.0.1)
 *
 * IDDL Structure:
 * - Overlay[Dialog]: 최상위 모달 컨테이너
 *   - Section[Header]: 타이틀 영역
 *   - Section[Container]: 메인 영역
 *     - Section[Navigator]: 카테고리 사이드바
 *       - Group[List]: 카테고리 버튼 목록
 *     - Section[Container]: 설정 패널
 *       - Group[Form]: 설정 폼 필드들
 *   - Section[Footer]: 버튼 영역
 *     - Group[Toolbar]: Cancel/Apply 버튼
 */

import { useState } from 'react';
import { Overlay } from '@/components/dsl/Overlay';
import { Section } from '@/components/dsl/Section';
import { Group } from '@/components/dsl/Group';
import { Field } from '@/components/dsl/Field';
import { Action } from '@/components/dsl/Action';
import { Text } from '@/components/dsl/Text';
import {
  Palette,
  Type,
  Layers,
  Keyboard,
  Settings as SettingsIcon,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsCategory =
  | 'appearance'
  | 'editor'
  | 'layers'
  | 'keymap'
  | 'general';

interface SettingsItem {
  id: string;
  label: string;
  type: 'select' | 'boolean' | 'range';
  value: any;
  options?: { label: string; value: any }[];
  min?: number;
  max?: number;
  step?: number;
}

export const SettingsModalDSL = ({ isOpen, onClose }: SettingsModalProps) => {
  const [activeCategory, setActiveCategory] =
    useState<SettingsCategory>('appearance');
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
      type: 'range',
      value: settings.fontSize,
      min: 10,
      max: 20,
      step: 1,
    },
    {
      id: 'lineHeight',
      label: 'Line Height',
      type: 'range',
      value: settings.lineHeight,
      min: 1,
      max: 2,
      step: 0.1,
    },
    {
      id: 'showLineNumbers',
      label: 'Show Line Numbers',
      type: 'boolean',
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

  return (
    <Overlay
      id="settings-modal"
      role="Dialog"
      isOpen={isOpen}
      onClose={onClose}
      dismissable={true}
      className="max-w-4xl w-full h-[600px] flex flex-col"
    >
      {/* Header */}
      <Section role="Header" className="px-6 py-4 border-b border-border">
        <Text
          role="Title"
          prominence="Hero"
          className="text-lg font-semibold"
          content="Settings"
        />
      </Section>

      {/* Main Content */}
      <Section role="Container" className="flex flex-1 overflow-hidden">
        {/* Sidebar - Categories */}
        <Section role="Navigator" className="w-56 border-r border-border overflow-y-auto">
          <Group role="List" className="p-2 gap-1">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Action
                  key={category.id}
                  label={category.label}
                  icon={Icon.displayName || Icon.name}
                  prominence={activeCategory === category.id ? 'Primary' : 'Tertiary'}
                  intent={activeCategory === category.id ? 'Brand' : 'Neutral'}
                  onClick={() => setActiveCategory(category.id)}
                  className="w-full justify-start gap-3 px-3 py-2 text-sm"
                />
              );
            })}
          </Group>
        </Section>

        {/* Settings Panel */}
        <Section role="Container" className="flex-1 overflow-y-auto p-6">
          <Text
            role="Title"
            prominence="Primary"
            className="text-base font-semibold mb-4"
            content={categories.find((c) => c.id === activeCategory)?.label || ''}
          />

          <Group role="Form" className="gap-6">
            {getSettingsForCategory(activeCategory).map((setting) => (
              <div key={setting.id} className="flex items-center justify-between">
                <Text
                  role="Label"
                  prominence="Primary"
                  className="text-sm font-medium"
                  content={setting.label}
                />
                <div className="w-64">
                  {setting.type === 'select' && (
                    <Field
                      model={setting.id}
                      dataType="select"
                      label=""
                      options={setting.options}
                      value={setting.value}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleSettingChange(setting.id, e.target.value)
                      }
                    />
                  )}
                  {setting.type === 'boolean' && (
                    <Field
                      model={setting.id}
                      dataType="boolean"
                      label={setting.label}
                      value={setting.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleSettingChange(setting.id, e.target.checked)
                      }
                    />
                  )}
                  {setting.type === 'range' && (
                    <div className="flex items-center gap-3">
                      <Field
                        model={setting.id}
                        dataType="range"
                        label=""
                        value={setting.value}
                        constraints={{
                          min: setting.min,
                          max: setting.max,
                        }}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleSettingChange(setting.id, parseFloat(e.target.value))
                        }
                        className="flex-1"
                      />
                      <Text
                        role="Body"
                        prominence="Tertiary"
                        className="text-sm w-12 text-right"
                        content={`${setting.value}${setting.id === 'fontSize' ? 'px' : ''}`}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {getSettingsForCategory(activeCategory).length === 0 && (
              <Text
                role="Body"
                prominence="Tertiary"
                className="text-center py-12"
                content="Settings for this category are coming soon..."
              />
            )}
          </Group>
        </Section>
      </Section>

      {/* Footer */}
      <Section role="Footer" className="px-6 py-4 border-t border-border">
        <Group role="Toolbar" layout="inline" className="gap-3 justify-end">
          <Action
            label="Cancel"
            prominence="Tertiary"
            intent="Neutral"
            onClick={onClose}
          />
          <Action
            label="Apply"
            prominence="Primary"
            intent="Brand"
            onClick={onClose}
          />
        </Group>
      </Section>
    </Overlay>
  );
};
