/**
 * PageShowcasePage - Page Layout Showcase
 * 
 * MECE gallery of IDDL Page layouts and templates.
 * Visualizes the 7 standard core layouts: Single, Sidebar, Aside, HolyGrail, Split, Studio, Blank.
 */

import { useState } from 'react';
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import { Group } from '@/components/types/Group/Group';
import { Text } from '@/components/types/Atom/Text/Text';
import { LAYOUT_SECTION_ROLES, PageLayout, SectionRole } from '@/components/types/Atom/types';

// Visual colors for section roles
const ROLE_COLORS: Partial<Record<SectionRole, string>> = {
  Header: 'bg-blue-100/50 border-blue-200 text-blue-700',
  Footer: 'bg-gray-100/50 border-gray-200 text-gray-700',
  Main: 'bg-emerald-50/50 border-emerald-200 text-emerald-700',
  Container: 'bg-emerald-50/50 border-emerald-200 text-emerald-700',
  Navigator: 'bg-purple-100/50 border-purple-200 text-purple-700',
  Aside: 'bg-amber-100/50 border-amber-200 text-amber-700',
  Toolbar: 'bg-stone-100/50 border-stone-200 text-stone-700',
  ActivityBar: 'bg-indigo-100/50 border-indigo-200 text-indigo-700',
  PrimarySidebar: 'bg-purple-100/50 border-purple-200 text-purple-700',
  SecondarySidebar: 'bg-pink-100/50 border-pink-200 text-pink-700',
  Editor: 'bg-white border-slate-200 text-slate-700',
  Panel: 'bg-orange-100/50 border-orange-200 text-orange-700',
  Master: 'bg-cyan-100/50 border-cyan-200 text-cyan-700',
  Detail: 'bg-white border-slate-200 text-slate-700',
  DialogHeader: 'bg-sky-100/50 border-sky-200 text-sky-700',
  DialogContent: 'bg-white border-slate-200 text-slate-700',
  DialogFooter: 'bg-slate-100/50 border-slate-200 text-slate-700',
};

// Grid template definitions (CSS grid-template-areas emulation)
const GRID_STYLES: Record<PageLayout, React.CSSProperties> = {
  Single: {
    gridTemplateAreas: '"header" "container" "footer"',
    gridTemplateRows: '60px 1fr 60px',
    gridTemplateColumns: '1fr'
  },
  Sidebar: {
    gridTemplateAreas: '"header header" "navigator container" "footer footer"',
    gridTemplateRows: '60px 1fr 60px',
    gridTemplateColumns: '240px 1fr'
  },
  Aside: {
    gridTemplateAreas: '"header header" "container aside" "footer footer"',
    gridTemplateRows: '60px 1fr 60px',
    gridTemplateColumns: '1fr 240px'
  },
  HolyGrail: {
    gridTemplateAreas: '"header header header" "navigator container aside" "footer footer footer"',
    gridTemplateRows: '60px 1fr 60px',
    gridTemplateColumns: '200px 1fr 200px'
  },
  Split: {
    gridTemplateAreas: '"header header" "master detail" "footer footer"',
    gridTemplateRows: '60px 1fr 50px',
    gridTemplateColumns: '300px 1fr'
  },
  Studio: {
    gridTemplateAreas: '"toolbar toolbar toolbar toolbar" "activitybar primarysidebar editor secondarysidebar" "activitybar panel panel panel" "footer footer footer footer"',
    gridTemplateRows: '40px 1fr 150px 24px',
    gridTemplateColumns: '48px 250px 1fr 250px'
  },
  Blank: {
    gridTemplateAreas: '"main"',
    gridTemplateRows: '1fr',
    gridTemplateColumns: '1fr'
  }
};

export function PageShowcasePage() {
  const [selectedLayout, setSelectedLayout] = useState<PageLayout>('Sidebar');

  // Available layouts
  const layouts: PageLayout[] = ['Single', 'Sidebar', 'Aside', 'HolyGrail', 'Split', 'Studio', 'Blank'];

  // Get valid section roles for the current layout
  const validSections = LAYOUT_SECTION_ROLES[selectedLayout] || [];

  return (
    <Page role="Application" layout="Studio">
      {/* Header */}
      <Section role="Toolbar" prominence="Standard">
        <Group role="Toolbar" layout="inline" density="Compact">
          <Text role="Title" prominence="Standard" content="Page Layout Gallery" />
          <Group role="Divider" layout="inline"><></></Group>
          <Text role="Body" prominence="Subtle" content="Core Layout Templates v5.0" />
        </Group>
      </Section>

      {/* Sidebar navigation */}
      <Section role="PrimarySidebar" prominence="Standard">
        <Group role="ScrollMenu" layout="stack" density="Comfortable">
          <Text role="Label" content="LAYOUT TEMPLATES" prominence="Subtle" className="px-2 pt-2" />
          <Group role="Container" layout="stack" density="Standard">
            {layouts.map(layout => (
              <Group
                key={layout}
                role="Inline"
                clickable
                onClick={() => setSelectedLayout(layout)}
                className={`px-2 py-1 rounded-md cursor-pointer ${selectedLayout === layout ? 'bg-accent/10 text-accent font-medium' : 'hover:bg-surface-elevated'}`}
              >
                <Text role="Body" content={layout} prominence={selectedLayout === layout ? 'Strong' : 'Standard'} />
              </Group>
            ))}
          </Group>
        </Group>
      </Section>

      {/* Main Content */}
      <Section role="Editor" prominence="Standard" mode="view">
        <Group role="Container" layout="stack" density="Comfortable" className="p-8 gap-8 w-full h-full">

          <Group role="Container" layout="stack" density="Standard" className="gap-2">
            <Text role="Title" prominence="Hero" content={selectedLayout} />
            <Text role="Body" prominence="Subtle" content={`Standard ${selectedLayout} Layout`} />
          </Group>

          {/* Canvas for Layout Visualization */}
          <Group role="Card" className="flex-1 w-full bg-surface-sunken p-8 border border-border-default rounded-xl overflow-hidden relative">
            <div className="absolute inset-4 bg-surface rounded-lg shadow-sm border border-border-default overflow-hidden">
              <div
                className="w-full h-full grid gap-1 p-1"
                style={GRID_STYLES[selectedLayout]}
              >
                {validSections.map(role => (
                  <div
                    key={role}
                    className={`
                        rounded flex flex-col items-center justify-center p-2 text-center transition-all
                        ${ROLE_COLORS[role] || 'bg-gray-100 border-gray-200'}
                        border
                      `}
                    style={{ gridArea: role.toLowerCase() }}
                  >
                    <Text role="Label" content={role} className="font-semibold text-xs" />
                  </div>
                ))}
              </div>
            </div>
          </Group>

          {/* Legend / Info */}
          <Group role="Container" layout="stack" density="Standard" className="gap-4">
            <Text role="Label" content="Usage" />
            <Group role="Card" className="bg-surface-sunken p-4 font-mono text-sm">
              <Text role="Code" content={`<Page role="Application" layout="${selectedLayout}">`} />
              {validSections.map(role => (
                <Text key={role} role="Code" content={`  <Section role="${role}">...</Section>`} className="text-muted-foreground" />
              ))}
              <Text role="Code" content={`</Page>`} />
            </Group>
          </Group>

        </Group>
      </Section>
    </Page>
  );
}
