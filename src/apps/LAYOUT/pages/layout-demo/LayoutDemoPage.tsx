/**
 * LayoutDemoPage - Page Template & Section 데모
 *
 * 4-panel layout:
 * - 좌측: Template 선택기
 * - 중앙: 실시간 레이아웃 미리보기 (resizable)
 * - 우측: Section role 정보 표
 * - 하단: 코드 생성기
 */

import { useState } from 'react';
import type { GridTemplate } from '@/components/types/Atom/types';
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import { TemplateSelector } from '../../widgets/TemplateSelector';
import { LayoutPreview } from '../../widgets/LayoutPreview';
import { SectionInfoTable } from '../../widgets/SectionInfoTable';
import { CodeGenerator } from '../../widgets/CodeGenerator';

export function LayoutDemoPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<GridTemplate>('studio');
  const [sections, setSections] = useState<string[]>([
    'ActivityBar',
    'PrimarySidebar',
    'Editor',
    'Panel',
  ]);

  return (
    <Page role="Application" layout="Studio">
      {/* 좌측: Template 선택기 */}
      <Section role="PrimarySidebar">
        <TemplateSelector
          selectedTemplate={selectedTemplate}
          onSelectTemplate={(template) => {
            setSelectedTemplate(template);
            // template 변경 시 기본 sections 설정
            setSections(getDefaultSections(template));
          }}
        />
      </Section>

      {/* 중앙: 레이아웃 미리보기 */}
      <Section role="Editor">
        <LayoutPreview
          template={selectedTemplate}
          sections={sections}
          onSectionsChange={setSections}
        />
      </Section>

      {/* 우측: Section 정보 */}
      <Section role="SecondarySidebar">
        <SectionInfoTable template={selectedTemplate} />
      </Section>

      {/* 하단: 코드 생성기 */}
      <Section role="Panel">
        <CodeGenerator template={selectedTemplate} sections={sections} />
      </Section>
    </Page>
  );
}

/**
 * Template별 기본 Section 구성
 */
function getDefaultSections(template: GridTemplate): string[] {
  switch (template) {
    case 'studio':
      return ['ActivityBar', 'PrimarySidebar', 'Editor', 'Panel'];
    case 'master-detail':
      return ['Master', 'Detail'];
    case 'sidebar-content':
      return ['Navigator', 'Main', 'Aside'];
    case 'dashboard':
      return ['Header', 'Main'];
    case 'dialog':
      return ['DialogHeader', 'DialogContent', 'DialogFooter'];
    case '3-col':
      return ['Navigator', 'Main', 'Aside'];
    default:
      return ['Main'];
  }
}
