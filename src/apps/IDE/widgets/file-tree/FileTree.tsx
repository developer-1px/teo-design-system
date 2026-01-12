import { Frame } from '@/components/dsl/shared/Frame';
import { useMemo } from 'react';
import type { FileNode } from '@/apps/IDE/lib/file-loader';
import { Block } from '@/components/dsl/Block/Block';
import { Text } from '@/components/dsl/Element/Text/Text';
import type { TreeNode } from '@/shared/lib/keyboard/useTreeNavigation';

interface FileTreeProps {
  data: FileNode[];
  onFileClick: (path: string) => void;
}

export function FileTree({ data, onFileClick }: FileTreeProps) {
  // Convert FileNode to TreeNode for IDDL Block role="Tree"
  const treeNodes = useMemo(() => {
    const convert = (nodes: FileNode[]): TreeNode[] => {
      return nodes.map((node, index) => ({
        id: node.path || `${node.name}-${index}`,
        name: node.name,
        type: node.type,
        children: node.children ? convert(node.children) : undefined,
        isOpen: node.defaultOpen,
        path: node.path,
        icon: node.icon,
      })) as TreeNode[];
    };
    return convert(data);
  }, [data]);

  return (
    <Frame.Stack className="h-full">
      <Block role="Toolbar" density="Compact" className="px-3 border-b border-border-default">
        <Text
          role="Caption"
          prominence="Subtle"
          content="EXPLORER"
          className="font-bold tracking-widest"
        />
      </Block>
      <Block role="ScrollArea" className="flex-1">
        <Block
          role="Tree"
          spec={{
            data: treeNodes,
            defaultExpandedIds: ['/src', '/src/apps', '/src/apps/IDE', '/src/docs'],
            onNodeClick: (node: any) => {
              if (node.type === 'file' && node.path) {
                onFileClick(node.path);
              }
            },
            selectable: true,
          }}
        />
      </Block>
    </Frame.Stack>
  );
}
