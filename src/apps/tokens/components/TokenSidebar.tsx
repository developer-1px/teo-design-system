/**
 * TokenSidebar - 카테고리 네비게이션
 *
 * Tier별로 그룹화된 토큰 카테고리 목록을 표시합니다.
 */

import type { TokenCategory } from '@/apps/tokens/parser/types';
import { Group } from '@/components/types/Group/Group.tsx';
import { Action } from '@/components/types/Atom/Action/Action';
import { Text } from '@/components/types/Atom/Text/Text';
import { Section } from '@/components/types/Section/Section.tsx';

export function TokenSidebar({
  categories,
  selectedCategory,
  onSelect,
}: {
  categories: TokenCategory[];
  selectedCategory: string | null;
  onSelect: (name: string) => void;
}) {
  // Tier별로 그룹화
  const tierGroups = {
    primitive: categories.filter((c) => c.tier === 'primitive'),
    semantic: categories.filter((c) => c.tier === 'semantic'),
    component: categories.filter((c) => c.tier === 'component'),
  };

  return (
    <Section role="Navigator">
      {/* 헤더 */}
      <Group role="Container" gap={1}>
        <Text role="Title" content="Categories" />
        <Text role="Caption" prominence="Subtle">
          {categories.length} categories
        </Text>
      </Group>

      {/* Tier 1: Primitive */}
      {tierGroups.primitive.length > 0 && (
        <Group role="Container" gap={1}>
          <Text role="Label" content="Tier 1: Primitive" />
          <Group role="List" gap={0}>
            {tierGroups.primitive.map((cat) => (
              <Action
                key={cat.name}
                label={`${cat.name} (${cat.tokens.length})`}
                behavior={{ action: 'command', command: 'selectCategory' }}
                onClick={() => onSelect(cat.name)}
                variant="list-item"
                prominence={selectedCategory === cat.name ? 'Standard' : 'Standard'}
                intent={selectedCategory === cat.name ? 'Brand' : 'Neutral'}
              />
            ))}
          </Group>
        </Group>
      )}

      {/* Tier 2: Semantic */}
      {tierGroups.semantic.length > 0 && (
        <Group role="Container" gap={1}>
          <Text role="Label" content="Tier 2: Semantic" />
          <Group role="List" gap={0}>
            {tierGroups.semantic.map((cat) => (
              <Action
                key={cat.name}
                label={`${cat.name} (${cat.tokens.length})`}
                behavior={{ action: 'command', command: 'selectCategory' }}
                onClick={() => onSelect(cat.name)}
                variant="list-item"
                prominence={selectedCategory === cat.name ? 'Standard' : 'Standard'}
                intent={selectedCategory === cat.name ? 'Brand' : 'Neutral'}
              />
            ))}
          </Group>
        </Group>
      )}

      {/* Tier 3: Component */}
      {tierGroups.component.length > 0 && (
        <Group role="Container" gap={1}>
          <Text role="Label" content="Tier 3: Component" />
          <Group role="List" gap={0}>
            {tierGroups.component.map((cat) => (
              <Action
                key={cat.name}
                label={`${cat.name} (${cat.tokens.length})`}
                behavior={{ action: 'command', command: 'selectCategory' }}
                onClick={() => onSelect(cat.name)}
                variant="list-item"
                prominence={selectedCategory === cat.name ? 'Standard' : 'Standard'}
                intent={selectedCategory === cat.name ? 'Brand' : 'Neutral'}
              />
            ))}
          </Group>
        </Group>
      )}

      {/* Footer */}
      <Group role="Container" gap={0}>
        <Text role="Caption" prominence="Subtle">
          Auto-generated from themes.css
        </Text>
      </Group>
    </Section>
  );
}
