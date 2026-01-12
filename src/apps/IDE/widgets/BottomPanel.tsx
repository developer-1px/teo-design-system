import { Frame } from '@/components/dsl/shared/Frame';
import { useState } from 'react';
import { Block } from '@/components/dsl/Block/Block.tsx';
import { Action } from '@/components/dsl/Element/Action/Action.tsx';
import { Text } from '@/components/dsl/Element/Text/Text.tsx';
import { Section } from '@/components/dsl/Section/Section.tsx';

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
    <div className="flex flex-col h-full bg-surface-sunken text-muted overflow-hidden">
      {/* Tab Header */}
      <div className="flex items-center justify-between px-4 h-[35px] border-b border-border-muted shrink-0 select-none">
        <div className="flex h-full items-center gap-6">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative h-full flex items-center cursor-pointer transition-all text-[11px] font-medium tracking-wide uppercase",
                  isActive ? "text-text opacity-100" : "text-subtle hover:text-muted"
                )}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-1.5 px-1.5 py-0.5 bg-surface-hover rounded-full text-[10px] items-center justify-center flex min-w-[18px]">
                    {tab.count}
                  </span>
                )}
                {isActive && (
                  <div className="absolute bottom-[-1px] left-[-4px] right-[-4px] h-[1px] bg-primary opacity-100" />
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-60">
          <Action role="IconButton" icon="ChevronUp" size="xs" className="hover:bg-hover rounded" />
          <Action
            role="IconButton"
            icon="X"
            size="xs"
            className="hover:bg-hover rounded"
            onClick={onClose}
          />
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-auto p-4 scrollbar-hide font-mono text-[13px]">
        {activeTab === 'terminal' && <TerminalContent />}
        {activeTab === 'problems' && <ProblemsContent />}
        {activeTab === 'output' && <OutputContent />}
        {activeTab === 'debug' && <DebugContent />}
      </div>
    </div>
  );
};

// Terminal Tab Content
const TerminalContent = () => {
  return (
    <Frame.Stack>
      <Frame.Row>
        <Text role="Code" intent="Brand" content="user@macbook" />
        <Text role="Code" prominence="Subtle" content="~" />
        <Text role="Code" content="$" />
        <Text role="Code" content="pnpm dev" />
      </Frame.Row>
      <Frame.Stack>
        <Text role="Code" prominence="Subtle" content="VITE v5.4.21 ready in 390 ms" />
        <Text role="Code" prominence="Subtle" content="➜ Local: http://localhost:5175/" />
      </Frame.Stack>
    </Frame.Stack>
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
    <Frame.Stack>
      {problems.map((problem, idx) => (
        <Frame.Stack key={idx}>
          <Frame.Row>
            <Action role="IconButton" icon="AlertCircle" disabled />
            <Frame.Stack>
              <Text role="Body" size="sm" prominence="Standard" content={problem.message} />
              <Text
                role="Caption"
                prominence="Subtle"
                content={`${problem.file}:${problem.line}:${problem.col}`}
              />
            </Frame.Stack>
          </Frame.Row>
        </Frame.Stack>
      ))}
    </Frame.Stack>
  );
};

// Output Tab Content
const OutputContent = () => {
  return (
    <Block role="List">
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
      <Text role="Code" intent="Positive" content="[12:34:58] Compilation successful" size="sm" />
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
    <Frame.Stack>
      <Text role="Code" prominence="Subtle" content="Debug console is empty" />
      <Text
        role="Code"
        prominence="Subtle"
        content="Start debugging to see output here"
        size="sm"
      />
    </Frame.Stack>
  );
};
