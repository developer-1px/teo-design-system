import { Section } from '@/components/Section/Section.tsx';
import { IconButton } from '@/components/Action/role/IconButton';
import {
  X as XIcon,
  ChevronUp as ChevronUpIcon,
  Terminal as TerminalIcon,
  AlertCircle as AlertCircleIcon,
  FileOutput as FileOutputIcon,
  Bug as BugIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

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
    <div style={{ height: `${height}px` }} className="flex flex-col overflow-hidden">
      <Section
        role="Container"
        prominence="Tertiary"
        className="flex flex-col flex-1 overflow-hidden"
      >
      {/* Tab Header */}
      <div className="flex items-center justify-between px-2 py-1 bg-surface">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1 text-xs rounded-md hover:bg-surface-sunken/50 active:bg-surface-sunken transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1',
                  activeTab === tab.id
                    ? 'bg-surface text'
                    : 'text-muted'
                )}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={cn(
                      'px-1.5 py-0.5 text-xs rounded-full',
                      activeTab === tab.id
                        ? 'bg-accent text-white'
                        : 'bg-surface-sunken text-subtle'
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <IconButton size="sm" title="Maximize Panel">
            <ChevronUpIcon size={16} />
          </IconButton>
          <IconButton size="sm" onClick={onClose} title="Close Panel">
            <XIcon size={16} />
          </IconButton>
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-auto p-2">
        {activeTab === 'terminal' && <TerminalContent />}
        {activeTab === 'problems' && <ProblemsContent />}
        {activeTab === 'output' && <OutputContent />}
        {activeTab === 'debug' && <DebugContent />}
      </div>
    </Section>
    </div>
  );
};

// Terminal Tab Content
const TerminalContent = () => {
  return (
    <div className="font-mono text-sm">
      <div className="text-muted mb-2">
        <span className="text-accent">user@macbook</span>
        <span className="text-subtle"> ~ </span>
        <span>$</span>
      </div>
      <div className="space-y-1">
        <div>
          <span className="text-accent">$</span> pnpm dev
        </div>
        <div className="text-muted">
          <div>VITE v5.4.21 ready in 390 ms</div>
          <div>➜ Local: http://localhost:5175/</div>
        </div>
      </div>
    </div>
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
    <div className="space-y-1">
      {problems.map((problem, idx) => (
        <button
          key={idx}
          className="w-full flex items-start gap-3 px-2 py-1.5 rounded hover:bg-surface-sunken/50 active:bg-surface-sunken transition-colors text-left text-sm"
        >
          <AlertCircleIcon
            size={16}
            className={cn(
              'mt-0.5 flex-shrink-0',
              problem.type === 'error' ? 'text-red-500' : 'text-yellow-500'
            )}
          />
          <div className="flex-1 min-w-0">
            <div className="text">{problem.message}</div>
            <div className="text-xs text-subtle mt-0.5">
              {problem.file}:{problem.line}:{problem.col}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

// Output Tab Content
const OutputContent = () => {
  return (
    <div className="font-mono text-xs space-y-0.5">
      <div className="text-subtle">[12:34:56] Starting compilation...</div>
      <div className="text-muted">[12:34:57] Compiling TypeScript...</div>
      <div className="text-green-600">[12:34:58] Compilation successful</div>
      <div className="text-muted">[12:34:58] Watching for file changes...</div>
    </div>
  );
};

// Debug Console Content
const DebugContent = () => {
  return (
    <div className="font-mono text-sm space-y-1">
      <div className="text-subtle">Debug console is empty</div>
      <div className="text-subtle text-xs">Start debugging to see output here</div>
    </div>
  );
};
