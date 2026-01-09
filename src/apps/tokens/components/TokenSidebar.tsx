/**
 * TokenSidebar - 카테고리 네비게이션
 *
 * Tier별로 그룹화된 토큰 카테고리 목록을 표시합니다.
 */

import type { TokenCategory } from '@/apps/tokens/parser/types';
import { Action } from '@/components/Item/Action/Action';
import { Group } from '@/components/Group/Group.tsx';
import { Section } from '@/components/Section/Section.tsx';
import { Text } from '@/components/Item/Text/Text';

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
    <Section role="Navigator" prominence="Secondary">
      {/* 헤더 */}
      <Group role="Container" prominence="Primary" gap={1}>
        <Text role="Title" prominence="Primary">
          Categories
        </Text>
        <Text role="Caption" prominence="Tertiary">
          {categories.length} categories
        </Text>
      </Group>

      {/* Tier 1: Primitive */}
      {tierGroups.primitive.length > 0 && (
        <Group role="Container" prominence="Secondary" gap={1}>
          <Text role="Label" prominence="Secondary">
            Tier 1: Primitive
          </Text>
          <Group role="List" prominence="Tertiary" gap={0}>
            {tierGroups.primitive.map((cat) => (
              <Action
                key={cat.name}
                label={`${cat.name} (${cat.tokens.length})`}
                behavior={{ action: 'command', command: 'selectCategory' }}
                onClick={() => onSelect(cat.name)}
                variant="list-item"
                prominence={selectedCategory === cat.name ? 'Primary' : 'Secondary'}
                intent={selectedCategory === cat.name ? 'Brand' : 'Neutral'}
              />
            ))}
          </Group>
        </Group>
      )}

      {/* Tier 2: Semantic */}
      {tierGroups.semantic.length > 0 && (
        <Group role="Container" prominence="Secondary" gap={1}>
          <Text role="Label" prominence="Secondary">
            Tier 2: Semantic
          </Text>
          <Group role="List" prominence="Tertiary" gap={0}>
            {tierGroups.semantic.map((cat) => (
              <Action
                key={cat.name}
                label={`${cat.name} (${cat.tokens.length})`}
                behavior={{ action: 'command', command: 'selectCategory' }}
                onClick={() => onSelect(cat.name)}
                variant="list-item"
                prominence={selectedCategory === cat.name ? 'Primary' : 'Secondary'}
                intent={selectedCategory === cat.name ? 'Brand' : 'Neutral'}
              />
            ))}
          </Group>
        </Group>
      )}

      {/* Tier 3: Component */}
      {tierGroups.component.length > 0 && (
        <Group role="Container" prominence="Secondary" gap={1}>
          <Text role="Label" prominence="Secondary">
            Tier 3: Component
          </Text>
          <Group role="List" prominence="Tertiary" gap={0}>
            {tierGroups.component.map((cat) => (
              <Action
                key={cat.name}
                label={`${cat.name} (${cat.tokens.length})`}
                behavior={{ action: 'command', command: 'selectCategory' }}
                onClick={() => onSelect(cat.name)}
                variant="list-item"
                prominence={selectedCategory === cat.name ? 'Primary' : 'Secondary'}
                intent={selectedCategory === cat.name ? 'Brand' : 'Neutral'}
              />
            ))}
          </Group>
        </Group>
      )}

      {/* Footer */}
      <Group role="Container" prominence="Tertiary" gap={0}>
        <Text role="Caption" prominence="Tertiary">
          Auto-generated from themes.css
        </Text>
      </Group>
    </Section>
  );
}
