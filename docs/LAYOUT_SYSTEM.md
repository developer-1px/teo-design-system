# Layout System

> **범용 레이아웃 시스템**: 모든 OS 앱에서 사용 가능한 통합 레이아웃 컴포넌트

---

## 인터랙티브 데모

다양한 Layout variant를 직접 확인해보세요.

<!-- INTERACTIVE:LayoutDemo -->

---

## 핵심 개념

### Layer → Layout으로의 진화

기존 "Layer"는 시각적 깊이만 제공했지만, 새로운 **Layout**은:

1. **Depth (깊이)**: 시각적 계층 구조 (0-6)
2. **Variant (레이아웃 타입)**: grid, flex, stack, scroll, surface
3. **Island**: 독립적인 UI 영역 (Bento Grid의 각 셀)
4. **Resizable**: 사용자 커스터마이징 가능
5. **Collapsible**: 펼침/접힘

---

## Layout Variants

### 1. Surface (기본)

기존 Layer의 동작. 단순 컨테이너로 사용.

```tsx
<Layout depth={2} variant="surface" rounded="lg" className="p-4">
  <h2>Panel</h2>
</Layout>
```

### 2. Grid (Bento Grid)

CSS Grid 기반 레이아웃. 미리 정의된 템플릿 또는 커스텀 그리드.

```tsx
<Layout variant="grid" template="sidebar-content" depth={2} gap={4}>
  <Layout.Island area="sidebar">
    <FileTree />
  </Layout.Island>
  <Layout.Island area="content">
    <Editor />
  </Layout.Island>
</Layout>
```

### 3. Flex

Flexbox 기반 레이아웃. 유연한 배치.

```tsx
<Layout variant="flex" depth={2} gap={2} className="items-center justify-between">
  <h1>Title</h1>
  <button>Action</button>
</Layout>
```

### 4. Stack

수직/수평 스택. 스크롤 가능한 컨테이너.

```tsx
<Layout variant="stack" direction="vertical" depth={1} className="h-96 p-2">
  {items.map(item => (
    <div key={item.id}>{item.name}</div>
  ))}
</Layout>
```

### 5. Scroll

순수 스크롤 컨테이너.

```tsx
<Layout variant="scroll" depth={1} className="h-64">
  <LongContent />
</Layout>
```

---

## Grid Templates

### IDE 레이아웃

```tsx
<Layout variant="grid" template="ide">
  <Layout.Island area="nav">...</Layout.Island>
  <Layout.Island area="sidebar">...</Layout.Island>
  <Layout.Island area="editor">...</Layout.Island>
  <Layout.Island area="terminal">...</Layout.Island>
</Layout>
```

### Sidebar-Content

```tsx
<Layout variant="grid" template="sidebar-content">
  <Layout.Island area="sidebar" variant="scroll">
    <Navigation />
  </Layout.Island>
  <Layout.Island area="content" variant="flex">
    <MainContent />
  </Layout.Island>
</Layout>
```

### Dashboard (Bento Grid)

```tsx
<Layout variant="grid" template="dashboard" gap={4}>
  <Layout.Island>
    <Card title="Stats" />
  </Layout.Island>
  <Layout.Island>
    <Card title="Chart" />
  </Layout.Island>
  <Layout.Island>
    <Card title="Activity" />
  </Layout.Island>
</Layout>
```

### Custom Grid

```tsx
<Layout
  variant="grid"
  template="custom"
  gridTemplate="'header header' 'sidebar main' 'footer footer' / 200px 1fr"
>
  <Layout.Island area="header">...</Layout.Island>
  <Layout.Island area="sidebar">...</Layout.Island>
  <Layout.Island area="main">...</Layout.Island>
  <Layout.Island area="footer">...</Layout.Island>
</Layout>
```

---

## Depth System

기존 Layer의 깊이 시스템 유지:

| Depth | 용도 | 배경색 | 그림자 |
|-------|------|--------|--------|
| **0** | App base | `#fafafa` | none |
| **1** | Sunken (input) | `#f5f5f5` | inset |
| **2** | Base surface | `#ffffff` | none |
| **3** | Primary surface | `#ffffff` | subtle |
| **4** | Elevated | `#ffffff` | medium |
| **5** | Floating | `#ffffff` | strong |
| **6** | Overlay (modal) | `#ffffff` | strongest |

```tsx
// ✅ 올바른 사용 - 낮은 depth 안에 높은 depth
<Layout depth={2}>
  <Layout depth={1}>
    <input />
  </Layout>
</Layout>

// ❌ 잘못된 사용 - depth 역전
<Layout depth={1}>
  <Layout depth={2} /> {/* 금지 */}
</Layout>
```

---

## Island Architecture

독립적인 UI 영역. Bento Grid의 각 셀.

### 특징

1. **격리**: 각 Island는 독립적으로 동작
2. **재사용성**: 다양한 레이아웃에서 재사용
3. **조합**: 다른 variant의 Island 조합 가능

```tsx
<Layout variant="grid" template="split">
  {/* Island 1: Scroll 가능한 리스트 */}
  <Layout.Island area="left" variant="scroll" depth={2}>
    <ItemList />
  </Layout.Island>

  {/* Island 2: Flex 기반 상세 */}
  <Layout.Island area="right" variant="flex" depth={3}>
    <ItemDetail />
  </Layout.Island>
</Layout>
```

---

## Resizable & Collapsible

### Resizable

크기 조절 가능한 Layout.

