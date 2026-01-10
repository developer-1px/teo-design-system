/**
 * SectionInfoTable - Section Role 정보 표
 *
 * 선택된 template의 유효한 Section role과 세부 정보 표시
 */

import type { GridTemplate, SectionRole } from '@/components/types/Atom/types';
import { TEMPLATE_SECTION_ROLES } from '@/components/types/Atom/types';
import { Group } from '@/components/types/Group/Group';
import { Text } from '@/components/types/Atom/Text/Text';

interface SectionInfoTableProps {
  template: GridTemplate;
}

interface SectionInfo {
  role: SectionRole;
  htmlTag: string;
  ariaRole?: string;
  ariaLabel?: string;
  gridArea: string;
  description: string;
}

const SECTION_INFO: Record<string, SectionInfo> = {
  // Universal
  Header: {
    role: 'Header',
    htmlTag: '<header>',
    gridArea: 'header',
    description: '페이지 상단 헤더',
  },
  Footer: {
    role: 'Footer',
    htmlTag: '<footer>',
    gridArea: 'footer',
    description: '페이지 하단 푸터',
  },
  Main: {
    role: 'Main',
    htmlTag: '<main>',
    gridArea: 'main',
    description: '메인 콘텐츠 영역',
  },
  Container: {
    role: 'Container',
    htmlTag: '<section>',
    gridArea: 'container',
    description: '일반 컨테이너',
  },
  // Web Standard
  Navigator: {
    role: 'Navigator',
    htmlTag: '<nav>',
    ariaRole: 'navigation',
    gridArea: 'nav',
    description: '네비게이션 영역',
  },
  Aside: {
    role: 'Aside',
    htmlTag: '<aside>',
    gridArea: 'aside',
    description: '보조 사이드바',
  },
  Search: {
    role: 'Search',
    htmlTag: '<search>',
    ariaRole: 'search',
    gridArea: 'search',
    description: '검색 영역',
  },
  Region: {
    role: 'Region',
    htmlTag: '<section>',
    ariaRole: 'region',
    gridArea: 'region',
    description: '명명된 영역',
  },
  // IDE/Studio
  Toolbar: {
    role: 'Toolbar',
    htmlTag: '<div>',
    ariaRole: 'toolbar',
    gridArea: 'toolbar',
    description: '툴바',
  },
  ActivityBar: {
    role: 'ActivityBar',
    htmlTag: '<nav>',
    ariaRole: 'navigation',
    ariaLabel: 'Activity Bar',
    gridArea: 'activitybar',
    description: '액티비티 바 (아이콘 세로 바)',
  },
  PrimarySidebar: {
    role: 'PrimarySidebar',
    htmlTag: '<aside>',
    ariaLabel: 'Primary Sidebar',
    gridArea: 'sidebar',
    description: '주 사이드바 (파일 트리 등)',
  },
  SecondarySidebar: {
    role: 'SecondarySidebar',
    htmlTag: '<aside>',
    ariaLabel: 'Secondary Sidebar',
    gridArea: 'secondary-sidebar',
    description: '보조 사이드바 (아웃라인 등)',
  },
  Editor: {
    role: 'Editor',
    htmlTag: '<main>',
    gridArea: 'editor',
    description: '에디터 영역',
  },
  Panel: {
    role: 'Panel',
    htmlTag: '<section>',
    ariaLabel: 'Panel',
    gridArea: 'panel',
    description: '하단 패널 (터미널, 콘솔 등)',
  },
  Auxiliary: {
    role: 'Auxiliary',
    htmlTag: '<aside>',
    ariaLabel: 'Auxiliary Panel',
    gridArea: 'rightbar',
    description: '보조 패널 (속성, AI 등)',
  },
  // Master-Detail
  Master: {
    role: 'Master',
    htmlTag: '<aside>',
    ariaLabel: 'Master List',
    gridArea: 'master',
    description: '마스터 리스트 (사이드 패널)',
  },
  Detail: {
    role: 'Detail',
    htmlTag: '<main>',
    ariaLabel: 'Detail View',
    gridArea: 'detail',
    description: '디테일 뷰 (메인 콘텐츠)',
  },
  // Dialog
  DialogHeader: {
    role: 'DialogHeader',
    htmlTag: '<header>',
    ariaLabel: 'Dialog Header',
    gridArea: 'dialog-header',
    description: '다이얼로그 헤더',
  },
  DialogContent: {
    role: 'DialogContent',
    htmlTag: '<div>',
    ariaLabel: 'Dialog Content',
    gridArea: 'dialog-content',
    description: '다이얼로그 콘텐츠',
  },
  DialogFooter: {
    role: 'DialogFooter',
    htmlTag: '<footer>',
    ariaLabel: 'Dialog Footer',
    gridArea: 'dialog-footer',
    description: '다이얼로그 푸터',
  },
};

export function SectionInfoTable({ template }: SectionInfoTableProps) {
  const validRoles = TEMPLATE_SECTION_ROLES[template] || [];
  const universalRoles = TEMPLATE_SECTION_ROLES.universal || [];
  const allValidRoles = [...new Set([...universalRoles, ...validRoles])];

  return (
    <Group role="Container" layout="stack" className="h-full overflow-y-auto p-4">
      <Text role="Title" content="Section Role 정보" prominence="Strong" />
      <Text
        role="Body"
        content={`Template: ${template} (${allValidRoles.length}개 role)`}
        prominence="Subtle"
        className="text-sm mb-4"
      />

      <Group role="List" layout="stack">
        {allValidRoles.map((role) => {
          const info = SECTION_INFO[role];
          if (!info) return null;

          return (
            <Group key={role} role="Card" className="text-sm">
              <Group role="Container" layout="stack">
                {/* Role Name */}
                <Text role="Title" content={info.role} prominence="Strong" className="text-base" />

                {/* HTML Tag */}
                <Group role="Container" layout="inline" className="items-center gap-2">
                  <Text role="Caption" content="HTML:" prominence="Subtle" className="text-xs" />
                  <Text
                    role="Code"
                    content={info.htmlTag}
                    className="text-xs font-mono bg-surface-sunken px-2 py-0.5 rounded"
                  />
                </Group>

                {/* ARIA */}
                {(info.ariaRole || info.ariaLabel) && (
                  <Group role="Container" layout="inline" className="items-center gap-2">
                    <Text role="Caption" content="ARIA:" prominence="Subtle" className="text-xs" />
                    <Text
                      role="Code"
                      content={info.ariaRole || info.ariaLabel || ''}
                      className="text-xs font-mono bg-surface-sunken px-2 py-0.5 rounded"
                    />
                  </Group>
                )}

                {/* Grid Area */}
                <Group role="Container" layout="inline" className="items-center gap-2">
                  <Text role="Caption" content="Grid Area:" prominence="Subtle" className="text-xs" />
                  <Text
                    role="Code"
                    content={info.gridArea}
                    className="text-xs font-mono bg-surface-sunken px-2 py-0.5 rounded"
                  />
                </Group>

                {/* Description */}
                <Text
                  role="Body"
                  content={info.description}
                  prominence="Subtle"
                  className="text-xs mt-1"
                />
              </Group>
            </Group>
          );
        })}
      </Group>
    </Group>
  );
}
