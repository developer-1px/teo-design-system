/**
 * LayoutPreview - 실시간 레이아웃 미리보기
 *
 * 선택된 template의 실제 레이아웃을 시각화
 * 각 Section의 role과 HTML 태그를 표시
 * **v2: 실제 Page와 Section 컴포넌트 사용 (Live Demo)**
 */

import type { GridTemplate } from '@/components/types/Atom/types';
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import { Group } from '@/components/types/Group/Group';
import { Text } from '@/components/types/Atom/Text/Text';

interface LayoutPreviewProps {
  template: GridTemplate;
  sections: string[];
  onSectionsChange: (sections: string[]) => void;
}

export function LayoutPreview({ template, sections }: LayoutPreviewProps) {
  return (
    <Group role="Container" className="h-full overflow-y-auto p-4">
      <Group role="Container" layout="stack" className="mb-4">
        <Text role="Title" content="레이아웃 미리보기" prominence="Strong" />
        <Text
          role="Body"
          content={`Template: ${template}`}
          prominence="Subtle"
          className="text-sm"
        />
      </Group>

      {/* Preview Container - 실제 Page/Section 렌더링 */}
      <Group
        role="Container"
        className="border border-border-default rounded-lg overflow-hidden h-[calc(100vh-200px)] min-h-[600px]"
      >
        <PreviewContent template={template} sections={sections} />
      </Group>
    </Group>
  );
}

/**
 * PreviewContent - 실제 Page와 Section 컴포넌트 렌더링 (Live Demo v2)
 *
 * Page의 template만으로 Section이 자동 배치됨
 * Section role → gridArea 자동 매핑 (Section 컴포넌트 내부에서 처리)
 */
function PreviewContent({ template, sections }: { template: GridTemplate; sections: string[] }) {
  // HTML 태그 매핑 (표시용)
  const getHtmlTag = (sectionRole: string): string => {
    const tagMap: Record<string, string> = {
      Main: 'main',
      Header: 'header',
      Footer: 'footer',
      Navigator: 'nav',
      Aside: 'aside',
      ActivityBar: 'nav',
      PrimarySidebar: 'aside',
      Editor: 'main',
      Panel: 'section',
      SecondarySidebar: 'aside',
      Master: 'aside',
      Detail: 'main',
      DialogHeader: 'header',
      DialogFooter: 'footer',
      DialogContent: 'div',
    };
    return tagMap[sectionRole] || 'section';
  };

  // Grid area 표시용 (Section 내부에서 자동 계산됨)
  const getGridAreaForDisplay = (sectionRole: string): string => {
    const areaMap: Record<string, Record<string, string>> = {
      studio: {
        ActivityBar: 'activitybar',
        PrimarySidebar: 'sidebar',
        Editor: 'editor',
        Panel: 'panel',
        SecondarySidebar: 'rightbar',
      },
      'master-detail': {
        Master: 'master',
        Detail: 'detail',
      },
      'sidebar-content': {
        Navigator: 'nav',
        Main: 'content',
        Aside: 'aside',
      },
      '3-col': {
        Navigator: 'left',
        Main: 'center',
        Aside: 'right',
      },
      dialog: {
        DialogHeader: 'dialog-header',
        DialogContent: 'dialog-content',
        DialogFooter: 'dialog-footer',
      },
    };
    return areaMap[template]?.[sectionRole] || sectionRole.toLowerCase();
  };

  return (
    <Page role="Application" layout={template as any} gap={0} className="w-full h-full">
      {sections.map((sectionRole, index) => (
        <Section
          key={`${sectionRole}-${index}`}
          role={sectionRole as any}
          className="border border-accent/30 bg-surface-elevated overflow-auto"
        >
          <Group
            role="Container"
            className="h-full flex flex-col items-center justify-center p-4 text-center"
          >
            <Text
              role="Title"
              content={sectionRole}
              prominence="Strong"
              className="text-lg mb-2"
            />
            <Text
              role="Code"
              content={`<${getHtmlTag(sectionRole)}>`}
              prominence="Subtle"
              className="text-xs font-mono bg-surface-sunken px-2 py-1 rounded"
            />
            <Text
              role="Caption"
              content={`grid-area: ${getGridAreaForDisplay(sectionRole)}`}
              prominence="Subtle"
              className="text-xs mt-2"
            />
          </Group>
        </Section>
      ))}
    </Page>
  );
}
