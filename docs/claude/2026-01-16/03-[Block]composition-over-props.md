# Block: Composition Over Props - 외울 것 없는 설계

**작성일**: 2026-01-16
**목적**: Props 방식 폐기, Composition 기반으로 재설계
**핵심**: **외울게 없어지는 방향**

---

## 문제: Props 방식의 한계

### ❌ Props 방식의 문제점

```tsx
// ❌ BAD: Props 지옥 - 외워야 할 API 폭발
<Block.Hero
  variant="centered"
  title="Build faster"
  subtitle="Description here"
  badge={{ text: "New", icon: Sparkles, variant: "primary" }}
  primaryAction={{ label: "Start", onClick: handleClick, icon: ArrowRight }}
  secondaryAction={{ label: "Learn", onClick: handleLearn }}
  decoration={true}
  maxWidth={800}
/>

// 문제점:
// 1. variant, badge, primaryAction 등 모두 외워야 함
// 2. 내부 구조를 변경할 수 없음 (경직됨)
// 3. "Hero Block API"를 또 배워야 함
// 4. 디자인이 Block에 갇힘 (재사용 불가)
// 5. 확장 불가능 (새로운 요구사항 = 새 prop 추가)
```

---

## 해결: Composition 방식

### ✅ "이미 아는 것"만 사용

```tsx
// ✅ GOOD: Frame + Text + Action 조합 - 외울게 없음
<Frame
  surface="base"
  layout={Layout.Stack.Hero}
>
  {/* Badge */}
  <Frame
    surface="raised"
    rounded="full"
    layout={Layout.Row.Item.Compact}
  >
    <Icon src={Sparkles} size={12} />
    <Text.Card.Note>New Feature</Text.Card.Note>
  </Frame>

  {/* Title */}
  <Text.Prose.Title variant="xl">
    Build faster with MDK
  </Text.Prose.Title>

  {/* Subtitle */}
  <Text.Prose.Body style={{ color: "var(--text-secondary)" }}>
    A design system that thinks like you do
  </Text.Prose.Body>

  {/* Actions */}
  <Frame layout={Layout.Row.Actions.Center}>
    <Action label="Get Started" variant="primary" icon={ArrowRight} />
    <Action label="View Docs" variant="surface" />
  </Frame>
</Frame>

// 장점:
// 1. Frame, Text, Action만 알면 됨 (이미 배운 것)
// 2. 내부 구조 자유롭게 변경 가능
// 3. 새로운 API 없음
// 4. 모든 조합이 재사용 가능
// 5. 무한 확장 가능
```

---

## 핵심 원칙: "Block은 Layout Token일 뿐"

### Block의 재정의

```typescript
/**
 * Block은 Props를 가진 Component가 아니다.
 * Block은 "의미 있는 Layout Token의 모음"이다.
 *
 * Block.Hero가 아니라 → Layout.Stack.Hero
 * Block.Features가 아니라 → Layout.Grid.Features
 * Block.Sidebar가 아니라 → Layout.Stack.Sidebar
 *
 * WHY?
 * - Layout은 이미 존재하는 개념
 * - 새로운 암기 불필요
 * - Frame의 layout prop으로 즉시 사용 가능
 */
```

---

## 재설계: Layout Token 기반

### 1. Hero = Layout.Stack.Hero

**Before (Props 방식 ❌)**
```tsx
<Block.Hero
  title="..."
  subtitle="..."
  primaryAction={...}
/>
```

**After (Layout Token 방식 ✅)**
```tsx
<Frame layout={Layout.Stack.Hero}>
  <Text.Prose.Title variant="xl">...</Text.Prose.Title>
  <Text.Prose.Body>...</Text.Prose.Body>
  <Frame layout={Layout.Row.Actions.Center}>
    <Action>...</Action>
  </Frame>
</Frame>
```

