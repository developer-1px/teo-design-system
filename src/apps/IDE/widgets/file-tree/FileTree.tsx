import {
  ChevronDown,
  ChevronRight,
  File,
  FileCode,
  FileJson,
  FileText,
  FileType,
  Folder,
  FolderOpen,
} from 'lucide-react';
import { useMemo } from 'react';
import { type TreeNode, useTreeNavigation } from '@/shared/lib/keyboard/useTreeNavigation.ts';
import { cn } from '@/lib/utils.ts';

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path?: string;
  children?: FileNode[];
  icon?: 'code' | 'json' | 'text' | 'markdown' | 'default';
  defaultOpen?: boolean;
}

const getFileIcon = (icon?: string) => {
  const iconProps = { size: 16, className: 'text-text-tertiary' };

  switch (icon) {
    case 'code':
      return <FileCode {...iconProps} />;
    case 'json':
      return <FileJson {...iconProps} />;
    case 'markdown':
      return <FileText {...iconProps} />;
    case 'text':
      return <FileType {...iconProps} />;
    default:
      return <File {...iconProps} />;
  }
};

interface FileTreeProps {
  data: FileNode[];
  onFileClick?: (path: string) => void;
}

// FileNode를 TreeNode로 변환
const convertToTreeNodes = (nodes: FileNode[]): TreeNode[] => {
  return nodes.map((node, index) => ({
    id: node.path || `${node.name}-${index}`,
    name: node.name,
    type: node.type,
    children: node.children ? convertToTreeNodes(node.children) : undefined,
    isOpen: node.defaultOpen,
    // 커스텀 속성 저장 (icon, path)
    ...(node.icon && { icon: node.icon }),
    ...(node.path && { path: node.path }),
  })) as TreeNode[];
};

export const FileTree = ({ data, onFileClick }: FileTreeProps) => {
  // FileNode를 TreeNode로 변환
  const treeData = useMemo(() => convertToTreeNodes(data), [data]);

  // 기본 열림 노드 ID 수집
  const defaultOpenIds = useMemo(() => {
    const ids: string[] = [];
    const collectOpenIds = (nodes: FileNode[], prefix = '') => {
      nodes.forEach((node, index) => {
        const id = node.path || `${prefix}${node.name}-${index}`;
        if (node.defaultOpen) {
          ids.push(id);
        }
        if (node.children) {
          collectOpenIds(node.children, `${id}/`);
        }
      });
    };
    collectOpenIds(data);
    return ids;
  }, [data]);

  // 트리 네비게이션 훅
  const { flatNodes, openFolderIds, getNodeProps } = useTreeNavigation({
    data: treeData,
    defaultOpenIds,
    onFileSelect: (node) => {
      if (onFileClick && 'path' in node && node.path) {
        onFileClick(node.path as string);
      }
    },
  });

  if (!data || data.length === 0) {
    return <div className="py-2 px-3 text-sm text-text-tertiary">No files found</div>;
  }

  return (
    <div className="py-2 focus-within:outline-none">
      {flatNodes.map((node, index) => {
        const isFolder = node.type === 'folder';
        const isOpen = openFolderIds.has(node.id);
        const isCursor = getNodeProps(index)['data-cursor'];
        const icon = 'icon' in node ? (node.icon as string) : undefined;

        return (
          <button
            key={node.id}
            {...getNodeProps(index)}
            className={cn(
              'flex w-full items-center gap-1.5 rounded-md py-1 text-sm',
              'hover:bg-layer-0 transition-colors',
              'text-text-secondary hover:text-text',
              'focus:outline-none',
              {
                'bg-accent/10 text-text': isCursor,
              }
            )}
            style={{
              paddingLeft: `${node.level * 16 + 8}px`,
              paddingRight: '8px',
            }}
          >
            {/* Chevron for folders */}
            <span className="flex-shrink-0 w-4 flex items-center justify-center">
              {isFolder && (
                <>
                  {isOpen ? (
                    <ChevronDown size={14} className="text-text-tertiary" />
                  ) : (
                    <ChevronRight size={14} className="text-text-tertiary" />
                  )}
                </>
              )}
            </span>

            {/* Folder/File icon */}
            <span className="flex-shrink-0">
              {isFolder ? (
                isOpen ? (
                  <FolderOpen size={16} className="text-text-secondary" />
                ) : (
                  <Folder size={16} className="text-text-tertiary" />
                )
              ) : (
                getFileIcon(icon)
              )}
            </span>

            {/* Name */}
            <span className="truncate">{node.name}</span>
          </button>
        );
      })}
    </div>
  );
};
