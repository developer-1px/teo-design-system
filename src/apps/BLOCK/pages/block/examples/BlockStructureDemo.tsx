import { Frame } from '@/components/dsl/shared/Frame';
import { Block } from '@/components/dsl/Block/Block';
import { Separator } from '@/components/dsl/Element/Separator/Separator.tsx';
import { Text } from '@/components/dsl/Element/Text/Text';

export function BlockStructureDemo() {
  return (
    <Frame.Column density="Comfortable">
      <div className="flex flex-col gap-1">
        <Text role="Title" prominence="Strong" content="6. Structure & LayoutHelpers" />
        <Text
          role="Body"
          prominence="Subtle"
          content="Helpers for dividing and arranging content."
        />
      </div>

      {/* Grid & Divider */}
      <Block role="Card">
        <Text role="Label" content="Grid Layout & Divider" />

        <Frame.Grid columns={2}>
          <div className="bg-surface-sunken flex items-center justify-center rounded">
            Left Pane
          </div>
          <div className="bg-surface-sunken flex items-center justify-center rounded">
            Right Pane
          </div>
        </Frame.Grid>

        <Block role="Divider"></Block>

        <Frame.Inline>
          <Text role="Body" content="Left" />
          <Separator role="ToolbarDivider" />
          <Text role="Body" content="Right" />
        </Frame.Inline>
      </Block>

      {/* ScrollArea */}
      <Block role="Card">
        <Text role="Label" content="ScrollArea (role='ScrollArea')" />
        <Block role="ScrollArea">
          {Array.from({ length: 10 }).map((_, i) => (
            <Frame.Inline key={i} clickable>
              <Text role="Body" content={`Scrollable Item ${i + 1}`} />
            </Frame.Inline>
          ))}
        </Block>
      </Block>
    </Frame.Column>
  );
}
