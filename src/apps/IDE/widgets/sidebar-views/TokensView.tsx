import { Palette, Type } from 'lucide-react';
import { Block } from '@/components/types/Block/Block';
import { Action } from '@/components/types/Element/Action/Action';
import { Text } from '@/components/types/Element/Text/Text';
import { Section } from '@/components/types/Section/Section';
import { SidebarHeader } from './SidebarHeader';

export const TokensView = () => {
  return (
    <>
      <SidebarHeader
        title="DESIGN TOKENS"
        actions={
          <div className="flex items-center gap-1">
            <Action
              role="IconButton"
              icon="RefreshCw"
              label="Refresh"
              prominence="Subtle"
              density="Compact"
            />
          </div>
        }
      />

      <Section role="Container" className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        {/* Colors */}
        <Block role="Container" className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 border-b border-border-muted pb-1">
            <Palette size={14} />
            <span>Colors (Surfaces)</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <ColorSwatch name="Surface" color="bg-surface" text="text-text" />
            <ColorSwatch name="Elevated" color="bg-surface-elevated" text="text-text" />
            <ColorSwatch name="Raised" color="bg-surface-raised" text="text-text" />
            <ColorSwatch name="Sunken" color="bg-surface-sunken" text="text-text" />
            <ColorSwatch name="Overlay" color="bg-surface-overlay" text="text-white" />
            <ColorSwatch name="Hover" color="bg-surface-hover" text="text-text" />
          </div>
        </Block>

        <Block role="Container" className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 border-b border-border-muted pb-1">
            <Palette size={14} />
            <span>Colors (Semantic)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <ColorSwatch name="Accent" color="bg-accent" text="text-white" />
            <ColorSwatch name="Error" color="bg-semantic-error" text="text-white" />
            <ColorSwatch name="Success" color="bg-semantic-success" text="text-white" />
            <ColorSwatch name="Warning" color="bg-semantic-warning" text="text-black" />
            <ColorSwatch name="Info" color="bg-semantic-info" text="text-white" />
          </div>
        </Block>

        {/* Typography */}
        <Block role="Container" className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-text-secondary uppercase tracking-wider mb-1 border-b border-border-muted pb-1">
            <Type size={14} />
            <span>Typography</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="p-2 border border-border-default rounded bg-surface">
              <Text role="Title" content="Title (Hero)" prominence="Hero" />
              <div className="text-[10px] text-text-tertiary font-mono mt-1">
                Founders Grotesk / 24px / Bold
              </div>
            </div>
            <div className="p-2 border border-border-default rounded bg-surface">
              <Text role="Title" content="Title (Standard)" prominence="Standard" />
              <div className="text-[10px] text-text-tertiary font-mono mt-1">
                Inter / 18px / Semibold
              </div>
            </div>
            <div className="p-2 border border-border-default rounded bg-surface">
              <Text
                role="Body"
                content="Body text for standard content paragraphs."
                prominence="Standard"
              />
              <div className="text-[10px] text-text-tertiary font-mono mt-1">
                Inter / 14px / Regular
              </div>
            </div>
            <div className="p-2 border border-border-default rounded bg-surface">
              <Text
                role="Caption"
                content="Caption text for generic hints."
                prominence="Standard"
              />
              <div className="text-[10px] text-text-tertiary font-mono mt-1">
                Inter / 12px / Medium
              </div>
            </div>
          </div>
        </Block>
      </Section>
    </>
  );
};

const ColorSwatch = ({ name, color, text }: any) => (
  <div
    className={`h-16 rounded-lg ${color} flex items-center justify-center border border-border-default shadow-sm transition-transform hover:scale-105`}
  >
    <span className={`text-xs font-medium ${text}`}>{name}</span>
  </div>
);
