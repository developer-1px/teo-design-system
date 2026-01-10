/**
 * Preview - 컴포넌트 렌더링 영역
 */

import { lazy, Suspense, useMemo, useState } from 'react';
import { CodeViewer } from '@/apps/showcase/widgets/components/CodeViewer';
import { ComponentRenderer } from '@/apps/showcase/widgets/components/ComponentRenderer';
import { MarkdownDocs } from '@/apps/showcase/widgets/components/MarkdownDocs';
import { PropsPanel } from '@/apps/showcase/widgets/components/PropsPanel';
import type {
  ComponentMetadata,
  FileTreeNode,
  MockData,
  PropValue,
} from '@/apps/showcase/widgets/parser/types';
import { Block } from '@/components/types/Block/Block.tsx';
import { Action } from '@/components/types/Atom/Action/Action';
import { Text } from '@/components/types/Atom/Text/Text';
import { Section } from '@/components/types/Section/Section.tsx';

interface PreviewProps {
  node: FileTreeNode | null;
}

type Tab = 'preview' | 'code';

export function Preview({ node }: PreviewProps) {
  const metadata = node?.metadata || null;
  const [activeTab, setActiveTab] = useState<Tab>('preview');
  const [propValues, setPropValues] = useState<Record<string, PropValue>>({});
  const [mockData, setMockData] = useState<MockData>({});
  const [darkMode, setDarkMode] = useState(false);

  // 메타데이터 변경 시 props 초기화
  useMemo(() => {
    if (!metadata) {
      setPropValues({});
      return;
    }

    // 기본값 설정
    const defaults: Record<string, PropValue> = {};
    for (const [name, prop] of Object.entries(metadata.props)) {
      if (prop.defaultValue !== undefined) {
        defaults[name] = prop.defaultValue;
      } else {
        // 타입별 기본값
        switch (prop.type.kind) {
          case 'string':
            defaults[name] = '';
            break;
          case 'number':
            defaults[name] = 0;
            break;
          case 'boolean':
            defaults[name] = false;
            break;
          case 'enum':
            defaults[name] = prop.type.values[0] || '';
            break;
          case 'ReactNode':
            defaults[name] = metadata.name;
            break;
        }
      }
    }

    setPropValues(defaults);
  }, [metadata]);

  if (!metadata) {
    return (
      <Section role="Container">
        <Block role="Card">
          <Text role="Body">Select a component to preview</Text>
        </Block>
      </Section>
    );
  }

  return (
    <Section role="Container" split="vertical">
      {/* Top Bar */}
      <Section role="navigation">
        <Block role="Toolbar" gap={2}>
          <Action
            label="Preview"
            behavior={{ action: 'command', command: 'switchTab' }}
            onClick={() => setActiveTab('preview')}
            prominence={activeTab === 'preview' ? 'Standard' : 'Standard'}
            intent={activeTab === 'preview' ? 'Brand' : 'Neutral'}
          />
          <Action
            label="Code"
            behavior={{ action: 'command', command: 'switchTab' }}
            onClick={() => setActiveTab('code')}
            prominence={activeTab === 'code' ? 'Standard' : 'Standard'}
            intent={activeTab === 'code' ? 'Brand' : 'Neutral'}
          />
          <Action
            label={darkMode ? '🌙' : '☀️'}
            behavior={{ action: 'command', command: 'toggleDarkMode' }}
            onClick={() => setDarkMode(!darkMode)}
          />
        </Block>
      </Section>

      {/* Content */}
      <Section role="Container" prominence="Standard">
        {activeTab === 'preview' ? (
          <Block role="Container" prominence="Standard" gap={2}>
            {/* Markdown Docs */}
            {metadata.description && <MarkdownDocs content={metadata.description} />}

            {/* Component Preview */}
            <Section role="Container" prominence="Hero" data-theme={darkMode ? 'dark' : 'light'}>
              {node?.componentModule ? (
                <Suspense fallback={<Text role="Body">Loading...</Text>}>
                  <ComponentRenderer
                    key={metadata.filePath}
                    metadata={metadata}
                    propValues={propValues}
                    mockData={mockData}
                    componentModule={node.componentModule}
                  />
                </Suspense>
              ) : (
                <Block role="Card" prominence="Standard">
                  <Text role="Body" prominence="Standard" intent="Critical">
                    Error: Component module not found for {metadata.name}.
                  </Text>
                  <Text role="Caption" prominence="Subtle">
                    Check browser console for details.
                  </Text>
                </Block>
              )}
            </Section>

            {/* Props Panel */}
            <PropsPanel
              metadata={metadata}
              propValues={propValues}
              mockData={mockData}
              onPropChange={(name, value) => setPropValues((prev) => ({ ...prev, [name]: value }))}
              onMockChange={setMockData}
            />
          </Block>
        ) : (
          <CodeViewer sourceCode={metadata.sourceCode} />
        )}
      </Section>
    </Section>
  );
}
