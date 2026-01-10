import { Block } from '@/components/types/Block/Block';
import { Text } from '@/components/types/Atom/Text/Text';
import { Action } from '@/components/types/Atom/Action/Action';

export function BlockNavigationDemo() {
    return (
        <Block role="Container" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
                <Text role="Title" prominence="Strong" content="5. Navigation" />
                <Text role="Body" prominence="Subtle" content="Components for wayfinding and structure." />
            </div>

            {/* Breadcrumbs */}
            <Block role="Card" className="p-4 gap-4">
                <Text role="Label" content="Breadcrumbs (role='Breadcrumbs')" />
                <Block role="Breadcrumbs">
                    <Text role="Caption" content="Home" />
                    <Action role="Button" icon="ChevronRight" label="" prominence="Subtle" density="Compact" disabled />
                    <Text role="Caption" content="Category" />
                    <Action role="Button" icon="ChevronRight" label="" prominence="Subtle" density="Compact" disabled />
                    <Text role="Caption" content="Current Page" prominence="Standard" />
                </Block>
            </Block>

            {/* Accordion */}
            <Block role="Card" className="p-4 gap-4">
                <Text role="Label" content="Accordion (role='Accordion')" />
                <Block role="Accordion" className="w-full max-w-sm">
                    {/* Note: Accordion implementation handles Items internally if using the specialized renderer context */}
                    {/* But effectively we use AccordionItem, AccordionTrigger, AccordionContent exported from Block */}
                </Block>
                <Text role="Caption" content="* Requires usage of AccordionItem sub-components (see Docs)" prominence="Subtle" />
            </Block>

            {/* Steps */}
            <Block role="Card" className="p-4 gap-4">
                <Text role="Label" content="Steps (role='Steps')" />
                <Block role="Steps" className="items-center !flex-row">
                    <Block role="Inline" gap="2">
                        <div className="w-6 h-6 rounded-full bg-surface-accent-default text-text-inverse flex items-center justify-center text-xs">1</div>
                        <Text role="Body" content="Step 1" />
                    </Block>
                    <div className="w-8 h-px bg-border-default" />
                    <Block role="Inline" gap="2">
                        <div className="w-6 h-6 rounded-full bg-surface-raised border border-border-default flex items-center justify-center text-xs">2</div>
                        <Text role="Body" content="Step 2" prominence="Subtle" />
                    </Block>
                </Block>
            </Block>
        </Block>
    );
}
