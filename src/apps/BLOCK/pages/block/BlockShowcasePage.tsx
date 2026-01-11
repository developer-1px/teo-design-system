import { Block } from '@/components/types/Block/Block';
import { Text } from '@/components/types/Element/Text/Text';
import { ShowcasePage } from '@/components/showcase/ShowcasePage';
import { SourcePreview } from '@/shared/components/SourcePreview';

// Examples & Source Code
import { BlockCardsDemo } from './examples/BlockCardsDemo';
import BlockCardsCode from './examples/BlockCardsDemo?raw';
import { BlockFormsDemo } from './examples/BlockFormsDemo';
import BlockFormsCode from './examples/BlockFormsDemo?raw';
import { BlockListsDemo } from './examples/BlockListsDemo';
import BlockListsCode from './examples/BlockListsDemo?raw';
import { BlockNavigationDemo } from './examples/BlockNavigationDemo';
import BlockNavigationCode from './examples/BlockNavigationDemo?raw';
import { BlockStructureDemo } from './examples/BlockStructureDemo';
import BlockStructureCode from './examples/BlockStructureDemo?raw';
import { BlockToolbarsDemo } from './examples/BlockToolbarsDemo';
import BlockToolbarsCode from './examples/BlockToolbarsDemo?raw';

export function BlockShowcasePage() {
  const categories = [
    { id: 'cards-containers', label: 'Cards & Containers' },
    { id: 'lists-grids', label: 'Lists & Grids' },
    { id: 'forms-fieldsets', label: 'Forms & Fieldsets' },
    { id: 'toolbars-actions', label: 'Toolbars & Actions' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'structure-layouthelpers', label: 'Structure & Layout' },
  ];

  const handleCategoryChange = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ShowcasePage
      title="Blocks"
      subtitle="Structural Layout System v2.1"
      description="The fundamental structural blocks for layout and grouping."
      categories={categories}
      activeCategoryId="all"
      onCategoryChange={handleCategoryChange}
    >
      {/* 1. Cards & Containers */}
      <div id="cards-containers">
        <SourcePreview code={BlockCardsCode} title="Cards & Containers">
          <BlockCardsDemo />
        </SourcePreview>
      </div>

      <Block role="Divider" layout="stack">
        <></>
      </Block>

      {/* 2. Lists & Grids */}
      <div id="lists-grids">
        <SourcePreview code={BlockListsCode} title="Lists & Grids">
          <BlockListsDemo />
        </SourcePreview>
      </div>

      <Block role="Divider" layout="stack">
        <></>
      </Block>

      {/* 3. Forms & Fieldsets */}
      <div id="forms-fieldsets">
        <SourcePreview code={BlockFormsCode} title="Forms & Fieldsets">
          <BlockFormsDemo />
        </SourcePreview>
      </div>

      <Block role="Divider" layout="stack">
        <></>
      </Block>

      {/* 4. Toolbars */}
      <div id="toolbars-actions">
        <SourcePreview code={BlockToolbarsCode} title="Toolbars & Actions">
          <BlockToolbarsDemo />
        </SourcePreview>
      </div>

      <Block role="Divider" layout="stack">
        <></>
      </Block>

      {/* 5. Navigation */}
      <div id="navigation">
        <SourcePreview code={BlockNavigationCode} title="Navigation">
          <BlockNavigationDemo />
        </SourcePreview>
      </div>

      <Block role="Divider" layout="stack">
        <></>
      </Block>

      {/* 6. Structure */}
      <div id="structure-layouthelpers">
        <SourcePreview code={BlockStructureCode} title="Structure & Layout">
          <BlockStructureDemo />
        </SourcePreview>
      </div>
    </ShowcasePage>
  );
}