**Layout Token 정의**
```typescript
// src/design-system/Frame/Layout/Layout.ts

export const Layout = {
  Stack: {
    // ... existing tokens ...

    /**
     * Hero Section Layout
     * WHY: 페이지 최상단의 핵심 메시지 전달
     *
     * - Vertical stack
     * - Center aligned
     * - Large vertical spacing (128px top/bottom)
     * - Max width for readability (800px)
     * - 24px gap between elements
     */
    Hero: {
      gap: Space.n24,
      py: Space.n128,
      px: Space.n24,
      align: "center",
      maxWidth: Size.n800,
    } as const,

    /**
     * Feature Section Layout
     * WHY: 여러 항목을 일정한 간격으로 나열
     */
    Features: {
      gap: Space.n48,
      py: Space.n96,
      px: Space.n24,
      align: "center",
      maxWidth: Size.n1200,
    } as const,

    /**
     * Content Section Layout
     * WHY: 본문 콘텐츠 영역
     */
    Content: {
      gap: Space.n32,
      py: Space.n64,
      px: Space.n24,
      maxWidth: Size.n768,
    } as const,
  },

  Grid: {
    /**
     * Feature Grid Layout
     * WHY: 기능 카드들을 그리드로 배치
     */
    Features: {
      grid: true,
      columns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: Space.n16,
      w: Size.full,
    } as const,

    /**
     * 2-Column Grid
     */
    TwoColumn: {
      grid: true,
      columns: "1fr 1fr",
      gap: Space.n16,
    } as const,

    /**
     * 3-Column Grid
     */
    ThreeColumn: {
      grid: true,
      columns: "1fr 1fr 1fr",
      gap: Space.n16,
    } as const,
  },

  Row: {
    // ... existing tokens ...

    /**
     * Sidebar Layout
     * WHY: 고정 너비 사이드바
     */
    Sidebar: {
      w: Size.n240,
      h: Size.full,
      borderRight: true,
    } as const,

    /**
     * Main Content Area
     * WHY: 사이드바 옆 메인 영역
     */
    MainContent: {
      flex: 1,
      h: Size.full,
    } as const,
  },
} as const;
```

---

### 2. Features = Layout.Grid.Features

```tsx
// ✅ Composition 방식
<Frame layout={Layout.Stack.Features}>
  <Frame layout={Layout.Stack.SectionHeader}>
    <Text.Card.Note>FEATURES</Text.Card.Note>
    <Text.Prose.Title variant="lg">Everything you need</Text.Prose.Title>
  </Frame>

  <Frame layout={Layout.Grid.Features}>
    {features.map(feature => (
      <Frame
        key={feature.id}
        surface="raised"
        rounded="2xl"
        layout={Layout.Stack.Card}
      >
        <Frame surface="sunken" rounded="xl" pack w={48} h={48}>
          <Icon src={feature.icon} size={24} />
        </Frame>
        <Text.Card.Title>{feature.title}</Text.Card.Title>
        <Text.Card.Desc>{feature.description}</Text.Card.Desc>
      </Frame>
    ))}
  </Frame>
</Frame>
```

---

### 3. Sidebar = Layout.Row.Sidebar

```tsx
// ✅ Composition 방식
<Frame layout={Layout.Row.AppContainer}>
  {/* Sidebar */}
  <Frame layout={Layout.Stack.Sidebar} surface="base">
    <Frame layout={Layout.Stack.SidebarHeader}>
      <TeoLogo />
    </Frame>

    <Frame layout={Layout.Stack.SidebarNav} scroll>
      {navItems.map(item => (
        <Frame
          key={item.id}
          layout={Layout.Row.NavItem}
          surface={item.active ? "selected" : undefined}
        >
          <Icon src={item.icon} size={16} />
          <Text.Menu.Item>{item.label}</Text.Menu.Item>
        </Frame>
      ))}
    </Frame>
  </Frame>

  {/* Main Content */}
  <Frame layout={Layout.Stack.MainContent}>
    {children}
  </Frame>
</Frame>
```

---

## Layout Token 체계

### 카테고리별 Layout Token

