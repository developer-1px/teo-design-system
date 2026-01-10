/**
 * useTree - 트리 컴포넌트 헤드리스 훅
 *
 * IDDL Block role="Tree" 구현을 위한 헤드리스 로직
 * @see docs/1-project/1-type-role-aria-mapping-1.md#4-group (Tree, TreeItem)
 * @see docs/1-project/3-how-to-renderer.md (useTree 예제 참고)
 */

import { useCallback, useState } from 'react';

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

export interface UseTreeOptions {
  /** 기본 확장 노드 ID들 */
  defaultExpandedIds?: string[];
  /** 기본 선택 노드 ID */
  defaultSelectedId?: string;
  /** 다중 선택 허용 여부 */
  multiSelect?: boolean;
}

export interface UseTreeReturn {
  /** 확장된 노드 ID들 */
  expandedIds: string[];
  /** 선택된 노드 ID들 */
  selectedIds: string[];
  /** 노드 확장/축소 토글 */
  toggleExpand: (id: string) => void;
  /** 노드 선택 */
  selectNode: (id: string) => void;
  /** Tree에 적용할 props */
  getTreeProps: () => {
    role: 'tree';
  };
  /** TreeItem에 적용할 props */
  getItemProps: (
    node: TreeNode,
    level: number
  ) => {
    role: 'treeitem';
    'aria-expanded': boolean | undefined;
    'aria-selected': boolean;
    'aria-level': number;
    tabIndex: number;
    onKeyDown: (event: React.KeyboardEvent) => void;
    onClick: () => void;
  };
  /** Toggle 버튼에 적용할 props */
  getToggleProps: (id: string) => {
    'aria-label': string;
    onClick: (event: React.MouseEvent) => void;
  };
}

/**
 * @example
 * const { expandedIds, selectedIds, getTreeProps, getItemProps, getToggleProps } = useTree();
 *
 * function TreeNode({ node, level }) {
 *   const hasChildren = node.children && node.children.length > 0;
 *   const isExpanded = expandedIds.includes(node.id);
 *
 *   return (
 *     <li {...getItemProps(node, level)}>
 *       {hasChildren && <button {...getToggleProps(node.id)}>Toggle</button>}
 *       {node.label}
 *       {hasChildren && isExpanded && (
 *         <ul>
 *           {node.children.map(child => <TreeNode key={child.id} node={child} level={level + 1} />)}
 *         </ul>
 *       )}
 *     </li>
 *   );
 * }
 *
 * <ul {...getTreeProps()}>
 *   {data.map(node => <TreeNode key={node.id} node={node} level={1} />)}
 * </ul>
 */
export function useTree(options: UseTreeOptions = {}): UseTreeReturn {
  const { defaultExpandedIds = [], defaultSelectedId, multiSelect = false } = options;
  const [expandedIds, setExpandedIds] = useState<string[]>(defaultExpandedIds);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    defaultSelectedId ? [defaultSelectedId] : []
  );

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((expandedId) => expandedId !== id) : [...prev, id]
    );
  }, []);

  const selectNode = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        if (multiSelect) {
          return prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id];
        }
        return [id];
      });
    },
    [multiSelect]
  );

  const getTreeProps = useCallback(() => {
    return {
      role: 'tree' as const,
    };
  }, []);

  const getItemProps = useCallback(
    (node: TreeNode, level: number) => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedIds.includes(node.id);
      const isSelected = selectedIds.includes(node.id);

      const handleKeyDown = (event: React.KeyboardEvent) => {
        switch (event.key) {
          case 'ArrowRight':
            // 확장 또는 첫 자식으로 이동
            if (hasChildren && !isExpanded) {
              event.preventDefault();
              toggleExpand(node.id);
            }
            // TODO: 이미 확장되어 있으면 첫 자식으로 포커스
            break;
          case 'ArrowLeft':
            // 축소 또는 부모로 이동
            if (hasChildren && isExpanded) {
              event.preventDefault();
              toggleExpand(node.id);
            }
            // TODO: 이미 축소되어 있으면 부모로 포커스
            break;
          case 'ArrowDown':
            // 다음 노드로 이동
            event.preventDefault();
            // TODO: 구현 필요
            break;
          case 'ArrowUp':
            // 이전 노드로 이동
            event.preventDefault();
            // TODO: 구현 필요
            break;
          case 'Enter':
          case ' ':
            event.preventDefault();
            selectNode(node.id);
            break;
          case 'Home':
            // 첫 번째 노드로 이동
            event.preventDefault();
            // TODO: 구현 필요
            break;
          case 'End':
            // 마지막 노드로 이동
            event.preventDefault();
            // TODO: 구현 필요
            break;
        }
      };

      const handleClick = () => {
        selectNode(node.id);
      };

      return {
        role: 'treeitem' as const,
        'aria-expanded': hasChildren ? isExpanded : undefined,
        'aria-selected': isSelected,
        'aria-level': level,
        tabIndex: isSelected ? 0 : -1, // 선택된 노드만 tab 순서에 포함
        onKeyDown: handleKeyDown,
        onClick: handleClick,
      };
    },
    [expandedIds, selectedIds, toggleExpand, selectNode]
  );

  const getToggleProps = useCallback(
    (id: string) => {
      const isExpanded = expandedIds.includes(id);

      const handleClick = (event: React.MouseEvent) => {
        event.stopPropagation(); // 부모 노드 클릭 이벤트와 분리
        toggleExpand(id);
      };

      return {
        'aria-label': isExpanded ? '축소' : '확장',
        onClick: handleClick,
      };
    },
    [expandedIds, toggleExpand]
  );

  return {
    expandedIds,
    selectedIds,
    toggleExpand,
    selectNode,
    getTreeProps,
    getItemProps,
    getToggleProps,
  };
}
