/**
 * TemplateSelector - Template 선택 UI
 *
 * 사용 가능한 template 목록을 표시하고 선택할 수 있게 함
 */

import type { GridTemplate } from '@/components/types/Atom/types';
import { Group } from '@/components/types/Group/Group';
import { Text } from '@/components/types/Atom/Text/Text';

interface TemplateSelectorProps {
  selectedTemplate: GridTemplate;
  onSelectTemplate: (template: GridTemplate) => void;
}

const TEMPLATES: Array<{
  value: GridTemplate;
  label: string;
  description: string;
  example: string;
}> = [
  {
    value: 'studio',
    label: 'Studio',
    description: 'IDE/Code Editor 레이아웃',
    example: 'VS Code, IntelliJ IDEA',
  },
  {
    value: 'master-detail',
    label: 'Master-Detail',
    description: '리스트 + 상세보기 레이아웃',
    example: 'Notion, Obsidian, Email Client',
  },
  {
    value: 'sidebar-content',
    label: 'Sidebar-Content',
    description: '사이드바 + 메인 콘텐츠 레이아웃',
    example: 'Blog, Documentation, GitBook',
  },
  {
    value: 'dashboard',
    label: 'Dashboard',
    description: '대시보드 레이아웃 (auto-fit grid)',
    example: 'Google Analytics, Admin Panel',
  },
  {
    value: 'dialog',
    label: 'Dialog',
    description: '다이얼로그/모달 레이아웃',
    example: 'Settings Modal, Confirmation Dialog',
  },
  {
    value: '3-col',
    label: '3-Column',
    description: '3단 레이아웃',
    example: 'News Site, Magazine Layout',
  },
];

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  return (
    <Group role="Container" layout="stack" className="h-full overflow-y-auto p-4">
      <Text role="Title" content="Template 선택" prominence="Strong" />
      <Text
        role="Body"
        content="제품 유형에 맞는 template을 선택하세요"
        prominence="Subtle"
        className="text-sm mb-4"
      />

      <Group role="List" layout="stack">
        {TEMPLATES.map((template) => (
          <Group
            key={template.value}
            role="Card"
            className={`cursor-pointer transition-all ${
              selectedTemplate === template.value
                ? 'ring-2 ring-accent bg-accent/5'
                : 'hover:bg-surface-elevated'
            }`}
            onClick={() => onSelectTemplate(template.value)}
          >
            <Group role="Container" layout="stack">
              <Group role="Container" layout="inline" className="justify-between items-start">
                <Text role="Title" content={template.label} prominence="Strong" className="text-base" />
                {selectedTemplate === template.value && (
                  <Text role="Caption" content="✓ 선택됨" intent="Brand" className="text-xs" />
                )}
              </Group>

              <Text
                role="Body"
                content={template.description}
                prominence="Subtle"
                className="text-sm"
              />

              <Text
                role="Caption"
                content={`예: ${template.example}`}
                prominence="Subtle"
                className="text-xs"
              />
            </Group>
          </Group>
        ))}
      </Group>
    </Group>
  );
}
