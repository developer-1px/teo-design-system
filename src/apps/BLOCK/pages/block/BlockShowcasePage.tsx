/**
 * BlockShowcasePage - Block Component Showcase
 * 
 * MECE gallery of IDDL Block component structural capabilities.
 * Demonstrates Containers, Cards, Lists, Forms, and Toolbars.
 * 
 * Features:
 * - Auto-Documentation: Imports source code via ?raw and displays it.
 * - SourcePreview: Renders component + source code tabs.
 */

import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import { Block } from '@/components/types/Block/Block';
import { Separator } from '@/components/types/Atom/Separator/Separator.tsx';
import { Text } from '@/components/types/Atom/Text/Text';
import { SourcePreview } from '@/shared/components/SourcePreview';

// Examples & Source Code
import { BlockCardsDemo } from './examples/BlockCardsDemo';
import BlockCardsCode from './examples/BlockCardsDemo?raw';

import { BlockListsDemo } from './examples/BlockListsDemo';
import BlockListsCode from './examples/BlockListsDemo?raw';

import { BlockFormsDemo } from './examples/BlockFormsDemo';
import BlockFormsCode from './examples/BlockFormsDemo?raw';

import { BlockToolbarsDemo } from './examples/BlockToolbarsDemo';
import BlockToolbarsCode from './examples/BlockToolbarsDemo?raw';

import { BlockNavigationDemo } from './examples/BlockNavigationDemo';
import BlockNavigationCode from './examples/BlockNavigationDemo?raw';

import { BlockStructureDemo } from './examples/BlockStructureDemo';
import BlockStructureCode from './examples/BlockStructureDemo?raw';

export function BlockShowcasePage() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Page role="Application" layout="Studio">
      {/* Header */}
      <Section role="Toolbar" prominence="Standard">
        <Block role="Toolbar" density="Compact">
          <Text role="Title" prominence="Standard" content="Block Component Gallery" />
          <Separator role="ToolbarDivider" />
          <Block role="Group" className="flex flex-row gap-1">
            <Text role="Body" prominence="Subtle" content="Structural Layout System v2.1" />
          </Block>
        </Block>
      </Section>

      {/* Sidebar navigation */}
      <Section role="PrimarySidebar" prominence="Standard">
        <Block role="ScrollMenu" density="Comfortable">
          <Text role="Label" content="CATEGORIES" prominence="Subtle" className="px-2 pt-2" />
          <Block role="Container" density="Standard">
            {['Cards & Containers', 'Lists & Grids', 'Forms & Fieldsets', 'Toolbars & Actions', 'Navigation', 'Structure & LayoutHelpers'].map(item => {
              const id = item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
              return (
                <Block
                  key={item}
                  role="Inline"
                  clickable
                  onClick={() => scrollTo(id)}
                  className="px-2 py-1 hover:bg-surface-elevated rounded-md cursor-pointer"
                >
                  <Text role="Body" content={item} prominence="Standard" />
                </Block>
              );
            })}
          </Block>
        </Block>
      </Section>

      {/* Main Content */}
      <Section role="Editor" prominence="Standard" mode="view">
        <Block role="Container" density="Comfortable" className="p-8 gap-12 max-w-5xl mx-auto">

          {/* Header */}
          <Block role="Container" density="Standard" className="gap-2">
            <Text role="Title" prominence="Hero" content="Blocks" />
            <Text role="Body" prominence="Hero" content="The fundamental structural blocks for layout and grouping." />
          </Block>

          <Block role="Divider" className="h-px w-full"><></></Block>

          {/* 1. Cards & Containers */}
          <div id="cards-containers">
            <SourcePreview code={BlockCardsCode} title="Cards & Containers">
              <BlockCardsDemo />
            </SourcePreview>
          </div>

          <Block role="Divider" className="h-px w-full"><></></Block>

          {/* 2. Lists & Grids */}
          <div id="lists-grids">
            <SourcePreview code={BlockListsCode} title="Lists & Grids">
              <BlockListsDemo />
            </SourcePreview>
          </div>

          <Block role="Divider" className="h-px w-full"><></></Block>

          {/* 3. Forms & Fieldsets */}
          <div id="forms-fieldsets">
            <SourcePreview code={BlockFormsCode} title="Forms & Fieldsets">
              <BlockFormsDemo />
            </SourcePreview>
          </div>

          <Block role="Divider" className="h-px w-full"><></></Block>

          {/* 4. Toolbars */}
          <div id="toolbars-actions">
            <SourcePreview code={BlockToolbarsCode} title="Toolbars & Actions">
              <BlockToolbarsDemo />
            </SourcePreview>
          </div>

          <Block role="Divider" className="h-px w-full"><></></Block>

          {/* 5. Navigation */}
          <div id="navigation">
            <SourcePreview code={BlockNavigationCode} title="Navigation">
              <BlockNavigationDemo />
            </SourcePreview>
          </div>

          <Block role="Divider" className="h-px w-full"><></></Block>

          {/* 6. Structure */}
          <div id="structure-layouthelpers">
            <SourcePreview code={BlockStructureCode} title="Structure & LayoutHelpers">
              <BlockStructureDemo />
            </SourcePreview>
          </div>

        </Block>
      </Section>
    </Page>
  );
}
