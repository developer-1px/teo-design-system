import { useState } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  FileCode,
  FileJson,
  FileType,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path?: string;
  children?: FileNode[];
  icon?: 'code' | 'json' | 'text' | 'markdown' | 'default';
  defaultOpen?: boolean;
}

interface FileTreeItemProps {
  node: FileNode;
  level: number;
  onFileClick?: (path: string) => void;
}

const getFileIcon = (node: FileNode) => {
  if (node.type === 'folder') {
    return null;
  }

  const iconProps = { size: 16, className: 'text-text-tertiary' };

  switch (node.icon) {
    case 'code':
      return <FileCode {...iconProps} />;
    case 'json':
      return <FileJson {...iconProps} />;
    case 'markdown':
      return <FileText {...iconProps} className="text-accent" />;
    case 'text':
      return <FileType {...iconProps} />;
    default:
      return <File {...iconProps} />;
  }
};

const FileTreeItem = ({ node, level, onFileClick }: FileTreeItemProps) => {
  const [isOpen, setIsOpen] = useState(node.defaultOpen ?? false);
  const isFolder = node.type === 'folder';

  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else if (onFileClick && node.path) {
      onFileClick(node.path);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          // Dense padding, rounded, no borders - using layer system
          'flex w-full items-center gap-1.5 rounded-md py-1 text-sm',
          'layer-2-interactive',
          'text-text-secondary hover:text-text',
          {
            'cursor-pointer': isFolder,
            'cursor-default': !isFolder,
          }
        )}
        style={{ paddingLeft: `${level * 16 + 8}px`, paddingRight: '8px' }}
      >
        {/* Chevron for folders - fixed width to align files and folders */}
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
              <FolderOpen size={16} className="text-accent" />
            ) : (
              <Folder size={16} className="text-text-tertiary" />
            )
          ) : (
            getFileIcon(node)
          )}
        </span>

        {/* Name */}
        <span className="truncate">{node.name}</span>
      </button>

      {/* Children */}
      {isFolder && isOpen && node.children && (
        <div>
          {node.children.map((child, index) => (
            <FileTreeItem
              key={index}
              node={child}
              level={level + 1}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface FileTreeProps {
  data: FileNode[];
  onFileClick?: (path: string) => void;
}

export const FileTree = ({ data, onFileClick }: FileTreeProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="py-2 px-3 text-sm text-text-tertiary">
        No files found
      </div>
    );
  }

  return (
    <div className="py-2">
      {data.map((node, index) => (
        <FileTreeItem
          key={index}
          node={node}
          level={0}
          onFileClick={onFileClick}
        />
      ))}
    </div>
  );
};
