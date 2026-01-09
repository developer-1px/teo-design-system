/**
 * useTreeNavigation - 트리 구조 키보드 네비게이션 전용 훅
 *
 * Left/Right로 접기/펼치기, Up/Down으로 노드 이동
 */

import { useCallback, useEffect, useMemo, useState } from 'react';

export interface TreeNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: TreeNode[];
  isOpen?: boolean;
}

interface FlatNode extends TreeNode {
  level: number;
  parentId?: string;
}

interface UseTreeNavigationOptions {
  /** 트리 데이터 */
  data: TreeNode[];
  /** 초기 열림 상태 */
  defaultOpenIds?: string[];
  /** 파일 선택 핸들러 */
  onFileSelect?: (node: TreeNode) => void;
  /** 활성화 여부 */
  enabled?: boolean;
}

interface UseTreeNavigationReturn {
  /** 현재 커서 인덱스 */
  cursorIndex: number;
  /** 플랫한 노드 리스트 (렌더링용) */
  flatNodes: FlatNode[];
  /** 열린 폴더 ID Set */
  openFolderIds: Set<string>;
  /** 폴더 토글 */
  toggleFolder: (nodeId: string) => void;
  /** 특정 노드로 포커스 이동 */
  focusNode: (index: number) => void;
  /** 노드별 props */
  getNodeProps: (index: number) => {
    'data-cursor': boolean;
    'data-index': number;
    tabIndex: number;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onClick: () => void;
  };
}

/**
 * 트리를 플랫한 리스트로 변환 (열린 노드만)
 */
const flattenTree = (
  nodes: TreeNode[],
  openIds: Set<string>,
  level = 0,
  parentId?: string
): FlatNode[] => {
  const result: FlatNode[] = [];

  for (const node of nodes) {
    result.push({
      ...node,
      level,
      parentId,
    });

    // 폴더이고 열려있으면 자식도 추가
    if (node.type === 'folder' && openIds.has(node.id) && node.children) {
      result.push(...flattenTree(node.children, openIds, level + 1, node.id));
    }
  }

  return result;
};

/**
 * 트리 네비게이션 훅
 */
export const useTreeNavigation = (options: UseTreeNavigationOptions): UseTreeNavigationReturn => {
  const { data, defaultOpenIds = [], onFileSelect, enabled = true } = options;

  const [cursorIndex, setCursorIndex] = useState(0);
  const [openFolderIds, setOpenFolderIds] = useState<Set<string>>(new Set(defaultOpenIds));

  // 플랫한 노드 리스트 생성
  const flatNodes = useMemo(() => {
    return flattenTree(data, openFolderIds);
  }, [data, openFolderIds]);

  // 폴더 토글
  const toggleFolder = useCallback((nodeId: string) => {
    setOpenFolderIds((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  // 특정 노드로 포커스 이동
  const focusNode = useCallback(
    (index: number) => {
      if (index >= 0 && index < flatNodes.length) {
        setCursorIndex(index);
      }
    },
    [flatNodes.length]
  );

  // 키보드 이벤트 핸들러
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!enabled || flatNodes.length === 0) return;

      const currentNode = flatNodes[cursorIndex];
      if (!currentNode) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setCursorIndex((prev) => Math.min(prev + 1, flatNodes.length - 1));
          break;

        case 'ArrowUp':
          e.preventDefault();
          setCursorIndex((prev) => Math.max(prev - 1, 0));
          break;

        case 'ArrowRight':
          e.preventDefault();
          if (currentNode.type === 'folder') {
            if (!openFolderIds.has(currentNode.id)) {
              // 폴더 펼치기
              toggleFolder(currentNode.id);
            } else if (currentNode.children && currentNode.children.length > 0) {
              // 이미 열려있으면 첫 자식으로 이동
              setCursorIndex((prev) => Math.min(prev + 1, flatNodes.length - 1));
            }
          }
          break;

        case 'ArrowLeft':
          e.preventDefault();
          if (currentNode.type === 'folder' && openFolderIds.has(currentNode.id)) {
            // 열려있는 폴더면 접기
            toggleFolder(currentNode.id);
          } else if (currentNode.parentId) {
            // 부모 노드로 이동
            const parentIndex = flatNodes.findIndex((n) => n.id === currentNode.parentId);
            if (parentIndex !== -1) {
              setCursorIndex(parentIndex);
            }
          }
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          if (currentNode.type === 'folder') {
            toggleFolder(currentNode.id);
          } else if (currentNode.type === 'file' && onFileSelect) {
            onFileSelect(currentNode);
          }
          break;

        case 'Home':
          e.preventDefault();
          setCursorIndex(0);
          break;

        case 'End':
          e.preventDefault();
          setCursorIndex(flatNodes.length - 1);
          break;
      }
    },
    [enabled, flatNodes, cursorIndex, openFolderIds, toggleFolder, onFileSelect]
  );

  // 노드별 props
  const getNodeProps = useCallback(
    (index: number) => ({
      'data-cursor': index === cursorIndex,
      'data-index': index,
      tabIndex: index === cursorIndex ? 0 : -1,
      onKeyDown: handleKeyDown,
      onClick: () => {
        setCursorIndex(index);
        const node = flatNodes[index];
        if (node.type === 'folder') {
          toggleFolder(node.id);
        } else if (node.type === 'file' && onFileSelect) {
          onFileSelect(node);
        }
      },
    }),
    [cursorIndex, handleKeyDown, flatNodes, toggleFolder, onFileSelect]
  );

  // 데이터 변경 시 커서 범위 체크
  useEffect(() => {
    if (flatNodes.length === 0) {
      setCursorIndex(0);
    } else if (cursorIndex >= flatNodes.length) {
      setCursorIndex(flatNodes.length - 1);
    }
  }, [flatNodes.length, cursorIndex]);

  return {
    cursorIndex,
    flatNodes,
    openFolderIds,
    toggleFolder,
    focusNode,
    getNodeProps,
  };
};
