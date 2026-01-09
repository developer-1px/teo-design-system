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
import { Action } from '@/components/Action/Action';
import { Group } from '@/components/Group/Group.tsx';
import { Section } from '@/components/Section/Section.tsx';
import { Text } from '@/components/Text/Text';

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
      <Section role="Container" prominence="Tertiary">
        <Group role="Info">
          <Text role="Body" prominence="Tertiary">
            Select a component to preview
          </Text>
        </Group>
      </Section>
    );
  }

  return (
    <Section role="Container" split="vertical">
      {/* Top Bar */}
      <Section role="navigation" prominence="Tertiary">
        <Group role="Action" gap={2}>
          <Action
            label="Preview"
            behavior={{ action: 'command', command: 'switchTab' }}
            onClick={() => setActiveTab('preview')}
            prominence={activeTab === 'preview' ? 'Primary' : 'Secondary'}
            intent={activeTab === 'preview' ? 'Brand' : 'Neutral'}
          />
          <Action
            label="Code"
            behavior={{ action: 'command', command: 'switchTab' }}
            onClick={() => setActiveTab('code')}
            prominence={activeTab === 'code' ? 'Primary' : 'Secondary'}
            intent={activeTab === 'code' ? 'Brand' : 'Neutral'}
          />
          <Action
            label={darkMode ? '🌙' : '☀️'}
            behavior={{ action: 'command', command: 'toggleDarkMode' }}
            onClick={() => setDarkMode(!darkMode)}
            prominence="Tertiary"
          />
        </Group>
      </Section>

      {/* Content */}
      <Section role="Container" prominence="Primary">
        {activeTab === 'preview' ? (
          <Group role="Container" prominence="Primary" gap={2}>
            {/* Markdown Docs */}
            {metadata.description && <MarkdownDocs content={metadata.description} />}

            {/* Component Preview */}
            <Section role="Container" prominence="Hero" data-theme={darkMode ? 'dark' : 'light'}>
              {node?.componentModule ? (
                <Suspense
                  fallback={
                    <Text role="Body" prominence="Tertiary">
                      Loading...
                    </Text>
                  }
                >
                  <ComponentRenderer
                    key={metadata.filePath}
                    metadata={metadata}
                    propValues={propValues}
                    mockData={mockData}
                    componentModule={node.componentModule}
                  />
                </Suspense>
              ) : (
                <Group role="Info" prominence="Primary">
                  <Text role="Body" prominence="Primary" intent="Critical">
                    Error: Component module not found for {metadata.name}.
                  </Text>
                  <Text role="Caption" prominence="Tertiary">
                    Check browser console for details.
                  </Text>
                </Group>
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
          </Group>
        ) : (
          <CodeViewer sourceCode={metadata.sourceCode} />
        )}
      </Section>
    </Section>
  );
}
