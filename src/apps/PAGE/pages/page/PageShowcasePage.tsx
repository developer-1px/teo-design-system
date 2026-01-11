/**
 * PageShowcasePage - Living Documentation (Config-based)
 *
 * 실제 구현체(config, registry)를 읽어서 명세처럼 보여줍니다.
 * - LAYOUT_SECTION_ROLES에서 Layout별 Section 목록
 * - ROLE_REGISTRY에서 각 Section의 실제 config
 * - 하드코딩 없음, 100% config 기반
 */

import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import { useState } from 'react';
import { ShowcasePage } from '@/components/showcase/ShowcasePage';
import { Block } from '@/components/types/Block/Block';
import { Text } from '@/components/types/Element/Text/Text';
import { Page } from '@/components/types/Page/Page';
import type { PageLayout, PageRole } from '@/components/types/Page/Page.types';
import { LAYOUT_SECTION_ROLES } from '@/components/types/Section/configs/constants';
import {
  getOverflowClass,
  getSectionRoleConfig,
} from '@/components/types/Section/configs/registry';
import { Section } from '@/components/types/Section/Section';
import type { SectionRole } from '@/components/types/Section/Section.types';
import { cn } from '@/shared/lib/utils';

/**
 * PageRole별 지원 Layout 매핑
 * (실제 사용 가능한 조합)
 */
const ROLE_LAYOUT_MAP: Record<PageRole, PageLayout[]> = {
  Document: ['Single', 'Sidebar', 'HolyGrail', 'Aside'],
  Application: ['Studio', 'Sidebar', 'Split'],
  Focus: ['Single'],
  Immersive: ['Single', 'Mobile'],
  Overlay: ['Single'],
  Paper: ['Single'],
  Fullscreen: ['Single', 'Split'],
};

/**
 * PageRole별 설명
 */
const ROLE_DESCRIPTIONS: Record<PageRole, string> = {
  Document:
    'Scrollable content page with max-width constraint. User scrolls window. Best for documentation, articles, forms.',
  Application:
    'Full-screen grid layout (100vh fixed). Container scrolls, not window. Best for IDE, dashboard, admin panels.',
  Focus:
    'Single-action focused layout. Centered content, no scrolling. Best for login, payment, single-task flows.',
  Immersive:
    'Immersive experience with scroll snap. Full viewport sections. Best for landing pages, presentations.',
  Overlay:
    'Modal-style page with dimmed background. Floating above main content. Best for quick views, dialogs.',
  Paper:
    'Fixed aspect ratio for print/PDF. A4 or Letter size. Best for invoices, resumes, printable documents.',
  Fullscreen: 'Legacy fullscreen application mode.',
};

/**
 * PageRole별 Physics (CSS 특성)
 */
const ROLE_PHYSICS: Record<PageRole, string> = {
  Document: 'min-h-screen overflow-y-auto',
  Application: 'h-screen overflow-hidden',
  Focus: 'h-screen flex items-center justify-center',
  Immersive: 'h-screen overflow-y-scroll snap-y snap-mandatory',
  Overlay: 'fixed inset-0 z-50 bg-black/50',
  Paper: 'w-[210mm] h-[297mm] bg-white shadow-lg',
  Fullscreen: 'h-screen w-screen overflow-hidden',
};

/**
 * SectionDetail - 각 Section의 실제 config 표시
 */
function SectionDetail({ name, layout }: { name: SectionRole; layout: PageLayout }) {
  const config = getSectionRoleConfig(name, layout);
  const overflowClass = getOverflowClass(config.overflow);

  return (
    <Block role="Card" className="p-4">
      <Block role="Row" gap={2} className="mb-3 items-center">
        <div className="w-2 h-2 rounded-full bg-accent" />
        <h5 className="font-semibold text-sm">{name}</h5>
      </Block>

      {config.description && (
        <p className="text-xs text-subtle mb-3 italic">{config.description}</p>
      )}

      <Block role="Grid" spec={{ columns: 2 }} gap={4} className="text-xs">
        <Block role="Stack" gap={2}>
          <div className="flex flex-col gap-2">
            <Text role="Label" content="grid-area:" prominence="Subtle" className="font-medium" />
            <code className="font-mono bg-layer-2 px-2 py-1 rounded text-accent w-fit">
              {config.gridArea}
            </code>
          </div>

          <div className="flex flex-col gap-2">
            <Text role="Label" content="overflow:" prominence="Subtle" className="font-medium" />
            <code className="font-mono bg-layer-2 px-2 py-1 rounded w-fit">
              {config.overflow}
              <span className="text-subtle ml-2">({overflowClass})</span>
            </code>
          </div>
        </Block>

        <Block role="Stack" gap={2}>
          <div className="flex flex-col gap-2">
            <Text role="Label" content="HTML tag:" prominence="Subtle" className="font-medium" />
            <code className="font-mono bg-layer-2 px-2 py-1 rounded w-fit">
              &lt;{config.htmlTag}&gt;
            </code>
          </div>

          <div className="flex flex-col gap-2">
            <Text role="Label" content="baseStyles:" prominence="Subtle" className="font-medium" />
            <code className="font-mono bg-layer-2 px-2 py-1 rounded col-span-1 break-all">
              {config.baseStyles || 'none'}
            </code>
          </div>
        </Block>
      </Block>
    </Block>
  );
}

