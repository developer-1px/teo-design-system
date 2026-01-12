import { Frame } from '@/components/dsl/shared/Frame';
import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Separator } from '@/components/dsl/Element/Separator/Separator.tsx';
import { Text } from '@/components/dsl/Element/Text/Text';

export function BlockToolbarsDemo() {
  return (
    <Frame.Column density="Comfortable">
      <div className="flex flex-col gap-1">
        <Text role="Title" prominence="Strong" content="4. Toolbars" />
        <Text role="Body" prominence="Subtle" content="Horizontal grouping for actions." />
      </div>

      <Block role="Card">
        <Frame.Column>
          <Text role="Label" content="Standard Toolbar" />
          <Block role="Toolbar">
            <Action role="IconButton" icon="Bold" prominence="Subtle" label="Bold" />
            <Action role="IconButton" icon="Italic" prominence="Subtle" label="Italic" />
            <Action role="IconButton" icon="Underline" prominence="Subtle" label="Underline" />
            <Separator role="ToolbarDivider" />
            <Action role="IconButton" icon="AlignLeft" prominence="Subtle" label="Align Left" />
            <Action role="IconButton" icon="AlignCenter" prominence="Subtle" label="Align Center" />
            <Action role="IconButton" icon="AlignRight" prominence="Subtle" label="Align Right" />
          </Block>
        </Frame.Column>

        <Frame.Column>
          <Text role="Label" content="Floating Toolbar" />
          <div className="h-20 relative bg-surface-sunken rounded-md flex items-center justify-center border border-border-dashed">
            <Block role="FloatingToolbar">
              <Action role="IconButton" icon="Plus" prominence="Hero" intent="Brand" label="Add" />
              <Action role="IconButton" icon="Edit" prominence="Strong" label="Edit" />
              <Action
                role="IconButton"
                icon="Trash"
                prominence="Strong"
                intent="Critical"
                label="Delete"
              />
            </Block>
          </div>
        </Frame.Column>
      </Block>
    </Frame.Column>
  );
}
