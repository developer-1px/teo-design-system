/**
 * FormatSidebar - IDDL 기반 포맷 설정 사이드바 (v3.0)
 *
 * Features:
 * - Edit 모드 활성화 (IDDLContext mode="edit")
 * - Minimal theme 디자인 (간결한 간격, 명확한 계층)
 * - Slide 데이터 실시간 반영
 *
 * IDDL 구조:
 * - Section[Aside]: 사이드바 컨테이너
 *   - Group[Form]: 폼 전체 (mode="edit")
 *     - Group[Fieldset]: 텍스트 설정
 *     - Group[Fieldset]: 배경 설정
 *     - Text[Caption]: 안내 메시지
 */

import { useState } from 'react';
import { IDDLProvider } from '@/components/context/IDDLContext';
import { Group } from '@/components/types/Group/Group.tsx';
import { Field } from '@/components/types/Atom/Field/Field';
import type { Slide } from './SlideList';

interface FormatSidebarProps {
  isOpen: boolean;
  activeSlide?: Slide;
  onSlideUpdate?: (updates: Partial<Slide>) => void;
}

export const FormatSidebar = ({ isOpen, activeSlide, onSlideUpdate }: FormatSidebarProps) => {
  if (!isOpen) return null;

  // 로컬 상태로 폼 데이터 관리
  const [formData, setFormData] = useState({
    fontFamily: activeSlide?.fontFamily || 'san-francisco',
    fontSize: activeSlide?.fontSize || 24,
    textColor: activeSlide?.textColor || '#000000',
    backgroundColor: activeSlide?.backgroundColor || '#ffffff',
  });

  const handleFieldChange = (field: string, value: any) => {
    const updates = { [field]: value };
    setFormData((prev) => ({ ...prev, ...updates }));
    onSlideUpdate?.(updates);
  };

  return (
    <IDDLProvider
      value={{
        prominence: 'Standard',
        density: 'Comfortable',
        intent: 'Neutral',
        depth: 1,
        mode: 'edit',
      }}
    >
      <div className="h-full w-full overflow-y-auto bg-surface border-l border-border">
        <div className="flex flex-col p-4 gap-6">
          {/* Text Formatting */}
          <Group role="Fieldset" layout="stack" direction="vertical" density="Compact" className="gap-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              텍스트
            </div>

            <Field
              label="글꼴"
              model="fontFamily"
              dataType="select"
              value={formData.fontFamily}
              onChange={(value) => handleFieldChange('fontFamily', value)}
              options={[
                { label: 'San Francisco', value: 'san-francisco' },
                { label: 'Helvetica', value: 'helvetica' },
                { label: 'Arial', value: 'arial' },
                { label: 'Times New Roman', value: 'times' },
              ]}
            />

            <Field
              label="크기 (pt)"
              model="fontSize"
              dataType="number"
              value={formData.fontSize}
              onChange={(value) => handleFieldChange('fontSize', value)}
              constraints={{ min: 8, max: 72 }}
            />

            <Field
              label="색상"
              model="textColor"
              dataType="color"
              value={formData.textColor}
              onChange={(value) => handleFieldChange('textColor', value)}
            />
          </Group>

          {/* Background Formatting */}
          <Group role="Fieldset" layout="stack" direction="vertical" density="Compact" className="gap-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
              배경
            </div>

            <Field
              label="배경색"
              model="backgroundColor"
              dataType="color"
              value={formData.backgroundColor}
              onChange={(value) => handleFieldChange('backgroundColor', value)}
            />

            <Field
              label="프리셋"
              model="backgroundPreset"
              dataType="radio"
              value={formData.backgroundColor}
              onChange={(value) => handleFieldChange('backgroundColor', value)}
              options={[
                { label: '흰색', value: '#ffffff' },
                { label: '회색', value: '#f5f5f5' },
                { label: '파랑', value: '#e3f2fd' },
                { label: '주황', value: '#fff3e0' },
                { label: '보라', value: '#f3e5f5' },
                { label: '초록', value: '#e8f5e9' },
              ]}
            />
          </Group>

          {/* Helper Text */}
          <div className="pt-4 border-t border-border-subtle text-xs text-text-tertiary">
            현재 선택된 슬라이드에 적용됩니다
          </div>
        </div>
      </div>
    </IDDLProvider>
  );
};
