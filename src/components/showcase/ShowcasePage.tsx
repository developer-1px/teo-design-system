import type { ReactNode } from 'react';
import { Block } from '@/components/types/Block/Block';
import { Text } from '@/components/types/Element/Text/Text';
import { Page } from '@/components/types/Page/Page';
import { Action } from '@/components/types/Element/Action/Action';
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
    <Page role="Document" layout="Sidebar">
      {/* Sidebar Section */}
      <Section
        role="Sidebar"
        prominence="Subtle"
        width="300px"
        className="border-r border-border-default h-full"
      >
        {sidebar ? (
          sidebar
        ) : (
          <Block role="Stack" className="h-full">
            {/* Sidebar Header */}
            <Block role="Stack" className="p-6 border-b border-border-default">
              <Text role="Heading" prominence="Strong" content={title} />
              {subtitle && <Text role="Caption" prominence="Subtle" content={subtitle} className="mt-1" />}
            </Block>

            {/* Category List */}
            <Block role="List" className="p-2">
              {categories.map((category) => (
                <Action
                  key={category.id}
                  role="ListItem"
                  selected={activeCategoryId === category.id}
                  onClick={() => onCategoryChange?.(category.id)}
                  className="rounded-lg"
                >
                  <Text role="Label" content={category.label} className="font-medium" />
                </Action>
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
          <Block role="Stack" className="items-center flex-row gap-2">
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
        <Block role="Stack" className="p-10 w-full space-y-20 pb-40">
          {description && (
            <Block role="Stack" className="px-8 py-5 bg-surface-sunken/30 border border-border-muted rounded-2xl max-w-4xl">
              <Text role="Body" prominence="Standard" content={description} />
            </Block>
          )}
          {children}
        </Block>
      </Section>
    </Page>
  );
};
