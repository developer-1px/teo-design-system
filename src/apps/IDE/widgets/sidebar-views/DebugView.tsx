import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Field } from '@/components/dsl/Element/Field/Field';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Section } from '@/components/dsl/Section/Section';
import { SidebarHeader } from './SidebarHeader';

export const DebugView = () => {
  return (
    <>
      <SidebarHeader
        title="RUN AND DEBUG"
        actions={
          <Block role="Toolbar">
            <Action
              role="IconButton"
              icon="MoreHorizontal"
              label="More Actions"
              prominence="Subtle"
              density="Compact"
            />
          </Block>
        }
      />

      {/* Debug Actions Toolbar */}
      <Section role="Toolbar">
        <Block role="Toolbar">
          <Action
            role="Button"
            icon="Play"
            label="Run: Development"
            prominence="Strong"
            intent="Positive"
            density="Compact"
          />
          <Action
            role="IconButton"
            icon="Settings"
            label="Configure"
            prominence="Subtle"
            density="Compact"
          />
        </Block>
      </Section>

      <Section role="Container">
        {/* Variables */}
        <Block role="Accordion">
          <Action role="Button" icon="ChevronDown" label="Variables" prominence="Subtle" />

          <Block role="List">
            <Action role="ListItem">
              <Text role="Code" content="local" prominence="Strong" intent="Brand" />
              <Text role="Body" content=":" prominence="Subtle" />
              <Text role="Code" content="Object" prominence="Standard" intent="Info" />
            </Action>
            <Action role="ListItem">
              <Text role="Code" content="this" prominence="Secondary" />
              <Text role="Body" content=":" prominence="Subtle" />
              <Text role="Code" content="undefined" prominence="Standard" intent="Info" />
            </Action>
            <Action role="ListItem">
              <Text role="Code" content="args" prominence="Secondary" />
              <Text role="Body" content=":" prominence="Subtle" />
              <Text role="Code" content="[]" prominence="Subtle" />
            </Action>
          </Block>
        </Block>

        {/* Watch */}
        <Block role="Accordion">
          <Block role="Toolbar">
            <Action role="Button" icon="ChevronDown" label="Watch" prominence="Subtle" />
            <Action
              role="IconButton"
              icon="Plus"
              label="Add Expression"
              prominence="Subtle"
              density="Compact"
            />
          </Block>

          <Text role="Caption" content="No expressions to watch." prominence="Subtle" />
        </Block>

        {/* Call Stack */}
        <Block role="Accordion">
          <Action role="Button" icon="ChevronDown" label="Call Stack" prominence="Subtle" />
          <Block role="List">
            <Action role="ListItem" selected>
              <Text role="Code" content="handleLogin" prominence="Strong" />
              <Text role="Caption" content="login.ts:42" prominence="Subtle" />
            </Action>
            <Action role="ListItem">
              <Text role="Code" content="onSubmit" prominence="Secondary" />
              <Text role="Caption" content="Form.tsx:128" prominence="Subtle" />
            </Action>
            <Action role="ListItem">
              <Text role="Code" content="HTMLFormElement.callCallback" prominence="Subtle" />
              <Text role="Caption" content="react-dom.js:123" prominence="Subtle" />
            </Action>
          </Block>
        </Block>

        {/* Breakpoints */}
        <Block role="Accordion">
          <Block role="Toolbar">
            <Action role="Button" icon="ChevronDown" label="Breakpoints" prominence="Subtle" />
            <Action
              role="IconButton"
              icon="Plus"
              label="Add Function Breakpoint"
              prominence="Subtle"
              density="Compact"
            />
            <Action
              role="IconButton"
              icon="RotateCcw"
              label="Remove All"
              prominence="Subtle"
              density="Compact"
            />
          </Block>
          <Block role="List">
            <Action role="ListItem">
              <Field role="Checkbox" label="Uncaught Exceptions" value={true} prominence="Standard" />
            </Action>
            <Action role="ListItem">
              <Field role="Checkbox" label="Caught Exceptions" value={false} prominence="Standard" />
            </Action>
          </Block>
        </Block>
      </Section>
    </>
  );
};
