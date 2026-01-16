# Block Tier Hierarchy Analysis - 위상 정리

**작성일**: 2026-01-16
**목적**: Block의 올바른 위치를 Tier 위계 관점에서 분석
**문제**: Layout Token을 2-Tier에 넣으면 위상이 섞임

---

## 현재 Tier 구조 분석

### 1-Tier: 순수 수치 토큰
```typescript
// 1-Tier = 순수 수치, 의미 없음, 범용적
Space.n8    // "8px 간격" (어디든 사용 가능)
Size.n40    // "40px 크기" (어디든 사용 가능)
Radius.n6   // "6px 둥근 모서리" (어디든 사용 가능)

// 특징:
// - 숫자만 있음 (n8, n40, n6)
// - 용도가 명시되지 않음
// - 어디서든 사용 가능 (범용)
```

### 2-Tier: 의미적 별칭
```typescript
// 2-Tier = 의미적 이름, 1-Tier 조합
ActionSize.md.height   // = Size.n40 (Action의 중간 크기)
Radius2.lg            // = Radius.n12 (큰 둥근 모서리)

// 특징:
// - 의미적 이름 (md, lg, sm)
// - 1-Tier 토큰의 조합 또는 별칭
// - 특정 컴포넌트/용도와 연결 (ActionSize, Radius2)
```

### 현재 Layout의 위치 (2-Tier처럼 사용 중)
```typescript
// Layout = 1-Tier 토큰들의 조합 (마치 2-Tier처럼)
Layout.Stack.Content.Default = {
  gap: Space.n12,      // 1-Tier
  p: Space.n0,         // 1-Tier
}

Layout.Row.Header.Default = {
  row: true,
  justify: "between",
  align: "center",
  py: Space.n12,       // 1-Tier
  px: Space.n16,       // 1-Tier
}
```

---

## 문제: Tier 위상이 맞지 않음

### ❌ Layout을 2-Tier에 넣으면?

```typescript
// 2-Tier의 예시들
ActionSize.md        // Component-specific (Action 전용)
Radius2.lg          // Semantic alias (의미적 별칭)

// Layout을 2-Tier에 넣는다면?
Layout.Stack.Hero   // ??? 이건 뭐지?
```

**문제점:**
1. **분류 관점이 다름**
   - 2-Tier: "Component-specific" 또는 "Semantic alias"
   - Layout: "Usage context" (사용 맥락)

2. **2-Tier가 비대해짐**
   - ActionSize, Radius2, TextSize, ... 여기에 Layout까지?
   - 2-Tier의 정의가 모호해짐

3. **Layout의 특수성**
   - ActionSize는 "Action에만" 사용
   - Layout.Stack.Hero는 "어디든" 사용 가능 (범용 조합)

---

## 해결 방안 분석

### Option 1: Layout을 3-Tier로 승격 ❌

```typescript
// 3-Tier = Layout Preset
Layout.Stack.Hero
Layout.Grid.Features
Layout.Application.Sidebar

// 문제:
// - 3-Tier가 생기면 계층이 너무 깊어짐
// - 1-Tier (수치) → 2-Tier (의미) → 3-Tier (조합)?
// - Tier의 정의가 불명확해짐
```

**결론: X**
- Tier를 추가하는 것은 복잡도만 증가
- 1-Tier, 2-Tier 구조는 명확하고 단순함

---

### Option 2: Layout을 별도 차원으로 분리 ✅

```typescript
/**
 * Tier는 "추상화 레벨"
 * Layout은 "사용 맥락"
 *
 * 이 둘은 직교하는 개념!
 */

// 1-Tier: 추상화 레벨 1 (순수 수치)
Space.n8
Size.n40

// 2-Tier: 추상화 레벨 2 (의미적 별칭)
ActionSize.md
Radius2.lg

// Layout: 사용 맥락별 조합 (Tier와 직교)
Layout.Hero         // 히어로 섹션 맥락
Layout.Sidebar      // 사이드바 맥락
Layout.FeatureCard  // 기능 카드 맥락
```

**핵심:**
- Tier = "추상화 레벨" (숫자 → 의미)
- Layout = "사용 맥락" (어디서 쓰는가)
- 이 둘은 **직교하는 차원**

---

## 재설계: Layout의 올바른 위치

### Layout은 "Preset Library"

