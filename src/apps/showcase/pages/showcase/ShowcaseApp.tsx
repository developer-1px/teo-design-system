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
import { Block } from '@/components/types/Block/Block.tsx';
import { Text } from '@/components/types/Element/Text/Text';
import { Page } from '@/components/types/Page/Page.tsx';
import { Section } from '@/components/types/Section/Section.tsx';

// components/types 폴더 스캔 (IDDL 컴포넌트)
// 1. 소스 코드 (파싱용)
const componentSourceModules = import.meta.glob('/src/components/types/**/*.tsx', {
  query: '?raw',
  import: 'default',
});

// 2. 컴포넌트 모듈 (렌더링용)
const componentModules = import.meta.glob('/src/components/types/**/*.tsx', {
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

  // components/types 파일 스캔 및 폴더 구조 생성 (계층 구조)
  useEffect(() => {
    async function loadComponents() {
      const root: FileTreeNode[] = [];

      // 재귀적으로 폴더 찾기 또는 생성
      function findOrCreateFolder(
        nodes: FileTreeNode[],
        folderNames: string[],
        basePath: string
      ): FileTreeNode {
        if (folderNames.length === 0) {
          throw new Error('folderNames cannot be empty');
        }

        const [currentName, ...remainingNames] = folderNames;
        const currentPath = `${basePath}/${currentName}`;

        // 현재 레벨에서 폴더 찾기
        let folder = nodes.find((node) => node.name === currentName && node.type === 'folder');

        // 없으면 생성
        if (!folder) {
          folder = {
            name: currentName,
            path: currentPath,
            type: 'folder',
            children: [],
          };
          nodes.push(folder);
        }

        // 마지막 폴더면 반환
        if (remainingNames.length === 0) {
          return folder;
        }

        // 아니면 재귀적으로 하위 폴더 찾기/생성
        if (!folder.children) folder.children = [];
        return findOrCreateFolder(folder.children, remainingNames, currentPath);
      }

      for (const [rawPath, sourceLoader] of Object.entries(componentSourceModules)) {
        // Query string 제거하여 정규화 (?raw 등)
        const filePath = rawPath.split('?')[0];

        // 경로 파싱: /src/components/types/{Category}/{SubCategory?}/role?/{fileName}.tsx
        const relativePath = filePath.replace('/src/components/types/', '');
        const pathParts = relativePath.split('/');
        const fileName = pathParts[pathParts.length - 1].replace('.tsx', '');

        // role/, renderers/, headless/, styles/ 폴더는 제거 (보조 폴더)
        const folderPath = pathParts
          .slice(0, -1)
          .filter((part) => !['role', 'renderers', 'headless', 'styles'].includes(part));

        // 파일이 루트에 있는 경우 스킵 (types.ts 같은 파일)
        if (folderPath.length === 0) {
          continue;
        }

        try {
          const sourceCode = (await sourceLoader()) as string;
          const componentMeta = parseComponent(sourceCode, filePath);

          // 컴포넌트 모듈 loader 가져오기
          const componentModule = componentModules[filePath];

          if (!componentModule) {
            console.warn(`[ShowcaseApp] ✗ No componentModule found for: ${filePath}`);
            continue;
          }

          // 파일 노드 생성
          const fileNode: FileTreeNode = {
            name: fileName,
            path: filePath,
            type: 'file',
            metadata: componentMeta,
            componentModule,
          };

          // 폴더 찾기/생성 및 파일 추가
          const targetFolder = findOrCreateFolder(root, folderPath, '/src/components/types');
          if (!targetFolder.children) targetFolder.children = [];
          targetFolder.children.push(fileNode);
        } catch (error) {
          console.error(`Failed to load ${filePath}:`, error);
        }
      }

      // 재귀적으로 폴더와 파일 정렬
      function sortTree(nodes: FileTreeNode[]): FileTreeNode[] {
        return nodes
          .sort((a, b) => {
            // 폴더 우선 정렬
            if (a.type !== b.type) {
              return a.type === 'folder' ? -1 : 1;
            }
            // 같은 타입이면 이름순
            return a.name.localeCompare(b.name);
          })
          .map((node) => {
            if (node.children) {
              node.children = sortTree(node.children);
            }
            return node;
          });
      }

      // 최상위 폴더 정렬 (Item을 맨 위로)
      root.sort((a, b) => {
        if (a.name === 'Item') return -1;
        if (b.name === 'Item') return 1;
        return a.name.localeCompare(b.name);
      });

      // 각 폴더 내부를 재귀적으로 정렬
      root.forEach((folder) => {
        if (folder.children) {
          // Item 폴더 내에서 Field를 맨 위로
          if (folder.name === 'Item') {
            folder.children.sort((a, b) => {
              if (a.name === 'Field') return -1;
              if (b.name === 'Field') return 1;
              return a.name.localeCompare(b.name);
            });
          }
          // 하위 폴더들도 재귀적으로 정렬
          folder.children = sortTree(folder.children);
        }
      });

      setFileTree(root);
      setLoading(false);

      // 첫 번째 파일 자동 선택 (재귀적으로 첫 파일 찾기)
      function findFirstFile(nodes: FileTreeNode[]): FileTreeNode | null {
        for (const node of nodes) {
          if (node.type === 'file') return node;
          if (node.children) {
            const file = findFirstFile(node.children);
            if (file) return file;
          }
        }
        return null;
      }

      const firstFile = findFirstFile(root);
      if (firstFile) {
        setSelectedFile(firstFile.path);
        setSelectedNode(firstFile);
      }
    }

    loadComponents();
  }, []);

  // 파일 선택 핸들러 (재귀적으로 파일 찾기)
  const handleFileSelect = (path: string) => {
    setSelectedFile(path);

    // 재귀적으로 파일 찾기
    function findNode(nodes: FileTreeNode[], targetPath: string): FileTreeNode | null {
      for (const node of nodes) {
        if (node.path === targetPath) return node;
        if (node.children) {
          const found = findNode(node.children, targetPath);
          if (found) return found;
        }
      }
      return null;
    }

    const node = findNode(fileTree, path);
    setSelectedNode(node);

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
      <Page title="Loading" role="Focus" className="items-center justify-center">
        <Block role="Container" prominence="Standard">
          <Text role="Body" prominence="Standard" content="Loading components..." />
        </Block>
      </Page>
    );
  }

  return (
    <Page title="Showcase App" role="Application" layout="Studio">
      {/* Top Toolbar */}
      <Section role="Toolbar" prominence="Standard">
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

      {/* Left Sidebar - Component Tree */}
      <Section role="PrimarySidebar" prominence="Standard">
        <Sidebar fileTree={fileTree} selectedFile={selectedFile} onFileSelect={handleFileSelect} />
      </Section>

      {/* Center Canvas - Preview */}
      <Section role="Editor" prominence="Standard">
        <Canvas
          node={selectedNode}
          propValues={propValues}
          zoom={zoom}
          background={background}
          viewport={viewport}
          showGrid={showGrid}
          showMeasure={showMeasure}
        />
      </Section>

      {/* Right Addons Panel - Controls/Docs/Code */}
      <Section role="SecondarySidebar" prominence="Standard">
        <AddonsPanel node={selectedNode} propValues={propValues} onPropChange={handlePropChange} />
      </Section>
    </Page>
  );
}
