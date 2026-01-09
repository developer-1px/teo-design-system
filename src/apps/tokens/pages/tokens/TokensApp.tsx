/**
 * TokensApp - Design Token Viewer (Pure IDDL)
 *
 * themes.css를 파싱하여 Design Token을 자동으로 시각화합니다.
 * 디자인 시스템 서비스(Figma Tokens, Material Design) 스타일의 전문적인 UI
 * 전체 스크롤 방식으로 모든 토큰을 한 페이지에 표시
 */

import { useEffect, useMemo, useState } from 'react';
import { TokenCategorySection } from '@/apps/tokens/components/TokenCategorySection';
import { TokenTableOfContents } from '@/apps/tokens/components/TokenTableOfContents';
import { parseCSSTokens } from '@/apps/tokens/parser/cssParser';
import type { TokenCategory } from '@/apps/tokens/parser/types';
import { Group } from '@/components/types/Group/Group.tsx';
import { Field } from '@/components/types/Atom/Field/Field';
import { Text } from '@/components/types/Atom/Text/Text';
import { Page } from '@/components/types/Page/Page.tsx';
import { Section } from '@/components/types/Section/Section.tsx';

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
          console.log(
            '[TokensApp] Categories:',
            parsed.map((c) => c.name)
          );

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
      byType: {
        color: colorCount,
        spacing: spacingCount,
        radius: radiusCount,
        shadow: shadowCount,
      },
    };
  }, [categories]);

  if (loading) {
    return (
      <Page role="App" layout="flex" direction="column">
        <Section role="Container" prominence="Standard" density="Standard">
          <Group role="Container" layout="stack" gap={2}>
            <Text role="Body" prominence="Standard">
              Loading design tokens...
            </Text>
          </Group>
        </Section>
      </Page>
    );
  }

  if (error) {
    return (
      <Page role="App" layout="flex" direction="column">
        <Section role="Container" prominence="Standard" density="Standard">
          <Group role="Container" layout="stack" gap={2}>
            <Text role="Title" prominence="Hero" intent="Critical">
              Error Loading Tokens
            </Text>
            <Text role="Body" prominence="Standard">
              {error}
            </Text>
          </Group>
        </Section>
      </Page>
    );
  }

  return (
    <Page
      role="App"
      layout="flex"
      direction="column"
      title="Design Tokens"
      description="3-Tier token architecture for consistent design system. Primitive tokens define raw values, semantic tokens map to purposes, and component tokens are pre-configured for UI elements."
      prominence="Standard"
      density="Standard"
    >
      {/* 통계 대시보드 */}
      <Section role="Container" prominence="Standard" density="Comfortable">
        <Group role="Container" layout="stack" gap={3}>
          {/* 전체 통계 */}
          <Group role="Container" layout="stack" gap={2}>
            <Text role="Label" prominence="Standard">
              Overview
            </Text>
            <Group role="Container" layout="inline" gap={3} className="flex-wrap">
              <StatCard label="Total Tokens" value={stats.total} />
              <StatCard label="Categories" value={categories.length} />
              <StatCard label="Colors" value={stats.byType.color} />
              <StatCard label="Spacing" value={stats.byType.spacing} />
              <StatCard label="Radius" value={stats.byType.radius} />
              <StatCard label="Shadows" value={stats.byType.shadow} />
            </Group>
          </Group>

          {/* Tier별 분포 */}
          <Group role="Container" layout="stack" gap={2}>
            <Text role="Label" prominence="Standard">
              Token Tiers
            </Text>
            <Group role="Container" layout="inline" gap={3} className="flex-wrap">
              <TierCard
                label="Tier 1: Primitive"
                value={stats.byTier.primitive}
                intent="Positive"
              />
              <TierCard label="Tier 2: Semantic" value={stats.byTier.semantic} intent="Brand" />
              <TierCard
                label="Tier 3: Component"
                value={stats.byTier.component}
                intent="Info"
              />
            </Group>
          </Group>

          {/* 검색 필드 */}
          <Group role="Form" layout="stack" gap={1}>
            <Field
              label="Search Tokens"
              dataType="text"
              placeholder="Search tokens by name or value..."
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
              clearable
              prominence="Standard"
            />
            {searchQuery && (
              <Text role="Caption" prominence="Subtle">
                Found {filteredCategories.reduce((sum, cat) => sum + cat.tokens.length, 0)} tokens
                in {filteredCategories.length} categories
              </Text>
            )}
          </Group>
        </Group>
      </Section>

      {/* 메인 콘텐츠: 목차 + 전체 토큰 스크롤 */}
      <Section role="SplitContainer" prominence="Standard">
        {/* 왼쪽: Sticky 목차 */}
        <TokenTableOfContents categories={filteredCategories} />

        {/* 오른쪽: 전체 토큰 섹션 (스크롤) */}
        <Section role="Container" prominence="Standard" className="flex-1 overflow-y-auto">
          <Group role="Container" layout="stack" gap={4} className="p-6">
            {filteredCategories.map((category) => (
              <TokenCategorySection key={category.name} category={category} />
            ))}

            {filteredCategories.length === 0 && (
              <Group role="Container" layout="stack" gap={2}>
                <Text role="Body" prominence="Standard">
                  No tokens found matching "{searchQuery}"
                </Text>
              </Group>
            )}
          </Group>
        </Section>
      </Section>
    </Page>
  );
}

/**
 * StatCard - 통계 카드 컴포넌트 (Pure IDDL)
 */
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Group role="Card" layout="stack" gap={1} prominence="Standard" density="Compact">
      <Text role="Caption" prominence="Subtle">
        {label}
      </Text>
      <Text role="Title" prominence="Hero">
        {value}
      </Text>
    </Group>
  );
}

/**
 * TierCard - Tier별 통계 카드 (Pure IDDL with intent)
 */
function TierCard({
  label,
  value,
  intent,
}: {
  label: string;
  value: number;
  intent: 'Positive' | 'Brand' | 'Info';
}) {
  return (
    <Group role="Card" layout="stack" gap={1} prominence="Standard" density="Compact">
      {/* Tier indicator bar - 유일한 시각적 구분 요소 */}
      <div
        className="w-full h-1 rounded-full"
        style={{
          backgroundColor:
            intent === 'Positive'
              ? 'var(--color-success)'
              : intent === 'Brand'
                ? 'var(--color-primary)'
                : 'var(--color-info)',
        }}
      />
      <Text role="Caption" prominence="Subtle">
        {label}
      </Text>
      <Text role="Title" prominence="Hero" intent={intent}>
        {value}
      </Text>
    </Group>
  );
}