```typescript
/**
 * Layout은 Tier가 아니다.
 * Layout은 "자주 사용하는 Frame 조합의 라이브러리"
 *
 * 비유:
 * - 1-Tier, 2-Tier = "악기" (피아노, 기타)
 * - Layout = "악보" (자주 연주하는 곡)
 */

// Layout = Preset Library
export const Layout = {
  // Marketing/Landing Presets
  Hero: { ... },
  Features: { ... },
  CTA: { ... },

  // Application Presets
  Sidebar: { ... },
  AppHeader: { ... },
  Panel: { ... },

  // Component Presets
  Card: { ... },
  ListItem: { ... },
  NavItem: { ... },
}
```

---

## 최종 구조: 3차원 Token 체계

### 차원 1: Tier (추상화 레벨)
```
1-Tier: 순수 수치 토큰
  - Space.n8, Size.n40, Radius.n6
  - "8px", "40px", "6px"

2-Tier: 의미적 별칭/조합
  - ActionSize.md, Radius2.lg
  - "Action 중간 크기", "큰 둥근 모서리"
```

### 차원 2: Category (토큰 카테고리)
```
Spacing: Space, Padding, Gap
Sizing: Size, Width, Height
Visual: Radius, Shadow, Opacity
Typography: FontSize, LineHeight
```

### 차원 3: Preset (사용 맥락)
```
Layout: 자주 사용하는 Frame 조합
  - Layout.Hero
  - Layout.Sidebar
  - Layout.FeatureCard
```

---

## 구현: Layout Preset 파일 구조

```
src/design-system/
├── token/
│   ├── token.const.1tier.ts      # 1-Tier 수치 토큰
│   └── token.const.2tier.ts      # 2-Tier 의미 토큰
│
├── Frame/
│   ├── Frame.tsx
│   ├── FrameProps.ts
│   └── Layout/
│       └── Layout.ts             # ❌ 여기가 아님!
│
└── preset/                        # ✅ 새로운 위치
    ├── Layout.ts                  # Layout Preset 메인
    ├── Layout.Marketing.ts        # Marketing 맥락
    ├── Layout.Application.ts      # Application 맥락
    └── Layout.Component.ts        # Component 맥락
```

**WHY preset/ 디렉토리?**
- Layout은 "Preset" (미리 설정된 조합)
- Frame에 종속되지 않음 (Grid, Overlay 등에도 사용 가능)
- 독립적인 라이브러리로 관리

---

## Layout Preset 재정의

### 기존 문제
```typescript
// ❌ 기존: Layout이 Frame에 종속
import { Layout } from "../design-system/Frame/Layout/Layout";

// Frame의 하위 개념처럼 보임
<Frame layout={Layout.Stack.Content.Default} />
```

### 해결
```typescript
// ✅ 개선: Layout은 독립적 Preset
import { Layout } from "../design-system/preset/Layout";

// Frame에 적용 가능한 Preset
<Frame layout={Layout.Hero} />

// Grid에도 적용 가능
<Frame grid layout={Layout.Dashboard} />
```

---

## Layout Preset 명명 규칙

### 기존 문제: 너무 깊은 중첩
```typescript
// ❌ 너무 복잡함
Layout.Stack.Content.Default
Layout.Row.Header.Default
Layout.Grid.Cards.Default
```

### 해결: Flat한 구조
```typescript
// ✅ 간결하고 명확
Layout.Hero              // 히어로 섹션
Layout.Features          // 기능 소개 섹션
Layout.FeatureCard       // 기능 카드
Layout.Sidebar           // 사이드바
Layout.SidebarNav        // 사이드바 네비게이션
Layout.AppHeader         // 앱 헤더
Layout.Card              // 일반 카드
Layout.CardHeader        // 카드 헤더
Layout.ListItem          // 리스트 아이템
```

**명명 규칙:**
- `Layout.{Context}` - 맥락만 표현
- Stack/Row/Grid는 내부 구현 (이름에 노출 안 함)
- Nested는 점(.)으로 연결 (예: SidebarNav, CardHeader)

---

## 실전 예시: Tier 위계가 명확한 사용

### Hero Section

```typescript
// 1-Tier 직접 사용 (세밀한 제어)
<Frame
  override={{
    gap: Space.n24,      // 1-Tier
    py: Space.n128,      // 1-Tier
    px: Space.n24,       // 1-Tier
    align: "center",
  }}
>
  ...
</Frame>

// 2-Tier 사용 (의미적 별칭)
<Action size="md" rounded={Radius2.full} />
//      ^^^^^^^^  ^^^^^^^^^^^^^^^^^^^^
//      2-Tier    2-Tier

// Layout Preset 사용 (맥락별 조합)
<Frame layout={Layout.Hero}>
  ...
</Frame>
```

