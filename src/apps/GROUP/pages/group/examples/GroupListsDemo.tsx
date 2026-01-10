import { Group } from '@/components/types/Group/Group';
import { Text } from '@/components/types/Atom/Text/Text';

export function GroupListsDemo() {
    return (
        <Group role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
                <Text role="Title" prominence="Strong" content="2. Lists & Grids" />
                <Text role="Body" prominence="Subtle" content="Layouts for collections of items." />
            </div>

            {/* Grid */}
            <Group role="Card" className="p-4 gap-4">
                <Text role="Label" content="Grid Layout (role='Grid')" />
                <Group role="Grid" className="grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-surface-sunken p-4 rounded text-center">Item {i}</div>
                    ))}
                </Group>
            </Group>

            {/* List */}
            <Group role="Card" className="p-4 gap-4">
                <Text role="Label" content="List Layout (role='List')" />
                <Group role="List" className="gap-2">
                    {['First Item', 'Second Item', 'Third Item'].map(item => (
                        <Group key={item} role="Inline" clickable className="p-2 border-b border-border-subtle last:border-0 hover:bg-surface-sunken">
                            <Text role="Body" content={item} />
                        </Group>
                    ))}
                </Group>
            </Group>
        </Group>
    );
}
