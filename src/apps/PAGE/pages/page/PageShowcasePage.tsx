/**
 * PageShowcasePage - Page Component Showcase
 *
 * Features:
 * - Template 시각화 (Studio, Sidebar, 3-Col, Presentation, Master-Detail, Dialog)
 * - Section 배치 미리보기 (색깔있는 박스로 표시)
 * - IDDL 명세서 표시
 */

import { useState } from 'react';
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import { Group } from '@/components/types/Group/Group';
import { Text } from '@/components/types/Atom/Text/Text';
import { Field } from '@/components/types/Atom/Field/Field';

type PageTemplate = 'Studio' | 'Sidebar' | '3-Col' | 'Presentation' | 'Master-Detail' | 'Dialog';

// Section role별 색상 매핑
const sectionColors: Record<string, string> = {
  Toolbar: 'bg-blue-100 border-blue-300 text-blue-900',
  ActivityBar: 'bg-indigo-100 border-indigo-300 text-indigo-900',
  PrimarySidebar: 'bg-purple-100 border-purple-300 text-purple-900',
  Editor: 'bg-green-100 border-green-300 text-green-900',
  Panel: 'bg-orange-100 border-orange-300 text-orange-900',
  SecondarySidebar: 'bg-pink-100 border-pink-300 text-pink-900',
  Navigator: 'bg-cyan-100 border-cyan-300 text-cyan-900',
  Main: 'bg-emerald-100 border-emerald-300 text-emerald-900',
  Aside: 'bg-rose-100 border-rose-300 text-rose-900',
  Header: 'bg-blue-100 border-blue-300 text-blue-900',
  Footer: 'bg-gray-100 border-gray-300 text-gray-900',
  Master: 'bg-violet-100 border-violet-300 text-violet-900',
  Detail: 'bg-teal-100 border-teal-300 text-teal-900',
  DialogHeader: 'bg-sky-100 border-sky-300 text-sky-900',
  DialogContent: 'bg-lime-100 border-lime-300 text-lime-900',
  DialogFooter: 'bg-slate-100 border-slate-300 text-slate-900',
};

// Template별 Section 구성
const templateSections: Record<PageTemplate, Array<{ role: string; gridArea: string; description: string }>> = {
  Studio: [
    { role: 'Toolbar', gridArea: 'toolbar', description: '상단 툴바 (고정)' },
    { role: 'ActivityBar', gridArea: 'activitybar', description: '좌측 아이콘바' },
    { role: 'PrimarySidebar', gridArea: 'primarysidebar', description: '메인 사이드바 (파일 트리)' },
    { role: 'Editor', gridArea: 'editor', description: '에디터 영역' },
    { role: 'Panel', gridArea: 'panel', description: '하단 패널 (터미널)' },
    { role: 'SecondarySidebar', gridArea: 'secondarysidebar', description: '우측 사이드바' },
  ],
  Sidebar: [
    { role: 'Header', gridArea: 'header', description: '상단 헤더' },
    { role: 'Navigator', gridArea: 'nav', description: '네비게이션 사이드바' },
    { role: 'Main', gridArea: 'content', description: '메인 콘텐츠' },
    { role: 'Footer', gridArea: 'footer', description: '하단 푸터' },
  ],
  '3-Col': [
    { role: 'Header', gridArea: 'header', description: '상단 헤더 (전체 너비)' },
    { role: 'Navigator', gridArea: 'left', description: '좌측 네비게이션' },
    { role: 'Main', gridArea: 'center', description: '중앙 메인' },
    { role: 'Aside', gridArea: 'right', description: '우측 사이드바' },
  ],
  Presentation: [
    { role: 'Header', gridArea: 'header', description: '프레젠테이션 툴바' },
    { role: 'Navigator', gridArea: 'left', description: '슬라이드 썸네일 리스트' },
    { role: 'Main', gridArea: 'main', description: '슬라이드 캔버스' },
    { role: 'Aside', gridArea: 'right', description: '포맷 설정 사이드바' },
    { role: 'Footer', gridArea: 'footer', description: '하단 상태바' },
  ],
  'Master-Detail': [
    { role: 'Master', gridArea: 'master', description: '마스터 리스트' },
    { role: 'Detail', gridArea: 'detail', description: '상세 뷰' },
  ],
  Dialog: [
    { role: 'DialogHeader', gridArea: 'dialog-header', description: '다이얼로그 헤더' },
    { role: 'DialogContent', gridArea: 'dialog-content', description: '다이얼로그 콘텐츠' },
    { role: 'DialogFooter', gridArea: 'dialog-footer', description: '다이얼로그 푸터' },
  ],
};

