/**
 * TreeView - DSL 빌더 트리 뷰
 *
 * 전체 트리를 표시하고 드래그 앤 드롭 관리
 * 키보드 네비게이션 지원 (Arrow keys, Enter, Space)
 */

import type { LucideIcon } from 'lucide-react';
import {
  Box,
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FormInput,
  Layers,
  Layout,
  MousePointerClick,
  Plus,
  Type,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import type { AnyDSLNode, DSLNodeType } from '@/apps/DSLBuilder/lib/dsl-builder/types.ts';
import { type TreeNode as KeyboardTreeNode, useTreeNavigation } from '@/shared/lib/keyboard';
import { cn } from '@/shared/lib/utils';

export interface TreeViewProps {
  tree: AnyDSLNode;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddChild: (parentId: string, type: DSLNodeType) => void;
  onMove: (nodeId: string, newParentId: string) => void;
}

const nodeIcons: Record<DSLNodeType, LucideIcon> = {
  page: FileText,
  region: Layout,
  section: Box,
  overlay: Layers,
  group: Folder,
  text: Type,
  field: FormInput,
  action: MousePointerClick,
};

const nodeLabels: Record<DSLNodeType, string> = {
  page: 'Page',
  region: 'Region',
  section: 'Section',
  overlay: 'Overlay',
  group: 'Block',
  text: 'Text',
  field: 'Field',
  action: 'Action',
};

interface FlatDSLNode {
  id: string;
  type: DSLNodeType;
  children?: AnyDSLNode[];
  level: number;
  parentId?: string;
  [key: string]: any; // Allow additional properties from AnyDSLNode
}

// AnyDSLNode를 KeyboardTreeNode로 변환
function convertToKeyboardTreeNode(node: AnyDSLNode): KeyboardTreeNode {
  const hasChildren = 'children' in node && node.children && node.children.length > 0;
  return {
    id: node.id,
    name: nodeLabels[node.type],
    type: hasChildren ? 'folder' : 'file',
    children:
      hasChildren && node.children ? node.children.map(convertToKeyboardTreeNode) : undefined,
  };
}

// Flatten tree for rendering
function flattenDSLTree(
  node: AnyDSLNode,
  openIds: Set<string>,
  level = 0,
  parentId?: string
): FlatDSLNode[] {
  const result: FlatDSLNode[] = [];
  result.push({ ...node, level, parentId });

  if ('children' in node && node.children && openIds.has(node.id)) {
    for (const child of node.children) {
      result.push(...flattenDSLTree(child, openIds, level + 1, node.id));
    }
  }

  return result;
}

export function TreeView({ tree, selectedId, onSelect, onAddChild, onMove }: TreeViewProps) {
  const [draggedNode, setDraggedNode] = useState<AnyDSLNode | null>(null);
  const [showAddMenu, setShowAddMenu] = useState<string | null>(null);

  // Convert to keyboard tree format
  const keyboardTree = useMemo(() => convertToKeyboardTreeNode(tree), [tree]);

  // Get all nodes that should be initially open (all folders)
  const getAllNodeIds = (node: AnyDSLNode): string[] => {
    const ids = [node.id];
    if ('children' in node && node.children) {
      node.children.forEach((child: AnyDSLNode) => {
        ids.push(...getAllNodeIds(child));
      });
    }
    return ids;
  };

  const defaultOpenIds = useMemo(() => getAllNodeIds(tree), [tree]);

  // Use keyboard navigation
  const { openFolderIds, getNodeProps } = useTreeNavigation({
    data: [keyboardTree],
    defaultOpenIds,
    onFileSelect: (node) => {
      onSelect(node.id);
    },
  });

  // Flatten DSL tree for rendering
  const flatDSLNodes = useMemo(() => flattenDSLTree(tree, openFolderIds), [tree, openFolderIds]);

  const handleDragStart = (node: AnyDSLNode) => {
    setDraggedNode(node);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();

    if (draggedNode && draggedNode.id !== targetId) {
      onMove(draggedNode.id, targetId);
    }

    setDraggedNode(null);
  };

  // Determine what children a node can accept
  const getChildTypes = (nodeType: DSLNodeType): DSLNodeType[] => {
    const childTypeMap: Record<DSLNodeType, DSLNodeType[]> = {
      page: ['region'],
      region: ['section', 'overlay'],
      section: ['group', 'section'],
      overlay: ['section', 'group'],
      group: ['text', 'field', 'action', 'group'],
      text: [],
      field: [],
      action: [],
    };
    return childTypeMap[nodeType] || [];
  };

  return (
    <div className="h-full overflow-y-auto py-2 focus-within:outline-none">
      {flatDSLNodes.map((node, index) => {
        const hasChildren = node.children && node.children.length > 0;
        const isExpanded = openFolderIds.has(node.id);
        const isSelected = selectedId === node.id;
        const isCursor = getNodeProps(index)['data-cursor'];
        const allowedChildTypes = getChildTypes(node.type);
        const canAddChildren = allowedChildTypes.length > 0;
        const NodeIcon = nodeIcons[node.type];

        return (
          <div
            key={node.id}
            {...getNodeProps(index)}
            className={cn(
              'flex items-center gap-1 px-2 py-1 text-xs cursor-pointer hover:bg-layer-3 transition-colors rounded mx-1',
              isCursor && 'bg-accent/10 ring-1 ring-accent/30',
              isSelected && 'text-accent font-medium'
            )}
            style={{ paddingLeft: `${node.level * 12 + 6}px` }}
            role="treeitem"
            aria-selected={isSelected}
            draggable
            onDragStart={(e) => {
              e.stopPropagation();
              handleDragStart(node as AnyDSLNode);
            }}
            onDragOver={handleDragOver}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDrop(e, node.id);
            }}
            onClick={() => onSelect(node.id)}
          >
            {/* Expand/Collapse */}
            {hasChildren ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Toggle will be handled by keyboard navigation
                }}
                className="p-0.5 hover:bg-black/10 rounded"
              >
                {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>
            ) : (
              <div className="w-4" />
            )}

            {/* Icon & Label */}
            <NodeIcon size={14} className="flex-shrink-0" />
            <span className="flex-1 truncate">
              {nodeLabels[node.type]}
              {node.type === 'region' && ` (${(node as any).role})`}
              {node.type === 'group' && ` (${(node as any).role})`}
            </span>

            {/* Add Child Button */}
            {canAddChildren && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAddMenu(showAddMenu === node.id ? null : node.id);
                  }}
                  className="p-0.5 hover:bg-black/10 rounded"
                >
                  <Plus size={12} />
                </button>

                {/* Add Menu */}
                {showAddMenu === node.id && (
                  <div className="absolute right-0 top-full mt-1 bg-layer-5 rounded-md shadow-5 border border-border py-1 z-50 min-w-[100px]">
                    {allowedChildTypes.map((type) => {
                      const MenuIcon = nodeIcons[type];
                      return (
                        <button
                          key={type}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddChild(node.id, type);
                            setShowAddMenu(null);
                          }}
                          className="w-full px-2 py-1 text-left text-xs hover:bg-black/5 flex items-center gap-1.5"
                        >
                          <MenuIcon size={12} />
                          <span>{nodeLabels[type]}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
