/**
 * DSL Builder Utilities
 *
 * 트리 조작을 위한 유틸리티 함수들
 */

import type { AnyDSLNode, DSLNodeType } from './types';

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `node-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Find node by ID in tree
 */
export function findNodeById(tree: AnyDSLNode, id: string): AnyDSLNode | null {
  if (tree.id === id) return tree;

  if ('children' in tree && tree.children) {
    for (const child of tree.children) {
      const found = findNodeById(child, id);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Find parent node by child ID
 */
export function findParentNode(tree: AnyDSLNode, childId: string): AnyDSLNode | null {
  if ('children' in tree && tree.children) {
    for (const child of tree.children) {
      if (child.id === childId) return tree;

      const found = findParentNode(child, childId);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Add child node to parent
 */
export function addChildNode(tree: AnyDSLNode, parentId: string, child: AnyDSLNode): AnyDSLNode {
  if (tree.id === parentId && 'children' in tree) {
    return {
      ...tree,
      children: [...(tree.children || []), child],
    } as AnyDSLNode;
  }

  if ('children' in tree && tree.children) {
    return {
      ...tree,
      children: tree.children.map((c) => addChildNode(c, parentId, child)),
    } as AnyDSLNode;
  }

  return tree;
}

/**
 * Remove node by ID
 */
export function removeNode(tree: AnyDSLNode, nodeId: string): AnyDSLNode | null {
  if (tree.id === nodeId) return null;

  if ('children' in tree && tree.children) {
    return {
      ...tree,
      children: tree.children
        .map((c) => removeNode(c, nodeId))
        .filter((c): c is AnyDSLNode => c !== null),
    } as AnyDSLNode;
  }

  return tree;
}

/**
 * Update node by ID
 */
export function updateNode(
  tree: AnyDSLNode,
  nodeId: string,
  updates: Partial<AnyDSLNode>
): AnyDSLNode {
  if (tree.id === nodeId) {
    return { ...tree, ...updates } as AnyDSLNode;
  }

  if ('children' in tree && tree.children) {
    return {
      ...tree,
      children: tree.children.map((c) => updateNode(c, nodeId, updates)),
    } as AnyDSLNode;
  }

  return tree;
}

/**
 * Move node from one parent to another
 */
export function moveNode(tree: AnyDSLNode, nodeId: string, newParentId: string): AnyDSLNode {
  const node = findNodeById(tree, nodeId);
  if (!node) return tree;

  // Remove from current position
  let newTree = removeNode(tree, nodeId);
  if (!newTree) return tree;

  // Add to new position
  newTree = addChildNode(newTree, newParentId, node);

  return newTree;
}

/**
 * Can node accept children of given type?
 */
export function canAcceptChild(parentType: DSLNodeType, childType: DSLNodeType): boolean {
  const rules: Record<DSLNodeType, DSLNodeType[]> = {
    page: ['region'],
    region: ['section', 'overlay'],
    section: ['group', 'section'],
    overlay: ['section', 'group'],
    group: ['text', 'field', 'action', 'group'],
    text: [],
    field: [],
    action: [],
  };

  return rules[parentType]?.includes(childType) ?? false;
}

/**
 * Create default node by type
 */
export function createDefaultNode(type: DSLNodeType): AnyDSLNode {
  const id = generateId();

  switch (type) {
    case 'page':
      return { id, type: 'page', children: [] };
    case 'region':
      return { id, type: 'region', role: 'main', children: [] };
    case 'section':
      return { id, type: 'section', prominence: 'Primary', children: [] };
    case 'overlay':
      return { id, type: 'overlay', role: 'Dialog', prominence: 'Hero', children: [] };
    case 'group':
      return { id, type: 'group', role: 'Container', children: [] };
    case 'text':
      return { id, type: 'text', role: 'Body', prominence: 'Primary', content: 'New Text' };
    case 'field':
      return {
        id,
        type: 'field',
        label: 'Field',
        model: 'data.field',
        dataType: 'text',
        prominence: 'Primary',
      };
    case 'action':
      return {
        id,
        type: 'action',
        label: 'Button',
        prominence: 'Primary',
        behavior: { action: 'command', command: 'noop' },
      };
    default:
      throw new Error(`Unknown node type: ${type}`);
  }
}

/**
 * Clone node (deep copy with new IDs)
 */
export function cloneNode(node: AnyDSLNode): AnyDSLNode {
  const newNode = { ...node, id: generateId() };

  if ('children' in newNode && newNode.children) {
    newNode.children = newNode.children.map(cloneNode);
  }

  return newNode as AnyDSLNode;
}
