/**
 * GroupShowcasePage - Group Component Showcase
 * 
 * MECE gallery of IDDL Group component structural capabilities.
 * Demonstrates Containers, Cards, Lists, Forms, and Toolbars.
 * 
 * Features:
 * - Auto-Documentation: Imports source code via ?raw and displays it.
 * - SourcePreview: Renders component + source code tabs.
 */

import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import { Group } from '@/components/types/Group/Group';
import { Text } from '@/components/types/Atom/Text/Text';
import { SourcePreview } from '@/shared/components/SourcePreview';

// Examples & Source Code
import { GroupCardsDemo } from './examples/GroupCardsDemo';
import GroupCardsCode from './examples/GroupCardsDemo?raw';

import { GroupListsDemo } from './examples/GroupListsDemo';
import GroupListsCode from './examples/GroupListsDemo?raw';

import { GroupFormsDemo } from './examples/GroupFormsDemo';
import GroupFormsCode from './examples/GroupFormsDemo?raw';

import { GroupToolbarsDemo } from './examples/GroupToolbarsDemo';
import GroupToolbarsCode from './examples/GroupToolbarsDemo?raw';

import { GroupNavigationDemo } from './examples/GroupNavigationDemo';
import GroupNavigationCode from './examples/GroupNavigationDemo?raw';

import { GroupStructureDemo } from './examples/GroupStructureDemo';
import GroupStructureCode from './examples/GroupStructureDemo?raw';

export function GroupShowcasePage() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Page role="Application" layout="Studio">
      {/* Header */}
      <Section role="Toolbar" prominence="Standard">
        <Group role="Toolbar" layout="inline" density="Compact">
          <Text role="Title" prominence="Standard" content="Group Component Gallery" />
          <Group role="Divider" layout="inline"><></></Group>
          <Text role="Body" prominence="Subtle" content="Structural Layout System v2.1" />
        </Group>
      </Section>

      {/* Sidebar navigation */}
      <Section role="PrimarySidebar" prominence="Standard">
        <Group role="ScrollMenu" layout="stack" density="Comfortable">
          <Text role="Label" content="CATEGORIES" prominence="Subtle" className="px-2 pt-2" />
          <Group role="Container" layout="stack" density="Standard">
            {['Cards & Containers', 'Lists & Grids', 'Forms & Fieldsets', 'Toolbars & Actions', 'Navigation', 'Structure & LayoutHelpers'].map(item => {
              const id = item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
              return (
                <Group
                  key={item}
                  role="Inline"
                  clickable
                  onClick={() => scrollTo(id)}
                  className="px-2 py-1 hover:bg-surface-elevated rounded-md cursor-pointer"
                >
                  <Text role="Body" content={item} prominence="Standard" />
                </Group>
              );
            })}
          </Group>
        </Group>
      </Section>

      {/* Main Content */}
      <Section role="Editor" prominence="Standard" mode="view">
        <Group role="Container" layout="stack" density="Comfortable" className="p-8 gap-12 max-w-5xl mx-auto">

          {/* Header */}
          <Group role="Container" layout="stack" density="Standard" className="gap-2">
            <Text role="Title" prominence="Hero" content="Groups" />
            <Text role="Body" prominence="Hero" content="The fundamental structural blocks for layout and grouping." />
          </Group>

          <Group role="Divider" layout="stack"><></></Group>

          {/* 1. Cards & Containers */}
          <div id="cards-containers">
            <SourcePreview code={GroupCardsCode} title="Cards & Containers">
              <GroupCardsDemo />
            </SourcePreview>
          </div>

          <Group role="Divider" layout="stack"><></></Group>

          {/* 2. Lists & Grids */}
          <div id="lists-grids">
            <SourcePreview code={GroupListsCode} title="Lists & Grids">
              <GroupListsDemo />
            </SourcePreview>
          </div>

          <Group role="Divider" layout="stack"><></></Group>

          {/* 3. Forms & Fieldsets */}
          <div id="forms-fieldsets">
            <SourcePreview code={GroupFormsCode} title="Forms & Fieldsets">
              <GroupFormsDemo />
            </SourcePreview>
          </div>

          <Group role="Divider" layout="stack"><></></Group>

          {/* 4. Toolbars */}
          <div id="toolbars-actions">
            <SourcePreview code={GroupToolbarsCode} title="Toolbars & Actions">
              <GroupToolbarsDemo />
            </SourcePreview>
          </div>

          <Group role="Divider" layout="stack"><></></Group>

          {/* 5. Navigation */}
          <div id="navigation">
            <SourcePreview code={GroupNavigationCode} title="Navigation">
              <GroupNavigationDemo />
            </SourcePreview>
          </div>

          <Group role="Divider" layout="stack"><></></Group>

          {/* 6. Structure */}
          <div id="structure-layouthelpers">
            <SourcePreview code={GroupStructureCode} title="Structure & LayoutHelpers">
              <GroupStructureDemo />
            </SourcePreview>
          </div>

        </Group>
      </Section>
    </Page>
  );
}
