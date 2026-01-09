/**
 * TokenTableOfContents - 토큰 목차 (Table of Contents)
 *
 * Sticky 사이드바로 카테고리 목록을 표시하고, 클릭 시 해당 섹션으로 스크롤합니다.
 * Figma Tokens, Material Design 스타일의 목차 네비게이션
 */

import { Section } from '@/components/Section/Section.tsx';
import { Group } from '@/components/Group/Group.tsx';
import { Action } from '@/components/Action/Action';
import { Text } from '@/components/Text/Text';
import type { TokenCategory } from '@/apps/tokens/parser/types';

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
    <div
      style={{
        width: '280px',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        borderRight: '1px solid var(--color-border-default)',
        backgroundColor: 'var(--color-surface)',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      {/* 헤더 */}
      <Group role="Container" prominence="Primary" gap={0}>
        <Text role="Title" prominence="Primary">
          Table of Contents
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
                behavior={{ action: 'command', command: 'scrollToCategory' }}
                onClick={() => scrollToCategory(cat.name)}
                variant="list-item"
                prominence="Secondary"
                intent="Neutral"
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
                behavior={{ action: 'command', command: 'scrollToCategory' }}
                onClick={() => scrollToCategory(cat.name)}
                variant="list-item"
                prominence="Secondary"
                intent="Neutral"
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
                behavior={{ action: 'command', command: 'scrollToCategory' }}
                onClick={() => scrollToCategory(cat.name)}
                variant="list-item"
                prominence="Secondary"
                intent="Neutral"
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
    </div>
  );
}
