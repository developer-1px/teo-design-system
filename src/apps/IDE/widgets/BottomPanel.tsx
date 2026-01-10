import {
  AlertCircle as AlertCircleIcon,
  Bug as BugIcon,
  FileOutput as FileOutputIcon,
  Terminal as TerminalIcon,
} from 'lucide-react';
import { useState } from 'react';
import { Action } from '@/components/types/Atom/Action/Action.tsx';
import { Section } from '@/components/types/Section/Section.tsx';
import { Group } from '@/components/types/Group/Group.tsx';
import { Text } from '@/components/types/Atom/Text/Text.tsx';
import { Badge } from '@/components/types/Atom/Text/role/Badge.tsx';

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

  if (!isOpen) return null;

  return (
    <Group role="Container" layout="flex" direction="column" height={height}>
      <Section role="Container" layout="flex" direction="column" flex="1">
        {/* Tab Header */}
        <Group
          role="Toolbar"
          direction="horizontal"
          align="center"
          justify="between"
          padding="xs"
          prominence="Secondary"
        >
          <Group role="Tabs" direction="horizontal" align="center" gap="xs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Group
                  key={tab.id}
                  role="Tab"
                  direction="horizontal"
                  align="center"
                  padding="sm"
                  gap="xs"
                  interactive
                  selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={14} />
                  <Text role="Body" content={tab.label} size="sm" />
                  {tab.count !== undefined && (
                    <Badge
                      variant={activeTab === tab.id ? 'default' : 'secondary'}
                      size="sm"
                    >
                      {tab.count}
                    </Badge>
                  )}
                </Group>
              );
            })}
          </Group>

          {/* Actions */}
          <Group role="Actions" direction="horizontal" align="center" gap="xs">
            <Action
              role="IconButton"
              icon="ChevronUp"
              label="Maximize Panel"
              density="Compact"
            />
            <Action
              role="IconButton"
              icon="X"
              label="Close Panel"
              density="Compact"
              onClick={onClose}
            />
          </Group>
        </Group>

        {/* Panel Content */}
        <Group role="Content" layout="scroll" flex="1" padding="sm">
          {activeTab === 'terminal' && <TerminalContent />}
          {activeTab === 'problems' && <ProblemsContent />}
          {activeTab === 'output' && <OutputContent />}
          {activeTab === 'debug' && <DebugContent />}
        </Group>
      </Section>
    </Group>
  );
};

// Terminal Tab Content
const TerminalContent = () => {
  return (
    <Group role="Terminal" font="mono" gap="sm">
      <Group role="Line" direction="horizontal" gap="xs">
        <Text role="Code" prominence="Brand" content="user@macbook" />
        <Text role="Code" prominence="Subtle" content="~" />
        <Text role="Code" content="$" />
      </Group>
      <Group role="Output" gap="xs">
        <Group role="Command" direction="horizontal" gap="xs">
          <Text role="Code" prominence="Brand" content="$" />
          <Text role="Code" content="pnpm dev" />
        </Group>
        <Group role="Result" gap="xs">
          <Text role="Code" prominence="Subtle" content="VITE v5.4.21 ready in 390 ms" />
          <Text role="Code" prominence="Subtle" content="➜ Local: http://localhost:5175/" />
        </Group>
      </Group>
    </Group>
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
    <Group role="List" gap="xs">
      {problems.map((problem, idx) => (
        <Group
          key={idx}
          role="ListItem"
          direction="horizontal"
          align="start"
          padding="sm"
          gap="sm"
          interactive
        >
          <AlertCircleIcon
            size={16}
            style={{
              color: problem.type === 'error' ? 'var(--color-semantic-error)' : 'var(--color-semantic-warning)',
              flexShrink: 0,
              marginTop: '2px'
            }}
          />
          <Group role="Content" flex="1" gap="xs">
            <Text role="Body" prominence="Primary" content={problem.message} />
            <Text
              role="Body"
              prominence="Subtle"
              content={`${problem.file}:${problem.line}:${problem.col}`}
              size="sm"
            />
          </Group>
        </Group>
      ))}
    </Group>
  );
};

// Output Tab Content
const OutputContent = () => {
  return (
    <Group role="Output" font="mono" gap="xs">
      <Text role="Code" prominence="Subtle" content="[12:34:56] Starting compilation..." size="sm" />
      <Text role="Code" prominence="Secondary" content="[12:34:57] Compiling TypeScript..." size="sm" />
      <Text
        role="Code"
        prominence="Positive"
        content="[12:34:58] Compilation successful"
        size="sm"
      />
      <Text role="Code" prominence="Secondary" content="[12:34:58] Watching for file changes..." size="sm" />
    </Group>
  );
};

// Debug Console Content
const DebugContent = () => {
  return (
    <Group role="Empty" font="mono" gap="xs">
      <Text role="Code" prominence="Subtle" content="Debug console is empty" />
      <Text role="Code" prominence="Subtle" content="Start debugging to see output here" size="sm" />
    </Group>
  );
};
