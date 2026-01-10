/**
 * TokenCategorySection - 토큰 카테고리 섹션 (Pure IDDL)
 *
 * 각 카테고리의 토큰들을 그리드로 표시합니다.
 */

import type { TokenCategory } from '@/apps/tokens/parser/types';
import { Group } from '@/components/types/Group/Group.tsx';
import { Text } from '@/components/types/Atom/Text/Text';
import { ColorToken } from './ColorToken';
import { RadiusToken } from './RadiusToken';
import { ShadowToken } from './ShadowToken';
import { SpacingToken } from './SpacingToken';

export function TokenCategorySection({ category }: { category: TokenCategory }) {
  return (
    <Group
      role="Container"
      layout="stack"
      gap={2}
      prominence="Standard"
      density="Standard"
      id={`category-${category.name.replace(/\s+/g, '-').toLowerCase()}`}
      className="pb-6 border-b border-border-muted"
    >
      {/* 섹션 헤더 */}
      <Group role="Container" layout="stack" gap={1}>
        <Text role="Title" prominence="Hero" className="text-lg font-semibold">
          {category.name}
        </Text>
        <Group role="Container" layout="inline" gap={2} className="flex-wrap">
          <Text role="Caption" prominence="Subtle" className="text-xs">
            <span className="font-semibold">Tier:</span>{' '}
            {category.tier.charAt(0).toUpperCase() + category.tier.slice(1)}
          </Text>
          <Text role="Caption" prominence="Subtle" className="text-xs">
            <span className="font-semibold">Type:</span> {category.type}
          </Text>
          <Text role="Caption" prominence="Subtle" className="text-xs">
            <span className="font-semibold">Count:</span> {category.tokens.length}
          </Text>
        </Group>
        <Text role="Caption" prominence="Subtle" className="text-xs">
          {getTierDescription(category.tier)}
        </Text>
      </Group>

      {/* 토큰 그리드 */}
      <Group
        role="Grid"
        layout="grid"
        gap={2}
        prominence="Standard"
        className="grid-cols-[repeat(auto-fill,minmax(200px,1fr))]"
      >
        {category.tokens.map((token) => {
          switch (category.type) {
            case 'color':
              return <ColorToken key={token.name} token={token} />;
            case 'spacing':
              return <SpacingToken key={token.name} token={token} />;
            case 'radius':
              return <RadiusToken key={token.name} token={token} />;
            case 'shadow':
              return <ShadowToken key={token.name} token={token} />;
            default:
              return (
                <Group key={token.name} role="Card" layout="stack" gap={1} prominence="Standard">
                  <Text role="Label" prominence="Standard">
                    {token.name}
                  </Text>
                  <Text role="Caption" prominence="Subtle">
                    {token.resolvedValue}
                  </Text>
                </Group>
              );
          }
        })}
      </Group>
    </Group>
  );
}

/**
 * Tier별 설명 텍스트
 */
function getTierDescription(tier: string): string {
  switch (tier) {
    case 'primitive':
      return 'Primitive tokens are the foundation of the design system. They define raw values like colors, sizes, and spacing that are referenced by semantic tokens.';
    case 'semantic':
      return 'Semantic tokens map primitive tokens to specific purposes (e.g., surface-base, text-primary). Use these in components for consistent theming.';
    case 'component':
      return 'Component tokens are pre-configured values for specific UI elements (e.g., button-bg-primary, input-border). Use these for rapid component development.';
    default:
      return '';
  }
}
