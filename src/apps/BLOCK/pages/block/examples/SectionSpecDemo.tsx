import { Frame } from '@/components/dsl/shared/Frame';
import { useIDDLContext } from '@/components/context/IDDLContext';
import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Section } from '@/components/dsl/Section/Section';

function ContextReader() {
  const ctx = useIDDLContext();
  return (
    <Block role="Card" prominence="Subtle" className="text-[10px] font-mono border-none bg-surface-base/40 backdrop-blur-sm p-2 rounded-lg">
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 opacity-80">
        <span className="text-text-subtle uppercase tracking-tighter">Role</span>
        <span className="text-primary font-bold">{ctx.role}</span>

        <span className="text-text-subtle uppercase tracking-tighter">Density</span>
        <span className="text-accent">{ctx.density}</span>

        <span className="text-text-subtle uppercase tracking-tighter">Prominence</span>
        <span className="text-text">{ctx.prominence}</span>

        <span className="text-text-subtle uppercase tracking-tighter">IconOnly</span>
        <span>{String(ctx.preferIconOnly)}</span>
      </div>
    </Block>
  );
}

export function SectionSpecDemo() {
  return (
    <Frame.Column gap={10} className="w-fill">
      {/* 1. Header Example */}
      <Frame.Stack gap={4}>
        <Text role="Heading" prominence="Strong" content="Header Context" className="text-sm border-b border-border pb-2 opacity-60" />
        <Section role="Header" prominence="Standard" className="rounded-xl border border-border overflow-hidden">
          <Frame.Row align="center" justify="between" padding={4}>
            <Frame.Stack gap={2}>
              <Text role="Title" content="Global Header Demo" />
              <Block role="Toolbar">
                <Action label="Project" size="sm" />
                <Action label="Settings" size="sm" />
              </Block>
            </Frame.Stack>
            <ContextReader />
          </Frame.Row>
        </Section>
      </Frame.Stack>

      {/* 2. Sidebar Example */}
      <Frame.Stack gap={4}>
        <Text role="Heading" prominence="Strong" content="Sidebar Context" className="text-sm border-b border-border pb-2 opacity-60" />
        <Section role="Sidebar" prominence="Subtle" className="rounded-xl border border-border-muted bg-surface-sunken/10">
          <Frame.Row align="start" justify="between" padding={6}>
            <Frame.Stack gap={4} className="flex-1">
              <Block role="List">
                <Text role="Caption" content="NAVIGATION" prominence="Subtle" />
                <Action role="ListItem" label="Dashboard" />
                <Action role="ListItem" label="Team" />
                <Action role="ListItem" label="Analytics" selected />
              </Block>
            </Frame.Stack>
            <ContextReader />
          </Frame.Row>
        </Section>
      </Frame.Stack>

      {/* 3. Main Example */}
      <Frame.Stack gap={4}>
        <Text role="Heading" prominence="Strong" content="Main Context" className="text-sm border-b border-border pb-2 opacity-60" />
        <Section role="Main" prominence="Standard" className="rounded-xl border border-border shadow-sm">
          <Frame.Row align="start" justify="between" padding={8}>
            <Frame.Stack gap={6} className="flex-1">
              <Text role="Title" prominence="Hero" content="Primary Workspace" />
              <Text role="Body" content="Standard blocks resolve with more spacing and standard prominence here." />
              <Block role="Toolbar">
                <Action label="Primary Action" intent="Brand" prominence="Strong" />
              </Block>
            </Frame.Stack>
            <ContextReader />
          </Frame.Row>
        </Section>
      </Frame.Stack>
    </Frame.Column>
  );
}
