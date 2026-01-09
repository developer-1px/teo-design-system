/**
 * TokenCategorySection - 토큰 카테고리 섹션
 *
 * 각 카테고리의 토큰들을 그리드로 표시합니다.
 * 전체 스크롤 페이지에서 사용되는 섹션 컴포넌트
 */

import { Group } from '@/components/Group/Group.tsx';
import { Text } from '@/components/Text/Text';
import { ColorToken } from './ColorToken';
import { SpacingToken } from './SpacingToken';
import { RadiusToken } from './RadiusToken';
import { ShadowToken } from './ShadowToken';
import type { TokenCategory } from '@/apps/tokens/parser/types';

export function TokenCategorySection({ category }: { category: TokenCategory }) {
  return (
    <section
      id={`category-${category.name.replace(/\s+/g, '-').toLowerCase()}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid var(--color-border-muted)',
      }}
    >
      {/* 섹션 헤더 (compact) */}
      <div>
        <Text role="Title" prominence="Hero" className="text-lg font-semibold mb-1">
          {category.name}
        </Text>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          <Text role="Caption" prominence="Secondary" className="text-xs">
            <span style={{ fontWeight: 600 }}>Tier:</span>{' '}
            {category.tier.charAt(0).toUpperCase() + category.tier.slice(1)}
          </Text>
          <Text role="Caption" prominence="Secondary" className="text-xs">
            <span style={{ fontWeight: 600 }}>Type:</span> {category.type}
          </Text>
          <Text role="Caption" prominence="Secondary" className="text-xs">
            <span style={{ fontWeight: 600 }}>Count:</span> {category.tokens.length}
          </Text>
        </div>
        <Text role="Caption" prominence="Tertiary" className="text-xs">
          {getTierDescription(category.tier)}
        </Text>
      </div>

      {/* 토큰 그리드 (더 compact) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '0.75rem',
        }}
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
                <Group key={token.name} role="Card" prominence="Primary" gap={1}>
                  <Text role="Label" prominence="Primary">
                    {token.name}
                  </Text>
                  <Text role="Caption" prominence="Tertiary">
                    {token.resolvedValue}
                  </Text>
                </Group>
              );
          }
        })}
      </div>
    </section>
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
