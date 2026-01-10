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
import { Block } from '@/components/types/Block/Block.tsx';
import { Text } from '@/components/types/Element/Text/Text';
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
      <Block
        role="Container"
        prominence="Standard"
        className="flex-1 flex items-center justify-center"
      >
        <Text role="Body">Select a component to view addons</Text>
      </Block>
    );
  }

  return (
    <Block role="Container" prominence="Standard" className="flex flex-col h-full">
      {/* Tabs Header */}
      <Block role="Tabs" prominence="Standard" className="border-b border-border-default">
        <button
          onClick={() => setActiveTab('controls')}
          className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'controls'
              ? 'border-accent-default text-accent-default'
              : 'border-transparent text-text-secondary hover:text-text'
          }`}
        >
          Controls
        </button>
        <button
          onClick={() => setActiveTab('docs')}
          className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'docs'
              ? 'border-accent-default text-accent-default'
              : 'border-transparent text-text-secondary hover:text-text'
          }`}
        >
          Docs
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'code'
              ? 'border-accent-default text-accent-default'
              : 'border-transparent text-text-secondary hover:text-text'
          }`}
        >
          Code
        </button>
      </Block>

      {/* Tab Content */}
      <Block role="Container" prominence="Standard" className="flex-1 overflow-auto">
        {activeTab === 'controls' && (
          <Block role="Container" prominence="Standard" className="p-4">
            <PropsPanel
              metadata={metadata}
              propValues={propValues}
              mockData={{}}
              onPropChange={onPropChange}
              onMockChange={() => {}}
            />
          </Block>
        )}

        {activeTab === 'docs' && (
          <Block role="Container" prominence="Standard" className="p-4">
            <MarkdownDocs metadata={metadata} />
          </Block>
        )}

        {activeTab === 'code' && metadata.sourceCode && (
          <CodeViewer sourceCode={metadata.sourceCode} />
        )}
      </Block>
    </Block>
  );
}