```typescript
/**
 * Layout Token Structure
 *
 * Layout.{Direction}.{Purpose}
 *
 * Direction: Stack (세로), Row (가로), Grid (그리드)
 * Purpose: 사용 목적의 의미적 이름
 */

export const Layout = {
  // ===== STACK (Vertical) =====
  Stack: {
    // Marketing/Landing
    Hero: { ... },           // 히어로 섹션
    Features: { ... },       // 기능 소개 섹션
    Content: { ... },        // 본문 콘텐츠
    CTA: { ... },            // Call-to-Action
    Footer: { ... },         // 푸터

    // Application
    Sidebar: { ... },        // 사이드바 내부
    SidebarHeader: { ... },  // 사이드바 헤더
    SidebarNav: { ... },     // 사이드바 네비게이션
    MainContent: { ... },    // 메인 콘텐츠 영역
    Panel: { ... },          // 패널 (Properties, Inspector)

    // Components
    Card: { ... },           // 카드 내부
    CardHeader: { ... },     // 카드 헤더
    CardContent: { ... },    // 카드 콘텐츠
    List: { ... },           // 리스트
    ListItem: { ... },       // 리스트 아이템

    // Sections
    SectionHeader: { ... },  // 섹션 헤더 (Label + Title)
  },

  // ===== ROW (Horizontal) =====
  Row: {
    // Application
    AppContainer: { ... },   // 앱 최상위 (Sidebar + Main)
    AppHeader: { ... },      // 앱 헤더
    Toolbar: { ... },        // 툴바

    // Navigation
    NavItem: { ... },        // 네비게이션 아이템
    TabBar: { ... },         // 탭 바

    // Actions
    Actions: {
      Default: { ... },      // 기본 액션 그룹
      Center: { ... },       // 중앙 정렬 액션
      Between: { ... },      // 양 끝 배치
    },

    // Components
    Card: { ... },           // 가로 카드
    Item: { ... },           // 가로 아이템
  },

  // ===== GRID =====
  Grid: {
    // Marketing
    Features: { ... },       // 기능 그리드 (auto-fit)
    TwoColumn: { ... },      // 2단 그리드
    ThreeColumn: { ... },    // 3단 그리드
    FourColumn: { ... },     // 4단 그리드

    // Application
    Dashboard: { ... },      // 대시보드 그리드
    Gallery: { ... },        // 갤러리 그리드
  },
} as const;
```

---

## 추가 Layout Token 정의

```typescript
// src/design-system/Frame/Layout/Layout.Marketing.ts

/**
 * Marketing/Landing Page Layout Tokens
 */
export const MarketingLayout = {
  /**
   * Hero Section
   */
  Hero: {
    gap: Space.n24,
    py: Space.n128,
    px: Space.n24,
    align: "center",
    maxWidth: Size.n800,
  },

  /**
   * Hero Badge (상단 작은 라벨)
   */
  HeroBadge: {
    row: true,
    gap: Space.n8,
    py: Space.n4,
    px: Space.n12,
    align: "center",
    rounded: Radius2.full,
    surface: "raised",
  },

  /**
   * Features Section
   */
  FeaturesSection: {
    gap: Space.n48,
    py: Space.n96,
    px: Space.n24,
    align: "center",
    w: Size.full,
  },

  /**
   * Features Grid
   */
  FeaturesGrid: {
    grid: true,
    columns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: Space.n16,
    w: Size.full,
    maxWidth: Size.n1200,
  },

  /**
   * Feature Card
   */
  FeatureCard: {
    gap: Space.n16,
    p: Space.n24,
    rounded: Radius2["2xl"],
    surface: "raised",
  },

  /**
   * Feature Icon Container
   */
  FeatureIcon: {
    w: Size.n48,
    h: Size.n48,
    rounded: Radius2.xl,
    surface: "sunken",
    pack: true,
  },

  /**
   * CTA Section
   */
  CTASection: {
    gap: Space.n24,
    py: Space.n96,
    px: Space.n24,
    align: "center",
    rounded: Radius2["2xl"],
    surface: "raised",
  },

  /**
   * FAQ Section
   */
  FAQSection: {
    gap: Space.n32,
    py: Space.n96,
    px: Space.n24,
    maxWidth: Size.n768,
  },

  /**
   * FAQ Item
   */
  FAQItem: {
    gap: Space.n16,
    py: Space.n24,
    borderBottom: true,
    cursor: "pointer",
  },

  /**
   * Section Header (Label + Title + Description)
   */
  SectionHeader: {
    gap: Space.n12,
    pb: Space.n32,
    align: "center",
  },

  /**
   * Footer
   */
  Footer: {
    py: Space.n96,
    px: Space.n24,
    gap: Space.n48,
    borderTop: true,
  },

  /**
   * Footer Columns
   */
  FooterColumns: {
    row: true,
    gap: Space.n48,
    wrap: true,
  },

  /**
   * Footer Column
   */
  FooterColumn: {
    gap: Space.n16,
    flex: 1,
  },
} as const;
```

