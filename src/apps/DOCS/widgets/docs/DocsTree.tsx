/**
 * DocsTree - 문서 트리 네비게이션
 *
 * FileTree를 재사용하여 /apps/docs 폴더 구조를 표시
 */

import { useMemo } from 'react';
import { buildDocTree, type DocNode, getAllDocs } from '@/apps/DOCS/lib/docs-scanner';
import type { FileNode } from '@/apps/IDE/lib/file-loader';
import { FileTree } from '@/apps/IDE/widgets/file-tree/FileTree';

interface DocsTreeProps {
  onFileClick?: (path: string) => void;
}

/**
 * DocNode를 FileNode로 변환
 */
const convertToFileNodes = (nodes: DocNode[]): FileNode[] => {
  return nodes.map((node) => ({
    name: node.name,
    type: node.type,
    path: node.path,
    children: node.children ? convertToFileNodes(node.children) : undefined,
    icon: node.type === 'file' ? 'markdown' : undefined,
    defaultOpen: node.defaultOpen,
  }));
};

export const DocsTree = ({ onFileClick }: DocsTreeProps) => {
  const fileTree = useMemo(() => {
    const files = getAllDocs();
    const tree = buildDocTree(files);
    return convertToFileNodes(tree);
  }, []);

  return <FileTree data={fileTree} onFileClick={onFileClick || (() => {})} />;
};
