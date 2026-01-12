import { Frame } from '@/components/dsl/shared/Frame';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Action } from '@/components/dsl/Element/Action/Action';
// Text import removed - unused
import { Section } from '@/components/dsl/Section/Section';
import { SidebarHeader } from './SidebarHeader';

export const JsonView = () => {
  return (
    <>
      <SidebarHeader
        title="JSON VIEWER"
        actions={
          <div className="flex items-center gap-1">
            <Action
              role="IconButton"
              icon="RefreshCw"
              label="Refresh"
              prominence="Subtle"
              density="Compact"
            />
            <Action
              role="IconButton"
              icon="Filter"
              label="Filter"
              prominence="Subtle"
              density="Compact"
            />
          </div>
        }
      />

      <Section role="Container" className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        <Frame.Column className="flex flex-col gap-1">
          <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
            Data Structure
          </div>
          <JsonTree data={mockJsonData} />
        </Frame.Column>
      </Section>
    </>
  );
};

const mockJsonData = {
  project: {
    name: 'ide-ui-kit',
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'vite',
      build: 'tsc && vite build',
      lint: 'eslint src',
    },
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      'lucide-react': '^0.300.0',
    },
    features: ['IDDL', 'Tailwind CSS', 'Radix UI'],
  },
};

const JsonTree = ({ data, level = 0, name }: any) => {
  const [isOpen, setIsOpen] = useState(true);
  const isObject = typeof data === 'object' && data !== null;
  const isArray = Array.isArray(data);
  const isEmpty = isObject && Object.keys(data).length === 0;

  if (!isObject) {
    return (
      <div
        className="flex items-start gap-1 font-mono text-xs py-0.5 hover:bg-surface-hover rounded-sm px-1 cursor-default"
        style={{ paddingLeft: `${level * 16}px` }}
      >
        {name && <span className="text-accent">{name}:</span>}
        <span className={typeof data === 'string' ? 'text-semantic-success' : 'text-semantic-info'}>
          {JSON.stringify(data)}
        </span>
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex items-center gap-1 font-mono text-xs py-0.5 hover:bg-surface-hover rounded-sm px-1 cursor-pointer select-none"
        style={{ paddingLeft: `${level * 16}px` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Icon */}
        <div className="w-4 h-4 flex items-center justify-center text-text-tertiary">
          {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </div>

        {name && <span className="text-text font-bold">{name}:</span>}
        <span className="text-text-tertiary">{isArray ? '[' : '{'}</span>
        {!isOpen && <span className="text-text-tertiary opacity-50">...</span>}
        {!isOpen && <span className="text-text-tertiary">{isArray ? ']' : '}'}</span>}
      </div>

      {isOpen && !isEmpty && (
        <div>
          {Object.entries(data).map(([key, value]) => (
            <JsonTree key={key} name={isArray ? undefined : key} data={value} level={level + 1} />
          ))}
        </div>
      )}

      {isOpen && (
        <div
          className="text-text-tertiary font-mono text-xs py-0.5 px-1 opacity-50"
          style={{ paddingLeft: `${level * 16 + 20}px` }}
        >
          {isArray ? ']' : '}'}
        </div>
      )}
    </div>
  );
};
