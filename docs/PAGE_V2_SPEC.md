# IDDL Page Component v2.0 Specification

**Version**: 2.0
**Date**: 2026-01-09
**Status**: Draft

---

## Overview

Page v2.0은 IDDL의 루트 컨테이너로서 **role 기반 아이덴티티**를 도입하여 페이지의 의도를 명확히 선언하고, design tokens(prominence, density, intent)를 통합하여 IDDL 일관성을 확보합니다.

### Key Changes from v1.0.1

| Feature | v1.0.1 | v2.0 |
|---------|--------|------|
| **Identity** | layout만으로 결정 | role로 정체성 선언 |
| **Design Tokens** | 없음 | prominence/density/intent 추가 |
| **Layout** | 6가지 옵션 | 10가지 옵션 (studio, masonry 등) |
| **State Management** | 없음 | loading/error 상태 내장 |
| **Navigation** | breadcrumbs만 | NavigationConfig 추가 |
| **Max Width** | 고정 | role별 기본값 + override 가능 |

---

## PageRole

페이지의 **의도적 정체성(Intent-driven Identity)**을 정의합니다.

### Role Types

```typescript
export type PageRole =
  | 'App'         // 애플리케이션 루트
  | 'Document'    // 문서형 컨텐츠
  | 'Dashboard'   // 데이터 대시보드
  | 'Wizard'      // 단계별 프로세스
  | 'Settings'    // 설정/환경설정
  | 'Canvas'      // 작업 캔버스
  | 'Gallery'     // 미디어 갤러리
  | 'Feed';       // 무한 스크롤 피드
```

### Role Defaults

각 role은 다음과 같은 기본값을 가집니다:

| Role | Default Layout | Max Width | Scrollable | Typical Use Case |
|------|---------------|-----------|------------|------------------|
| **App** | `full` | none | ❌ | IDE, Studio, SaaS Dashboard |
| **Document** | `single` | 1024px | ✅ | Article, Blog, Documentation |
| **Dashboard** | `dashboard` | none | ✅ | Analytics, Admin Panel |
| **Wizard** | `wizard` | 640px | ❌ | Onboarding, Multi-step Form |
| **Settings** | `sidebar` | 1280px | ✅ | User Preferences, Configuration |
| **Canvas** | `full` | none | ❌ | Design Tool, Editor |
| **Gallery** | `masonry` | 1440px | ✅ | Photo Gallery, Portfolio |
| **Feed** | `single` | 768px | ✅ | Social Feed, News Stream |

---

## PageProps Interface

```typescript
export interface PageProps {
  // ============================================
  // Identity & Structure (v2.0)
  // ============================================
  role?: PageRole;            // v2.0: 페이지 정체성 (기본값: 'Document')
  title?: string;             // v1.0.1: 페이지 제목
  description?: string;       // v1.0.1: 페이지 설명

  // ============================================
  // Design Tokens (v2.0: IDDL 일관성)
  // ============================================
  prominence?: Prominence;    // v2.0: Hero/Primary/Secondary/Tertiary
  density?: Density;          // v2.0: Comfortable/Standard/Compact
  intent?: Intent;            // v2.0: Neutral/Brand/Positive/Caution/Critical/Info

  // ============================================
  // Layout Control
  // ============================================
  layout?: PageLayout;        // v1.0.1: role의 기본값 override 가능
  maxWidth?: MaxWidth;        // v2.0: 컨텐츠 최대 너비
  centered?: boolean;         // v2.0: 컨텐츠 중앙 정렬 여부

  // ============================================
  // Navigation (v2.0)
  // ============================================
  breadcrumbs?: Breadcrumb[]; // v1.0.1: 경로 네비게이션
  navigation?: NavigationConfig; // v2.0: 네비게이션 구성

  // ============================================
  // State & Behavior (v2.0)
  // ============================================
  scrollable?: boolean;       // v2.0: 스크롤 가능 여부
  loading?: boolean;          // v2.0: 로딩 상태
  error?: string;             // v2.0: 에러 메시지

  // ============================================
  // React Integration
  // ============================================
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  condition?: string;         // v1.0.1: 조건부 렌더링
}
```

---

## PageLayout (확장)

v2.0에서 4가지 새로운 layout 추가:

```typescript
export type PageLayout =
  // v1.0.1
  | 'single'      // 단일 컬럼 중앙 정렬
  | 'sidebar'     // 좌측 사이드바 + 메인
  | 'dashboard'   // 그리드 대시보드
  | 'split'       // 2컬럼 분할
  | 'wizard'      // 중앙 단계별
  | 'full'        // 풀스크린 (no padding)

  // v2.0 추가
  | 'studio'      // IDE/Studio (multi-panel, flex)
  | 'three-column' // 3컬럼 (nav-main-aside)
  | 'masonry'     // Pinterest 스타일 (columns)
  | 'timeline';   // 타임라인 (세로 흐름)
```

---

## NavigationConfig

```typescript
export interface NavigationConfig {
  header?: {
    show: boolean;
    sticky?: boolean;        // sticky top-0
    transparent?: boolean;   // 투명 배경
  };
  sidebar?: {
    show: boolean;
    position?: 'left' | 'right';
    collapsible?: boolean;
    width?: number;
  };
  footer?: {
    show: boolean;
    sticky?: boolean;        // sticky bottom-0
  };
}
```

---

## Usage Examples

### Example 1: App Role (IDE)

```tsx
<Page role="App" density="Compact" prominence="Primary">
  <Section role="Navigator">...</Section>
  <Section role="Container">...</Section>
</Page>
```

