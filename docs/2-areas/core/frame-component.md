# Frame Component - 순수 레이아웃 프리미티브

## 개요

`Frame`은 순수한 레이아웃을 위한 기본 컴포넌트입니다. IDDL의 의미론적 역할(`role`, `prominence`, `intent`)과는 독립적으로 동작하며, 오직 **레이아웃만** 담당합니다.

## 철학

### IDDL Block vs Frame

| Aspect | Block (IDDL) | Frame (Layout) |
|--------|--------------|----------------|
| **목적** | 의미론적 구조 (What/Why) | 순수 레이아웃 (How) |
| **Props** | role, prominence, intent, density | direction, gap, justify, align |
| **사용** | 비즈니스 로직, 컴포넌트 구조 | 디자인 시스템 내부, 레이아웃 |
| **예시** | `<Block role="Card">` | `<Frame direction="row" gap={4}>` |

### 언제 사용하나?

**Frame 사용**:
- 디자인 시스템 내부 구현
- 순수 레이아웃이 필요할 때
- 의미론적 역할이 없는 컨테이너
- 프로토타이핑, 빠른 레이아웃

**Block 사용**:
- 애플리케이션 코드
- 의미 있는 UI 구조
- IDDL 토큰 시스템 활용
- 일관된 디자인 패턴

## API

### Props

```typescript
interface FrameProps {
  /** Flex direction */
  direction?: 'row' | 'column';

  /** Gap between children (in 4px units: 0, 1, 2, 3, 4, 6, 8, 12, 16, 24) */
  gap?: GapScale;

  /** Justify content (main axis) */
  justify?: JustifyContent;

  /** Align items (cross axis) */
  align?: AlignItems;

  /** Allow wrapping */
  wrap?: boolean;

  /** Full width */
  fullWidth?: boolean;

  /** Full height */
  fullHeight?: boolean;

  /** Additional className */
  className?: string;

  /** Children */
  children?: React.ReactNode;

  /** HTML element type */
  as?: keyof JSX.IntrinsicElements;
}
```

### Gap Scale

Gap은 4px 단위 스케일을 사용합니다:

```typescript
type GapScale = 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16 | 24;

// 매핑:
0  → 0px
1  → 4px
2  → 8px
3  → 12px
4  → 16px
6  → 24px
8  → 32px
12 → 48px
16 → 64px
24 → 96px
```

### Justify Content

```typescript
type JustifyContent =
  | 'start'    // justify-start
  | 'end'      // justify-end
  | 'center'   // justify-center
  | 'between'  // justify-between
  | 'around'   // justify-around
  | 'evenly'   // justify-evenly
  | 'stretch'; // justify-stretch
```

### Align Items

```typescript
type AlignItems =
  | 'start'    // items-start
  | 'end'      // items-end
  | 'center'   // items-center
  | 'baseline' // items-baseline
  | 'stretch'; // items-stretch
```

## 사용 예제

### 기본 사용

```tsx
import { Frame } from '@/components/dsl/shared/Frame';

// 가로 레이아웃
<Frame direction="row" gap={4} justify="between" align="center">
  <div>Left</div>
  <div>Right</div>
</Frame>

// 세로 레이아웃
<Frame direction="column" gap={2}>
  <div>Top</div>
  <div>Middle</div>
  <div>Bottom</div>
</Frame>
```

### Convenience Methods

```tsx
// Frame.Row - 가로 레이아웃
<Frame.Row gap={4} justify="between">
  <button>Cancel</button>
  <button>OK</button>
</Frame.Row>

// Frame.Column - 세로 레이아웃
<Frame.Column gap={2}>
  <h1>Title</h1>
  <p>Content</p>
</Frame.Column>

// Frame.Stack - 세로 + 기본 gap=4
<Frame.Stack>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Frame.Stack>

// Frame.Inline - 가로 + 기본 gap=2
<Frame.Inline>
  <span>Tag 1</span>
  <span>Tag 2</span>
  <span>Tag 3</span>
</Frame.Inline>
```

### 실전 예제

#### Header with Actions

```tsx
<Frame.Row justify="between" align="center" fullWidth>
  <Frame.Row gap={2} align="center">
    <Logo />
    <h1>My App</h1>
  </Frame.Row>

  <Frame.Inline>
    <Button>Settings</Button>
    <Button>Profile</Button>
  </Frame.Inline>
</Frame.Row>
```