```typescript
// src/design-system/Frame/Layout/Layout.Application.ts

/**
 * Application UI Layout Tokens
 */
export const ApplicationLayout = {
  /**
   * App Container (Sidebar + Main)
   */
  AppContainer: {
    row: true,
    fill: true,
    h: Size.full,
  },

  /**
   * Sidebar
   */
  Sidebar: {
    w: Size.n240,
    h: Size.full,
    borderRight: true,
    surface: "base",
  },

  /**
   * Sidebar Header
   */
  SidebarHeader: {
    p: Space.n16,
    borderBottom: true,
  },

  /**
   * Sidebar Navigation
   */
  SidebarNav: {
    gap: Space.n4,
    p: Space.n8,
    scroll: true,
    flex: 1,
  },

  /**
   * Sidebar Nav Item
   */
  SidebarNavItem: {
    row: true,
    gap: Space.n8,
    p: Space.n8,
    align: "center",
    rounded: Radius2.md,
    cursor: "pointer",
  },

  /**
   * Main Content
   */
  MainContent: {
    flex: 1,
    h: Size.full,
    scroll: true,
  },

  /**
   * App Header
   */
  AppHeader: {
    row: true,
    justify: "between",
    align: "center",
    h: Size.n56,
    px: Space.n16,
    borderBottom: true,
    surface: "base",
  },

  /**
   * Toolbar (Floating)
   */
  ToolbarFloating: {
    row: true,
    gap: Space.n4,
    p: Space.n4,
    rounded: Radius2.full,
    surface: "base",
    shadow: "xl",
    align: "center",
  },

  /**
   * Panel (Properties, Inspector)
   */
  Panel: {
    w: Size.n320,
    h: Size.full,
    borderLeft: true,
    surface: "base",
  },

  /**
   * Panel Header
   */
  PanelHeader: {
    row: true,
    justify: "between",
    align: "center",
    p: Space.n12,
    borderBottom: true,
  },

  /**
   * Panel Section
   */
  PanelSection: {
    gap: Space.n12,
    p: Space.n12,
    borderBottom: true,
  },

  /**
   * Drawer
   */
  Drawer: {
    w: Size.n400,
    h: Size.full,
    surface: "overlay",
    shadow: "xl",
  },

  /**
   * Split View (List + Detail)
   */
  SplitView: {
    row: true,
    fill: true,
    h: Size.full,
  },

  /**
   * Split View - List
   */
  SplitViewList: {
    w: Size.n384,
    h: Size.full,
    borderRight: true,
    scroll: true,
  },

  /**
   * Split View - Detail
   */
  SplitViewDetail: {
    flex: 1,
    h: Size.full,
    scroll: true,
  },
} as const;
```

---

## 사용 예시: 실전 비교

### Hero Section

