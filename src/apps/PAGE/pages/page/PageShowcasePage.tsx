/**
 * PageShowcasePage - Page Layout Showcase
 * 
 * MECE gallery of IDDL Page layouts and templates.
 * Visualizes the 7 standard core layouts: Single, Sidebar, Aside, HolyGrail, Split, Studio, Blank.
 */

import { useState } from 'react';
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import { Block } from '@/components/types/Block/Block';
import { Text } from '@/components/types/Atom/Text/Text';
import { LAYOUT_SECTION_ROLES, PageLayout, SectionRole } from '@/components/types/Atom/types';

// Visual colors for section roles (keeping existing colors)
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
  // Fallback
  Region: 'bg-gray-100 border-gray-200 text-gray-700',
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
        <Block role="Toolbar" layout="inline" density="Compact">
          <Text role="Title" prominence="Standard" content="Page Layout Gallery" />
          <Block role="Divider" layout="inline"><></></Block>
          <Text role="Body" prominence="Subtle" content="Core Layout Templates v5.0 (Live Preview)" />
        </Block>
      </Section>

      {/* Sidebar navigation */}
      <Section role="PrimarySidebar" prominence="Standard">
        <Block role="ScrollMenu" layout="stack" density="Comfortable">
          <Text role="Label" content="LAYOUT TEMPLATES" prominence="Subtle" className="px-2 pt-2" />
          <Block role="Container" layout="stack" density="Standard">
            {layouts.map(layout => (
              <Block
                key={layout}
                role="Inline"
                clickable
                onClick={() => setSelectedLayout(layout)}
                className={`px-2 py-1 rounded-md cursor-pointer ${selectedLayout === layout ? 'bg-accent/10 text-accent font-medium' : 'hover:bg-surface-elevated'}`}
              >
                <Text role="Body" content={layout} prominence={selectedLayout === layout ? 'Strong' : 'Standard'} />
              </Block>
            ))}
          </Block>
        </Block>
      </Section>

      {/* Main Content */}
      <Section role="Editor" prominence="Standard" mode="view">
        <Block role="Container" layout="stack" density="Comfortable" className="p-8 gap-8 w-full h-full">

          <Block role="Container" layout="stack" density="Standard" className="gap-2">
            <Text role="Title" prominence="Hero" content={selectedLayout} />
            <Text role="Body" prominence="Subtle" content={`Standard ${selectedLayout} Layout`} />
          </Block>

          {/* Canvas for Layout Visualization */}
          <Block role="Card" className="flex-1 w-full bg-surface-sunken p-8 border border-border-default rounded-xl overflow-hidden relative shadow-inner">
            <div className="absolute inset-8 bg-surface rounded-lg shadow-sm border border-border-default overflow-hidden">
              {/* 
                 Live Page Component 
                 - We use role="Application" to trigger AppLayout
                 - We override w-screen/h-screen with w-full/h-full to fit in this card
                 - We pass explicit sizes to ensure it renders reasonably in small space
               */}
              <Page
                role="Application"
                layout={selectedLayout}
                className="w-full h-full relative"
                // Provide default sizes suitable for the preview scale if needed
                sizes={{
                  primarysidebar: '200px',
                  secondarysidebar: '200px',
                  panel: '150px',
                  navigator: '200px',
                  aside: '200px',
                  master: '250px'
                }}
              >
                {validSections.map(role => (
                  <Section key={role} role={role} className="relative group">
                    {/* Visual overlay to identify the section */}
                    <div className={`
                       absolute inset-2 
                       rounded border-2 border-dashed 
                       flex flex-col items-center justify-center p-2 text-center 
                       transition-all opacity-70 group-hover:opacity-100
                       ${ROLE_COLORS[role] || 'bg-gray-100/50 border-gray-200 text-gray-700'}
                     `}>
                      <Text role="Label" content={role} className="font-bold text-xs" />
                      <div className="text-[10px] opacity-70 mt-1">{role} Area</div>
                    </div>
                  </Section>
                ))}
              </Page>
            </div>
          </Block>

          {/* Legend / Info */}
          <Block role="Container" layout="stack" density="Standard" className="gap-4">
            <Text role="Label" content="Usage" />
            <Block role="Card" className="bg-surface-sunken p-4 font-mono text-sm border border-border-default rounded-md">
              <Text role="Code" content={`<Page role="Application" layout="${selectedLayout}">`} className="text-blue-600" />
              {validSections.map(role => (
                <Text key={role} role="Code" content={`  <Section role="${role}">...</Section>`} className="text-gray-500 pl-4" />
              ))}
              <Text role="Code" content={`</Page>`} className="text-blue-600" />
            </Block>
          </Block>

        </Block>
      </Section>
    </Page>
  );
}
