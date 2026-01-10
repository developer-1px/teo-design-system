import { Group } from '@/components/types/Group/Group';
import { Text } from '@/components/types/Atom/Text/Text';

export function GroupStructureDemo() {
    return (
        <Group role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
                <Text role="Title" prominence="Strong" content="6. Structure & LayoutHelpers" />
                <Text role="Body" prominence="Subtle" content="Helpers for dividing and arranging content." />
            </div>

            {/* Split & Divider */}
            <Group role="Card" className="p-4 gap-4">
                <Text role="Label" content="Split Layout & Divider" />

                <Group role="Split" className="h-32">
                    <div className="bg-surface-sunken flex items-center justify-center rounded">Left Pane</div>
                    <div className="bg-surface-sunken flex items-center justify-center rounded">Right Pane</div>
                </Group>

                <Group role="Divider" layout="stack"><></></Group>

                <Group role="Inline" className="h-10 items-center bg-surface-sunken px-4 rounded">
                    <Text role="Body" content="Item A" />
                    <Group role="Divider" layout="inline"><></></Group>
                    <Text role="Body" content="Item B" />
                    <Group role="Divider" layout="inline"><></></Group>
                    <Text role="Body" content="Item C" />
                </Group>
            </Group>

            {/* ScrollMenu */}
            <Group role="Card" className="p-4 gap-4">
                <Text role="Label" content="ScrollMenu (role='ScrollMenu')" />
                <Group role="ScrollMenu" className="h-32 border border-border-default rounded p-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <Group key={i} role="Inline" clickable className="p-2 hover:bg-surface-elevated rounded">
                            <Text role="Body" content={`Scrollable Item ${i + 1}`} />
                        </Group>
                    ))}
                </Group>
            </Group>
        </Group>
    );
}
