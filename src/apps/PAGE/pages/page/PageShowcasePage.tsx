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
import { Text } from '@/components/types/Element/Text/Text';
import type { PageLayout } from '@/components/types/Page/Page.types';
import { LAYOUT_SECTION_ROLES } from '@/components/types/Section/role-config';
import type { SectionRole } from '@/components/types/Section/Section.types';

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
        <Block role="Toolbar" className="w-full">
          <Text role="Title" prominence="Standard" content="Page Layout Gallery" />
          <Block role="ToolbarDivider" />
          <Text role="Body" prominence="Subtle" content="Core Layout Templates v5.0 (Live Preview)" />
        </Block>
      </Section>

      {/* Sidebar navigation */}
      <Section role="PrimarySidebar" prominence="Standard" className="w-64">
        <Block role="ScrollMenu" className="p-2 gap-1 h-full">
          <Text role="Label" content="LAYOUT TEMPLATES" prominence="Subtle" className="px-2 py-2" />
          {layouts.map(layout => (
            <Block
              key={layout}
              role="Inline"
              clickable
              onClick={() => setSelectedLayout(layout)}
              className={`
                px-3 py-2 rounded-md cursor-pointer transition-colors
                ${selectedLayout === layout
                  ? 'bg-accent/10 text-accent font-medium'
                  : 'hover:bg-surface-elevated text-text-secondary'}
              `}
            >
              <Text role="Body" content={layout} />
            </Block>
          ))}
        </Block>
      </Section>

      {/* Main Content */}
      <Section role="Editor" prominence="Standard" mode="view">
        {/* Removing h-full to allow natural scrolling of the Section */}
        <Block role="Container" className="p-8 gap-8 w-full max-w-6xl mx-auto">

          <Block role="Stack" className="gap-2">
            <Text role="Title" prominence="Hero" content={selectedLayout} />
            <Text role="Body" prominence="Subtle" content={`Standard ${selectedLayout} Layout Preview`} />
            <Text role="Body" content="The preview below demonstrates the layout capabilities. Resize your window to see responsiveness." />
          </Block>

          {/* Canvas for Layout Visualization */}
          <Block role="Card" className="aspect-video w-full bg-surface-sunken p-8 border border-border-default rounded-xl shadow-inner relative overflow-hidden">
            <div className="absolute inset-8 bg-surface rounded-lg shadow-sm border border-border-default overflow-hidden">
              {/* 
                 Live Page Component 
                 - role="Application" triggers AppLayout (grid based)
                 - w-full h-full fills the card container
               */}
              <Page
                role="Application"
                layout={selectedLayout}
                className="w-full h-full relative"
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
                  <Section key={role} role={role} className="relative group overflow-hidden">
                    {/* 
                        Mock Content to demonstrate scrolling 
                        Container/Main/Editor roles usually scroll
                     */}
                    <div className={`
                       absolute inset-0 
                       flex flex-col
                       ${ROLE_COLORS[role] || 'bg-gray-100/50 border-gray-200 text-gray-700'}
                     `}>
                      {/* Header for the section */}
                      <div className="p-2 border-b border-black/5 flex items-center justify-center bg-black/5">
                        <Text role="Label" content={role} className="font-bold text-xs" />
                      </div>

                      {/* Scrolling content area */}
                      <div className="flex-1 overflow-auto p-4 space-y-4">
                        <div className="text-[10px] opacity-70 text-center uppercase tracking-wider mb-4">{role} Area</div>

                        {/* Add lots of dummy content for scrolling regions */}
                        {(['Container', 'Main', 'Editor', 'Navigator', 'Aside', 'Master', 'Detail', 'PrimarySidebar', 'SecondarySidebar'].includes(role)) && (
                          <>
                            {Array.from({ length: 10 }).map((_, i) => (
                              <div key={i} className="h-8 bg-black/5 rounded w-full animate-pulse" style={{ opacity: 1 - (i * 0.1) }} />
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  </Section>
                ))}
              </Page>
            </div>
          </Block>

          {/* Code Usage Example */}
          <Block role="Stack" className="gap-4">
            <Text role="Label" content="Implementation" />
            <Block role="Card" className="bg-surface-sunken p-4 font-mono text-sm border border-border-default rounded-md overflow-x-auto">
              <pre className="text-text-secondary">
                {`<Page role="Application" layout="${selectedLayout}">
${validSections.map(role => `  <Section role="${role}">
    {/* content */}
  </Section>`).join('\n')}
</Page>`}
              </pre>
            </Block>
          </Block>

        </Block>
      </Section>
    </Page>
  );
}
