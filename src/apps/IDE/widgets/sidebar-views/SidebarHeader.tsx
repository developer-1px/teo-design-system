import { Frame } from '@/components/dsl/shared/Frame';
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
        <Frame.Stack>
          <Text role="Title" prominence="Subtle" content={title.toUpperCase()} />
        </Frame.Stack>
        {actions && (
          <Frame.Inline>
            {actions}
          </Frame.Inline>
        )}
      </Block>
    </Section>
  );
};
