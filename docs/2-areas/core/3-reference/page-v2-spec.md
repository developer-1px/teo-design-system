# IDDL Page Component v5.0 Specification

**Version**: 5.0
**Date**: 2026-01-10
**Status**: Stable
**Breaking Changes**: No (backward compatible)

---

## Overview

Page v5.0은 IDDL의 루트 컨테이너로서 **물리법칙(Physical Laws)**과 **공간 설계(Space Division)**를 명확히 분리하여 Why-based API를 완성합니다.

### Key Changes from v4.0

| Feature | v4.0 | v5.0 |
|---------|------|------|
| **PageRole values** | "App", "Content" | "Application", "Document", "Focus", "Fullscreen" |
| **Layout prop** | `template` (lowercase) | `layout` (PascalCase) |
| **Props** | template, layout, direction | layout only (cleaner API) |
| **Backward compat** | N/A | Deprecated props work with warnings |
| **Section positioning** | gridArea prop | role-based (role-config.ts) |

**Migration**: No breaking changes. Old code works with deprecation warnings.

---

## PageRole (물리법칙)

페이지가 **어떻게 움직이는가(How it moves)** - 스크롤, 뷰포트, 물리적 특성

### Role Types

```typescript
export type PageRole =
  | 'Application'  // 풀스크린 앱 (스크롤 없음)
  | 'Document'     // 스크롤 가능한 문서 (기본값)
  | 'Focus'        // 중앙 집중 (로그인, 결제)
  | 'Fullscreen';  // 고정 풀스크린 (프레젠테이션, 키오스크)
```

### Role Physical Laws

각 role은 물리적 특성(viewport, scroll)을 정의합니다:

| Role | Physical Laws | CSS Classes | Use Case |
|------|---------------|-------------|----------|
| **Application** | 풀스크린, 스크롤 없음 | `w-screen h-screen overflow-hidden` | IDE, Studio, Dashboard, Complex Apps |
| **Document** | 스크롤 가능, min-height | `min-h-screen overflow-y-auto` | Articles, Docs, Forms, Settings |
| **Focus** | 중앙 정렬, 고정 높이 | `h-screen flex items-center justify-center` | Login, Payment, Wizard |
| **Fullscreen** | 고정 풀스크린, chrome 없음 | `w-screen h-screen overflow-hidden` | Presentation, Kiosk, Immersive |

---

## PageLayout (공간 설계)

페이지 **공간을 어떻게 나누는가(How space is divided)** - Section 배치 패턴

### Layout Types

```typescript
export type PageLayout =
  | 'Single'      // 1컬럼 기본형 (Header + Container + Footer)
  | 'Sidebar'     // 2컬럼 좌측 네비 (Navigator + Container)
  | 'Aside'       // 2컬럼 우측 정보 (Container + Aside)
  | 'HolyGrail'   // 3컬럼 완전형 (Header + Navigator + Container + Aside + Footer)
  | 'Split'       // 50-50 분할 (Master + Detail)
  | 'Studio'      // IDE 5컬럼 (ActivityBar + PrimarySidebar + Editor + Panel + SecondarySidebar)
  | 'Blank';      // 빈 캔버스 (커스텀 레이아웃, 다이얼로그)
```

### Layout to Section Role Mapping (v5.0)

각 layout은 허용되는 Section role을 정의합니다 (`LAYOUT_SECTION_ROLES` in `types.ts`):

| Layout | Allowed Section Roles |
|--------|-----------------------|
| **Single** | Header, Container, Footer, Main |
| **Sidebar** | Header, Footer, Navigator, Container, Main |
| **Aside** | Header, Footer, Container, Aside, Main |
| **HolyGrail** | Header, Footer, Navigator, Container, Aside, Main, Region |
| **Split** | Header, Footer, Master, Detail, Toolbar, Container, Main |
| **Studio** | Header, Footer, Toolbar, ActivityBar, PrimarySidebar, SecondarySidebar, Editor, Panel, Auxiliary, Container, Main |
| **Blank** | Container, Main, DialogHeader, DialogContent, DialogFooter |

---

## PageProps Interface

