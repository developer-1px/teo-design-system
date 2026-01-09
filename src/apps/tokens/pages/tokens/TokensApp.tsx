/**
 * TokensApp - Design Token Viewer
 *
 * themes.css를 파싱하여 Design Token을 자동으로 시각화합니다.
 * 디자인 시스템 서비스(Figma Tokens, Material Design) 스타일의 전문적인 UI
 * 전체 스크롤 방식으로 모든 토큰을 한 페이지에 표시
 */

import { useState, useEffect, useMemo } from 'react';
import { Page } from '@/components/dsl/Page';
import { Section } from '@/components/dsl/Section';
import { Group } from '@/components/dsl/Group';
import { Text } from '@/components/atoms/Text';
import { Field } from '@/components/dsl/Field';
import { parseCSSTokens } from '@/apps/tokens/parser/cssParser';
import { TokenCategorySection } from '@/apps/tokens/components/TokenCategorySection';
import { TokenTableOfContents } from '@/apps/tokens/components/TokenTableOfContents';
import type { TokenCategory } from '@/apps/tokens/parser/types';

// import.meta.glob으로 themes.css 로드
const cssModules = import.meta.glob('/src/styles/themes.css', {
  query: '?raw',
  import: 'default',
});

export function TokensApp() {
  const [categories, setCategories] = useState<TokenCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // themes.css 로드 및 파싱
  useEffect(() => {
    async function loadTokens() {
      try {
        console.log('[TokensApp] 🔄 Loading themes.css...');

        // import.meta.glob으로 로드된 모듈들 순회
        for (const [path, loader] of Object.entries(cssModules)) {
          console.log(`[TokensApp] 📄 Loading ${path}`);
          const cssContent = (await loader()) as string;
          console.log(`[TokensApp] 📝 CSS length: ${cssContent.length} characters`);

          // CSS 파싱
          const parsed = parseCSSTokens(cssContent);
          console.log(`[TokensApp] ✅ Parsed ${parsed.length} categories`);
          console.log('[TokensApp] Categories:', parsed.map((c) => c.name));

          setCategories(parsed);
        }

        setLoading(false);
      } catch (err) {
        console.error('[TokensApp] ❌ Error loading tokens:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    }

    loadTokens();
  }, []);

  // 검색 필터링
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;

    return categories
      .map((category) => ({
        ...category,
        tokens: category.tokens.filter(
          (token) =>
            token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            token.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
            token.resolvedValue.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((category) => category.tokens.length > 0);
  }, [categories, searchQuery]);

  // 통계 계산
  const stats = useMemo(() => {
    const totalTokens = categories.reduce((sum, cat) => sum + cat.tokens.length, 0);
    const primitiveCount = categories
      .filter((c) => c.tier === 'primitive')
      .reduce((sum, cat) => sum + cat.tokens.length, 0);
    const semanticCount = categories
      .filter((c) => c.tier === 'semantic')
      .reduce((sum, cat) => sum + cat.tokens.length, 0);
    const componentCount = categories
      .filter((c) => c.tier === 'component')
      .reduce((sum, cat) => sum + cat.tokens.length, 0);

    const colorCount = categories
      .filter((c) => c.type === 'color')
      .reduce((sum, cat) => sum + cat.tokens.length, 0);
    const spacingCount = categories
      .filter((c) => c.type === 'spacing')
      .reduce((sum, cat) => sum + cat.tokens.length, 0);
    const radiusCount = categories
      .filter((c) => c.type === 'radius')
      .reduce((sum, cat) => sum + cat.tokens.length, 0);
    const shadowCount = categories
      .filter((c) => c.type === 'shadow')
      .reduce((sum, cat) => sum + cat.tokens.length, 0);

    return {
      total: totalTokens,
      byTier: { primitive: primitiveCount, semantic: semanticCount, component: componentCount },
      byType: { color: colorCount, spacing: spacingCount, radius: radiusCount, shadow: shadowCount },
    };
  }, [categories]);

  if (loading) {
    return (
      <Page layout="full">
        <Section role="Container" prominence="Primary">
          <Group role="Container" prominence="Primary">
            <Text role="Body" prominence="Primary">
              Loading design tokens...
            </Text>
          </Group>
        </Section>
      </Page>
    );
  }

  if (error) {
    return (
      <Page layout="full">
        <Section role="Container" prominence="Primary">
          <Group role="Container" prominence="Primary">
            <Text role="Title" prominence="Primary" intent="Critical">
              Error Loading Tokens
            </Text>
            <Text role="Body" prominence="Secondary">
              {error}
            </Text>
          </Group>
        </Section>
      </Page>
    );
  }

  return (
    <Page
      layout="full"
      title="Design Tokens"
      description="3-Tier token architecture for consistent design system. Primitive tokens define raw values, semantic tokens map to purposes, and component tokens are pre-configured for UI elements."
    >
      {/* 통계 대시보드 */}
      <Section role="Container" prominence="Secondary">
        <Group role="Container" prominence="Primary" gap={2}>
          {/* 전체 통계 */}
          <Group role="Container" prominence="Primary" gap={1}>
            <Text role="Label" prominence="Secondary">
              Overview
            </Text>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <StatCard label="Total Tokens" value={stats.total} />
              <StatCard label="Categories" value={categories.length} />
              <StatCard label="Colors" value={stats.byType.color} />
              <StatCard label="Spacing" value={stats.byType.spacing} />
              <StatCard label="Radius" value={stats.byType.radius} />
              <StatCard label="Shadows" value={stats.byType.shadow} />
            </div>
          </Group>

          {/* Tier별 분포 */}
          <Group role="Container" prominence="Primary" gap={1}>
            <Text role="Label" prominence="Secondary">
              Token Tiers
            </Text>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <TierCard label="Tier 1: Primitive" value={stats.byTier.primitive} color="#10b981" />
              <TierCard label="Tier 2: Semantic" value={stats.byTier.semantic} color="#3b82f6" />
              <TierCard label="Tier 3: Component" value={stats.byTier.component} color="#a855f7" />
            </div>
          </Group>

          {/* 검색 필드 */}
          <Group role="Form" prominence="Secondary" gap={1}>
            <Field
              dataType="text"
              placeholder="Search tokens by name or value..."
              value={searchQuery}
              onChange={(value) => setSearchQuery(value as string)}
            />
            {searchQuery && (
              <Text role="Caption" prominence="Tertiary">
                Found {filteredCategories.reduce((sum, cat) => sum + cat.tokens.length, 0)} tokens
                in {filteredCategories.length} categories
              </Text>
            )}
          </Group>
        </Group>
      </Section>

      {/* 메인 콘텐츠: 목차 + 전체 토큰 스크롤 */}
      <Section role="SplitContainer" prominence="Primary">
        {/* 왼쪽: Sticky 목차 */}
        <TokenTableOfContents categories={filteredCategories} />

        {/* 오른쪽: 전체 토큰 섹션 (스크롤) */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
          }}
        >
          {filteredCategories.map((category) => (
            <TokenCategorySection key={category.name} category={category} />
          ))}

          {filteredCategories.length === 0 && (
            <Group role="Container" prominence="Tertiary">
              <Text role="Body" prominence="Tertiary">
                No tokens found matching "{searchQuery}"
              </Text>
            </Group>
          )}
        </div>
      </Section>
    </Page>
  );
}

/**
 * StatCard - 통계 카드 컴포넌트
 */
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Group role="Card" prominence="Secondary" gap={0}>
      <Text role="Caption" prominence="Tertiary">
        {label}
      </Text>
      <Text role="Title" prominence="Primary">
        {value}
      </Text>
    </Group>
  );
}

/**
 * TierCard - Tier별 통계 카드 (색상 강조)
 */
function TierCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Group role="Card" prominence="Secondary" gap={0}>
      <div
        style={{
          width: '100%',
          height: '4px',
          backgroundColor: color,
          borderRadius: '2px',
          marginBottom: '0.5rem',
        }}
      />
      <Text role="Caption" prominence="Tertiary">
        {label}
      </Text>
      <Text role="Title" prominence="Primary">
        {value}
      </Text>
    </Group>
  );
}
