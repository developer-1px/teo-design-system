import { Block } from '@/components/types/Block/Block';
import { Separator } from '@/components/types/Element/Separator/Separator.tsx';
import { Text } from '@/components/types/Element/Text/Text';

export function BlockStructureDemo() {
  return (
    <Block role="Container" density="Comfortable">
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

        <Block role="Grid" spec={{ columns: 2 }}>
          <div className="bg-surface-sunken flex items-center justify-center rounded">
            Left Pane
          </div>
          <div className="bg-surface-sunken flex items-center justify-center rounded">
            Right Pane
          </div>
        </Block>

        <Block role="Divider"></Block>

        <Block role="Inline">
          <Text role="Body" content="Left" />
          <Separator role="ToolbarDivider" />
          <Text role="Body" content="Right" />
        </Block>
      </Block>

      {/* ScrollArea */}
      <Block role="Card">
        <Text role="Label" content="ScrollArea (role='ScrollArea')" />
        <Block role="ScrollArea">
          {Array.from({ length: 10 }).map((_, i) => (
            <Block
              key={i}
              role="Inline"
              clickable
            >
              <Text role="Body" content={`Scrollable Item ${i + 1}`} />
            </Block>
          ))}
        </Block>
      </Block>
    </Block>
  );
}