export function PageShowcasePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate>('Studio');

  const sections = templateSections[selectedTemplate];

  return (
    <Page role="Application" layout="Studio">
      {/* Top Toolbar */}
      <Section role="Toolbar" prominence="Standard">
        <Group role="Toolbar" layout="inline" density="Compact">
          <Text role="Title" prominence="Standard" content="Page Component Showcase" />
        </Group>
      </Section>

      {/* Left Sidebar - Template Selection */}
      <Section role="PrimarySidebar" prominence="Standard">
        <Group role="Container" layout="stack" density="Comfortable" className="p-4 gap-4">
          <Group role="Fieldset" layout="stack">
            <Text role="Label" content="Page Template" prominence="Standard" />
            <Field
              label=""
              model="pageTemplate"
              type="select"
              value={selectedTemplate}
              onChange={(value) => setSelectedTemplate(value as PageTemplate)}
              options={[
                { label: 'Studio (IDE)', value: 'Studio' },
                { label: 'Sidebar (Docs)', value: 'Sidebar' },
                { label: '3-Col (Dashboard)', value: '3-Col' },
                { label: 'Presentation (PPT)', value: 'Presentation' },
                { label: 'Master-Detail', value: 'Master-Detail' },
                { label: 'Dialog', value: 'Dialog' },
              ]}
            />
          </Group>

          <Group role="Fieldset" layout="stack" density="Comfortable">
            <Text role="Label" content="Sections in Template" prominence="Standard" />
            {sections.map((section) => (
              <Group key={section.role} role="Inline" layout="inline" density="Comfortable">
                <Group role="ColorIndicator" className={sectionColors[section.role] || 'bg-gray-100'}>{''}</Group>
                <Text role="Body" prominence="Standard" content={section.role} />
              </Group>
            ))}
          </Group>
        </Group>
      </Section>

      {/* Center Canvas - Template Visualization */}
      <Section role="Editor" prominence="Standard">
        <Group role="Container" layout="stack" density="Comfortable">
          <Group role="Card" prominence="Standard" density="Comfortable" layout="stack">
            <Text
              role="Title"
              prominence="Standard"
              content={`Template: ${selectedTemplate}`}
            />

            {/* Miniature Grid Layout Visualization */}
            <Group role="PreviewContainer">
              {selectedTemplate === 'Studio' && (
                <Group role="Grid" layout="grid" className="gap-2 h-full" style={{ gridTemplateAreas: '"toolbar toolbar toolbar toolbar" "activitybar primarysidebar editor secondarysidebar" "activitybar panel panel panel"', gridTemplateColumns: '48px 200px 1fr 250px', gridTemplateRows: '48px 1fr 200px' }}>
                  {sections.map((section) => (
                    <Group
                      key={section.role}
                      role="PreviewCard"
                      style={{ gridArea: section.gridArea }}
                      className={sectionColors[section.role]}
                    >
                      <Text role="Label" prominence="Standard" content={section.role} />
                      <Text role="Caption" prominence="Standard" content={section.gridArea} />
                      <Text role="Caption" prominence="Subtle" content={section.description} />
                    </Group>
                  ))}
                </Group>
              )}

              {selectedTemplate === 'Sidebar' && (
                <Group role="Grid" layout="grid" className="gap-2 h-full" style={{ gridTemplateAreas: '"header header" "nav content" "footer footer"', gridTemplateColumns: '200px 1fr', gridTemplateRows: 'auto 1fr auto' }}>
                  {sections.map((section) => (
                    <Group
                      key={section.role}
                      style={{ gridArea: section.gridArea }}
                      role="PreviewCard" className={sectionColors[section.role]}
                    >
                      <Text role="Label" prominence="Standard" content={section.role} />
                      <Text role="Caption" prominence="Standard" content={section.gridArea} />
                      <Text role="Caption" prominence="Subtle" content={section.description} />
                    </Group>
                  ))}
                </Group>
              )}

              {selectedTemplate === '3-Col' && (
                <Group role="Grid" layout="grid" className="gap-2 h-full" style={{ gridTemplateAreas: '"header header header" "left center right"', gridTemplateColumns: '200px 1fr 250px', gridTemplateRows: 'auto 1fr' }}>
                  {sections.map((section) => (
                    <Group
                      key={section.role}
                      style={{ gridArea: section.gridArea }}
                      role="PreviewCard" className={sectionColors[section.role]}
                    >
                      <Text role="Label" prominence="Standard" content={section.role} />
                      <Text role="Caption" prominence="Standard" content={section.gridArea} />
                      <Text role="Caption" prominence="Subtle" content={section.description} />
                    </Group>
                  ))}
                </Group>
              )}

              {selectedTemplate === 'Presentation' && (
                <Group role="Grid" layout="grid" className="gap-2 h-full" style={{ gridTemplateAreas: '"header header header" "left main right" "footer footer footer"', gridTemplateColumns: '150px 1fr 200px', gridTemplateRows: 'auto 1fr auto' }}>
                  {sections.map((section) => (
                    <Group
                      key={section.role}
                      style={{ gridArea: section.gridArea }}
                      role="PreviewCard" className={sectionColors[section.role]}
                    >
                      <Text role="Label" prominence="Standard" content={section.role} />
                      <Text role="Caption" prominence="Standard" content={section.gridArea} />
                      <Text role="Caption" prominence="Subtle" content={section.description} />
                    </Group>
                  ))}
                </Group>
              )}

              {selectedTemplate === 'Master-Detail' && (
                <Group role="Grid" layout="grid" className="gap-2 h-full" style={{ gridTemplateAreas: '"master detail"', gridTemplateColumns: '300px 1fr', gridTemplateRows: '1fr' }}>
                  {sections.map((section) => (
                    <Group
                      key={section.role}
                      style={{ gridArea: section.gridArea }}
                      role="PreviewCard" className={sectionColors[section.role]}
                    >
                      <Text role="Label" prominence="Standard" content={section.role} />
                      <Text role="Caption" prominence="Standard" content={section.gridArea} />
                      <Text role="Caption" prominence="Subtle" content={section.description} />
                    </Group>
                  ))}
                </Group>
              )}

              {selectedTemplate === 'Dialog' && (
                <Group role="Grid" layout="grid" className="gap-2 h-full max-w-md mx-auto" style={{ gridTemplateAreas: '"header" "content" "footer"', gridTemplateColumns: '1fr', gridTemplateRows: 'auto 1fr auto' }}>
                  {sections.map((section) => (
                    <Group
                      key={section.role}
                      style={{ gridArea: section.gridArea }}
                      role="PreviewCard" className={sectionColors[section.role]}
                    >
                      <Text role="Label" prominence="Standard" content={section.role} />
                      <Text role="Caption" prominence="Standard" content={section.gridArea} />
                      <Text role="Caption" prominence="Subtle" content={section.description} />
                    </Group>
                  ))}
                </Group>
              )}
            </Group>
          </Group>
        </Group>
      </Section>

      {/* Right Panel - IDDL Spec */}
      <Section role="SecondarySidebar" prominence="Standard">
        <Group role="Container" layout="stack" density="Comfortable">
          <Text role="Title" prominence="Standard" content="IDDL Specification" />

          <Group role="Card" prominence="Subtle" density="Comfortable">
            <Text
              role="Code"
              prominence="Standard"
              content={`<Page role="Application" layout="${selectedTemplate}">\n  ${sections.map(s => `<Section role="${s.role}" />`).join('\n  ')}\n</Page>`}
            />
          </Group>

          <Group role="Fieldset" layout="stack" density="Comfortable">
            <Text role="Label" prominence="Standard" content="Grid Template" />
            {sections.map((section) => (
              <Group key={section.role} role="Container" layout="stack" density="Comfortable">
                <Group role="Inline" layout="inline" density="Comfortable">
                  <Group role="ColorIndicator" density="Compact" className={sectionColors[section.role]}>{''}</Group>
                  <Text role="Code" prominence="Standard" content={`gridArea: "${section.gridArea}"`} />
                </Group>
                <Text role="Caption" prominence="Subtle" content={section.description} />
              </Group>
            ))}
          </Group>
        </Group>
      </Section>
    </Page>
  );
}
