/**
 * TokenGrid - 토큰 그리드 레이아웃
 *
 * 선택된 카테고리의 토큰들을 그리드로 표시합니다.
 * 디자인 시스템 서비스 스타일: 복사 기능, 코드 스니펫, 사용 예시
 */

import { Section } from '@/components/dsl/Section';
import { Group } from '@/components/dsl/Group';
import { Text } from '@/components/atoms/Text';
import { Action } from '@/components/dsl/Action';
import { ColorToken } from './ColorToken';
import { SpacingToken } from './SpacingToken';
import { RadiusToken } from './RadiusToken';
import { ShadowToken } from './ShadowToken';
import type { TokenCategory } from '@/apps/tokens/parser/types';

export function TokenGrid({ category }: { category?: TokenCategory }) {
  if (!category) {
    return (
      <Section role="Container" prominence="Tertiary">
        <Group role="Container" prominence="Tertiary">
          <Text role="Body" prominence="Tertiary">
            Select a category to view tokens
          </Text>
        </Group>
      </Section>
    );
  }

  return (
    <Section role="Container" prominence="Primary">
      {/* 카테고리 헤더 */}
      <Group role="Container" prominence="Primary" gap={2}>
        <Group role="Container" prominence="Primary" gap={1}>
          <Text role="Title" prominence="Primary">
            {category.name}
          </Text>
          <Group role="Container" prominence="Tertiary" gap={0}>
            <Text role="Caption" prominence="Tertiary">
              Tier: {category.tier.charAt(0).toUpperCase() + category.tier.slice(1)} | Type:{' '}
              {category.type} | Tokens: {category.tokens.length}
            </Text>
            {category.description && (
              <Text role="Caption" prominence="Tertiary">
                {category.description}
              </Text>
            )}
          </Group>
        </Group>

        {/* 카테고리 설명 */}
        <Group role="Container" prominence="Secondary" gap={1}>
          <Text role="Label" prominence="Secondary">
            Usage Guide
          </Text>
          <Text role="Body" prominence="Secondary">
            {getTierDescription(category.tier)}
          </Text>
          {category.type === 'color' && (
            <Group role="Container" prominence="Tertiary" gap={0}>
              <Text role="Caption" prominence="Tertiary">
                💡 Tip: Click any color swatch to copy the token name to clipboard
              </Text>
            </Group>
          )}
        </Group>
      </Group>

      {/* 토큰 그리드 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1rem',
          marginTop: '1rem',
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
                  <Action
                    label="Copy"
                    prominence="Secondary"
                    intent="Neutral"
                    onClick={() => copyToClipboard(token.name)}
                  />
                </Group>
              );
          }
        })}
      </div>
    </Section>
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

/**
 * 클립보드 복사 헬퍼
 */
function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log(`[TokenGrid] ✅ Copied to clipboard: ${text}`);
        // TODO: Toast 알림 추가 (Phase 2에서 구현)
      },
      (err) => {
        console.error('[TokenGrid] ❌ Failed to copy:', err);
      }
    );
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      console.log(`[TokenGrid] ✅ Copied to clipboard (fallback): ${text}`);
    } catch (err) {
      console.error('[TokenGrid] ❌ Failed to copy (fallback):', err);
    }
    document.body.removeChild(textArea);
  }
}
