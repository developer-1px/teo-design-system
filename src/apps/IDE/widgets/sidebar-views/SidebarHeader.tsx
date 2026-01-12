import type { ReactNode } from 'react';
import { Block } from '@/components/dsl/Block/Block';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Section } from '@/components/dsl/Section/Section';

interface SidebarHeaderProps {
  title: string;
  actions?: ReactNode;
}

export const SidebarHeader = ({ title, actions }: SidebarHeaderProps) => {
  return (
    <Section role="Header" density="Compact">
      <Block role="Toolbar">
        <Block role="Group">
          <Text role="Title" prominence="Subtle" content={title.toUpperCase()} />
        </Block>
        {actions && (
          <Block role="Inline" layout="inline">
            {actions}
          </Block>
        )}
      </Block>
    </Section>
  );
};
