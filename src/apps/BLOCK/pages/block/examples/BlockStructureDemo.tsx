import { Block } from '@/components/types/Block/Block';
import { Separator } from '@/components/types/Element/Separator/Separator.tsx';
import { Text } from '@/components/types/Element/Text/Text';

export function BlockStructureDemo() {
  return (
    <Block role="Container" density="Comfortable" className="gap-6">
      <div className="flex flex-col gap-1">
        <Text role="Title" prominence="Strong" content="6. Structure & LayoutHelpers" />
        <Text
          role="Body"
          prominence="Subtle"
          content="Helpers for dividing and arranging content."
        />
      </div>

      {/* Grid & Divider */}
      <Block role="Card" className="p-4 gap-4">
        <Text role="Label" content="Grid Layout & Divider" />

        <Block role="Grid" spec={{ columns: 2 }} className="h-32">
          <div className="bg-surface-sunken flex items-center justify-center rounded">
            Left Pane
          </div>
          <div className="bg-surface-sunken flex items-center justify-center rounded">
            Right Pane
          </div>
        </Block>

        <Block role="Divider" className="h-px w-full"></Block>

        <Block role="Inline" className="p-4 border border-border-default rounded">
          <Text role="Body" content="Left" />
          <Separator role="ToolbarDivider" />
          <Text role="Body" content="Right" />
        </Block>
      </Block>

      {/* ScrollArea */}
      <Block role="Card" className="p-4 gap-4">
        <Text role="Label" content="ScrollArea (role='ScrollArea')" />
        <Block role="ScrollArea" className="h-32 border border-border-default rounded p-2">
          {Array.from({ length: 10 }).map((_, i) => (
            <Block
              key={i}
              role="Inline"
              clickable
              className="p-2 hover:bg-surface-elevated rounded"
            >
              <Text role="Body" content={`Scrollable Item ${i + 1}`} />
            </Block>
          ))}
        </Block>
      </Block>
    </Block>
  );
}
