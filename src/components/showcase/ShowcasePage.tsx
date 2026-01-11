import type { ReactNode } from 'react';
import { Block } from '@/components/types/Block/Block';
import { Text } from '@/components/types/Element/Text/Text';
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';

export interface ShowcaseCategory {
  id: string;
  label: string;
}

export interface ShowcasePageProps {
  title: string;
  subtitle?: string;
  description?: string;
  categories?: ShowcaseCategory[];
  activeCategoryId?: string;
  onCategoryChange?: (id: string) => void;
  sidebar?: ReactNode;
  children: ReactNode;
  mode?: 'view' | 'edit';
}

export const ShowcasePage = ({
  title,
  subtitle,
  description,
  categories = [],
  activeCategoryId,
  onCategoryChange,
  sidebar,
  children,
  mode = 'view',
}: ShowcasePageProps) => {
  return (
    <Page role="Application">
      {/* Sidebar Section */}
      <Section
        role="Sidebar"
        prominence="Subtle"
        width="280px"
        className="border-r border-border-default h-full"
      >
        {sidebar ? (
          sidebar
        ) : (
          <Block role="Container" layout="stack" gap={4} className="h-full">
            {/* Sidebar Header */}
            <Block
              role="Container"
              layout="stack"
              gap={2}
              className="p-4 border-b border-border-default"
            >
              <Text role="Label" prominence="Strong" content={title} />
              {subtitle && <Text role="Caption" prominence="Subtle" content={subtitle} />}
            </Block>

            {/* Category List */}
            <Block role="List" layout="stack" className="p-2">
              {categories.map((category) => (
                <Block
                  key={category.id}
                  role="ListItem"
                  layout="inline"
                  clickable
                  selected={activeCategoryId === category.id}
                  className={`p-2 rounded-md ${
                    activeCategoryId === category.id
                      ? 'bg-surface-active'
                      : 'hover:bg-surface-hover'
                  }`}
                  onClick={() => onCategoryChange?.(category.id)}
                >
                  <Text role="Body" content={category.label} />
                </Block>
              ))}
            </Block>
          </Block>
        )}
      </Section>

      {/* Main Content Area */}
      <Section role="Main" prominence="Standard" mode={mode}>
        {/* Toolbar */}
        <Section
          role="Header"
          prominence="Elevated"
          className="h-14 border-b border-border-default px-6 flex items-center justify-between bg-surface/50 backdrop-blur-md sticky top-0 z-10"
        >
          <Block role="Inline" layout="inline" gap={2} className="items-center">
            <Text role="Title" size="md" content={title} />
            {activeCategoryId && (
              <>
                <Text role="Caption" prominence="Subtle" content="/" />
                <Text
                  role="Caption"
                  prominence="Standard"
                  content={categories.find((c) => c.id === activeCategoryId)?.label || ''}
                />
              </>
            )}
          </Block>
        </Section>

        {/* Content */}
        <Block role="Container" layout="stack" className="p-8 max-w-5xl mx-auto space-y-12 pb-32">
          {description && (
            <Block
              role="Container"
              layout="stack"
              gap={2}
              className="px-6 py-4 bg-layer-2 border border-border-default rounded-xl"
            >
              <Text role="Body" prominence="Standard" content={description} />
            </Block>
          )}
          {children}
        </Block>
      </Section>
    </Page>
  );
};