```typescript
export interface PageProps {
  // ============================================
  // Identity & Physical Laws (v5.0)
  // ============================================
  role?: PageRole;            // v5.0: 물리법칙 (기본값: 'Document')
  title?: string;             // v1.0.1: 페이지 제목
  description?: string;       // v1.0.1: 페이지 설명

  // ============================================
  // Design Tokens (v2.0: IDDL 일관성)
  // ============================================
  prominence?: Prominence;    // v2.0: Hero/Primary/Secondary/Tertiary
  density?: Density;          // v2.0: Comfortable/Standard/Compact
  intent?: Intent;            // v2.0: Neutral/Brand/Positive/Caution/Critical/Info

  // ============================================
  // Space Division (v5.0)
  // ============================================
  layout?: PageLayout;        // v5.0: 공간 설계 (PascalCase: Studio, Sidebar, etc.)
  gap?: number;               // v5.0: Section 간 간격
  maxWidth?: MaxWidth;        // v2.0: 컨텐츠 최대 너비
  centered?: boolean;         // v2.0: 컨텐츠 중앙 정렬 여부

  // ============================================
  // Navigation (v2.0)
  // ============================================
  breadcrumbs?: Breadcrumb[]; // v1.0.1: 경로 네비게이션

  // ============================================
  // State & Behavior (v2.0)
  // ============================================
  loading?: boolean;          // v2.0: 로딩 상태
  error?: string;             // v2.0: 에러 메시지

  // ============================================
  // React Integration
  // ============================================
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  condition?: string;         // v1.0.1: 조건부 렌더링

  // ============================================
  // Deprecated (v5.0) - Backward Compatibility
  // ============================================
  /** @deprecated Use `layout` instead of `template` */
  template?: GridTemplate;
  /** @deprecated direction is now determined by `role` and `layout` props */
  direction?: 'row' | 'column';
}
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

## Usage Examples (v5.0)

### Example 1: Application Role (IDE)

```tsx
<Page role="Application" layout="Studio" density="Compact">
  <Section role="ActivityBar">...</Section>
  <Section role="PrimarySidebar">...</Section>
  <Section role="Editor">...</Section>
  <Section role="Panel">...</Section>
</Page>
```

**Result**:
- Physical Laws: `w-screen h-screen overflow-hidden` (no scroll)
- Layout: Dynamic CSS Grid based on Section roles
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
  density="Comfortable"
>
  <Section role="Container">
    {/* 본문 */}
  </Section>
</Page>
```

**Result**:
- Physical Laws: `min-h-screen overflow-y-auto` (scrollable)
- Layout: Single column (default)
- Max Width: `lg` (1024px)
- Centered: `true`
- Header: title + description + breadcrumbs

### Example 3: Focus Role (Login)

```tsx
<Page
  role="Focus"
  title="Sign In"
  centered
  density="Standard"
>
  <Section role="Container">
    <Group role="Form">
      {/* 로그인 폼 */}
    </Group>
  </Section>
</Page>
```

**Result**:
- Physical Laws: `h-screen flex items-center justify-center`
- Layout: Centered content only
- Scrollable: `false`
- Max Width: auto (constrained by content)

### Example 4: Fullscreen Role (Presentation)

```tsx
<Page
  role="Fullscreen"
  density="Compact"
>
  <Section role="Container">
    {/* 프레젠테이션 슬라이드 */}
  </Section>
</Page>
```

**Result**:
- Physical Laws: `w-screen h-screen overflow-hidden`
- Layout: Full canvas (no chrome)
- Scrollable: `false`
- Title/Breadcrumbs: hidden (immersive mode)

### Example 5: Application with Sidebar Layout

```tsx
<Page
  role="Application"
  layout="Sidebar"
  title="Settings"
  density="Standard"
>
  <Section role="Navigator">
    {/* 설정 네비게이션 */}
  </Section>
  <Section role="Container">
    {/* 설정 패널 */}
  </Section>
</Page>
```

**Result**:
- Physical Laws: `w-screen h-screen overflow-hidden`
- Layout: 2-column with left navigation
- Dynamic Grid: Navigator (250px) + Container (1fr)

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

## Migration Guide (v4.0 → v5.0)

### Changes Summary

| Aspect | v4.0 | v5.0 |
|--------|------|------|
| PageRole values | "App", "Content" | "Application", "Document", "Focus", "Fullscreen" |
| Layout prop name | `template` | `layout` |
| Layout values | lowercase (studio, sidebar) | PascalCase (Studio, Sidebar) |
| Section positioning | `gridArea` prop | `role` prop (auto-mapping) |

### Before (v4.0)

```tsx
<Page role="App" template="studio" density="Compact">
  <Section gridArea="activitybar">...</Section>
  <Section gridArea="sidebar">...</Section>
  <Section gridArea="editor">...</Section>
  <Section gridArea="panel">...</Section>
</Page>
```

### After (v5.0) - Recommended

