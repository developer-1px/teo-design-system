import {
  AlertCircle as AlertCircleIcon,
  Bug as BugIcon,
  FileOutput as FileOutputIcon,
  Terminal as TerminalIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Block } from '@/components/types/Block/Block.tsx';
import { Action } from '@/components/types/Element/Action/Action.tsx';
import { Text } from '@/components/types/Element/Text/Text.tsx';
import { Section } from '@/components/types/Section/Section.tsx';
import { cn } from '@/shared/lib/utils';

interface BottomPanelProps {
  isOpen: boolean;
  onClose: () => void;
  height?: number;
  onHeightChange?: (height: number) => void;
}

type TabType = 'terminal' | 'problems' | 'output' | 'debug';

interface Tab {
  id: TabType;
  label: string;
  icon: typeof TerminalIcon;
  count?: number;
}

const tabs: Tab[] = [
  { id: 'terminal', label: 'Terminal', icon: TerminalIcon },
  { id: 'problems', label: 'Problems', icon: AlertCircleIcon, count: 3 },
  { id: 'output', label: 'Output', icon: FileOutputIcon },
  { id: 'debug', label: 'Debug Console', icon: BugIcon },
];

export const BottomPanel = ({ isOpen, onClose, height = 200 }: BottomPanelProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('terminal');

  return (
    <Block role="Container" layout="flex" direction="column" className="h-full">
      <Section role="Container" layout="flex" direction="column" flex="1">
        {/* Tab Header (Unified Design) */}
        <Section
          role="Header"
          density="Compact"
          className="flex items-center justify-between gap-0 p-0 h-9 border-b border-border-default"
        >
          <Block role="Tabs" direction="horizontal" align="center" gap="0" className="h-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={cn(
                    'flex items-center gap-2 px-4 h-full text-xs transition-colors border-r border-border-muted whitespace-nowrap',
                    {
                      'bg-surface-raised text-text font-medium': activeTab === tab.id,
                      'text-text-secondary hover:bg-surface-hover': activeTab !== tab.id,
                    }
                  )}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={14} className="text-text-tertiary" />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={cn(
                        'ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full',
                        activeTab === tab.id
                          ? 'bg-accent text-white'
                          : 'bg-surface-sunken text-text-tertiary'
                      )}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </Block>

          {/* Actions */}
          <Block role="Inline" align="center" gap="xs" className="px-2">
            <Action role="IconButton" icon="ChevronUp" label="Maximize Panel" density="Compact" />
            <Action
              role="IconButton"
              icon="X"
              label="Close Panel"
              density="Compact"
              onClick={onClose}
            />
          </Block>
        </Section>

        {/* Panel Content */}
        <Block role="Container" layout="scroll" flex="1" padding="sm">
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
    <Block role="List" className="font-mono" gap="sm">
      <Block role="Inline" gap="xs">
        <Text role="Code" prominence="Brand" content="user@macbook" />
        <Text role="Code" prominence="Subtle" content="~" />
        <Text role="Code" content="$" />
      </Block>
      <Block role="List" gap="xs">
        <Block role="Inline" gap="xs">
          <Text role="Code" prominence="Brand" content="$" />
          <Text role="Code" content="pnpm dev" />
        </Block>
        <Block role="List" gap="xs">
          <Text role="Code" prominence="Subtle" content="VITE v5.4.21 ready in 390 ms" />
          <Text role="Code" prominence="Subtle" content="➜ Local: http://localhost:5175/" />
        </Block>
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
    <Block role="List" gap="xs">
      {problems.map((problem, idx) => (
        <Block key={idx} role="Inline" align="start" padding="sm" gap="sm" clickable>
          <AlertCircleIcon
            size={16}
            style={{
              color:
                problem.type === 'error'
                  ? 'var(--color-semantic-error)'
                  : 'var(--color-semantic-warning)',
              flexShrink: 0,
              marginTop: '2px',
            }}
          />
          <Block role="Container" flex="1" gap="xs">
            <Text role="Body" prominence="Standard" content={problem.message} />
            <Text
              role="Body"
              prominence="Subtle"
              content={`${problem.file}:${problem.line}:${problem.col}`}
              size="sm"
            />
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
        prominence="Positive"
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
    <Block role="Container" className="items-center justify-center h-full font-mono" gap="xs">
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