```tsx
// ❌ Props 방식 - 외워야 할 것: variant, badge, primaryAction, secondaryAction, decoration, maxWidth
<Block.Hero
  variant="centered"
  badge={{ text: "New", icon: Sparkles }}
  title="Build faster"
  subtitle="Description"
  primaryAction={{ label: "Start", onClick: handleStart }}
  secondaryAction={{ label: "Docs", onClick: handleDocs }}
  decoration
  maxWidth={800}
/>

// ✅ Layout Token 방식 - 외울 것: 없음 (Frame, Text, Action만 알면 됨)
<Frame layout={Layout.Stack.Hero}>
  <Frame layout={Layout.Marketing.HeroBadge}>
    <Icon src={Sparkles} size={12} />
    <Text.Card.Note>New Feature</Text.Card.Note>
  </Frame>

  <Text.Prose.Title variant="xl">Build faster</Text.Prose.Title>
  <Text.Prose.Body>Description</Text.Prose.Body>

  <Frame layout={Layout.Row.Actions.Center}>
    <Action label="Start" variant="primary" onClick={handleStart} />
    <Action label="Docs" variant="surface" onClick={handleDocs} />
  </Frame>
</Frame>
```

### Features Grid

```tsx
// ❌ Props 방식 - 외워야 할 것: items 구조, columns, variant
<Block.Features
  title="Everything you need"
  items={[...]}
  columns={3}
  variant="card"
/>

// ✅ Layout Token 방식 - 외울 것: 없음
<Frame layout={Layout.Stack.Features}>
  <Frame layout={Layout.Marketing.SectionHeader}>
    <Text.Card.Note>FEATURES</Text.Card.Note>
    <Text.Prose.Title variant="lg">Everything you need</Text.Prose.Title>
  </Frame>

  <Frame layout={Layout.Grid.Features}>
    {features.map(f => (
      <Frame key={f.id} layout={Layout.Marketing.FeatureCard}>
        <Frame layout={Layout.Marketing.FeatureIcon}>
          <Icon src={f.icon} size={24} />
        </Frame>
        <Text.Card.Title>{f.title}</Text.Card.Title>
        <Text.Card.Desc>{f.description}</Text.Card.Desc>
      </Frame>
    ))}
  </Frame>
</Frame>
```

### Application with Sidebar

```tsx
// ❌ Props 방식 - 외워야 할 것: items, collapsible, width, header, footer, searchable
<Block.Sidebar
  items={navItems}
  collapsible
  width={240}
  header={<Logo />}
  footer={<Profile />}
  searchable
/>

// ✅ Layout Token 방식 - 외울 것: 없음
<Frame layout={Layout.Application.AppContainer}>
  <Frame layout={Layout.Application.Sidebar}>
    <Frame layout={Layout.Application.SidebarHeader}>
      <TeoLogo />
    </Frame>

    <Frame layout={Layout.Application.SidebarNav}>
      {navItems.map(item => (
        <Frame
          key={item.id}
          layout={Layout.Application.SidebarNavItem}
          surface={item.active ? "selected" : undefined}
        >
          <Icon src={item.icon} size={16} />
          <Text.Menu.Item>{item.label}</Text.Menu.Item>
        </Frame>
      ))}
    </Frame>

    <Frame layout={Layout.Application.SidebarHeader}>
      <UserProfile />
    </Frame>
  </Frame>

  <Frame layout={Layout.Application.MainContent}>
    {children}
  </Frame>
</Frame>
```

---

## 장점 정리

### 1️⃣ **외울게 없음**
- ✅ Frame, Text, Action만 알면 됨
- ✅ Layout Token은 "이름만 보면 이해됨"
- ✅ 새로운 API 학습 불필요

### 2️⃣ **무한 확장 가능**
- ✅ Layout Token만 추가하면 됨
- ✅ Props 인터페이스 수정 불필요
- ✅ Breaking change 없음

### 3️⃣ **완전한 자유도**
- ✅ 내부 구조 마음대로 변경
- ✅ 순서 바꾸기, 요소 추가/제거 자유
- ✅ 모든 조합이 유효함

### 4️⃣ **재사용성 극대화**
- ✅ 모든 조각이 재사용 가능
- ✅ Hero의 Badge → 다른 곳에서도 사용 가능
- ✅ FeatureCard → 어디서든 사용 가능

