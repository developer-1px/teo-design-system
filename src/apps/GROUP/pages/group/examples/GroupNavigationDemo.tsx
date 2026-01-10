import { Group } from '@/components/types/Group/Group';
import { Text } from '@/components/types/Atom/Text/Text';
import { Action } from '@/components/types/Atom/Action/Action';

export function GroupNavigationDemo() {
    return (
        <Group role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
                <Text role="Title" prominence="Strong" content="5. Navigation" />
                <Text role="Body" prominence="Subtle" content="Components for wayfinding and structure." />
            </div>

            {/* Breadcrumbs */}
            <Group role="Card" className="p-4 gap-4">
                <Text role="Label" content="Breadcrumbs (role='Breadcrumbs')" />
                <Group role="Breadcrumbs" layout="inline">
                    <Text role="Caption" content="Home" />
                    <Action role="Button" icon="ChevronRight" label="" prominence="Subtle" density="Compact" disabled />
                    <Text role="Caption" content="Category" />
                    <Action role="Button" icon="ChevronRight" label="" prominence="Subtle" density="Compact" disabled />
                    <Text role="Caption" content="Current Page" prominence="Standard" />
                </Group>
            </Group>

            {/* Accordion */}
            <Group role="Card" className="p-4 gap-4">
                <Text role="Label" content="Accordion (role='Accordion')" />
                <Group role="Accordion" className="w-full max-w-sm">
                    {/* Note: Accordion implementation handles Items internally if using the specialized renderer context */}
                    {/* But effectively we use AccordionItem, AccordionTrigger, AccordionContent exported from Group */}
                    {/* For this demo, since we are showing Group structure, we rely on the component's internal logic which expects specific children structure or standard Group children? */}
                    {/* Group.tsx: if role === 'Accordion', it renders <Accordion> ... </Accordion> */}
                    {/* The Accordion component from role/Accordion.tsx likely expects AccordionItem children. */}
                    {/* Let's try standard composition if supported, or just use the role and let it be a container if not using the specialized subcomponents. */}
                    {/* Wait, Group exports AccordionItem etc. I should use them? */}
                    {/* No, the request is to showcase Group. If I use Group role="Accordion", I should see if it works with standard Groups or needs specific subcomponents. */}
                    {/* The code says: `export { AccordionItem ... } from ...`. This implies we should use them. */}
                    {/* However, `Group` wraps `Accordion` provider. */}

                    {/* Let's try a simple mocked visual structure if the complex one is too heavy, or just use Group role="List" to mimic it if needed. */}
                    {/* Actually, let's use the explicit `Accordion` component imports if available, but here we are in a demo showing `Group role=...`. */}
                    {/* If I use `Group role="Accordion"`, children are passed to `Accordion` renderer. */}
                </Group>
                <Text role="Caption" content="* Requires usage of AccordionItem sub-components (see Docs)" prominence="Subtle" />
            </Group>

            {/* Steps */}
            <Group role="Card" className="p-4 gap-4">
                <Text role="Label" content="Steps (role='Steps')" />
                <Group role="Steps" layout="inline" className="items-center">
                    <Group role="Inline" gap="2">
                        <div className="w-6 h-6 rounded-full bg-surface-accent-default text-text-inverse flex items-center justify-center text-xs">1</div>
                        <Text role="Body" content="Step 1" />
                    </Group>
                    <div className="w-8 h-px bg-border-default" />
                    <Group role="Inline" gap="2">
                        <div className="w-6 h-6 rounded-full bg-surface-raised border border-border-default flex items-center justify-center text-xs">2</div>
                        <Text role="Body" content="Step 2" prominence="Subtle" />
                    </Group>
                </Group>
            </Group>
        </Group>
    );
}
