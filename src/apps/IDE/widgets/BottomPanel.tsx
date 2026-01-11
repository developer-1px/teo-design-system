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
    <Block role="Stack">
      <Section role="Container">
        {/* Tab Header (Unified Design) */}
        <Block
          role="Toolbar"
          density="Compact"
        >
          <Block role="Tabs" layout="inline">
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
                >
                  {tab.count !== undefined && (
                    <Text
                      role="Badge"
                      content={tab.count}
                    />
                  )}
                </Action>
              );
            })}
          </Block>

          {/* Actions */}
          <Block role="Row" layout="inline">
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
        <Block role="ScrollArea">
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
    <Block role="Stack">
      <Block role="Row" layout="inline">
        <Text role="Code" intent="Brand" content="user@macbook" />
        <Text role="Code" prominence="Subtle" content="~" />
        <Text role="Code" content="$" />
        <Text role="Code" content="pnpm dev" />
      </Block>
      <Block role="Stack">
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
    <Block role="Stack">
      {problems.map((problem, idx) => (
        <Block
          key={idx}
          role="Group"
        >
          <Block role="Row" layout="inline">
            <Action role="IconButton" icon="AlertCircle" disabled />
            <Block role="Stack">
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
    <Block role="Group">
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
