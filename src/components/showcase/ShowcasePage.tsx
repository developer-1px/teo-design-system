import type { ReactNode } from 'react';
import { Page } from '@/components/types/Page/Page';
import { Section } from '@/components/types/Section/Section';
import { Block } from '@/components/types/Block/Block';
import { Text } from '@/components/types/Element/Text/Text';

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
    toolbarActions?: ReactNode;
    sidebar?: ReactNode; // Added sidebar prop
    mode?: 'view' | 'edit';
    children: ReactNode;
}

/**
 * ShowcasePage - Reusable layout for component showcase pages.
 *
 * Provides a consistent structure:
 * - Sidebar with category navigation (or custom sidebar)
 * - Main content area with toolbar and header
 * - Standardized spacing and decorative elements
 */
export function ShowcasePage({
    title,
    subtitle,
    description,
    categories = [],
    activeCategoryId,
    onCategoryChange,
    toolbarActions,
    sidebar,
    mode = 'view',
    children,
}: ShowcasePageProps) {
    return (
        <Page title="Showcase" role="Document" layout="Sidebar">
            {/* Sidebar for Navigation */}
            <Section role="PrimarySidebar" prominence="Standard">
                {sidebar ? sidebar : (
                    <Block role="Container" layout="stack" gap={4} className="h-full">
                        {/* Sidebar Header */}
                        <Block role="Container" layout="stack" gap={2} className="p-4 border-b border-border-default">
                            <Text role="Label" prominence="Strong" content={title} />
                            {subtitle && <Text role="Caption" prominence="Subtle" content={subtitle} />}
                        </Block>

                        {/* Category List */}
                        {categories.length > 0 && (
                            <Block role="List" layout="stack" className="p-2">
                                {categories.map((category) => (
                                    <Block
                                        key={category.id}
                                        role="ListItem"
                                        layout="inline"
                                        clickable
                                        selected={activeCategoryId === category.id}
                                        className={`p-2 rounded-md ${activeCategoryId === category.id ? 'bg-surface-active' : 'hover:bg-surface-hover'
                                            }`}
                                        onClick={() => onCategoryChange?.(category.id)}
                                    >
                                        <Text role="Body" content={category.label} />
                                    </Block>
                                ))}
                            </Block>
                        )}
                    </Block>
                )}
            </Section>

            {/* Main Content Area */}
            <Section role="Main" prominence="Standard" mode={mode}>
                {/* Toolbar */}
                <Block role="Toolbar" layout="inline" density="Compact" className="p-4 border-b border-border-default h-12">
                    <Text role="Title" prominence="Standard" content={`${title} Catalog`} />
                    {toolbarActions && (
                        <div className="ml-auto flex items-center gap-2">
                            {toolbarActions}
                        </div>
                    )}
                </Block>

                {/* Content Container */}
                <Block
                    role="Container"
                    layout="stack"
                    density="Comfortable"
                    gap={6}
                    className="p-8 max-w-5xl mx-auto w-full"
                >
                    {/* Content Header */}
                    <Block role="Container" layout="stack" gap={2}>
                        <Text role="Title" prominence="Hero" content={title} />
                        {description && <Text role="Body" prominence="Hero" content={description} />}
                    </Block>

                    <Block role="Divider" layout="stack">
                        <></>
                    </Block>

                    {/* Children Content */}
                    {children}
                </Block>
            </Section>
        </Page>
    );
}