#### Form Layout

```tsx
<Frame.Stack gap={4}>
  <Frame.Column gap={1}>
    <label>Email</label>
    <input type="email" />
  </Frame.Column>

  <Frame.Column gap={1}>
    <label>Password</label>
    <input type="password" />
  </Frame.Column>

  <Frame.Row gap={2} justify="end">
    <Button variant="ghost">Cancel</Button>
    <Button variant="primary">Login</Button>
  </Frame.Row>
</Frame.Stack>
```

#### Card Content

```tsx
<Frame.Column gap={3} fullWidth>
  <Frame.Row justify="between" align="start">
    <h2>Card Title</h2>
    <IconButton icon="more" />
  </Frame.Row>

  <p>Card description text goes here...</p>

  <Frame.Inline wrap>
    <Tag>React</Tag>
    <Tag>TypeScript</Tag>
    <Tag>Tailwind</Tag>
  </Frame.Inline>
</Frame.Column>
```

## 내부 구현에서 활용

디자인 시스템의 컴포넌트 내부에서 Frame을 활용할 수 있습니다:

```tsx
// Before: 수동 className
export function Button({ icon, children }) {
  return (
    <button className="flex items-center gap-2">
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
}

// After: Frame 활용
export function Button({ icon, children }) {
  return (
    <button>
      <Frame.Inline align="center">
        {icon && <Icon name={icon} />}
        {children}
      </Frame.Inline>
    </button>
  );
}
```

## IDDL Block과의 조합

Frame과 Block을 함께 사용할 수 있습니다:

```tsx
// Block으로 의미 정의, Frame으로 레이아웃
<Block role="Card" prominence="Standard">
  <Frame.Stack gap={4}>
    <Text role="Title">Card Title</Text>
    <Text role="Body">Card content...</Text>

    <Frame.Row justify="end">
      <Action role="Button">Cancel</Action>
      <Action role="Button" prominence="Primary">Save</Action>
    </Frame.Row>
  </Frame.Stack>
</Block>
```

## 주의사항

### ❌ 안티패턴

```tsx
// BAD: 애플리케이션 코드에서 Frame만 사용
<Frame.Stack>
  <Frame.Row justify="between">
    <span>User Settings</span>
    <button>Edit</button>
  </Frame.Row>
  <Frame.Column gap={2}>
    <input placeholder="Name" />
    <input placeholder="Email" />
  </Frame.Column>
</Frame.Stack>

// GOOD: IDDL Block으로 의미 부여
<Block role="Card">
  <Block role="Toolbar">
    <Text role="Title">User Settings</Text>
    <Action role="IconButton" icon="edit" />
  </Block>
  <Block role="Form">
    <Field role="TextInput" label="Name" />
    <Field role="EmailInput" label="Email" />
  </Block>
</Block>
```

### ✅ 올바른 사용

```tsx
// GOOD: 디자인 시스템 내부 구현
function Card({ title, actions, children }) {
  return (
    <Block role="Card">
      <Frame.Stack gap={4}>
        <Frame.Row justify="between" align="center">
          <Text role="Title">{title}</Text>
          <Frame.Inline>{actions}</Frame.Inline>
        </Frame.Row>
        {children}
      </Frame.Stack>
    </Block>
  );
}
```

## 마이그레이션 가이드

기존의 수동 레이아웃 코드를 Frame으로 변경:

```tsx
// Before
<div className="flex flex-col gap-4">
  <div className="flex items-center justify-between">
    <h2>Title</h2>
    <button>Edit</button>
  </div>
  <p>Content</p>
</div>

// After
<Frame.Stack gap={4}>
  <Frame.Row justify="between" align="center">
    <h2>Title</h2>
    <button>Edit</button>
  </Frame.Row>
  <p>Content</p>
</Frame.Stack>
```

## 결론

`Frame`은 순수한 레이아웃 프리미티브로, 디자인 시스템 구현과 프로토타이핑에 유용합니다. 하지만 **애플리케이션 코드에서는 IDDL Block을 우선 사용**하여 의미론적 구조를 명확히 해야 합니다.

**원칙**:
- 디자인 시스템 내부 → Frame 사용 가능
- 애플리케이션 코드 → Block 우선, Frame은 보조
- 의미가 있으면 Block, 순수 레이아웃이면 Frame
