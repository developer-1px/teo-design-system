/**
 * SettingsModalDSL - IDDL 기반 설정 모달 (v1.0.1)
 *
 * IDDL Structure:
 * - Overlay[Dialog]: 최상위 모달 컨테이너
 *   - Section[Header]: 타이틀 영역
 *   - Section[Container]: 메인 영역
 *     - Section[Navigator]: 카테고리 사이드바
 *       - Block[List]: 카테고리 버튼 목록
 *     - Section[Container]: 설정 패널
 *       - Block[Form]: 설정 폼 필드들
 *   - Section[Footer]: 버튼 영역
 *     - Block[Toolbar]: Cancel/Apply 버튼
 */

import { Keyboard, Layers, Palette, Settings as SettingsIcon, Type } from 'lucide-react';
import { useState } from 'react';
import { Block } from '@/components/types/Block/Block.tsx';
import { Action } from '@/components/types/Element/Action/Action.tsx';
import { Field } from '@/components/types/Element/Field/Field.tsx';
import { Text } from '@/components/types/Element/Text/Text.tsx';
import { Overlay } from '@/components/types/Overlay/Overlay.tsx';
import { Section } from '@/components/types/Section/Section.tsx';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsCategory = 'appearance' | 'editor' | 'layers' | 'keymap' | 'general';

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
      density="Compact"
    >
      {/* Header */}
      <Section role="DialogHeader" density="Compact">
        <Text role="Title" prominence="Standard" content="Settings" />
      </Section>

      {/* Main Content */}
      <Section role="DialogContent" density="Compact">
        <Section role="SplitContainer">
          {/* Sidebar - Categories */}
          <Section role="Navigator">
            <Block role="List" density="Compact">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Action
                    key={category.id}
                    label={category.label}
                    icon={Icon.displayName || Icon.name}
                    prominence={activeCategory === category.id ? 'Standard' : 'Standard'}
                    intent={activeCategory === category.id ? 'Brand' : 'Neutral'}
                    onClick={() => setActiveCategory(category.id)}
                  />
                );
              })}
            </Block>
          </Section>

          {/* Settings Panel */}
          <Section role="Container" density="Compact">
            <Text
              role="Title"
              prominence="Standard"
              content={categories.find((c) => c.id === activeCategory)?.label || ''}
            />

            <Block role="Form" density="Compact">
              {getSettingsForCategory(activeCategory).map((setting) => (
                <Block key={setting.id} role="Inline" layout="inline" density="Compact">
                  <Text role="Label" prominence="Standard" content={setting.label} />
                  {setting.type === 'select' && (
                    <Field
                      model={setting.id}
                      type="select"
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
                      type="boolean"
                      label={setting.label}
                      value={setting.value}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleSettingChange(setting.id, e.target.checked)
                      }
                    />
                  )}
                  {setting.type === 'range' && (
                    <Block role="Inline" layout="inline" density="Compact">
                      <Field
                        model={setting.id}
                        type="range"
                        label=""
                        value={setting.value}
                        constraints={{
                          min: setting.min,
                          max: setting.max,
                        }}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleSettingChange(setting.id, parseFloat(e.target.value))
                        }
                      />
                      <Text
                        role="Body"
                        prominence="Subtle"
                        align="right"
                        content={`${setting.value}${setting.id === 'fontSize' ? 'px' : ''}`}
                      />
                    </Block>
                  )}
                </Block>
              ))}

              {getSettingsForCategory(activeCategory).length === 0 && (
                <Text
                  role="Body"
                  prominence="Subtle"
                  align="center"
                  content="Settings for this category are coming soon..."
                />
              )}
            </Block>
          </Section>
        </Section>
      </Section>

      {/* Footer */}
      <Section role="DialogFooter" density="Compact">
        <Block role="Toolbar" layout="inline" density="Compact">
          <Action label="Cancel" prominence="Standard" intent="Neutral" onClick={onClose} />
          <Action label="Apply" prominence="Standard" intent="Brand" onClick={onClose} />
        </Block>
      </Section>
    </Overlay>
  );
};