**Result**:
- Layout: `full` (no padding)
- Overflow: `hidden` (h-screen w-screen)
- Scrollable: `false`
- Max Width: `none`

### Example 2: Document Role (Blog)

```tsx
<Page
  role="Document"
  title="Getting Started with IDDL"
  description="Learn how to build UI with Intent-Driven Design"
  breadcrumbs={[
    { label: 'Docs', to: '/docs' },
    { label: 'Getting Started' },
  ]}
  maxWidth="lg"
  centered
  prominence="Secondary"
  density="Comfortable"
>
  <Section role="Container">
    {/* 본문 */}
  </Section>
</Page>
```

**Result**:
- Layout: `single` (자동)
- Max Width: `lg` (1024px, override)
- Centered: `true`
- Scrollable: `true`
- Header: title + description + breadcrumbs

### Example 3: Dashboard Role

```tsx
<Page
  role="Dashboard"
  title="Analytics Overview"
  loading={isLoading}
  error={error}
  density="Compact"
>
  <Section role="Container">
    {/* 위젯 그리드 */}
  </Section>
</Page>
```

**Result**:
- Layout: `dashboard` (grid)
- Loading/Error state 자동 렌더링
- Scrollable: `true`

### Example 4: Wizard Role

```tsx
<Page
  role="Wizard"
  title="Account Setup"
  description="Step 2 of 5"
  maxWidth="md"
  centered
>
  <Section role="Container">
    {/* 단계별 폼 */}
  </Section>
</Page>
```

**Result**:
- Layout: `wizard`
- Max Width: `md` (640px, override)
- Scrollable: `false` (Wizard는 고정 높이)
- Centered: `true`

### Example 5: Gallery Role

```tsx
<Page
  role="Gallery"
  title="Portfolio"
  layout="masonry"  // role 기본값과 동일
  maxWidth="2xl"
>
  <Section role="Container">
    {/* Masonry 그리드 */}
  </Section>
</Page>
```

**Result**:
- Layout: `masonry` (columns)
- Max Width: `2xl` (1440px)
- Scrollable: `true`

---

## State Management

### Loading State

```tsx
<Page role="Document" loading={true}>
  {/* 자동으로 로딩 스피너 렌더링 */}
</Page>
```

**Renders**:
```html
<div class="...items-center justify-center" data-state="loading">
  <Loader2 />
  <p>Loading...</p>
</div>
```

### Error State

```tsx
<Page role="Dashboard" error="Failed to load data">
  {/* 자동으로 에러 메시지 렌더링 */}
</Page>
```

**Renders**:
```html
<div class="...items-center justify-center" data-state="error">
  <p class="text-critical">Error</p>
  <p>Failed to load data</p>
</div>
```

---

## Design Token Integration

Page는 LayoutProvider를 통해 prominence/density/intent를 하위 컴포넌트에 전파합니다.

```tsx
<Page role="Document" density="Compact" intent="Brand">
  <Section role="Container">
    {/* density: Compact 상속 */}
    <Group role="Fieldset">
      {/* density: Compact, intent: Brand 상속 */}
      <Field model="title" dataType="text" />
    </Group>
  </Section>
</Page>
```

---

## Migration Guide (v1.0.1 → v2.0)

### Before (v1.0.1)

```tsx
<Page layout="full">
  <Section role="Container">...</Section>
</Page>
```

### After (v2.0) - Option 1: Explicit role

```tsx
<Page role="App">
  <Section role="Container">...</Section>
</Page>
```

### After (v2.0) - Option 2: Backward compatible

```tsx
<Page layout="full">  {/* role 없으면 기본값 'Document' + layout override */}
  <Section role="Container">...</Section>
</Page>
```

**Notes**:
- role이 없으면 기본값 `'Document'`
- layout이 명시되면 role의 기본 layout을 override
- **Breaking Change 없음** - 기존 코드도 동작

---

## Implementation Notes

### CVA Variants

```typescript
const pageContainerVariants = cva('bg-surface-base flex flex-col', {
  variants: {
    role: {
      App: 'h-screen w-screen overflow-hidden',
      Document: 'h-full w-full overflow-y-auto',
      // ...
    },
    prominence: {
      Hero: 'bg-surface-raised',
      Primary: 'bg-surface',
      Secondary: 'bg-surface-sunken',
      Tertiary: 'bg-surface-base',
    },
  },
});
```

### Role → Layout Mapping

```typescript
const roleToLayout: Record<PageRole, PageLayout> = {
  App: 'full',
  Document: 'single',
  Dashboard: 'dashboard',
  Wizard: 'wizard',
  Settings: 'sidebar',
  Canvas: 'full',
  Gallery: 'masonry',
  Feed: 'single',
};
```

---

## Future Enhancements

### Planned for v2.1

- [ ] **Auto Navigation**: role에 따라 navigation 자동 구성
- [ ] **Responsive Breakpoints**: role별 반응형 레이아웃
- [ ] **Skeleton Loading**: loading 상태의 skeleton UI
- [ ] **Transition Animation**: 페이지 전환 애니메이션

### Under Consideration

- [ ] **SEO Metadata**: title/description을 `<head>`에 자동 주입
- [ ] **Analytics**: role별 페이지 추적 이벤트
- [ ] **A11y Enhancements**: role별 ARIA landmark 자동 설정

---

## References

- **IDDL Spec v1.0.1**: `/spec/iddl-spec-1.0.1.md`
- **Type Definitions**: `/src/components/dsl/types.ts`
- **Implementation**: `/src/components/dsl/Page.tsx`
- **Examples**: `/src/apps/*/pages/**/*.tsx`
