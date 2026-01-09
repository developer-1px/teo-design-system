/**
 * FormatSidebar - 순수 IDDL 기반 포맷 설정 사이드바 (v2.0)
 *
 * IDDL 전체 스택 사용:
 * - Section[Aside]: 전체 사이드바
 *   - Group[Fieldset]: 텍스트 설정
 *     - Field[select]: 글꼴 선택
 *     - Field[number]: 글꼴 크기
 *     - Field[color]: 텍스트 색상
 *   - Group[Fieldset]: 배경 설정
 *     - Field[color]: 배경색
 *     - Field[radio]: 프리셋 색상
 *   - Group[Info]: 안내 메시지
 */

import { Field } from '@/components/Field/Field';
import { Group } from '@/components/Group/Group.tsx';
import { Section } from '@/components/Section/Section.tsx';
import { Text } from '@/components/Text/Text';

interface FormatSidebarProps {
  isOpen: boolean;
}

export const FormatSidebar = ({ isOpen }: FormatSidebarProps) => {
  if (!isOpen) return null;

  return (
    <Section role="Aside" prominence="Tertiary" className="h-full w-full overflow-y-auto p-4">
      {/* Group[Fieldset]: Text Formatting */}
      <Group role="Fieldset" layout="stack" density="Compact" className="gap-3">
        <Text role="Title" prominence="Secondary" content="텍스트" />

        {/* Font Family - IDDL Field[select] */}
        <Field
          label="글꼴"
          model="fontFamily"
          dataType="select"
          prominence="Secondary"
          options={[
            { label: 'San Francisco', value: 'san-francisco' },
            { label: 'Helvetica', value: 'helvetica' },
            { label: 'Arial', value: 'arial' },
            { label: 'Times New Roman', value: 'times' },
          ]}
        />

        {/* Font Size - IDDL Field[number] */}
        <Field
          label="크기 (pt)"
          model="fontSize"
          dataType="number"
          prominence="Secondary"
          constraints={{
            min: 8,
            max: 72,
          }}
        />

        {/* Text Color - IDDL Field[color] */}
        <Field label="색상" model="textColor" dataType="color" prominence="Secondary" />
      </Group>

      {/* Group[Fieldset]: Background Formatting */}
      <Group role="Fieldset" layout="stack" density="Compact" className="gap-3 mt-6">
        <Text role="Title" prominence="Secondary" content="배경" />

        {/* Background Color - IDDL Field[color] */}
        <Field label="배경색" model="backgroundColor" dataType="color" prominence="Secondary" />

        {/* Preset Colors - IDDL Field[radio] */}
        <Field
          label="프리셋"
          model="backgroundPreset"
          dataType="radio"
          prominence="Secondary"
          options={[
            { label: '흰색', value: '#ffffff' },
            { label: '연한 회색', value: '#f0f0f0' },
            { label: '파랑', value: '#e3f2fd' },
            { label: '주황', value: '#fff3e0' },
            { label: '보라', value: '#f3e5f5' },
            { label: '초록', value: '#e8f5e9' },
            { label: '분홍', value: '#fce4ec' },
            { label: '노랑', value: '#fff9c4' },
            { label: '회색', value: '#cfd8dc' },
            { label: '검정', value: '#000000' },
          ]}
        />
      </Group>

      {/* Helper Text */}
      <Group
        role="Container"
        layout="stack"
        density="Compact"
        className="mt-6 pt-4 border-t border-border"
      >
        <Text
          role="Caption"
          prominence="Tertiary"
          content="현재 선택된 슬라이드에 적용됩니다"
          intent="Info"
        />
      </Group>
    </Section>
  );
};
