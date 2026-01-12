import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
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
            prominence="Primary"
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
            <Block role="ListItem">
              <Text role="Code" content="local" prominence="Primary" intent="Brand" />
              <Text role="Body" content=":" prominence="Tertiary" />
              <Text role="Code" content="Object" prominence="Standard" intent="Info" />
            </Block>
            <Block role="ListItem">
              <Text role="Code" content="this" prominence="Secondary" />
              <Text role="Body" content=":" prominence="Tertiary" />
              <Text role="Code" content="undefined" prominence="Standard" intent="Info" />
            </Block>
            <Block role="ListItem">
              <Text role="Code" content="args" prominence="Secondary" />
              <Text role="Body" content=":" prominence="Tertiary" />
              <Text role="Code" content="[]" prominence="Tertiary" />
            </Block>
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

          <Text role="Caption" content="No expressions to watch." prominence="Tertiary" />
        </Block>

        {/* Call Stack */}
        <Block role="Accordion">
          <Action role="Button" icon="ChevronDown" label="Call Stack" prominence="Subtle" />
          <Block role="List">
            <Block role="ListItem" selected>
              <Text role="Code" content="handleLogin" prominence="Primary" />
              <Text role="Caption" content="login.ts:42" prominence="Tertiary" />
            </Block>
            <Block role="ListItem">
              <Text role="Code" content="onSubmit" prominence="Secondary" />
              <Text role="Caption" content="Form.tsx:128" prominence="Tertiary" />
            </Block>
            <Block role="ListItem">
              <Text role="Code" content="HTMLFormElement.callCallback" prominence="Tertiary" />
              <Text role="Caption" content="react-dom.js:123" prominence="Tertiary" />
            </Block>
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
            <Block role="ListItem">
              <Action role="Checkbox" label="Uncaught Exceptions" checked prominence="Standard" />
            </Block>
            <Block role="ListItem">
              <Action role="Checkbox" label="Caught Exceptions" prominence="Standard" />
            </Block>
          </Block>
        </Block>
      </Section>
    </>
  );
};
