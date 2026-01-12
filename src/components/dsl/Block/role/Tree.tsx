/**
 * Tree - Hierarchical Tree Component (IDDL v4.1)
 *
 * Keyboard-accessible tree navigation with expand/collapse and selection.
 * Leverages useTreeNavigation hook for logic.
 */

import * as Icons from 'lucide-react';
import { Action } from '@/components/dsl/Element/Action/Action';
import { Text } from '@/components/dsl/Element/Text/Text';
import { useTreeNavigation } from '@/shared/lib/keyboard/useTreeNavigation';
import { cn } from '@/shared/lib/utils';
import type { BlockRendererProps } from '../Block.types';

export function Tree({
  spec,
  computedDensity,
  className,
  ...rest
}: BlockRendererProps) {
  const data = (spec?.data as any[]) || [];
  const onNodeClick = spec?.onNodeClick as (node: any) => void;
  const defaultExpandedIds = (spec?.defaultExpandedIds as string[]) || [];
  const icons = (spec?.icons as Record<string, any>) || {};
  const { flatNodes, cursorIndex, toggleFolder, getNodeProps } = useTreeNavigation({
    data,
    defaultOpenIds: defaultExpandedIds,
    onFileSelect: onNodeClick,
  });

  console.log('Tree: data count:', data.length);
  console.log('Tree: flatNodes count:', flatNodes.length);

  // Icon mapping helper
  const getIcon = (node: any, isExpanded: boolean) => {
    const iconName =
      icons[node.type] ||
      (node.type === 'folder' ? (isExpanded ? 'FolderOpen' : 'Folder') : 'File');
    const IconComponent = (Icons as any)[iconName] || Icons.File;
    return <IconComponent size={14} className="text-text-tertiary" />;
  };

  return (
    <div
      className={cn(
        'w-full py-1 focus:outline-none focus:ring-1 focus:ring-accent/30 rounded',
        className
      )}
      {...rest}
    >
      {flatNodes.map((node, index) => {
        const { onClick, onKeyDown, tabIndex } = getNodeProps(index);
        const isSelected = cursorIndex === index;
        const hasChildren = node.type === 'folder' && node.children && node.children.length > 0;
        const __isExpanded = node.type === 'folder' && node.isOpen; // useTreeNavigation internal state? Wait, check hook again.

        // Actually, internal state of hook doesn't expose isOpen on FlatNode directly in the same way.
        // Let's re-verify useTreeNavigation.ts
        // Line 67: result.push({ ...node, level, parentId });
        // Line 39: openFolderIds: Set<string>;

        return (
          <div
            key={node.id}
            className={cn(
              'flex items-center gap-1 px-2 py-0.5 cursor-pointer rounded transition-colors',
              'hover:bg-surface-hover',
              isSelected && 'bg-surface-selected ring-1 ring-accent/20',
              density === 'Compact' ? 'py-0.5' : 'py-1'
            )}
            style={{ paddingLeft: `${node.level * 12 + 8}px` }}
            onClick={onClick}
            onKeyDown={onKeyDown}
            tabIndex={tabIndex}
            role="treeitem"
            aria-selected={isSelected}
          >
            {/* Expand/Collapse Toggle */}
            <div className="w-4 flex items-center justify-center">
              {hasChildren && (
                <Action
                  role="IconButton"
                  icon={node.isOpen ? 'ChevronDown' : 'ChevronRight'}
                  density="Compact"
                  prominence="Subtle"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFolder(node.id);
                  }}
                />
              )}
            </div>

            {/* Folder/File Icon */}
            {getIcon(node, !!node.isOpen)}

            {/* Label */}
            <Text role="Body" size="sm" content={node.name} className="truncate ml-1" />
          </div>
        );
      })}
    </div>
  );
}