**각 레벨의 역할:**
- 1-Tier: 세밀한 조정 (override)
- 2-Tier: 컴포넌트 크기/스타일 (size, rounded)
- Layout: 전체 구조 (layout)

---

## Block의 올바른 위치

### Block은 무엇인가?

```typescript
/**
 * Block은 "완성된 UI 패턴"
 *
 * 1-Tier: 기본 재료 (밀가루, 설탕, 계란)
 * 2-Tier: 가공 재료 (반죽, 크림)
 * Layout: 레시피 (케이크 만드는 법)
 * Block: 완성품 (케이크)
 */
```

### Block ≠ Component
```typescript
// ❌ Block을 Component로 만들면?
function HeroBlock(props) {
  return <Frame layout={Layout.Hero}>{props.children}</Frame>
}

// 문제:
// - 또 다른 API (props)
// - 경직된 구조
// - 재사용 불가

// ✅ Block은 "조합 패턴 예시"
// src/examples/patterns/Hero.example.tsx
export function HeroExample() {
  return (
    <Frame layout={Layout.Hero}>
      <Frame layout={Layout.HeroBadge}>
        <Icon src={Sparkles} size={IconSize.n12} />
        <Text.Card.Note>New</Text.Card.Note>
      </Frame>

      <Text.Prose.Title variant="xl">Build faster</Text.Prose.Title>

      <Frame layout={Layout.Actions}>
        <Action label="Start" variant="primary" />
      </Frame>
    </Frame>
  )
}
```

**Block의 정체:**
- Component가 아니라 "Example Code"
- 복사해서 커스터마이징하는 용도
- Storybook/문서에서 참고용

---

## 최종 정리

### Tier 위계 (추상화 레벨)
```
1-Tier (Primitive)
  ↓ 사용
2-Tier (Semantic)
  ↓ 사용
Layout Preset (Contextual)
  ↓ 사용
Example Patterns (Complete UI)
```

### 파일 구조
```
src/design-system/
├── token/
│   ├── token.const.1tier.ts    # 1-Tier
│   └── token.const.2tier.ts    # 2-Tier
│
├── preset/
│   ├── Layout.ts               # Layout Preset
│   ├── Layout.Marketing.ts
│   ├── Layout.Application.ts
│   └── Layout.Component.ts
│
├── Frame/
├── Action/
├── Text/
└── ...

src/examples/
└── patterns/
    ├── Hero.example.tsx        # Hero 패턴 예시
    ├── Features.example.tsx    # Features 패턴 예시
    ├── Sidebar.example.tsx     # Sidebar 패턴 예시
    └── ...
```

### 사용 흐름
```typescript
// 1. Preset 사용 (빠른 시작)
<Frame layout={Layout.Hero}>

// 2. Preset + Override (커스터마이징)
<Frame
  layout={Layout.Hero}
  override={{ py: Space.n160 }}  // 더 큰 여백
>

// 3. 직접 조합 (완전 제어)
<Frame
  override={{
    gap: Space.n24,
    py: Space.n128,
    align: "center",
  }}
>
```

---

## 결론

### ✅ Layout의 올바른 위치

**Layout은:**
- ❌ 2-Tier가 아님 (Tier는 추상화 레벨)
- ❌ Component가 아님 (경직된 구조)
- ✅ **Preset Library** (자주 사용하는 조합 모음)
- ✅ Tier와 **직교하는 차원** (사용 맥락)

**위치:**
```
src/design-system/preset/Layout.ts
```

**사용:**
```tsx
import { Layout } from "../design-system/preset/Layout"

<Frame layout={Layout.Hero}>
<Frame layout={Layout.Sidebar}>
<Frame layout={Layout.FeatureCard}>
```

### ✅ Block의 올바른 위치

**Block은:**
- ❌ Component가 아님
- ✅ **Example Pattern** (참고용 예시 코드)

**위치:**
```
src/examples/patterns/Hero.example.tsx
```

**사용:**
- Storybook에서 참고
- 복사해서 프로젝트에 붙여넣기
- 자유롭게 커스터마이징

---

## 다음 단계

1. ✅ `src/design-system/preset/` 디렉토리 생성
2. ✅ `Layout.ts` 파일 작성 (기존 Layout 이동)
3. ✅ Flat한 명명 규칙 적용 (Layout.Hero, Layout.Sidebar)
4. ✅ `src/examples/patterns/` 디렉토리 생성
5. ✅ Hero, Features, Sidebar 등 Pattern 예시 작성
6. ✅ Storybook 문서화
