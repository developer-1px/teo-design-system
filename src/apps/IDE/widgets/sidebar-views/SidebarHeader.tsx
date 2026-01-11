import type { ReactNode } from 'react';
import { Block } from '@/components/types/Block/Block';
import { Text } from '@/components/types/Element/Text/Text';
import { Section } from '@/components/types/Section/Section';

interface SidebarHeaderProps {
  title: string;
  actions?: ReactNode;
}

export const SidebarHeader = ({ title, actions }: SidebarHeaderProps) => {
  return (
    <Section
      role="Header"
      density="Compact"
      className="h-9 px-3 border-b border-border-default bg-surface-elevated flex-shrink-0"
    >
      <Block role="Toolbar" flex="1" justify="between" className="px-0">
        <Block role="Group" flex="1" className="min-w-0">
          <Text
            role="Title"
            prominence="Subtle"
            content={title.toUpperCase()}
            className="text-[10px] font-bold text-text-tertiary tracking-widest truncate"
          />
        </Block>
        {actions && (
          <Block role="Inline" layout="inline" className="gap-1">
            {actions}
          </Block>
        )}
      </Block>
    </Section>
  );
};
