import { Group } from '@/components/types/Group/Group';
import { Text } from '@/components/types/Atom/Text/Text';
import { Action } from '@/components/types/Atom/Action/Action';

export function GroupToolbarsDemo() {
    return (
        <Group role="Container" layout="stack" density="Comfortable" className="gap-6">
            <div className="flex flex-col gap-1">
                <Text role="Title" prominence="Strong" content="4. Toolbars" />
                <Text role="Body" prominence="Subtle" content="Horizontal grouping for actions." />
            </div>

            <Group role="Card" className="p-6 gap-6">
                <Group role="Container" layout="stack" className="gap-2">
                    <Text role="Label" content="Standard Toolbar" />
                    <Group role="Toolbar" layout="inline" className="p-2 bg-surface-sunken rounded-md border border-border-default">
                        <Action role="IconButton" icon="Bold" prominence="Subtle" label="Bold" />
                        <Action role="IconButton" icon="Italic" prominence="Subtle" label="Italic" />
                        <Action role="IconButton" icon="Underline" prominence="Subtle" label="Underline" />
                        <Group role="Divider" layout="inline"><></></Group>
                        <Action role="IconButton" icon="AlignLeft" prominence="Subtle" label="Align Left" />
                        <Action role="IconButton" icon="AlignCenter" prominence="Subtle" label="Align Center" />
                        <Action role="IconButton" icon="AlignRight" prominence="Subtle" label="Align Right" />
                    </Group>
                </Group>

                <Group role="Container" layout="stack" className="gap-2">
                    <Text role="Label" content="Floating Toolbar" />
                    <div className="h-20 relative bg-surface-sunken rounded-md flex items-center justify-center border border-border-dashed">
                        <Group role="FloatingToolbar">
                            <Action role="IconButton" icon="Plus" prominence="Hero" intent="Brand" label="Add" />
                            <Action role="IconButton" icon="Edit" prominence="Strong" label="Edit" />
                            <Action role="IconButton" icon="Trash" prominence="Strong" intent="Critical" label="Delete" />
                        </Group>
                    </div>
                </Group>
            </Group>
        </Group>
    );
}
