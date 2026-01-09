/**
 * Sidebar - Storybook-style Component Tree (Pure IDDL)
 *
 * Features:
 * - Search filter
 * - Component count
 * - Active selection highlight
 */

import { useState } from 'react';
import type { FileTreeNode } from '@/apps/showcase/widgets/parser/types';
import { Action } from '@/components/Item/Action/Action';
import { Field } from '@/components/Item/Field/Field';
import { Group } from '@/components/Group/Group.tsx';
import { Section } from '@/components/Section/Section.tsx';
import { Text } from '@/components/Item/Text/Text';

interface SidebarProps {
  fileTree: FileTreeNode[];
  selectedFile: string | null;
  onFileSelect: (path: string) => void;
}

export function Sidebar({ fileTree, selectedFile, onFileSelect }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter components by search query
  const filteredTree = searchQuery
    ? fileTree.filter((node) => node.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : fileTree;

  return (
    <Section role="Navigator" prominence="Secondary">
      {/* Search Header */}
      <Group role="Form" prominence="Secondary" gap={1}>
        <Field
          dataType="text"
          placeholder="Search components..."
          value={searchQuery}
          onChange={(value) => setSearchQuery(value as string)}
        />
      </Group>

      {/* Component Count */}
      <Group role="Container" prominence="Tertiary" gap={0}>
        <Text role="Caption" prominence="Tertiary">
          {filteredTree.length} of {fileTree.length} components
        </Text>
      </Group>

      {/* Component List */}
      <Section role="Container" prominence="Tertiary">
        {filteredTree.length === 0 ? (
          <Group role="Container" prominence="Tertiary">
            <Text role="Body" prominence="Tertiary">
              No components found
            </Text>
          </Group>
        ) : (
          <Group role="List" prominence="Tertiary" gap={0}>
            {filteredTree.map((node) => (
              <Action
                key={node.path}
                label={node.name}
                behavior={{ action: 'command', command: 'selectComponent' }}
                onClick={() => onFileSelect(node.path)}
                variant="list-item"
                prominence={selectedFile === node.path ? 'Primary' : 'Secondary'}
                intent={selectedFile === node.path ? 'Brand' : 'Neutral'}
              />
            ))}
          </Group>
        )}
      </Section>

      {/* Footer */}
      <Group role="Container" prominence="Tertiary" gap={0}>
        <Text role="Caption" prominence="Tertiary">
          IDDL 1.0.1 Atoms
        </Text>
        <Text role="Caption" prominence="Tertiary">
          Auto-generated
        </Text>
      </Group>
    </Section>
  );
}
