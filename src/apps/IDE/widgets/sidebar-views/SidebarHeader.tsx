import { ReactNode } from 'react';
import { Section } from '@/components/types/Section/Section';
import { Text } from '@/components/types/Element/Text/Text';

interface SidebarHeaderProps {
    title: string;
    actions?: ReactNode;
}

export const SidebarHeader = ({ title, actions }: SidebarHeaderProps) => {
    return (
        <Section
            role="Header"
            density="Compact"
            className="h-9 px-3 flex items-center border-b border-border-default bg-surface-elevated flex-shrink-0"
        >
            <div className="flex-1 min-w-0">
                <Text
                    role="Title"
                    prominence="Subtle"
                    content={title.toUpperCase()}
                    className="text-[10px] font-bold text-text-tertiary tracking-widest truncate"
                />
            </div>
            {actions && <div className="flex items-center gap-1">{actions}</div>}
        </Section>
    );
};
