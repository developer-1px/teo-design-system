/**
 * FormatSidebar - 순수 IDDL 기반 포맷 설정 사이드바 (v4.0)
 *
 * 모든 레이아웃과 스타일을 IDDL Block/Text role로 표현
 * - 수동 div/className 제거
 * - Block layout="stack" + density로 간격 제어
 * - Text role="Label"로 섹션 헤더 표현
 * - 미니멀 디자인 유지 (간결한 간격, 명확한 계층)
 *
 * IDDL 구조:
 * - Section[Aside]: 사이드바 컨테이너 (외부에서 적용)
 *   - Block[Stack]: 전체 폼 컨테이너
 *     - Block[Fieldset]: 텍스트 설정
 *     - Block[Fieldset]: 배경 설정
 *     - Text[Caption]: 안내 메시지
 */

import { useState } from 'react';
import { IDDLProvider } from '@/components/context/IDDLContext';
import { Block } from '@/components/dsl/Block/Block.tsx';
import { Field } from '@/components/dsl/Element/Field/Field';
import { Text } from '@/components/dsl/Element/Text/Text';
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
    textAlign: 'center',
    verticalAlign: 'center',
    animation: 'none',
    fontWeight: 'normal',
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
        density: 'Compact',
        intent: 'Neutral',
        depth: 1,
        mode: 'edit',
      }}
    >
      <Block role="Container" density="Comfortable">
        <Block role="Stack" density="Comfortable">
          {/* Text Formatting Section */}
          <Block role="Fieldset" density="Compact">
            <Text role="Label" prominence="Strong" content="텍스트" />

            <Field
              role="Select"
              label="글꼴"
              model="fontFamily"
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
              role="NumberInput"
              label="크기 (pt)"
              model="fontSize"
              value={formData.fontSize}
              onChange={(value) => handleFieldChange('fontSize', value)}
              spec={{ min: 8, max: 72 }}
            />

            <Field
              role="Input"
              type="color"
              label="색상"
              model="textColor"
              value={formData.textColor}
              onChange={(value) => handleFieldChange('textColor', value)}
            />

            <Field
              role="Select"
              label="굵기"
              model="fontWeight"
              value={formData.fontWeight}
              onChange={(value) => handleFieldChange('fontWeight', value)}
              options={[
                { label: '보통', value: 'normal' },
                { label: '중간', value: 'medium' },
                { label: '굵게', value: 'bold' },
              ]}
            />
          </Block>

          {/* Background Formatting Section */}
          <Block role="Fieldset" density="Compact">
            <Text role="Label" prominence="Strong" content="배경" />

            <Field
              role="Input"
              type="color"
              label="배경색"
              model="backgroundColor"
              value={formData.backgroundColor}
              onChange={(value) => handleFieldChange('backgroundColor', value)}
            />

            <Field
              role="Radio"
              label="프리셋"
              model="backgroundPreset"
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
          </Block>

          {/* Layout Section */}
          <Block role="Fieldset" density="Compact">
            <Text role="Label" prominence="Strong" content="레이아웃" />

            <Field
              role="Radio"
              label="수평 정렬"
              model="textAlign"
              value={formData.textAlign}
              onChange={(value) => handleFieldChange('textAlign', value)}
              options={[
                { label: '왼쪽', value: 'left' },
                { label: '가운데', value: 'center' },
                { label: '오른쪽', value: 'right' },
              ]}
            />

            <Field
              role="Radio"
              label="수직 정렬"
              model="verticalAlign"
              value={formData.verticalAlign}
              onChange={(value) => handleFieldChange('verticalAlign', value)}
              options={[
                { label: '위', value: 'top' },
                { label: '가운데', value: 'center' },
                { label: '아래', value: 'bottom' },
              ]}
            />
          </Block>

          {/* Animation Section */}
          <Block role="Fieldset" density="Compact">
            <Text role="Label" prominence="Strong" content="애니메이션" />

            <Field
              role="Select"
              label="전환 효과"
              model="animation"
              value={formData.animation}
              onChange={(value) => handleFieldChange('animation', value)}
              options={[
                { label: '없음', value: 'none' },
                { label: '페이드', value: 'fade' },
                { label: '슬라이드', value: 'slide' },
                { label: '줌', value: 'zoom' },
                { label: '회전', value: 'rotate' },
              ]}
            />
          </Block>

          {/* Divider + Helper Text */}
          <Block role="Container" prominence="Subtle" density="Comfortable">
            <Text role="Caption" prominence="Subtle" content="현재 선택된 슬라이드에 적용됩니다" />
          </Block>
        </Block>
      </Block>
    </IDDLProvider>
  );
};
