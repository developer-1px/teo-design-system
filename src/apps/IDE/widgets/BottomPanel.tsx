import { useState } from 'react';
import { Block } from '@/components/types/Block/Block.tsx';
import { Action } from '@/components/types/Element/Action/Action.tsx';
import { Text } from '@/components/types/Element/Text/Text.tsx';
import { Section } from '@/components/types/Section/Section.tsx';
import { cn } from '@/shared/lib/utils';

interface BottomPanelProps {
  onClose: () => void;
  onHeightChange?: (height: number) => void;
}

type TabType = 'terminal' | 'problems' | 'output' | 'debug';

interface Tab {
  id: TabType;
  label: string;
  icon: string;
  count?: number;
}

const tabs: Tab[] = [
  { id: 'terminal', label: 'Terminal', icon: 'Terminal' },
  { id: 'problems', label: 'Problems', icon: 'AlertCircle', count: 3 },
  { id: 'output', label: 'Output', icon: 'FileText' },
  { id: 'debug', label: 'Debug Console', icon: 'Bug' },
];

export const BottomPanel = ({ onClose }: BottomPanelProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('terminal');

  return (
    <Block role="Stack" gap={0} className="h-full">
      <Section role="Container" className="flex-1 overflow-hidden">
        {/* Tab Header (Unified Design) */}
        <Block
          role="Toolbar"
          density="Compact"
          className="px-0 h-9 border-b border-border-default justify-between"
        >
          <Block role="Tabs" layout="inline" gap={0} className="h-full">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <Action
                  key={tab.id}
                  role="Button"
                  prominence={isActive ? 'Standard' : 'Subtle'}
                  onClick={() => setActiveTab(tab.id)}
                  icon={tab.icon}
                  label={tab.label}
                  className={cn(
                    'h-full px-4 rounded-none border-r border-border-muted flex items-center gap-2',
                    isActive && 'bg-surface-raised'
                  )}
                >
                  {tab.count !== undefined && (
                    <Text
                      role="Badge"
                      className={cn(
                        'ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full',
                        isActive ? 'bg-accent text-white' : 'bg-surface-sunken text-text-tertiary'
                      )}
                    >
                      {tab.count}
                    </Text>
                  )}
                </Action>
              );
            })}
          </Block>

          {/* Actions */}
          <Block role="Row" layout="inline" className="gap-1 px-2">
            <Action role="IconButton" icon="ChevronUp" label="Maximize Panel" density="Compact" />
            <Action
              role="IconButton"
              icon="X"
              label="Close Panel"
              density="Compact"
              onClick={onClose}
            />
          </Block>
        </Block>

        {/* Panel Content */}
        <Block role="ScrollArea" flex="1" className="p-4">
          {activeTab === 'terminal' && <TerminalContent />}
          {activeTab === 'problems' && <ProblemsContent />}
          {activeTab === 'output' && <OutputContent />}
          {activeTab === 'debug' && <DebugContent />}
        </Block>
      </Section>
    </Block>
  );
};

// Terminal Tab Content
const TerminalContent = () => {
  return (
    <Block role="Stack" className="font-mono" gap={1}>
      <Block role="Row" layout="inline" className="gap-1.5">
        <Text role="Code" intent="Brand" content="user@macbook" />
        <Text role="Code" prominence="Subtle" content="~" />
        <Text role="Code" content="$" />
        <Text role="Code" content="pnpm dev" />
      </Block>
      <Block role="Stack" gap={0}>
        <Text role="Code" prominence="Subtle" content="VITE v5.4.21 ready in 390 ms" />
        <Text role="Code" prominence="Subtle" content="➜ Local: http://localhost:5175/" />
      </Block>
    </Block>
  );
};

// Problems Tab Content
const ProblemsContent = () => {
  const problems = [
    {
      type: 'error',
      message: "Cannot find module '@/components/ui/button'",
      file: 'App.tsx',
      line: 2,
      col: 24,
    },
    {
      type: 'warning',
      message: "'cn' is declared but its value is never read",
      file: 'components/ui/Sidebar.tsx',
      line: 12,
      col: 1,
    },
    {
      type: 'warning',
      message: 'Unexpected console statement',
      file: 'utils/file-loader.ts',
      line: 45,
      col: 3,
    },
  ];

  return (
    <Block role="Stack" gap={1}>
      {problems.map((problem, idx) => (
        <Block key={idx} role="Group" className="hover:bg-surface-hover p-2 cursor-pointer rounded-sm">
          <Block role="Row" layout="inline" align="start" className="gap-3">
            <Action role="IconButton" icon="AlertCircle" disabled className="shrink-0 mt-[3px]" />
            <Block role="Stack" gap={0} className="flex-1">
              <Text role="Body" size="sm" prominence="Standard" content={problem.message} />
              <Text
                role="Caption"
                prominence="Subtle"
                content={`${problem.file}:${problem.line}:${problem.col}`}
              />
            </Block>
          </Block>
        </Block>
      ))}
    </Block>
  );
};

// Output Tab Content
const OutputContent = () => {
  return (
    <Block role="List" className="font-mono" gap="xs">
      <Text
        role="Code"
        prominence="Subtle"
        content="[12:34:56] Starting compilation..."
        size="sm"
      />
      <Text
        role="Code"
        prominence="Standard"
        content="[12:34:57] Compiling TypeScript..."
        size="sm"
      />
      <Text
        role="Code"
        intent="Positive"
        content="[12:34:58] Compilation successful"
        size="sm"
      />
      <Text
        role="Code"
        prominence="Standard"
        content="[12:34:58] Watching for file changes..."
        size="sm"
      />
    </Block>
  );
};

// Debug Console Content
const DebugContent = () => {
  return (
    <Block role="Group" className="items-center justify-center h-full font-mono" gap={1}>
      <Text role="Code" prominence="Subtle" content="Debug console is empty" />
      <Text
        role="Code"
        prominence="Subtle"
        content="Start debugging to see output here"
        size="sm"
      />
    </Block>
  );
};
