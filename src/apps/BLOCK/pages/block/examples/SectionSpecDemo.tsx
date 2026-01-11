import { IDDLProvider, useIDDLContext } from '@/components/context/IDDLContext';
import { Block } from '@/components/types/Block/Block';
import { Action } from '@/components/types/Element/Action/Action';
import { Text } from '@/components/types/Element/Text/Text';
import { Section } from '@/components/types/Section/Section';

function ContextReader() {
  const ctx = useIDDLContext();
  return (
    <Block
      role="Card"
      className="p-2 border border-border-default bg-surface-base text-xs font-mono mb-2"
    >
      <div>Role: {ctx.role}</div>
      <div>Density: {ctx.density}</div>
      <div>Prompt: {ctx.prominence}</div>
      <div>IconOnly: {String(ctx.preferIconOnly)}</div>
      <div>Depth: {ctx.depth}</div>
    </Block>
  );
}

export function SectionSpecDemo() {
  return (
    <Block role="Container" density="Comfortable" className="gap-8">
      <div className="flex flex-col gap-1">
        <Text role="Title" prominence="Strong" content="Section Context Awareness (v5.2)" />
        <Text role="Body" content="Verifying Context Propagation and Validation Rules" />
      </div>

      {/* 1. Bar Category (Compact Density) */}
      <Section role="Header" className="border border-dashed border-border-default p-4 gap-4">
        <div className="flex justify-between items-center mb-4">
          <Text role="Label" content="Section: Header (Bar)" prominence="Strong" />
          <ContextReader />
        </div>

        {/* Block: Toolbar in Header (Should be flat) */}
        <Block role="Toolbar">
          <Text role="Label" content="Toolbar (Flat)" />
          <Block role="DividerVertical" className="h-4" />
          <Action label="Save" />
          <Action label="Edit" />
        </Block>

        {/* Block: Card in Header (Styled as wrapper?) or just plain */}
        <Block role="Card" className="p-2">
          <Text role="Caption" content="Card in Header (Elevated, no border)" />
        </Block>
      </Section>

      <div className="grid grid-cols-2 gap-8">
        {/* 2. Panel Category (Side/Rail) */}
        <Section
          role="Sidebar"
          className="border border-dashed border-border-default p-4 gap-4 bg-surface-sunken"
        >
          <div className="flex flex-col gap-2 mb-4">
            <Text role="Label" content="Section: Sidebar (Panel)" prominence="Strong" />
            <ContextReader />
          </div>

          {/* Block: List in Sidebar (Tight) */}
          <Block role="List">
            <Text role="Label" content="FILES" prominence="Subtle" className="px-2" />
            <Block
              role="ListItem"
              className="px-2 py-1 hover:bg-surface-hover rounded cursor-pointer"
            >
              <Text role="Body" content="index.tsx" />
            </Block>
            <Block
              role="ListItem"
              className="px-2 py-1 hover:bg-surface-hover rounded cursor-pointer"
            >
              <Text role="Body" content="App.tsx" />
            </Block>
            <Block
              role="ListItem"
              className="px-2 py-1 hover:bg-surface-hover rounded cursor-pointer"
            >
              <Text role="Body" content="utils.ts" />
            </Block>
          </Block>

          {/* Block: Card in Sidebar (Flat) */}
          <Block role="Card" className="bg-surface p-3 mt-4">
            <Text role="Heading" content="Sidebar Widget" />
            <Text
              role="Caption"
              content="Card here is flat/transparent by config, but class override gives bg."
            />
          </Block>
        </Section>

        {/* 3. Main Category (Comfortable) */}
        <Section role="Main" className="border border-dashed border-border-default p-4 gap-4">
          <div className="flex flex-col gap-2 mb-4">
            <Text role="Label" content="Section: Main (Main)" prominence="Strong" />
            <ContextReader />
          </div>

          {/* Block: Toolbar in Main (Detached) */}
          <Block role="Toolbar">
            <Text role="Label" content="Toolbar (Detached)" />
            <Block role="DividerVertical" className="h-4" />
            <Action label="Action 1" />
          </Block>

          {/* Block: List in Main (Standard) */}
          <Block role="List" className="mt-4">
            <Block role="ListItem" className="p-2 border-b border-border-muted">
              <Text role="Body" content="Standard List Item 1" />
            </Block>
            <Block role="ListItem" className="p-2 border-b border-border-muted">
              <Text role="Body" content="Standard List Item 2" />
            </Block>
          </Block>

          {/* 4. Violation Test (Check Console) */}
          <Block role="Card" intent="Caution" className="p-4 mt-auto border border-yellow-400">
            <Text role="Heading" content="Validation Test Area" />
            <Text
              role="Body"
              content="Open console to see warnings for forbidden blocks if implemented."
            />
          </Block>
        </Section>
      </div>
    </Block>
  );
}
