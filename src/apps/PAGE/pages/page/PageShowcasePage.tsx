/**
 * PageShowcasePage - IDDL Standard Compliant Showcase
 * 
 * Uses only IDDL default values and standard components.
 */

import { useState } from 'react';
import { ShowcasePage } from '@/components/showcase/ShowcasePage';
import { Block } from '@/components/types/Block/Block';
import { Text } from '@/components/types/Element/Text/Text';
import { Page } from '@/components/types/Page/Page';
import type { PageLayout, PageRole } from '@/components/types/Page/Page.types';
import { LAYOUT_SECTION_ROLES } from '@/components/types/Section/configs/constants';
import { Action } from '@/components/types/Element/Action/Action';
import { Section } from '@/components/types/Section/Section';

const ROLES: PageRole[] = ['Document', 'Application', 'Focus', 'Immersive', 'Overlay', 'Paper'];

const ROLE_LAYOUT_MAP: Record<PageRole, PageLayout[]> = {
  Document: ['Single', 'Sidebar', 'ThreeColumn', 'Aside'],
  Application: ['Workbench', 'Sidebar', 'Split'],
  Focus: ['Single'],
  Immersive: ['Single', 'Mobile'],
  Overlay: ['Single'],
  Paper: ['Single'],
};

const ROLE_DESCRIPTIONS: Record<PageRole, string> = {
  Document: 'Standard responsive document with window scroll. Ideal for Blogs, Docs, and News.',
  Application: 'Full-screen 100vh app with internal scrolling slots. Ideal for Dashboards and IDEs.',
  Focus: 'Centered single-action layout. Ideal for Login or Payment screens.',
  Immersive: 'Scroll-snap based full-page experience. Ideal for Landing Pages.',
  Overlay: 'Modal-style page with a dimmed backdrop.',
  Paper: 'Fixed-dimension page (A4). Ideal for Invoices and Resumes.',
};

export function PageShowcasePage() {
  const [activeRole, setActiveRole] = useState<PageRole>('Document');
  const [activeLayout, setActiveLayout] = useState<PageLayout>('Single');

  const categories = ROLES.map(r => ({ id: r, label: `${r} Role` }));
  const layouts = ROLE_LAYOUT_MAP[activeRole] || ['Single'];
  const sections = LAYOUT_SECTION_ROLES[activeLayout] || [];

  return (
    <ShowcasePage
      title="Page Specification"
      subtitle="Standard Roles & Templates"
      description={ROLE_DESCRIPTIONS[activeRole]}
      categories={categories}
      activeCategoryId={activeRole}
      onCategoryChange={(id) => {
        const nextRole = id as PageRole;
        setActiveRole(nextRole);
        setActiveLayout(ROLE_LAYOUT_MAP[nextRole][0]);
      }}
    >
      {/* 1. Layout Selection */}
      <Block role="Stack">
        <Text role="Heading" content="Available Layouts" prominence="Strong" />
        <Block role="Toolbar">
          {layouts.map((layout) => (
            <Action
              key={layout}
              role="Button"
              label={layout}
              prominence={activeLayout === layout ? 'Hero' : 'Standard'}
              onClick={() => setActiveLayout(layout)}
            />
          ))}
        </Block>
      </Block>

      {/* 2. Live Preview (IDDL Native) */}
      <Block role="Stack">
        <Block role="Toolbar">
          <Text role="Heading" content="Live Preview" prominence="Strong" />
          <Text role="Caption" content={`${activeLayout} Template`} prominence="Subtle" />
        </Block>

        <Block role="Card">
          <Page
            role={activeRole}
            layout={activeLayout}
            title={`${activeRole} - ${activeLayout}`}
          >
            {sections.map((secRole) => (
              <Section key={secRole} role={secRole}>
                <Block role="Card" prominence="Subtle">
                  <Text role="Label" content={secRole} prominence="Strong" />
                </Block>
              </Section>
            ))}
          </Page>
        </Block>
      </Block>

      {/* 3. Slot Information */}
      <Block role="Stack">
        <Text role="Heading" content="Layout Slots" prominence="Strong" />
        <Block role="Grid" spec={{ columns: 3 }}>
          {sections.map(sec => (
            <Block key={sec} role="Card" prominence="Subtle">
              <Text role="Label" content={sec} />
            </Block>
          ))}
        </Block>
      </Block>
    </ShowcasePage>
  );
}