### 5️⃣ **디자인 경직성 제거**
- ✅ "Block의 디자인"에 갇히지 않음
- ✅ 프로젝트별 커스터마이징 자유
- ✅ 점진적 개선 가능

---

## 구현 가이드

### 1. Layout Token 파일 구조

```
src/design-system/Frame/Layout/
├── Layout.ts                    # Main export
├── Layout.Marketing.ts          # Marketing/Landing tokens
├── Layout.Application.ts        # Application UI tokens
├── Layout.Component.ts          # Component-level tokens
└── Layout.Utility.ts            # Utility tokens
```

### 2. Layout Token 작성 규칙

```typescript
/**
 * Layout Token Naming Convention
 *
 * {Category}.{Purpose}
 *
 * Category: Stack, Row, Grid
 * Purpose: 의미적 이름 (Hero, Sidebar, FeatureCard, ...)
 *
 * Example:
 * - Layout.Stack.Hero
 * - Layout.Row.AppHeader
 * - Layout.Grid.Features
 */

/**
 * Layout Token 작성 시 필수 주석
 *
 * 1. WHY: 왜 이 Layout이 필요한가?
 * 2. WHEN: 언제 사용하는가?
 * 3. STRUCTURE: 내부 구조 설명
 */

/**
 * Hero Section Layout
 *
 * WHY: 페이지 최상단의 핵심 메시지 전달
 * WHEN: 랜딩 페이지, 제품 소개 페이지의 첫 섹션
 *
 * STRUCTURE:
 * - Vertical stack (gap: 24px)
 * - Center aligned
 * - Large top/bottom padding (128px)
 * - Max width for readability (800px)
 *
 * CHILDREN:
 * - Badge (optional)
 * - Title (Prose.Title xl)
 * - Subtitle (Prose.Body)
 * - Actions (Row.Actions.Center)
 */
Hero: {
  gap: Space.n24,
  py: Space.n128,
  px: Space.n24,
  align: "center",
  maxWidth: Size.n800,
} as const,
```

### 3. 기존 앱 Migration 전략

```tsx
// Before: 직접 Frame 조합
<Frame
  override={{
    gap: Space.n24,
    py: Space.n128,
    px: Space.n24,
    align: "center"
  }}
>
  ...
</Frame>

// After: Layout Token 사용
<Frame layout={Layout.Stack.Hero}>
  ...
</Frame>

// Migration은 점진적으로!
// 1. 자주 사용되는 패턴부터 Layout Token으로 추출
// 2. 기존 코드는 그대로 둬도 됨 (호환성 유지)
// 3. 새 코드부터 Layout Token 사용
```

---

## 결론

### Props 방식 → Layout Token 방식

| 항목 | Props 방식 ❌ | Layout Token 방식 ✅ |
|------|--------------|---------------------|
| 학습 곡선 | 각 Block API 외워야 함 | Frame만 알면 됨 |
| 확장성 | Props 추가 = Breaking change | Token 추가 = Non-breaking |
| 자유도 | Block 구조에 갇힘 | 완전한 자유 |
| 재사용성 | Block 단위로만 재사용 | 모든 조각 재사용 가능 |
| 유지보수 | Props 인터페이스 관리 복잡 | Token만 관리하면 됨 |

### 핵심 메시지

> **"Block은 Component가 아니다. Block은 Layout Token이다."**
>
> - Component를 만들지 말고, Layout Token을 만들어라
> - Props를 정의하지 말고, 의미 있는 조합을 Layout으로 저장하라
> - API를 외우게 하지 말고, 이미 아는 것을 조합하게 하라

---

## 다음 단계

1. ✅ **Layout.Marketing.ts 작성** - Hero, Features, CTA, FAQ, Footer
2. ✅ **Layout.Application.ts 작성** - Sidebar, AppHeader, Toolbar, Panel
3. ✅ **Layout.Component.ts 작성** - Card, List, Item 등
4. ✅ **Migration Guide 작성** - 기존 앱을 Layout Token으로 전환
5. ✅ **Storybook 예시** - Layout Token 사용 예시 문서화
