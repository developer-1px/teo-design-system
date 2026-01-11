/**
 * PageShowcasePage - Minimal Layout-centric Showcase
 *
 * Focuses on visualizing PageRoles and their physical layouts.
 */

import { Info, Layout as LayoutIcon } from 'lucide-react';
import { useState } from 'react';
import { ShowcasePage } from '@/components/showcase/ShowcasePage';
import { Block } from '@/components/types/Block/Block';
import { Text } from '@/components/types/Element/Text/Text';
import { Page } from '@/components/types/Page/Page';
import type { PageLayout, PageRole } from '@/components/types/Page/Page.types';
import { LAYOUT_SECTION_ROLES } from '@/components/types/Section/configs/constants';
import { Section } from '@/components/types/Section/Section';
import { cn } from '@/shared/lib/utils';

/**
 * PageRole Definitions
 */
const ROLES: PageRole[] = ['Document', 'Application', 'Focus', 'Immersive', 'Overlay', 'Paper'];

const ROLE_LAYOUT_MAP: Record<PageRole, PageLayout[]> = {
  Document: ['Single', 'Sidebar', 'HolyGrail', 'Aside'],
  Application: ['Studio', 'Sidebar', 'Split'],
  Focus: ['Single'],
  Immersive: ['Single', 'Mobile'],
  Overlay: ['Single'],
  Paper: ['Single'],
  Fullscreen: ['Single'],
};

const ROLE_DESCRIPTIONS: Record<PageRole, string> = {
  Document: 'Standard scrollable content page for articles and forms.',
  Application: 'Full-screen app layout with rigid skeletal structure (IDE, Dashboard).',
  Focus: 'Centered task-oriented layout for login or wizards.',
  Immersive: 'Scroll-snap based immersive experience for landing pages.',
  Overlay: 'Floating layout above content for dialogs and quick previews.',
  Paper: 'Fixed aspect ratio layout for printable documents like A4.',
  Fullscreen: 'Full viewport application mode.',
};

/**
 * LayoutBlueprint - A minimal visual representation of a layout
 */
function LayoutBlueprint({ role, layout }: { role: PageRole; layout: PageLayout }) {
  const sections = LAYOUT_SECTION_ROLES[layout] || [];

  return (
    <Block role="Card" className="p-0 overflow-hidden border border-border-default hover:border-accent/40 transition-colors group">
      <div className="p-4 border-b border-border-default bg-layer-1 flex justify-between items-center">
        <Block role="Row" gap={2} className="items-center">
          <LayoutIcon size={16} className="text-accent" />
          <Text role="Label" prominence="Strong" content={layout} />
        </Block>
        <Text role="Caption" prominence="Subtle" content={`${sections.length} slots`} />
      </div>

      <div className="p-6 bg-layer-2 aspect-video flex items-center justify-center">
        <div className="w-full h-full max-w-[240px] max-h-[160px] border-2 border-text-primary/10 rounded shadow-sm overflow-hidden bg-surface-base">
          <Page
            role={role}
            layout={layout}
            className="w-full h-full scale-[0.35] origin-top-left"
            style={{ width: '285.7%', height: '285.7%' }} // 1 / 0.35
          >
            {sections.map((sec) => (
              <Section key={sec} role={sec} className="border border-dashed border-accent/30 bg-accent/5 flex items-center justify-center">
                <span className="text-[12px] font-mono font-bold text-accent/60">{sec}</span>
              </Section>
            ))}
          </Page>
        </div>
      </div>
    </Block>
  );
}

export function PageShowcasePage() {
  const [activeRole, setActiveRole] = useState<PageRole>('Document');

  const categories = ROLES.map(r => ({ id: r, label: r }));

  return (
    <ShowcasePage
      title="Layout Systems"
      subtitle="Page Roles & Physical Layouts"
      description={ROLE_DESCRIPTIONS[activeRole]}
      categories={categories}
      activeCategoryId={activeRole}
      onCategoryChange={(id) => setActiveRole(id as PageRole)}
    >
      <Block role="Stack" gap={6}>
        <Block role="Row" gap={3} className="items-start p-4 bg-accent/5 rounded-lg border border-accent/10">
          <Info size={18} className="text-accent mt-0.5" />
          <Block role="Stack" gap={1}>
            <Text role="Label" prominence="Strong" content={`${activeRole} Role Behavior`} />
            <Text role="Caption" prominence="Subtle" content="The role determines the 'Physics' (scrolling, sizing, position), while the Layout determines 'Arrangement' (slots)." />
          </Block>
        </Block>

        <Block role="Grid" spec={{ columns: 2 }} gap={6}>
          {ROLE_LAYOUT_MAP[activeRole].map((layout) => (
            <LayoutBlueprint key={layout} role={activeRole} layout={layout} />
          ))}
        </Block>
      </Block>
    </ShowcasePage>
  );
}