```tsx
<Layout variant="flex" gap={0}>
  <Layout.Island
    variant="scroll"
    resizable
    minWidth={200}
    maxWidth={400}
    className="w-64"
  >
    <Sidebar />
  </Layout.Island>

  <ResizeHandle direction="vertical" />

  <Layout.Island variant="flex" className="flex-1">
    <Main />
  </Layout.Island>
</Layout>
```

### Collapsible

펼침/접힘 가능한 Layout.

```tsx
const [isOpen, setIsOpen] = useState(false);

<Layout variant="stack" collapsible className={isOpen ? 'h-64' : 'h-0'}>
  <Terminal />
</Layout>
```

---

## 실전 예제

### 1. IDE 레이아웃

```tsx
function IDELayout() {
  return (
    <Layout depth={0} variant="flex" direction="vertical" className="h-screen">
      {/* Top Toolbar */}
      <Layout depth={4} variant="flex" className="h-12 px-2 items-center">
        <Logo />
        <Menu />
      </Layout>

      {/* Main Area */}
      <Layout variant="grid" template="sidebar-content" className="flex-1">
        {/* Sidebar - scrollable */}
        <Layout.Island area="sidebar" variant="scroll" depth={2} resizable>
          <FileTree />
        </Layout.Island>

        {/* Editor - flex */}
        <Layout.Island area="content" variant="flex" direction="vertical">
          <EditorTabs />
          <CodeEditor />
        </Layout.Island>
      </Layout>

      {/* Bottom Terminal - collapsible */}
      <Layout variant="stack" collapsible depth={1} className="h-48">
        <Terminal />
      </Layout>
    </Layout>
  );
}
```

### 2. Dashboard (Bento Grid)

```tsx
function Dashboard() {
  return (
    <Layout
      variant="grid"
      template="dashboard"
      gap={4}
      className="p-4"
    >
      {/* 큰 카드 */}
      <Layout.Island
        depth={3}
        rounded="lg"
        className="col-span-2 row-span-2"
      >
        <Chart />
      </Layout.Island>

      {/* 작은 카드들 */}
      <Layout.Island depth={3} rounded="lg">
        <StatsCard title="Users" value="1,234" />
      </Layout.Island>

      <Layout.Island depth={3} rounded="lg">
        <StatsCard title="Revenue" value="$5,678" />
      </Layout.Island>

      <Layout.Island depth={3} rounded="lg" className="col-span-2">
        <ActivityFeed />
      </Layout.Island>
    </Layout>
  );
}
```

### 3. Split View

```tsx
function SplitView() {
  return (
    <Layout variant="grid" template="split" gap={0} className="h-screen">
      <Layout.Island area="left" variant="scroll" depth={2} resizable>
        <MarkdownEditor />
      </Layout.Island>

      <ResizeHandle direction="vertical" />

      <Layout.Island area="right" variant="scroll" depth={3}>
        <MarkdownPreview />
      </Layout.Island>
    </Layout>
  );
}
```

---

## 디자인 원칙

### 1. Grid vs Flex vs Scroll

- **Grid**: 정적 구조, 명확한 영역 구분
- **Flex**: 동적 배치, 요소 정렬
- **Stack/Scroll**: 컨텐츠 오버플로우 처리

### 2. Depth 규칙

- 낮은 depth 안에 높은 depth 배치 (역전 금지)
- 4단계 이상 중첩 금지
- 같은 depth는 같은 중요도

### 3. Island 활용

- 각 Island는 독립적인 기능 단위
- 상태 공유는 명시적으로 (props, context)
- 재사용 가능하도록 설계

### 4. Resizable 사용

- 사용자가 조절해야 하는 영역에만
- 최소/최대 크기 제약 설정
- 키보드 접근성 지원

---

## 마이그레이션 가이드

### Before (Layer)

```tsx
<Layer level={2} className="flex flex-col">
  <Sidebar />
  <Panel elevated />
</Layer>
```

### After (Layout)

```tsx
<Layout variant="flex" direction="vertical" depth={2}>
  <Layout.Island variant="scroll">
    <Sidebar />
  </Layout.Island>
  <Layout.Island depth={3}>
    <Panel />
  </Layout.Island>
</Layout>
```

---

## API Reference

### Layout Props

```typescript
interface LayoutProps {
  // 시각적 깊이
  depth?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

  // 레이아웃 타입
  variant?: 'surface' | 'grid' | 'flex' | 'stack' | 'scroll';

  // Grid 템플릿
  template?: 'ide' | 'sidebar-content' | 'dashboard' | 'split' | 'custom';

  // 커스텀 그리드
  gridTemplate?: string;

  // Stack 방향
  direction?: 'horizontal' | 'vertical';

  // 둥근 모서리
  rounded?: boolean | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

  // 클릭 가능 (호버 효과)
  clickable?: boolean;

  // 크기 조절 가능
  resizable?: boolean;

  // 펼침/접힘 가능
  collapsible?: boolean;

  // 떠있는 패널
  floating?: boolean;

  // Gap
  gap?: 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16 | 24;
}
```

### Layout.Island Props

```typescript
interface LayoutIslandProps extends Omit<LayoutProps, 'depth'> {
  // Grid area name
  area?: string;

  // Island depth
  depth?: LayoutDepth;

  // 크기 제약 (resizable일 때)
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
}
```

---

## 참고 자료

- [DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md) - 디자인 원칙
- [EXAMPLES.md](./EXAMPLES.md) - 추가 예제
- [Bento Grid 트렌드](https://bentogrids.com/)
- [Islands Architecture](https://www.patterns.dev/vanilla/islands-architecture/)
