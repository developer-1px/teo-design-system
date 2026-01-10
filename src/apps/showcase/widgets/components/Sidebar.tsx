/**
 * Sidebar - Storybook-style Component Tree (Pure IDDL)
 *
 * Features:
 * - Folder structure (Block, Item, Overlay, Page, Section)
 * - Expandable/collapsible folders
 * - Search filter
 * - Component count
 * - Active selection highlight
 * - Keyboard navigation (v3.1): Arrow keys, Enter
 */

import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { FileTreeNode } from '@/apps/showcase/widgets/parser/types';
import { Block } from '@/components/types/Block/Block.tsx';
import { Action } from '@/components/types/Element/Action/Action';
import { Field } from '@/components/types/Element/Field/Field';
import { Text } from '@/components/types/Element/Text/Text';
import { Section } from '@/components/types/Section/Section.tsx';

interface SidebarProps {
  fileTree: FileTreeNode[];
  selectedFile: string | null;
  onFileSelect: (path: string) => void;
}

export function Sidebar({ fileTree, selectedFile, onFileSelect }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => {
    // 모든 폴더를 기본으로 펼침
    const allFolders = new Set<string>();
    function collectFolders(nodes: FileTreeNode[]) {
      for (const node of nodes) {
        if (node.type === 'folder') {
          allFolders.add(node.path);
          if (node.children) {
            collectFolders(node.children);
          }
        }
      }
    }
    collectFolders(fileTree);
    return allFolders;
  });
  const [focusedIndex, setFocusedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  // Toggle folder expand/collapse
  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  // Filter components by search query (재귀적으로 필터링)
  const filteredTree = searchQuery
    ? (function filterTree(nodes: FileTreeNode[]): FileTreeNode[] {
        return nodes
          .map((node) => {
            if (node.type === 'file') {
              // 파일 이름 매칭
              return node.name.toLowerCase().includes(searchQuery.toLowerCase()) ? node : null;
            } else if (node.type === 'folder' && node.children) {
              // 폴더는 자식을 재귀적으로 필터링
              const filteredChildren = filterTree(node.children);
              if (filteredChildren.length > 0) {
                return { ...node, children: filteredChildren };
              }
            }
            return null;
          })
          .filter(Boolean) as FileTreeNode[];
      })(fileTree)
    : fileTree;

  // Count total files (재귀적으로)
  const totalFiles = useMemo(() => {
    function countFiles(nodes: FileTreeNode[]): number {
      return nodes.reduce((acc, node) => {
        if (node.type === 'file') return acc + 1;
        if (node.children) return acc + countFiles(node.children);
        return acc;
      }, 0);
    }
    return countFiles(fileTree);
  }, [fileTree]);

  const filteredFiles = useMemo(() => {
    function countFiles(nodes: FileTreeNode[]): number {
      return nodes.reduce((acc, node) => {
        if (node.type === 'file') return acc + 1;
        if (node.children) return acc + countFiles(node.children);
        return acc;
      }, 0);
    }
    return countFiles(filteredTree);
  }, [filteredTree]);

  // Flat list of all visible files (for keyboard navigation) - 재귀적으로
  const visibleFiles = useMemo(() => {
    const files: FileTreeNode[] = [];
    function collectVisibleFiles(nodes: FileTreeNode[]) {
      for (const node of nodes) {
        if (node.type === 'file') {
          files.push(node);
        } else if (node.type === 'folder' && expandedFolders.has(node.path) && node.children) {
          collectVisibleFiles(node.children);
        }
      }
    }
    collectVisibleFiles(filteredTree);
    return files;
  }, [filteredTree, expandedFolders]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (visibleFiles.length === 0) return;

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const newIndex = Math.min(focusedIndex + 1, visibleFiles.length - 1);
          setFocusedIndex(newIndex);
          const file = visibleFiles[newIndex];
          if (file) {
            onFileSelect(file.path);
          }
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const newIndex = Math.max(focusedIndex - 1, 0);
          setFocusedIndex(newIndex);
          const file = visibleFiles[newIndex];
          if (file) {
            onFileSelect(file.path);
          }
          break;
        }
        case 'Enter': {
          e.preventDefault();
          const file = visibleFiles[focusedIndex];
          if (file) {
            onFileSelect(file.path);
          }
          break;
        }
      }
    };

    const listElement = listRef.current;
    if (listElement) {
      listElement.addEventListener('keydown', handleKeyDown);
      return () => listElement.removeEventListener('keydown', handleKeyDown);
    }
  }, [visibleFiles, focusedIndex, onFileSelect]);

  // Auto-scroll focused item into view
  useEffect(() => {
    const focusedElement = itemRefs.current.get(focusedIndex);
    if (focusedElement) {
      focusedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [focusedIndex]);

  // Reset focus when search query changes
  useEffect(() => {
    setFocusedIndex(0);
  }, [searchQuery]);

  // Auto-focus selected file (when selectedFile changes)
  useEffect(() => {
    if (selectedFile) {
      const index = visibleFiles.findIndex((file) => file.path === selectedFile);
      if (index !== -1) {
        setFocusedIndex(index);
      }
    }
  }, [selectedFile, visibleFiles]);

  // 재귀 컴포넌트: TreeNode 렌더링
  const renderTree = (nodes: FileTreeNode[], depth: number = 0) => {
    return nodes.map((node) => {
      if (node.type === 'folder') {
        const isExpanded = expandedFolders.has(node.path);
        const folderChildren = isExpanded && node.children ? renderTree(node.children, depth + 1) : null;

        return (
          <Block key={node.path} role="Container" gap={0}>
            {/* Folder Label */}
            <div
              className="flex items-center gap-1 px-2 py-1"
              style={{ paddingLeft: `${depth * 12 + 8}px` }}
            >
              <button
                onClick={() => toggleFolder(node.path)}
                className="p-0 hover:bg-surface-raised rounded transition-colors"
              >
                {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>
              <Text role="Label" prominence="Standard" content={node.name} className="text-xs" />
            </div>
            {folderChildren}
          </Block>
        );
      } else {
        // 파일
        const globalIndex = visibleFiles.indexOf(node);
        const isFocused = focusedIndex === globalIndex;

        return (
          <button
            key={node.path}
            ref={(el) => {
              if (el) {
                itemRefs.current.set(globalIndex, el);
              } else {
                itemRefs.current.delete(globalIndex);
              }
            }}
            onClick={() => {
              setFocusedIndex(globalIndex);
              onFileSelect(node.path);
            }}
            style={{ paddingLeft: `${(depth + 1) * 12 + 8}px` }}
            className={`w-full px-2 py-1 text-left text-xs rounded transition-colors ${
              selectedFile === node.path
                ? 'bg-accent-subtle text-accent font-medium'
                : isFocused
                  ? 'bg-surface-raised text-text-primary ring-2 ring-accent ring-inset'
                  : 'text-text-secondary hover:bg-surface-raised'
            }`}
          >
            {node.name}
          </button>
        );
      }
    });
  };

  return (
    <Section role="Navigator" prominence="Standard" density="Compact">
      {/* Search Header */}
      <Block role="Form" prominence="Standard" gap={0} className="mb-2">
        <Field
          type="text"
          placeholder="Search components..."
          value={searchQuery}
          onChange={(value) => setSearchQuery(value as string)}
        />
      </Block>

      {/* Component Tree (Folder Structure) - v3.1: Keyboard navigable */}
      <Section role="Container">
        {filteredTree.length === 0 ? (
          <Block role="Container">
            <Text role="Body" content="No components found" />
          </Block>
        ) : (
          <div ref={listRef} tabIndex={0} className="focus:outline-none">
            <Block role="List" gap={0}>
              {renderTree(filteredTree)}
            </Block>
          </div>
        )}
      </Section>
    </Section>
  );
}
