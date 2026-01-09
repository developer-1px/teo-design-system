# Layout Patterns (레이아웃 패턴)

반응형이고 유연한 레이아웃을 구성하는 패턴입니다.

---

## 개요

Layout Patterns는 **다양한 화면 크기와 컨텐츠에 대응하는 레이아웃 구조**를 정의합니다. CSS Grid, Flexbox, Container Queries 등을 활용합니다.

### 왜 필요한가?
- **반응형 디자인**: 모든 디바이스 대응
- **유연성**: 콘텐츠 양 변화에 적응
- **일관성**: 예측 가능한 레이아웃 구조
- **유지보수성**: 재사용 가능한 레이아웃 패턴

---

## 1. Responsive Patterns

### 1.1 Breakpoint-based Layout

#### 설명
미디어 쿼리를 사용한 전통적인 반응형 레이아웃입니다.

#### 구현 예제

```tsx
export function ResponsiveGrid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '16px',
        padding: '16px',
      }}
    >
      {children}
    </div>
  );
}

// CSS Media Query 버전
const styles = `
  .responsive-grid {
    display: grid;
    gap: 16px;
    padding: 16px;
  }

  /* Mobile */
  @media (max-width: 640px) {
    .responsive-grid {
      grid-template-columns: 1fr;
    }
  }

  /* Tablet */
  @media (min-width: 641px) and (max-width: 1024px) {
    .responsive-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* Desktop */
  @media (min-width: 1025px) {
    .responsive-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`;
```

---

### 1.2 Container Queries

#### 설명
부모 컨테이너 크기에 따라 반응하는 최신 CSS 기법입니다.

```tsx
export function ContainerQueryCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        containerType: 'inline-size',
        border: '1px solid var(--color-border-default)',
        borderRadius: '8px',
        padding: '16px',
      }}
    >
      {children}
    </div>
  );
}

// CSS
const styles = `
  .card {
    container-type: inline-size;
  }

  .card-content {
    display: flex;
    flex-direction: column;
  }

  /* 컨테이너가 600px 이상일 때 */
  @container (min-width: 600px) {
    .card-content {
      flex-direction: row;
      gap: 24px;
    }
  }
`;
```

---

### 1.3 useMediaQuery Hook

#### 설명
JavaScript로 미디어 쿼리를 감지하는 Hook입니다.

```tsx
import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

// 사용 예제
export function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return (
    <div>
      {isMobile && <MobileLayout />}
      {isTablet && <TabletLayout />}
      {isDesktop && <DesktopLayout />}
    </div>
  );
}
```

---

## 2. Grid Systems

### 2.1 12-Column Grid

#### 설명
전통적인 12컬럼 그리드 시스템입니다.

```tsx
interface GridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
}

export function Grid({ children, columns = 12, gap = 16 }: GridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
      }}
    >
      {children}
    </div>
  );
}

interface ColProps {
  children: React.ReactNode;
  span?: number;
  offset?: number;
}

export function Col({ children, span = 1, offset = 0 }: ColProps) {
  return (
    <div
      style={{
        gridColumn: `span ${span}`,
        gridColumnStart: offset > 0 ? offset + 1 : undefined,
      }}
    >
      {children}
    </div>
  );
}

// 사용 예제
<Grid columns={12} gap={16}>
  <Col span={12}>Full width header</Col>
  <Col span={8}>Main content (8/12)</Col>
  <Col span={4}>Sidebar (4/12)</Col>
  <Col span={6}>Half width (6/12)</Col>
  <Col span={6}>Half width (6/12)</Col>
</Grid>
```

---

### 2.2 CSS Grid Areas

#### 설명
Named Grid Areas를 사용한 의미론적 레이아웃입니다.

```tsx
export function IDELayout() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateAreas: `
          "header header header"
          "sidebar editor panel"
          "footer footer footer"
        `,
        gridTemplateColumns: '250px 1fr 300px',
        gridTemplateRows: 'auto 1fr auto',
        height: '100vh',
        gap: '1px',
        background: 'var(--color-border-default)',
      }}
    >
      <header style={{ gridArea: 'header', background: 'var(--color-surface-base)' }}>
        Header
      </header>
      <aside style={{ gridArea: 'sidebar', background: 'var(--color-surface-base)' }}>
        Sidebar
      </aside>
      <main style={{ gridArea: 'editor', background: 'var(--color-surface-base)' }}>
        Editor
      </main>
      <aside style={{ gridArea: 'panel', background: 'var(--color-surface-base)' }}>
        Panel
      </aside>
      <footer style={{ gridArea: 'footer', background: 'var(--color-surface-base)' }}>
        Footer
      </footer>
    </div>
  );
}
```

---

### 2.3 Bento Grid

#### 설명
다양한 크기의 카드를 배치하는 현대적인 그리드 레이아웃입니다.

```tsx
export function BentoGrid() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(3, 200px)',
        gap: '16px',
        padding: '16px',
      }}
    >
      {/* Large card (2x2) */}
      <div
        style={{
          gridColumn: 'span 2',
          gridRow: 'span 2',
          background: 'var(--color-surface-elevated)',
          borderRadius: '12px',
          padding: '24px',
        }}
      >
        Featured Content
      </div>

      {/* Medium cards (1x2) */}
      <div
        style={{
          gridColumn: 'span 1',
          gridRow: 'span 2',
          background: 'var(--color-surface-elevated)',
          borderRadius: '12px',
          padding: '16px',
        }}
      >
        Tall Card
      </div>

      <div
        style={{
          gridColumn: 'span 1',
          gridRow: 'span 2',
          background: 'var(--color-surface-elevated)',
          borderRadius: '12px',
          padding: '16px',
        }}
      >
        Tall Card
      </div>

      {/* Small cards (1x1) */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          style={{
            background: 'var(--color-surface-elevated)',
            borderRadius: '12px',
            padding: '16px',
          }}
        >
          Card {i + 1}
        </div>
      ))}
    </div>
  );
}
```

---

## 3. Flexbox Patterns

### 3.1 Stack (Vertical/Horizontal)

#### 설명
간격이 일정한 수직/수평 스택 레이아웃입니다.

```tsx
interface StackProps {
  children: React.ReactNode;
  direction?: 'vertical' | 'horizontal';
  gap?: number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around';
}

export function Stack({
  children,
  direction = 'vertical',
  gap = 8,
  align = 'stretch',
  justify = 'start',
}: StackProps) {
  const alignItems = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
  }[align];

  const justifyContent = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    'space-between': 'space-between',
    'space-around': 'space-around',
  }[justify];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        gap,
        alignItems,
        justifyContent,
      }}
    >
      {children}
    </div>
  );
}

// 사용 예제
<Stack direction="vertical" gap={16} align="start">
  <h2>Title</h2>
  <p>Description</p>
  <button>Action</button>
</Stack>

<Stack direction="horizontal" gap={8} justify="space-between">
  <span>Left</span>
  <span>Right</span>
</Stack>
```

---

### 3.2 Cluster (Wrap)

#### 설명
공간이 부족하면 자동으로 줄바꿈하는 레이아웃입니다.

```tsx
interface ClusterProps {
  children: React.ReactNode;
  gap?: number;
  justify?: 'start' | 'center' | 'end';
}

export function Cluster({ children, gap = 8, justify = 'start' }: ClusterProps) {
  const justifyContent = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
  }[justify];

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap,
        justifyContent,
      }}
    >
      {children}
    </div>
  );
}

// 사용 예제 (Tag List)
<Cluster gap={8}>
  <span className="tag">React</span>
  <span className="tag">TypeScript</span>
  <span className="tag">CSS</span>
  <span className="tag">Design Systems</span>
</Cluster>
```

---

### 3.3 Sidebar Layout

#### 설명
고정 너비 사이드바와 유연한 메인 콘텐츠 레이아웃입니다.

```tsx
interface SidebarLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  sidebarWidth?: number;
  gap?: number;
  sidebarPosition?: 'left' | 'right';
}

export function SidebarLayout({
  sidebar,
  children,
  sidebarWidth = 250,
  gap = 16,
  sidebarPosition = 'left',
}: SidebarLayoutProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: sidebarPosition === 'left' ? 'row' : 'row-reverse',
        gap,
        height: '100%',
      }}
    >
      <aside
        style={{
          width: sidebarWidth,
          flexShrink: 0,
        }}
      >
        {sidebar}
      </aside>
      <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
    </div>
  );
}
```

---

## 4. Sizing Patterns

### 4.1 Intrinsic Sizing

#### 설명
콘텐츠 크기에 따라 자동으로 크기가 결정되는 패턴입니다.

```tsx
export function IntrinsicCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 'fit-content', // 콘텐츠 너비에 맞춤
        maxWidth: '100%', // 부모 너비 초과 방지
        padding: '16px',
        background: 'var(--color-surface-base)',
        borderRadius: '8px',
      }}
    >
      {children}
    </div>
  );
}
```

---

### 4.2 Aspect Ratio

#### 설명
고정 비율을 유지하는 컨테이너입니다.

```tsx
interface AspectRatioProps {
  ratio: number; // 예: 16/9, 4/3, 1
  children: React.ReactNode;
}

export function AspectRatio({ ratio, children }: AspectRatioProps) {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: `${(1 / ratio) * 100}%`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// 사용 예제
<AspectRatio ratio={16 / 9}>
  <img src="/video-thumbnail.jpg" alt="Video" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
</AspectRatio>
```

---

### 4.3 Clamp (Fluid Typography/Spacing)

#### 설명
최소/최대 값 사이에서 유동적으로 크기가 변하는 패턴입니다.

```tsx
export function FluidText({ children }: { children: React.ReactNode }) {
  return (
    <h1
      style={{
        fontSize: 'clamp(1.5rem, 5vw, 3rem)', // min, preferred, max
        lineHeight: 1.2,
      }}
    >
      {children}
    </h1>
  );
}

export function FluidContainer({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 'clamp(300px, 90%, 1200px)',
        margin: '0 auto',
        padding: 'clamp(1rem, 3vw, 2rem)',
      }}
    >
      {children}
    </div>
  );
}
```

---

## 5. Spacing Patterns

### 5.1 Spacer Component

#### 설명
명시적인 간격 조정 컴포넌트입니다.

```tsx
interface SpacerProps {
  size?: number;
  axis?: 'horizontal' | 'vertical';
}

export function Spacer({ size = 16, axis = 'vertical' }: SpacerProps) {
  return (
    <div
      style={{
        width: axis === 'horizontal' ? size : 1,
        height: axis === 'vertical' ? size : 1,
        flexShrink: 0,
      }}
    />
  );
}

// 사용 예제
<div>
  <Header />
  <Spacer size={32} />
  <Content />
  <Spacer size={24} />
  <Footer />
</div>
```

---

### 5.2 Divider

#### 설명
시각적 구분선 컴포넌트입니다.

```tsx
interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  spacing?: number;
}

export function Divider({ orientation = 'horizontal', spacing = 16 }: DividerProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      style={{
        width: orientation === 'horizontal' ? '100%' : '1px',
        height: orientation === 'vertical' ? '100%' : '1px',
        background: 'var(--color-border-default)',
        margin:
          orientation === 'horizontal'
            ? `${spacing}px 0`
            : `0 ${spacing}px`,
      }}
    />
  );
}
```

---

## 6. Scrollable Patterns

### 6.1 Scroll Container

#### 설명
고정 높이에서 스크롤 가능한 컨테이너입니다.

```tsx
interface ScrollContainerProps {
  children: React.ReactNode;
  maxHeight?: number | string;
}

export function ScrollContainer({ children, maxHeight = 400 }: ScrollContainerProps) {
  return (
    <div
      style={{
        maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {children}
    </div>
  );
}
```

---

### 6.2 Horizontal Scroll

#### 설명
수평 스크롤 가능한 컨테이너입니다.

```tsx
export function HorizontalScroll({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        overflowX: 'auto',
        overflowY: 'hidden',
        padding: '16px 0',
        // Hide scrollbar (optional)
        scrollbarWidth: 'thin',
      }}
    >
      {children}
    </div>
  );
}

// 사용 예제 (카드 리스트)
<HorizontalScroll>
  {items.map((item) => (
    <div key={item.id} style={{ minWidth: '300px', flexShrink: 0 }}>
      <Card data={item} />
    </div>
  ))}
</HorizontalScroll>
```

---

### 6.3 Sticky Header

#### 설명
스크롤 시 상단에 고정되는 헤더입니다.

```tsx
export function StickyHeader({ children }: { children: React.ReactNode }) {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--color-surface-base)',
        borderBottom: '1px solid var(--color-border-default)',
        padding: '16px',
      }}
    >
      {children}
    </header>
  );
}
```

---

## 7. IDDL Integration

### 7.1 Layout with IDDL

#### 설명
IDDL 컴포넌트를 사용한 레이아웃 구성입니다.

```tsx
import { Group } from '@/components/dsl/Group';
import { Section } from '@/components/dsl/Section';

export function IDDLLayout() {
  return (
    <Section role="Page" prominence="Primary">
      {/* Header */}
      <Group role="Navigation" prominence="Primary" gap={2}>
        <span>Logo</span>
        <nav>Menu</nav>
      </Group>

      {/* Main Content */}
      <Group role="Container" prominence="Primary" gap={4}>
        <Section role="Sidebar" prominence="Secondary">
          Sidebar
        </Section>
        <Section role="Main" prominence="Primary">
          Main Content
        </Section>
      </Group>

      {/* Footer */}
      <Group role="Footer" prominence="Tertiary">
        Footer
      </Group>
    </Section>
  );
}
```

---

## 구현 우선순위

### 🔴 High Priority (즉시 구현)
1. **Stack (Vertical/Horizontal)** - 기본 레이아웃 필수
2. **Grid System** - 복잡한 레이아웃 구성
3. **Responsive Patterns** - 모바일 대응 필수

### 🟡 Medium Priority
4. **Sidebar Layout** - 일반적인 앱 레이아웃
5. **Aspect Ratio** - 미디어 콘텐츠
6. **Scroll Container** - 긴 콘텐츠 처리

### 🟢 Low Priority
7. **Bento Grid** - 고급 대시보드
8. **Parallax** - 시각적 효과

---

## 참고 자료

### 주요 라이브러리
- **Every Layout**: https://every-layout.dev/
- **Layout Primitives**: https://layout-primitives.com/
- **Panda CSS**: https://panda-css.com/
- **Tailwind CSS**: https://tailwindcss.com/

### CSS 기법
- **CSS Grid**: https://css-tricks.com/snippets/css/complete-guide-grid/
- **Flexbox**: https://css-tricks.com/snippets/css/a-guide-to-flexbox/
- **Container Queries**: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries

### 관련 문서
- [LAYOUT_SYSTEM.md](../LAYOUT_SYSTEM.md)
- [Component Role Mapping](../component-role-mapping.md)
