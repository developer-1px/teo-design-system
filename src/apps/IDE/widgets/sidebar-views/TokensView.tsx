import { Palette, Type } from 'lucide-react';
import { Block } from '@/components/dsl/Block/Block';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';
import { Section } from '@/components/dsl/Section/Section';
import { SidebarHeader } from './SidebarHeader';

export const TokensView = () => {
  return (
    <>
      <SidebarHeader
        title="DESIGN TOKENS"
        actions={
          <Block role="Toolbar">
            <Action
              role="IconButton"
              icon="RefreshCw"
              label="Refresh"
              prominence="Subtle"
              density="Compact"
            />
          </Block>
        }
      />

      <Section role="Container">
        {/* Colors */}
        <Block role="Container">
          <Block role="Toolbar">
            <Palette size={14} />
            <Text role="Label" content="Colors (Surfaces)" prominence="Secondary" />
          </Block>

          <Block role="Grid">
            <ColorSwatch name="Surface" color="bg-surface" text="text-text" />
            <ColorSwatch name="Elevated" color="bg-surface-elevated" text="text-text" />
            <ColorSwatch name="Raised" color="bg-surface-raised" text="text-text" />
            <ColorSwatch name="Sunken" color="bg-surface-sunken" text="text-text" />
            <ColorSwatch name="Overlay" color="bg-surface-overlay" text="text-white" />
            <ColorSwatch name="Hover" color="bg-surface-hover" text="text-text" />
          </Block>
        </Block>

        <Block role="Container">
          <Block role="Toolbar">
            <Palette size={14} />
            <Text role="Label" content="Colors (Semantic)" prominence="Secondary" />
          </Block>
          <Block role="Grid">
            <ColorSwatch name="Accent" color="bg-accent" text="text-white" />
            <ColorSwatch name="Error" color="bg-semantic-error" text="text-white" />
            <ColorSwatch name="Success" color="bg-semantic-success" text="text-white" />
            <ColorSwatch name="Warning" color="bg-semantic-warning" text="text-black" />
            <ColorSwatch name="Info" color="bg-semantic-info" text="text-white" />
          </Block>
        </Block>

        {/* Typography */}
        <Block role="Container">
          <Block role="Toolbar">
            <Type size={14} />
            <Text role="Label" content="Typography" prominence="Secondary" />
          </Block>

          <Block role="List">
            <Block role="Card">
              <Text role="Title" content="Title (Hero)" prominence="Hero" />
              <Text role="Code" content="Founders Grotesk / 24px / Bold" size="xs" />
            </Block>
            <Block role="Card">
              <Text role="Title" content="Title (Standard)" prominence="Standard" />
              <Text role="Code" content="Inter / 18px / Semibold" size="xs" />
            </Block>
            <Block role="Card">
              <Text
                role="Body"
                content="Body text for standard content paragraphs."
                prominence="Standard"
              />
              <Text role="Code" content="Inter / 14px / Regular" size="xs" />
            </Block>
            <Block role="Card">
              <Text
                role="Caption"
                content="Caption text for generic hints."
                prominence="Standard"
              />
              <Text role="Code" content="Inter / 12px / Medium" size="xs" />
            </Block>
          </Block>
        </Block>
      </Section>
    </>
  );
};

const ColorSwatch = ({ name, color, text }: any) => (
  <Block role="Card" className={`${color} ${text}`}>
    <Text role="Label" content={name} prominence="Standard" />
  </Block>
);
