import { ShowcasePage } from '@/components/showcase/ShowcasePage';
import { Block } from '@/components/types/Block/Block';
import type { BlockRole } from '@/components/types/Block/Block.types';
import { ROLE_CONFIGS } from '@/components/types/Block/role-config';
import { Text } from '@/components/types/Element/Text/Text';
import { SectionSpecDemo } from './examples/SectionSpecDemo';

// Categorize roles for display
const CATEGORIES: Record<string, BlockRole[]> = {
  Layout: ['Card', 'Stack', 'Grid', 'Container', 'Group', 'Row', 'Divider', 'Spacer'],
  Navigation: ['Tabs', 'Toolbar', 'Sidebar', 'Breadcrumbs', 'Pagination', 'Stepper'],
  Collection: ['List', 'ListItem', 'Menu', 'DataTable', 'TreeView'],
  Form: ['Form', 'FieldGroup', 'RadioGroup', 'CheckboxGroup'],
  Overlay: ['Dialog', 'Sheet', 'Popover', 'Tooltip', 'Toast'],
  Feedback: ['Alert', 'Banner', 'Toast'],
};

export function BlockShowcasePage() {
  const categories = [
    { id: 'context', label: '1. Context Awareness' },
    ...Object.keys(CATEGORIES).map((cat) => ({ id: cat.toLowerCase(), label: cat })),
  ];

  const handleCategoryChange = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ShowcasePage
      title="Block Showcase"
      description="Functional building blocks (IDDL v4.1). Blocks adapt to their parent Section context."
      categories={categories}
      activeCategoryId="context"
      onCategoryChange={handleCategoryChange}
    >
      {/* 1. Context Awareness Demo (Hero) */}
      <Block role="Container" layout="stack" density="Comfortable" gap={6} id="context">
        <Block role="Stack" gap={1}>
          <Text role="Title" prominence="Strong" content="1. Context Awareness (v5)" />
          <Text
            role="Body"
            prominence="Subtle"
            content="Blocks automatically adapt styling based on the Section role."
          />
        </Block>

        {/* Embedded Spec Demo */}
        <SectionSpecDemo />
      </Block>

      <Block role="Divider" className="my-12" />

      {/* Render Categories */}
      {Object.entries(CATEGORIES).map(([category, roles]) => (
        <div key={category} id={category.toLowerCase()}>
          <Block role="Stack" density="Comfortable">
            <h2 className="text-xl font-bold border-b border-border-default pb-2 mb-6">
              {category} Blocks
            </h2>

            <Block role="Stack" density="Comfortable" gap={6}>
              {roles.map((role) => {
                const config = ROLE_CONFIGS[role as BlockRole];
                if (!config) return null;
                const { description } = config;

                return (
                  <Block
                    key={role}
                    role="Group"
                    className="border-b border-border-muted pb-6 last:border-0"
                  >
                    {/* Header */}
                    <div className="mb-2 flex items-center gap-2">
                      <span className="font-bold text-sm bg-surface-raised px-2 py-0.5 rounded border border-border-default">
                        {role}
                      </span>
                      <span className="text-xs text-text-subtle">{description}</span>
                    </div>

                    {/* Visual Preview */}
                    <div className="w-full">
                      {role === 'Divider' ? (
                        <Block role="Divider" />
                      ) : (
                        <Block
                          role={role as BlockRole}
                          prominence="Standard"
                          density="Standard"
                          className="p-4 border border-dashed border-border-muted bg-surface-base"
                        >
                          <Text role="Caption" content={`Preview of ${role}`} />
                        </Block>
                      )}
                    </div>
                  </Block>
                );
              })}
            </Block>
          </Block>
          <Block role="Divider" className="my-12" />
        </div>
      ))}
    </ShowcasePage>
  );
}
