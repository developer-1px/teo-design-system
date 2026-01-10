/**
 * TokenTableOfContents - 토큰 목차 (Pure IDDL)
 *
 * Sticky 사이드바로 카테고리 목록을 표시하고, 클릭 시 해당 섹션으로 스크롤합니다.
 */

import type { TokenCategory } from '@/apps/tokens/parser/types';
import { Group } from '@/components/types/Group/Group.tsx';
import { Action } from '@/components/types/Atom/Action/Action';
import { Text } from '@/components/types/Atom/Text/Text';

export function TokenTableOfContents({ categories }: { categories: TokenCategory[] }) {
  // Tier별로 그룹화
  const tierGroups = {
    primitive: categories.filter((c) => c.tier === 'primitive'),
    semantic: categories.filter((c) => c.tier === 'semantic'),
    component: categories.filter((c) => c.tier === 'component'),
  };

  const scrollToCategory = (categoryName: string) => {
    const id = `category-${categoryName.replace(/\s+/g, '-').toLowerCase()}`;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Group
      role="Container"
      layout="stack"
      gap={3}
      prominence="Standard"
      density="Standard"
      className="w-[280px] flex-shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-border-default bg-surface p-6"
    >
      {/* 헤더 */}
      <Group role="Container" layout="stack" gap={1}>
        <Text role="Title" prominence="Standard">
          Table of Contents
        </Text>
        <Text role="Caption" prominence="Subtle">
          {categories.length} categories
        </Text>
      </Group>

      {/* Tier 1: Primitive */}
      {tierGroups.primitive.length > 0 && (
        <Group role="Container" layout="stack" gap={2}>
          <Text role="Label" prominence="Standard">
            Tier 1: Primitive
          </Text>
          <Group role="List" layout="stack" gap={0}>
            {tierGroups.primitive.map((cat) => (
              <Action
                key={cat.name}
                label={`${cat.name} (${cat.tokens.length})`}
                prominence="Standard"
                intent="Neutral"
                onClick={() => scrollToCategory(cat.name)}
                className="w-full justify-start"
              />
            ))}
          </Group>
        </Group>
      )}

      {/* Tier 2: Semantic */}
      {tierGroups.semantic.length > 0 && (
        <Group role="Container" layout="stack" gap={2}>
          <Text role="Label" prominence="Standard">
            Tier 2: Semantic
          </Text>
          <Group role="List" layout="stack" gap={0}>
            {tierGroups.semantic.map((cat) => (
              <Action
                key={cat.name}
                label={`${cat.name} (${cat.tokens.length})`}
                prominence="Standard"
                intent="Neutral"
                onClick={() => scrollToCategory(cat.name)}
                className="w-full justify-start"
              />
            ))}
          </Group>
        </Group>
      )}

      {/* Tier 3: Component */}
      {tierGroups.component.length > 0 && (
        <Group role="Container" layout="stack" gap={2}>
          <Text role="Label" prominence="Standard">
            Tier 3: Component
          </Text>
          <Group role="List" layout="stack" gap={0}>
            {tierGroups.component.map((cat) => (
              <Action
                key={cat.name}
                label={`${cat.name} (${cat.tokens.length})`}
                prominence="Standard"
                intent="Neutral"
                onClick={() => scrollToCategory(cat.name)}
                className="w-full justify-start"
              />
            ))}
          </Group>
        </Group>
      )}

      {/* Footer */}
      <Group role="Container" layout="stack" gap={0} className="mt-auto">
        <Text role="Caption" prominence="Subtle">
          Auto-generated from themes.css
        </Text>
      </Group>
    </Group>
  );
}