```tsx
<Page role="Application" layout="Studio" density="Compact">
  <Section role="ActivityBar">...</Section>
  <Section role="PrimarySidebar">...</Section>
  <Section role="Editor">...</Section>
  <Section role="Panel">...</Section>
</Page>
```

### Backward Compatible (v5.0)

```tsx
// Old code still works with deprecation warnings
<Page role="App" template="studio" density="Compact">
  <Section gridArea="activitybar">...</Section>
  <Section gridArea="sidebar">...</Section>
  <Section gridArea="editor">...</Section>
  <Section gridArea="panel">...</Section>
</Page>

// Automatic mapping:
// role="App" → role="Application"
// template="studio" → layout="Studio"
// Section gridArea → role-based positioning (v4.1)
```

### Document Page Migration

```tsx
// Before (v4.0)
<Page role="Content" title="Settings" maxWidth="lg" centered>
  <Section role="Container">...</Section>
</Page>

// After (v5.0)
<Page role="Document" title="Settings" maxWidth="lg" centered>
  <Section role="Container">...</Section>
</Page>
```

**Migration Notes**:
- **No breaking changes**: Old code continues to work
- Deprecation warnings will guide you to new API
- Section `gridArea` prop deprecated in favor of `role` (v4.1)
- Consider migrating incrementally - both APIs work simultaneously

---

## Implementation Notes (v5.0)

### Role-Based Branching

```typescript
// Page.tsx - Main component
export function Page({ role = 'Document', layout, ... }: PageProps) {
  // Backward compatibility: "App" → "Application", "Content" → "Document"
  const normalizedRole: PageRole =
    role === ('App' as any) ? 'Application'
    : role === ('Content' as any) ? 'Document'
    : role;

  // v5.0: role="Application" → AppLayout renderer
  if (normalizedRole === 'Application') {
    return (
      <LayoutProvider value={{ prominence, density, intent, depth: 0, mode: 'view', layout }}>
        <AppLayout layout={layout} gap={gap} prominence={prominence} intent={intent}>
          {children}
        </AppLayout>
      </LayoutProvider>
    );
  }

  // Document/Focus/Fullscreen → DocumentPage renderer
  return <DocumentPage role={normalizedRole} ... />;
}
```

### Backward Compatibility Helpers

```typescript
// Convert deprecated template prop to layout prop
function convertTemplateToLayout(template?: GridTemplate): PageLayout | undefined {
  if (!template) return undefined;
  const mapping: Record<GridTemplate, PageLayout> = {
    studio: 'Studio',
    'sidebar-content': 'Sidebar',
    'master-detail': 'Split',
    '3-col': 'HolyGrail',
    dashboard: 'HolyGrail',
    dialog: 'Blank',
    presentation: 'HolyGrail',
    custom: 'Blank',
  };
  return mapping[template];
}

// Usage in Page.tsx
const layout = layoutProp || convertTemplateToLayout(template);
```

### Section Role Auto-Mapping (v4.1+)

```typescript
// Section roles automatically map to gridArea via role-config.ts
import { getRoleConfig } from '@/components/types/Section/role-config';

// Example: Section role="PrimarySidebar" → gridArea="sidebar"
const config = getRoleConfig('PrimarySidebar', 'studio');
// Returns: { gridArea: 'sidebar', defaultWidth: '250px', ... }
```

---

## Future Enhancements

### Planned for v5.1

- [ ] **Focus role enhancements**: Better centered layout variants
- [ ] **Fullscreen API integration**: Native browser fullscreen support
- [ ] **Responsive Breakpoints**: Layout adapts to viewport size
- [ ] **Skeleton Loading**: Automatic loading state UI

### Under Consideration

- [ ] **SEO Metadata**: Auto-inject title/description to `<head>`
- [ ] **Analytics**: Auto-track page role changes
- [ ] **A11y Enhancements**: ARIA landmarks based on role
- [ ] **Page Transitions**: Smooth transitions between roles

---

## References

- **IDDL Spec v1.0.1**: `/docs/2-areas/spec/iddl-spec-1.0.1.md`
- **Type Definitions**: `/src/components/types/Atom/types.ts`
- **Page Implementation**: `/src/components/types/Page/Page.tsx`
- **AppLayout Renderer**: `/src/components/types/Page/renderers/AppLayout.tsx`
- **Section Role Config**: `/src/components/types/Section/role-config.ts`
- **Dynamic Grid Hook**: `/src/components/types/Page/hooks/useDynamicGridTemplate.ts`
- **Example Apps**: `/src/apps/*/pages/**/*.tsx`
