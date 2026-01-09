/**
 * Storybook-style Addons Panel
 *
 * 탭 구조:
 * - Controls: Props 조정
 * - Docs: 컴포넌트 문서
 * - Code: 소스 코드
 */

import { useState } from 'react';
import type {
  ComponentMetadata,
  FileTreeNode,
  PropValue,
} from '@/apps/showcase/widgets/parser/types';
import { Group } from '@/components/Group/Group.tsx';
import { Text } from '@/components/Text/Text';
import { CodeViewer } from './CodeViewer';
import { MarkdownDocs } from './MarkdownDocs';
import { PropsPanel } from './PropsPanel';

type AddonTab = 'controls' | 'docs' | 'code';

interface AddonsPanelProps {
  node: FileTreeNode | null;
  propValues: Record<string, PropValue>;
  onPropChange: (name: string, value: PropValue) => void;
}

export function AddonsPanel({ node, propValues, onPropChange }: AddonsPanelProps) {
  const [activeTab, setActiveTab] = useState<AddonTab>('controls');
  const metadata = node?.metadata || null;

  if (!metadata) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-surface">
        <Text role="Body" prominence="Tertiary">
          Select a component to view addons
        </Text>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-surface border-l border-default">
      {/* Tabs Header */}
      <Group role="Toolbar" layout="inline" className="border-b border-default px-2">
        <button
          onClick={() => setActiveTab('controls')}
          className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'controls'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text'
          }`}
        >
          Controls
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'docs'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text'
          }`}
        >
          Docs
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'code'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted hover:text'
          }`}
        >
          Code
        </button>
      </Group>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'controls' && (
          <div className="p-4">
            <PropsPanel
              metadata={metadata}
              propValues={propValues}
              onPropChange={onPropChange}
              mockData={{}}
              onMockDataChange={() => {}}
            />
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="p-4">
            <MarkdownDocs metadata={metadata} />
          </div>
        )}

        {activeTab === 'code' && node && <CodeViewer node={node} />}
      </div>
    </div>
  );
}