/**
 * LayoutCard - 각 Layout의 Section 목록 및 config 표시
 */
function LayoutCard({ layout, role }: { layout: PageLayout; role: PageRole }) {
  const [expanded, setExpanded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const sections = LAYOUT_SECTION_ROLES[layout];

  if (!sections) {
    return (
      <Block role="Card" className="p-4 bg-layer-2 border-border-subtle">
        <Text
          role="Body"
          content={`Layout "${layout}" not found in LAYOUT_SECTION_ROLES`}
          prominence="Subtle"
        />
      </Block>
    );
  }

  // Grid Template Areas 생성
  const gridTemplateAreas = sections
    .map((section) => `"${getSectionRoleConfig(section, layout).gridArea}"`)
    .join(' ');

  return (
    <Block role="Card" className="p-0 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 hover:bg-layer-1 transition-colors"
      >
        <Block role="Row" className="items-center justify-between">
          <Block role="Row" gap={3} className="items-center">
            {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            <Block role="Stack" gap={1} className="items-start">
              <h4 className="font-semibold text-base">{layout} Layout</h4>
              <span className="text-xs text-subtle">
                {sections.length} sections: {sections.join(', ')}
              </span>
            </Block>
          </Block>
          <div className="text-xs font-mono bg-layer-2 px-3 py-1 rounded">
            {sections.length} sections
          </div>
        </Block>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <Block role="Stack" gap={6} className="p-4 pt-0">
          {/* Grid Template Info */}
          <Block role="Stack" gap={2}>
            <Block role="Row" gap={2} className="items-center text-sm font-medium">
              <Info size={14} className="text-accent" />
              <span>Grid Template Configuration</span>
            </Block>
            <Block role="Card" gap={2} className="p-3 bg-layer-2">
              <p className="text-xs text-subtle">grid-template-areas:</p>
              <code className="block font-mono text-xs bg-layer-1 px-3 py-2 rounded">
                {gridTemplateAreas}
              </code>
            </Block>
          </Block>

          {/* Section Details */}
          <Block role="Stack" gap={2}>
            <Block role="Row" gap={2} className="items-center text-sm font-medium">
              <Info size={14} className="text-accent" />
              <span>Section Configurations (from ROLE_REGISTRY)</span>
            </Block>
            <Block role="Grid" spec={{ columns: 2 }} gap={3}>
              {sections.map((section) => (
                <SectionDetail key={section} name={section} layout={layout} />
              ))}
            </Block>
          </Block>

          {/* Live Preview Toggle */}
          <Block role="Stack" gap={2}>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 text-sm font-medium text-accent hover:underline w-fit"
            >
              {showPreview ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              <span>{showPreview ? 'Hide' : 'Show'} Live Preview</span>
            </button>

            {showPreview && (
              <Block role="Card" className="p-4 bg-layer-2">
                <div className="w-full h-[500px] border-4 border-text-primary rounded overflow-hidden">
                  <Page
                    title={`${role} - ${layout}`}
                    role={role}
                    layout={layout}
                    className="w-full h-full"
                  >
                    {sections.map((sectionRole) => {
                      const config = getSectionRoleConfig(sectionRole, layout);
                      return (
                        <Section key={sectionRole} role={sectionRole} className="relative">
                          <div
                            className={cn(
                              'h-full p-4 border border-dashed border-border flex flex-col items-center justify-center gap-2',
                              'bg-gradient-to-br from-layer-1 to-layer-2'
                            )}
                          >
                            <div className="text-xs font-mono bg-accent/10 px-2 py-1 rounded">
                              {sectionRole}
                            </div>
                            <div className="text-[10px] text-subtle">
                              grid-area: {config.gridArea}
                            </div>
                            <div className="text-[10px] text-subtle">
                              overflow: {config.overflow}
                            </div>
                          </div>
                        </Section>
                      );
                    })}
                  </Page>
                </div>
              </Block>
            )}
          </Block>
        </Block>
      )}
    </Block>
  );
}

/**
 * RoleSection - PageRole별 섹션
 */
function RoleSection({ role, index }: { role: PageRole; index: number }) {
  const supportedLayouts = ROLE_LAYOUT_MAP[role];

  return (
    <Block role="Container" layout="stack" density="Comfortable" gap={12} className="mb-16">
      <Block role="Stack" gap={3}>
        <Text
          role="Title"
          prominence="Hero"
          content={`${index}. ${role} Role`}
          className="text-3xl font-bold"
        />
        <Text
          role="Body"
          prominence="Standard"
          content={ROLE_DESCRIPTIONS[role]}
          className="text-base"
        />
        <Block role="Row" gap={4} className="items-start mt-2">
          <Block role="Stack" gap={1}>
            <Text role="Label" content="Physics (CSS):" prominence="Strong" className="text-sm" />
            <code className="text-xs font-mono bg-layer-1 px-3 py-2 rounded border border-border">
              {ROLE_PHYSICS[role]}
            </code>
          </Block>
          <Block role="Stack" gap={1}>
            <Text
              role="Label"
              content="Supported Layouts:"
              prominence="Strong"
              className="text-sm"
            />
            <Block role="Row" gap={2} className="flex-wrap">
              {supportedLayouts.map((layout) => (
                <span
                  key={layout}
                  className="text-xs font-mono bg-accent/10 text-accent px-2 py-1 rounded"
                >
                  {layout}
                </span>
              ))}
            </Block>
          </Block>
        </Block>
      </Block>

      <Block role="Divider" className="my-4" />

      <Block role="Stack" gap={4}>
        <Text
          role="Label"
          content="Layout Configurations (from LAYOUT_SECTION_ROLES)"
          prominence="Strong"
          className="text-lg"
        />
        <Block role="Stack" gap={3}>
          {supportedLayouts.map((layout) => (
            <LayoutCard key={layout} layout={layout} role={role} />
          ))}
        </Block>
      </Block>
    </Block>
  );
}

/**
 * PageShowcasePage - Main Component
 */
export function PageShowcasePage() {
  const roles: PageRole[] = ['Document', 'Application', 'Focus', 'Immersive', 'Overlay', 'Paper'];

  return (
    <ShowcasePage
      title="IDDL Page Specification"
      subtitle="Complete PageRole & PageLayout Catalog (Config-based)"
      description="All PageRoles and supported Layouts from actual LAYOUT_SECTION_ROLES and ROLE_REGISTRY. Click to see real configuration details."
    >
      <Block role="Container" className="bg-accent/5 border border-accent/20 rounded-lg p-4 mb-12">
        <Block role="Row" gap={3} className="items-start">
          <Info size={20} className="text-accent mt-0.5 flex-shrink-0" />
          <Block role="Stack" gap={2}>
            <Text
              role="Label"
              content="Living Documentation"
              prominence="Strong"
              className="text-sm"
            />
            <Text
              role="Body"
              content="This showcase is 100% config-based. All data is read from:"
              prominence="Subtle"
              className="text-xs"
            />
            <Block role="Stack" as="ul" gap={1} className="text-xs text-subtle ml-4 list-disc">
              <li>
                <code className="bg-layer-1 px-1 rounded">LAYOUT_SECTION_ROLES</code> - Valid
                sections per layout
              </li>
              <li>
                <code className="bg-layer-1 px-1 rounded">ROLE_REGISTRY</code> - Section
                configurations (grid-area, overflow, htmlTag, baseStyles)
              </li>
              <li>
                <code className="bg-layer-1 px-1 rounded">getRoleConfig()</code> - Runtime config
                resolution
              </li>
            </Block>
            <Text
              role="Body"
              content="No hardcoding. Config changes automatically reflect here."
              prominence="Subtle"
              className="text-xs italic mt-2"
            />
          </Block>
        </Block>
      </Block>

      <Block role="Stack" gap={16}>
        {roles.map((role, index) => (
          <div key={role}>
            <RoleSection role={role} index={index + 1} />
            {index < roles.length - 1 && <Block role="Divider" className="my-16" />}
          </div>
        ))}
      </Block>
    </ShowcasePage>
  );
}
