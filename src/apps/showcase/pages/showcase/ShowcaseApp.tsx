/**
 * Showcase App - Storybook-style Component Explorer
 *
 * atoms 폴더를 스캔하여 자동으로 interactive showcase 생성
 * Storybook UI: Toolbar + Sidebar + Canvas + Addons Panel
 */

import { useEffect, useState } from 'react';
import { AddonsPanel } from '@/apps/showcase/widgets/components/AddonsPanel';
import { Canvas } from '@/apps/showcase/widgets/components/Canvas';
import { Sidebar } from '@/apps/showcase/widgets/components/Sidebar';
import {
  type BackgroundType,
  Toolbar,
  type ViewportSize,
} from '@/apps/showcase/widgets/components/Toolbar';
import { parseComponent } from '@/apps/showcase/widgets/parser/parseComponent';
import type { FileTreeNode, PropValue } from '@/apps/showcase/widgets/parser/types';
import { Group } from '@/components/Group/Group.tsx';
import { Page } from '@/components/Page/Page.tsx';
import { Section } from '@/components/Section/Section.tsx';
import { Text } from '@/components/Text/Text';

// atoms 폴더 스캔
// 1. 소스 코드 (파싱용)
const atomsSourceModules = import.meta.glob('/src/components/atoms/*.tsx', {
  query: '?raw',
  import: 'default',
});

// 2. 컴포넌트 모듈 (렌더링용)
const atomsComponentModules = import.meta.glob('/src/components/atoms/*.tsx', {
  eager: false,
});

export function ShowcaseApp() {
  const [fileTree, setFileTree] = useState<FileTreeNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<FileTreeNode | null>(null);
  const [loading, setLoading] = useState(true);

  // Storybook Toolbar States
  const [zoom, setZoom] = useState(100);
  const [background, setBackground] = useState<BackgroundType>('light');
  const [viewport, setViewport] = useState<ViewportSize>('full');
  const [showGrid, setShowGrid] = useState(false);
  const [showMeasure, setShowMeasure] = useState(false);

  // Props State
  const [propValues, setPropValues] = useState<Record<string, PropValue>>({});

  // atoms 파일 스캔 및 메타데이터 생성
  useEffect(() => {
    async function loadAtoms() {
      const tree: FileTreeNode[] = [];

      // 디버깅: glob key 형식 확인
      console.log(
        '[ShowcaseApp] Source module keys (first 3):',
        Object.keys(atomsSourceModules).slice(0, 3)
      );
      console.log(
        '[ShowcaseApp] Component module keys (first 3):',
        Object.keys(atomsComponentModules).slice(0, 3)
      );

      for (const [rawPath, sourceLoader] of Object.entries(atomsSourceModules)) {
        // Query string 제거하여 정규화 (?raw 등)
        const filePath = rawPath.split('?')[0];
        try {
          const sourceCode = (await sourceLoader()) as string;
          const componentMeta = parseComponent(sourceCode, filePath);

          // 파일명 추출
          const fileName = filePath.split('/').pop()?.replace('.tsx', '') || '';

          // 컴포넌트 모듈 loader 가져오기 (정규화된 filePath 사용)
          const componentModule = atomsComponentModules[filePath];

          if (!componentModule) {
            console.warn(`[ShowcaseApp] ✗ No componentModule found for: ${filePath}`);
            console.log(
              '[ShowcaseApp] Available keys:',
              Object.keys(atomsComponentModules).slice(0, 5)
            );
            console.log('[ShowcaseApp] Looking for exact match:', filePath);
          } else {
            console.log(`[ShowcaseApp] ✓ Found componentModule for: ${fileName}`);
          }

          tree.push({
            name: fileName,
            path: filePath,
            type: 'file',
            metadata: componentMeta,
            componentModule,
          });
        } catch (error) {
          console.error(`Failed to load ${filePath}:`, error);
        }
      }

      // 알파벳 순 정렬
      tree.sort((a, b) => a.name.localeCompare(b.name));

      setFileTree(tree);
      setLoading(false);

      // 첫 번째 파일 자동 선택
      if (tree.length > 0) {
        setSelectedFile(tree[0].path);
        setSelectedNode(tree[0]);
      }
    }

    loadAtoms();
  }, []);

  // 파일 선택 핸들러
  const handleFileSelect = (path: string) => {
    setSelectedFile(path);
    const node = fileTree.find((n) => n.path === path);
    setSelectedNode(node || null);

    // 새 컴포넌트 선택 시 props 초기화
    if (node?.metadata) {
      const defaults: Record<string, PropValue> = {};
      for (const [name, prop] of Object.entries(node.metadata.props)) {
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
              defaults[name] = node.metadata.name;
              break;
          }
        }
      }
      setPropValues(defaults);
    }
  };

  // Prop 변경 핸들러
  const handlePropChange = (name: string, value: PropValue) => {
    setPropValues((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <Page layout="full">
        <Section role="Container" prominence="Secondary">
          <Group role="Info" prominence="Secondary">
            <Text role="Body" prominence="Secondary">
              Loading atoms components...
            </Text>
          </Group>
        </Section>
      </Page>
    );
  }

  return (
    <Page layout="full">
      {/* Storybook Toolbar */}
      <Section role="Header">
        <Toolbar
          zoom={zoom}
          onZoomChange={setZoom}
          background={background}
          onBackgroundChange={setBackground}
          viewport={viewport}
          onViewportChange={setViewport}
          showGrid={showGrid}
          onGridToggle={() => setShowGrid(!showGrid)}
          showMeasure={showMeasure}
          onMeasureToggle={() => setShowMeasure(!showMeasure)}
        />
      </Section>

      {/* Main Content: 3-Column Layout */}
      <Section role="Container" prominence="Primary">
        {/* Left Sidebar - Component Tree */}
        <Sidebar fileTree={fileTree} selectedFile={selectedFile} onFileSelect={handleFileSelect} />

        {/* Center Canvas - Preview */}
        <Canvas
          node={selectedNode}
          propValues={propValues}
          zoom={zoom}
          background={background}
          viewport={viewport}
          showGrid={showGrid}
          showMeasure={showMeasure}
        />

        {/* Right Addons Panel - Controls/Docs/Code */}
        <Section role="Aside">
          <AddonsPanel
            node={selectedNode}
            propValues={propValues}
            onPropChange={handlePropChange}
          />
        </Section>
      </Section>
    </Page>
  );
}
