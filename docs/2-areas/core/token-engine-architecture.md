# Token Engine 아키텍처 문서

> **"디자인을 못하는 사람도 일관된 UI를 만들 수 있다"**
>
> Token Engine은 개발자가 **"의도"만 선언**하면, 시스템이 **수학적 공식**으로 모든 디자인 결정을 자동으로 처리하는 IDDL의 핵심 엔진입니다.

---

## 목차

1. [왜 Token Engine을 만들었는가?](#1-왜-token-engine을-만들었는가)
2. [핵심 설계 원칙](#2-핵심-설계-원칙)
3. [아키텍처 구조](#3-아키텍처-구조)
4. [핵심 토큰 시스템 상세](#4-핵심-토큰-시스템-상세)
5. [사용 예시 및 이점](#5-사용-예시-및-이점)
6. [트레이드오프 및 제약사항](#6-트레이드오프-및-제약사항)

---

## 1. 왜 Token Engine을 만들었는가?

### 문제 정의

일반적인 프론트엔드 개발에서 디자인 일관성을 유지하는 것은 어렵습니다:

```tsx
// ❌ 기존 방식: 개발자가 모든 디자인 결정을 직접 해야 함
<div className="flex gap-4 px-3 py-2 bg-surface-hover rounded-lg hover:bg-surface-pressed">
  <button className="px-6 py-3 bg-accent text-white rounded-lg font-semibold">
    Save
  </button>
</div>
```

**문제점:**
- **수백 개의 className 조합**: gap-1? gap-2? px-3? px-4? → 매번 고민
- **일관성 부족**: 개발자마다 다른 spacing/color 선택
- **컨텍스트 무시**: Sidebar와 Main에서 같은 버튼인데 크기가 동일
- **상태 관리 누락**: hover, active, selected 상태를 수동으로 작성
- **디자인 의사결정 부담**: "이게 Primary인가? Secondary인가?" 매번 판단

### Token Engine의 해결책

개발자는 **"의도"만 선언**하고, 시스템이 **모든 스타일을 자동 계산**합니다:

```tsx
// ✅ Token Engine 방식: 의도만 선언
<Block role="Toolbar" prominence="Standard" density="Standard">
  <Action role="Button" prominence="Standard" intent="Brand">
    Save
  </Action>
</Block>
```

**Token Engine이 자동으로 처리하는 것들:**
- ✅ prominence × density → gap/padding 자동 계산
- ✅ sectionType × prominence → font-size 자동 조정
- ✅ intent × state → hover/active/selected className 자동 생성
- ✅ role × sectionType → background/border/shadow 자동 선택
- ✅ 컨텍스트 인식: Bar에서는 작게, Stage에서는 크게 자동 조정

---

## 2. 핵심 설계 원칙

Token Engine은 다음 4가지 원칙으로 설계되었습니다:

### 2.1 선언적 의도 기반 (Declarative Intent)

개발자는 **"어떻게"가 아닌 "무엇을" / "왜"**를 선언합니다:

| 기존 방식 (How-based) | Token Engine (Why-based) |
|----------------------|-------------------------|
| `className="gap-4 px-3 py-2"` | `prominence="Standard" density="Standard"` |
| `className="bg-accent hover:bg-accent-hover"` | `intent="Brand" selected={true}` |
| `className="text-2xl font-bold"` | `prominence="Hero"` |

### 2.2 컨텍스트 인식 (Context-Aware)

Token Engine은 **Page → Section → Block → Element 계층**을 이해합니다:

```tsx
// Sidebar (Panel Type)의 버튼
<Section role="Sidebar"> {/* sectionType="Panel" */}
  <Action prominence="Standard"> {/* 14px font, 36px height */}
    Settings
  </Action>
</Section>

// Main (Stage Type)의 버튼
<Section role="Main"> {/* sectionType="Stage" */}
  <Action prominence="Standard"> {/* 16px font, 44px height */}
    Settings
  </Action>
</Section>
```

**같은 prominence="Standard"인데 크기가 다른 이유:**
- Panel Type은 공간이 제한되어 **작은 스케일** 사용
- Stage Type은 공간이 자유로워 **큰 스케일** 사용
- Token Engine이 sectionType을 보고 **자동으로 조정**

### 2.3 수학적 일관성 (Mathematical Consistency)

모든 spacing/font-size는 **공식으로 계산**됩니다 (감각이 아님):

```typescript
// Spacing 계산 공식
spacing = baseValue × typeScaleFactor × prominenceFactor × densityFactor

// 예시: Panel에서 Standard × Compact
gap = 16px × 0.875 (Panel) × 1.0 (Standard) × 0.75 (Compact) = 10.5px → 12px (snap)
```

**수학적 계산의 장점:**
- ✅ 누가 작성해도 **동일한 결과**
- ✅ prominence/density 변경 시 **일관된 비율 유지**
- ✅ 디자이너가 공식만 조정하면 **전체 시스템 일괄 변경**

### 2.4 타입 안전성 (Type Safety)

TypeScript로 **잘못된 조합을 컴파일 타임에 방지**합니다:

```typescript
// ❌ 컴파일 에러: "Huge"는 Prominence 타입이 아님
<Action prominence="Huge" />

// ❌ 컴파일 에러: "Danger"는 Intent 타입이 아님
<Action intent="Danger" />

// ✅ 올바른 조합
<Action prominence="Standard" intent="Critical" />
```

---

## 3. 아키텍처 구조

Token Engine의 전체 플로우는 다음과 같습니다:

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. Developer Input (의도 선언)                                     │
│   <Action prominence="Standard" intent="Brand" selected={true}>  │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. useIDDLToken Hook (Context 병합)                              │
│   - Local Props (prominence, intent, selected)                  │
│   - Ambient Context (sectionType, pageRole, density)            │
│   → Merged TokenInput                                           │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. TokenEngine.resolve(input)                                   │
│   ├─ generateSpacing()  → SpacingTokens                        │
│   ├─ generateSurface()  → SurfaceTokens                        │
│   ├─ generateGeometry() → GeometryTokens                       │
│   ├─ generateTypography() → TypographyTokens                   │
│   └─ generateShadow()   → ShadowTokens                         │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. TokenOutput (최종 className)                                  │
│   {                                                             │
│     spacing: { gap: "1rem", padding: "0.5rem 1rem" },          │
│     surface: { background: "bg-accent", ... },                 │
│     typography: { size: "text-base", color: "text-white" },    │
│     ...                                                         │
│   }                                                             │
└─────────────────────────────────────────────────────────────────┘
```

### 3.1 TokenInput (입력)

개발자가 선언하는 **의도**와 시스템이 감지하는 **컨텍스트**를 포함합니다:

```typescript
export interface TokenInput {
  // 1. 로컬 Props (개발자가 직접 지정)
  role: Role;                    // "Button", "Card", "Input" 등
  prominence?: Prominence;       // "Hero" | "Standard" | "Strong" | "Subtle"
  intent?: Intent;               // "Neutral" | "Brand" | "Positive" | ...
  density?: Density;             // "Comfortable" | "Standard" | "Compact"
  state?: {                      // 상태 (selected, hover, disabled 등)
    hover?: boolean;
    selected?: boolean;
    disabled?: boolean;
  };

  // 2. Ambient Context (IDDL Context에서 자동 전달)
  sectionRole?: string;          // "Sidebar", "Main", "Header" 등
  sectionType?: SectionType;     // "Bar" | "Panel" | "Stage" | ...
  pageRole?: string;             // "Document" | "Application" | "Focus" | ...
}
```

**왜 Context를 분리했나?**
- `prominence`, `intent`는 **컴포넌트마다 다름** → Local Props로 전달
- `sectionType`, `pageRole`은 **부모로부터 상속** → Ambient Context로 자동 전달
- 개발자는 **Local Props만 신경쓰면 됨**, Context는 자동

### 3.2 useIDDLToken Hook (Context 병합)

React Hook이 **Local Props + Ambient Context**를 병합합니다:

```typescript
export function useIDDLToken(localInput: Partial<TokenInput>): TokenOutput {
  // 1. Get Ambient Context
  const context = useIDDLContext();          // Page/Section에서 제공하는 Context
  const blockContext = useBlockLayoutContext(); // Block에서 제공하는 Context

  // 2. Merge Inputs (Local Props가 Context보다 우선)
  const mergedInput: TokenInput = useMemo(() => ({
    role: localInput.role || 'Box',

    // Contextual derivations (자동 전달)
    sectionRole: localInput.sectionRole || blockContext.sectionRole,
    sectionType: localInput.sectionType || context.type,
    pageRole: localInput.pageRole || context.pageRole,

    // Inheritable props (Local이 없으면 Context 사용)
    prominence: localInput.prominence ?? context.prominence ?? 'Standard',
    intent: localInput.intent ?? context.intent ?? 'Neutral',
    density: localInput.density ?? context.density ?? 'Standard',

    // Local-only state
    state: localInput.state || {},
  }), [localInput, context, blockContext]);

  // 3. Resolve Tokens (Memoized)
  return useMemo(() => TokenEngine.resolve(mergedInput), [mergedInput]);
}
```

**핵심 포인트:**
- `??` 연산자: Local Props가 **undefined일 때만** Context 사용
- `useMemo`: 불필요한 재계산 방지 (성능 최적화)
- **Local Props > Context > Default** 우선순위

### 3.3 TokenEngine (Core Engine)

중앙 엔진이 **5개 Generator**를 호출하여 모든 토큰을 생성합니다:

```typescript
export class TokenEngine {
  static resolve(input: TokenInput): TokenOutput {
    return {
      spacing: this.resolveSpacing(input),      // gap, padding 계산
      surface: this.resolveSurface(input),      // background, blur 계산
      geometry: this.resolveGeometry(input),    // border, radius 계산
      typography: this.resolveTypography(input), // font-size, weight 계산
      shadow: this.resolveShadow(input),        // box-shadow 계산
    };
  }
}
```

### 3.4 Generator 시스템

각 Generator는 **특정 영역의 토큰**을 생성합니다:

| Generator | 담당 영역 | 입력 | 출력 |
|-----------|---------|------|------|
| `generateSpacing` | gap, padding | prominence × density × sectionType | `gap: "1rem", padding: "0.5rem 1rem"` |
| `generateSurface` | background, blur | prominence × intent × state | `background: "bg-accent", blur: "backdrop-blur-md"` |
| `generateTypography` | font-size, weight, color | role × prominence × intent | `size: "text-base", weight: "font-semibold"` |
| `generateGeometry` | border, radius, outline | role × prominence | `radius: "rounded-lg", border: "border-2"` |
| `generateShadow` | box-shadow | sectionType × prominence | `boxShadow: "shadow-soft-lg"` |

---

## 4. 핵심 토큰 시스템 상세

Token Engine은 다음 5개의 핵심 토큰 시스템을 사용합니다:

### 4.1 Adaptive Scale System (적응형 스케일)

**목적**: sectionType에 따라 **자동으로 크기를 조정**합니다.

**공식**:
```typescript
finalValue = baseValue × typeScaleFactor × prominenceFactor × densityFactor
```

**Type Scale Factor** (SectionType별):
```typescript
const TYPE_SCALE_FACTORS: Record<SectionType, number> = {
  Bar: 0.875,     // Standard 14px (작은 공간)
  Rail: 0.875,    // Standard 14px
  Panel: 0.875,   // Standard 14px
  Stage: 1.0,     // Standard 16px (기준)
  Layer: 1.0,     // Standard 16px
  Float: 0.8125,  // Standard 13px (가장 작음)
};
```

**왜 Type별로 다른 스케일을 사용하나?**

각 SectionType은 **물리적 제약**이 다릅니다:

- **Bar** (Header/Footer): 높이 제한 (48-64px) → **작은 텍스트 필수**
- **Rail** (ActivityBar): 너비 제한 (48-80px) → **아이콘 중심**
- **Panel** (Sidebar): 너비 제한 (240-400px) → **조밀한 레이아웃**
- **Stage** (Main Content): 제약 없음 → **큰 텍스트 가능** (기준)
- **Float** (Tooltip): 최소 크기 → **가장 작은 텍스트**

**실제 계산 예시**:

```typescript
// Bar에서 Hero × Comfortable
gap = 16 (base) × 0.875 (Bar) × 1.5 (Hero) × 1.5 (Comfortable)
    = 31.5px → 32px (snap to allowed value)

// Stage에서 Standard × Compact
gap = 16 (base) × 1.0 (Stage) × 1.0 (Standard) × 0.75 (Compact)
    = 12px
```

**Allowed Values Snapping**:

계산된 값을 **디자인 토큰 허용 값**으로 반올림합니다:
```typescript
const ALLOWED_VALUES = [4, 8, 12, 16, 24, 32, 48, 64, 96];

// 14px → 16px로 snap
// 20px → 24px로 snap
```

**이유**: 무한한 spacing 값 대신 **일관된 8px 기반 그리드** 유지

### 4.2 Type Scale Tokens (타입별 스케일 정의)

**목적**: 각 SectionType의 **물리적 제약**을 명시적으로 정의합니다.

```typescript
export const TYPE_SCALE_TOKENS: Record<SectionType, TypeScaleTokens> = {
  Bar: {
    dimensions: {
      fixedHeight: 56,  // 48-64px 범위
    },
    text: {
      Hero: 20,        // Bar의 Hero는 Stage보다 작음
      Standard: 14,
      Subtle: 12,
    },
    space: {
      base: 12,
      tight: 8,
      loose: 16,
    },
    action: {
      height: 36,
      variant: 'icon',  // 기본 아이콘만
    },
    defaultDensity: 'Compact',  // Bar는 항상 조밀함
  },

  Stage: {
    dimensions: {
      // 제약 없음
    },
    text: {
      Hero: 48,        // 큰 Hero 텍스트 가능
      Standard: 16,
      Subtle: 14,
    },
    space: {
      base: 24,
      tight: 16,
      loose: 32,
    },
    action: {
      height: 44,
      variant: 'default',
    },
    defaultDensity: 'Standard',
  },

  // ... Panel, Rail, Layer, Float
};
```

**핵심 아이디어:**
- **Type별 물리 법칙**: Bar는 높이 제한, Panel은 너비 제한, Stage는 자유
- **Type별 기본값**: Bar는 Compact가 기본, Stage는 Standard가 기본
- **Type별 Action 변형**: Bar는 icon만, Stage는 full button 가능

### 4.3 Spacing Token System (자동 spacing 계산)

**목적**: `gap-4`, `px-3`, `py-2` 같은 **수동 spacing 제거**

**공식**:
```typescript
spacing = baseValue × prominenceFactor × densityFactor
```

**Prominence Factor**:
```typescript
const prominenceFactors: Record<Prominence, number> = {
  Hero: 1.5,      // 가장 넓은 spacing
  Standard: 1.0,  // 표준
  Strong: 0.75,
  Subtle: 0.5,    // 가장 좁은 spacing
};
```

**Density Factor**:
```typescript
const densityFactors: Record<Density, number> = {
  Comfortable: 1.5,  // 여유로운 spacing
  Standard: 1.0,     // 표준
  Compact: 0.75,     // 좁은 spacing
};
```

**Base Values** (Standard 기준):
```typescript
const BASE_GAP = 16;        // gap-4
const BASE_PADDING_X = 12;  // px-3
const BASE_PADDING_Y = 8;   // py-2
```

**계산 예시**:

```typescript
// Hero × Comfortable
gap = 16 × 1.5 × 1.5 = 36px → snap to 32px (gap-8)
paddingX = 12 × 1.5 × 1.5 = 27px → snap to 24px (px-6)
paddingY = 8 × 1.5 × 1.5 = 18px → snap to 16px (py-4)
// → className: "gap-8 px-6 py-4"

// Subtle × Compact
gap = 16 × 0.5 × 0.75 = 6px → snap to 4px (gap-1)
paddingX = 12 × 0.5 × 0.75 = 4.5px → snap to 4px (px-1)
paddingY = 8 × 0.5 × 0.75 = 3px → snap to 4px (py-1)
// → className: "gap-1 px-1 py-1"
```

**CVA Variants로 미리 계산**:

성능을 위해 **모든 조합을 미리 계산**하여 CVA variants로 제공:

```typescript
export const spacingVariants = cva('', {
  compoundVariants: [
    { prominence: 'Hero', density: 'Comfortable', class: 'gap-8 px-8 py-6' },
    { prominence: 'Hero', density: 'Standard', class: 'gap-6 px-6 py-4' },
    { prominence: 'Standard', density: 'Standard', class: 'gap-4 px-3 py-2' },
    { prominence: 'Subtle', density: 'Compact', class: 'gap-1 px-1 py-0.5' },
    // ... 모든 조합
  ],
});
```

### 4.4 Interactive Token System (인터랙티브 상태)

**목적**: `hover:bg-*`, `active:bg-*`, `selected:bg-*` 같은 **수동 상태 className 제거**

**공식**:
```typescript
className = interactiveVariants({ prominence, intent, state })
```

**State Types**:
```typescript
export type InteractiveState = 'idle' | 'hover' | 'active' | 'selected' | 'disabled';
```

**prominence × intent × state 조합**:

```typescript
// Standard × Neutral × idle
class: 'bg-surface text-text-primary'

// Standard × Neutral × hover
class: 'hover:bg-surface-hover'

// Standard × Neutral × selected
class: 'bg-accent-subtle text-accent border-l-2 border-accent'

// Standard × Brand × idle
class: 'bg-accent text-white'

// Standard × Brand × hover
class: 'hover:bg-accent-hover'
```

**Focus State Variants** (키보드 포커스):

```typescript
export const focusVariants = cva('outline-none', {
  variants: {
    intent: {
      Neutral: 'focus-visible:ring-2 focus-visible:ring-accent',
      Brand: 'focus-visible:ring-2 focus-visible:ring-accent',
      Critical: 'focus-visible:ring-2 focus-visible:ring-critical',
      // ...
    },
  },
});
```

**헬퍼 함수**:

```typescript
export function getInteractiveClasses({
  prominence = 'Standard',
  intent = 'Neutral',
  config = {},  // { selected: boolean, disabled: boolean }
}): string {
  const { selected, disabled } = config;

  // State 결정 (우선순위: disabled > selected > idle)
  let state: InteractiveState = 'idle';
  if (disabled) state = 'disabled';
  else if (selected) state = 'selected';

  return interactiveVariants({ prominence, intent, state });
}
```

### 4.5 Prominence Token System (주목도 시스템)

**목적**: **주목도(prominence)**에 따라 텍스트/배경/여백을 **자동 조정**

**핵심 아이디어**: 디자인을 못하는 사람도 **"이게 중요한지"만 판단**하면 됨

**Prominence Levels**:
```typescript
export type ProminenceLevel = 'primary' | 'secondary' | 'tertiary';
```

**텍스트 투명도** (중요도에 따라):
```typescript
const textOpacity: Record<ProminenceLevel, number> = {
  primary: 1.0,    // 가장 중요 (완전히 선명)
  secondary: 0.7,  // 보조 정보
  tertiary: 0.5,   // 덜 중요한 정보
};
```

**폰트 Weight**:
```typescript
const fontWeight: Record<ProminenceLevel, number> = {
  primary: 600,    // semibold
  secondary: 500,  // medium
  tertiary: 400,   // normal
};
```

**배경 강도** (depth에 따라 변화):
```typescript
export function getBackgroundIntensity(depth: number, prominence: ProminenceLevel): number {
  const config = {
    primary: { base: 0.02, depthMultiplier: 0.015 },
    secondary: { base: 0.01, depthMultiplier: 0.008 },
    tertiary: { base: 0, depthMultiplier: 0 },  // 배경 없음
  };

  const { base, depthMultiplier } = config[prominence];
  return Math.min(base + depth * depthMultiplier, 0.15); // 최대 15%
}
```

**예시**:
```typescript
// depth=3, prominence=primary
backgroundIntensity = 0.02 + (3 × 0.015) = 0.065 (6.5% 불투명도)

// depth=3, prominence=tertiary
backgroundIntensity = 0 (배경 없음)
```

**이유**: depth가 높아질수록 **시각적 분리가 필요** → 배경 강도 증가

---

## 5. 사용 예시 및 이점

### 5.1 Before/After 비교

#### Example 1: 버튼 컴포넌트

**Before (기존 방식)**:
```tsx
// 개발자가 모든 className을 수동으로 작성
<button className="px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-hover active:bg-accent-pressed focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50">
  Save
</button>

// 다른 개발자는 다르게 작성
<button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
  Save
</button>

// ❌ 일관성 없음!
```

**After (Token Engine)**:
```tsx
// 의도만 선언
<Action role="Button" prominence="Standard" intent="Brand">
  Save
</Action>

// Token Engine이 자동 생성:
// className: "px-6 py-4 gap-4 bg-accent text-white rounded-lg hover:bg-accent-hover active:bg-accent-pressed focus-visible:ring-2 focus-visible:ring-accent"

// ✅ 누가 작성해도 동일한 결과!
```

#### Example 2: 컨텍스트별 자동 조정

**Before**:
```tsx
// Sidebar에서
<div className="p-2">
  <button className="px-3 py-2 text-sm">Settings</button>
</div>

// Main에서
<div className="p-4">
  <button className="px-6 py-3 text-base">Settings</button>
</div>

// ❌ 수동으로 크기 조정, 실수 가능
```

**After**:
```tsx
// Sidebar에서 (Panel Type)
<Section role="Sidebar"> {/* sectionType="Panel" 자동 전달 */}
  <Action prominence="Standard">Settings</Action>
  {/* 자동: text-sm, px-3, py-2 */}
</Section>

// Main에서 (Stage Type)
<Section role="Main"> {/* sectionType="Stage" 자동 전달 */}
  <Action prominence="Standard">Settings</Action>
  {/* 자동: text-base, px-6, py-3 */}
</Section>

// ✅ 같은 코드인데 자동으로 크기 조정!
```

#### Example 3: 상태 관리

**Before**:
```tsx
<button
  className={cn(
    "px-4 py-2 rounded-lg",
    selected ? "bg-accent-subtle text-accent border-l-2 border-accent" : "bg-transparent",
    disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-surface-hover",
  )}
>
  List Item
</button>

// ❌ 복잡한 조건부 className, 실수 가능
```

**After**:
```tsx
<Action
  role="Button"
  prominence="Standard"
  selected={selected}
  disabled={disabled}
>
  List Item
</Action>

// ✅ Token Engine이 자동으로 모든 상태 처리!
```

### 5.2 디자인 일관성 보장

#### 전체 앱 spacing 변경

**Before**:
```tsx
// 모든 파일을 수동으로 찾아서 변경 필요
<div className="gap-4"> → <div className="gap-6">
<div className="gap-4"> → <div className="gap-6">
<div className="gap-4"> → <div className="gap-6">
// ... 수백 개 파일

// ❌ 누락 가능, 시간 소모
```

**After**:
```typescript
// adaptive-scale-tokens.ts에서 공식만 조정
const BASE_VALUES = {
  gap: 24,  // 16 → 24로 변경
  paddingX: 18,
  paddingY: 12,
};

// ✅ 전체 앱의 spacing이 일괄 변경!
```

#### prominence별 일관된 스타일

**Before**:
```tsx
// 개발자마다 다르게 해석
// 개발자 A: Hero = 큰 폰트
<h1 className="text-4xl font-bold">Title</h1>

// 개발자 B: Hero = 진한 배경
<h1 className="bg-accent text-white px-6 py-3">Title</h1>

// ❌ 일관성 없음
```

**After**:
```tsx
// 모든 개발자가 동일하게 사용
<Text role="Title" prominence="Hero">Title</Text>

// Token Engine이 정의한 Hero 스타일 적용:
// - font-size: text-4xl (48px in Stage)
// - font-weight: font-bold
// - 배경: 없음 (Text는 background 없음)

// ✅ 시스템이 정의한 대로 일관되게 적용!
```

### 5.3 개발자 부담 감소

#### 디자인 의사결정 제거

**Before**:
```tsx
// 매번 고민: "이게 Primary인가? Secondary인가?"
// "gap은 4? 6? 8?"
// "hover는 어떤 색?"
<div className="flex gap-??? px-??? py-???">
  <button className="bg-??? hover:bg-??? ...">
    Save
  </button>
</div>

// ❌ 시간 소모, 스트레스
```

**After**:
```tsx
// "이게 중요한가?" → prominence 선택
// "이게 위험한 동작인가?" → intent 선택
// 끝!
<Block role="Toolbar" prominence="Standard">
  <Action prominence="Standard" intent="Brand">
    Save
  </Action>
</Block>

// ✅ 단순한 질문, 빠른 개발
```

#### 학습 곡선 감소

**Before**:
```tsx
// 신입 개발자가 배워야 할 것들:
// - Tailwind의 수백 개 className
// - 디자인 시스템의 spacing 규칙
// - Color palette의 사용 시나리오
// - hover/active/focus 상태 처리
// - 반응형 breakpoint 사용법

// ❌ 학습 시간: 수 주
```

**After**:
```tsx
// 신입 개발자가 배워야 할 것들:
// - role: 컴포넌트 역할
// - prominence: 중요도 (Hero > Standard > Subtle)
// - intent: 의미 (Neutral, Brand, Critical 등)
// - density: 밀도 (Comfortable > Standard > Compact)

// ✅ 학습 시간: 수 시간
```

---

## 6. 트레이드오프 및 제약사항

Token Engine은 강력하지만, 모든 상황에 완벽하지는 않습니다.

### 6.1 장점 (Pros)

#### ✅ 디자인 일관성 보장
- 누가 작성해도 **동일한 결과**
- prominence/density 조합이 **수학적으로 계산**됨
- 디자이너가 공식만 조정하면 **전체 시스템 일괄 변경**

#### ✅ 개발자 부담 감소
- **"어떻게"가 아닌 "무엇을"** 선언
- className 조합을 고민할 필요 없음
- hover/active/selected 상태를 **자동 처리**

#### ✅ 컨텍스트 자동 인식
- Sidebar에서는 **작게**, Main에서는 **크게** 자동 조정
- sectionType × prominence → **최적의 크기** 자동 선택

#### ✅ 타입 안전성
- TypeScript로 **잘못된 조합 방지**
- IDE 자동완성으로 **빠른 개발**

#### ✅ 유지보수 용이
- 토큰 공식만 수정하면 **전체 앱 스타일 변경**
- 디자인 규칙이 **코드로 명시**되어 문서화 불필요

### 6.2 단점 (Cons)

#### ❌ 유연성 제한
Token Engine은 **정해진 조합**만 제공합니다. 예외적인 디자인이 필요하면 **override 필요**:

```tsx
// ❌ Token Engine으로 불가능한 경우
<Action prominence="Standard"> {/* gap-4가 기본 */}
  {/* "gap-3만 딱 필요한데..." */}
</Action>

// ✅ override로 해결
<Action prominence="Standard" className="!gap-3">
  {/* Tailwind의 !important로 강제 override */}
</Action>
```

**언제 override가 필요한가?**
- 디자인 QA에서 **"1px만 조정해주세요"** 같은 요청
- 특정 화면에서만 **예외적인 spacing** 필요
- 외부 라이브러리와의 **스타일 충돌** 해결

**권장사항**: override는 **주석으로 이유를 명시**
```tsx
{/* EXCEPTION: QA 요청으로 gap-3 필요 (2026-01-12) */}
<Action prominence="Standard" className="!gap-3">
```

#### ❌ 초기 학습 필요
개발자가 Token Engine의 **개념을 이해**해야 합니다:
- prominence, intent, density의 의미
- sectionType이 자동 조정하는 방식
- Context 상속 메커니즘

**완화 방법**:
- 이 문서로 학습 시간 단축
- IDDL Inspector (Cmd+D)로 실시간 디버깅
- 타입 정의로 IDE 자동완성 지원

#### ❌ 런타임 계산 비용
Token Engine은 **런타임에 토큰을 계산**합니다:

```typescript
// 매 렌더링마다 useMemo로 계산
const tokens = useIDDLToken({ prominence, intent });
```

**성능 최적화**:
- `useMemo`로 불필요한 재계산 방지
- CVA variants로 **미리 계산된 className 사용**
- prominence/intent가 변경될 때만 재계산

**실제 성능**: 일반적인 앱에서는 **무시 가능한 수준**

#### ❌ Tailwind IntelliSense 제한
Token Engine이 생성한 className은 **동적**이므로 Tailwind IntelliSense가 작동하지 않습니다:

```tsx
// ❌ IntelliSense 없음
<Action prominence="Standard"> {/* className이 런타임에 생성됨 */}
```

**완화 방법**:
- IDDL Inspector로 **실제 생성된 className 확인**
- CVA variants 정의를 보면 **모든 조합 확인 가능**

### 6.3 언제 사용하고 언제 피해야 하는가?

#### ✅ Token Engine을 사용해야 하는 경우

1. **일관된 디자인이 중요한 경우**
   - 엔터프라이즈 앱 (IDE, Dashboard, Admin Panel)
   - 디자인 시스템 기반 프로젝트

2. **여러 개발자가 협업하는 경우**
   - 팀원마다 다른 스타일을 방지
   - 신입 개발자도 빠르게 생산성 확보

3. **디자인 변경이 잦은 경우**
   - 토큰 공식만 수정하면 전체 변경
   - 디자인 QA 피드백 반영이 빠름

4. **컨텍스트별 자동 조정이 필요한 경우**
   - IDE처럼 Sidebar/Main/Panel 크기가 다른 경우
   - 반응형 디자인에서 자동 조정 필요

#### ❌ Token Engine을 피해야 하는 경우

1. **극도로 커스텀한 디자인**
   - 랜딩 페이지, 마케팅 사이트
   - 매 섹션마다 독특한 디자인

2. **디자인 시스템이 없는 프로젝트**
   - 빠른 프로토타이핑
   - 일회성 페이지

3. **성능이 극도로 중요한 경우**
   - 초당 수천 개 렌더링이 필요한 경우 (극히 드뭄)
   - 런타임 계산 비용을 줄여야 하는 경우

4. **팀이 Tailwind를 직접 작성하는 것을 선호**
   - 팀 문화에 따라 "직접 className 작성"을 선호하는 경우

---

## 7. 결론

Token Engine은 **"디자인을 못하는 사람도 일관된 UI를 만들 수 있다"**는 철학으로 설계되었습니다.

### 핵심 가치

1. **의도 기반 선언**: "어떻게"가 아닌 "무엇을" / "왜"
2. **수학적 일관성**: 공식으로 계산, 감각이 아님
3. **컨텍스트 인식**: Page/Section 계층을 이해하고 자동 조정
4. **타입 안전성**: 잘못된 조합을 컴파일 타임에 방지

### Token Engine이 해결하는 문제

- ❌ "gap은 4? 6? 8?" → ✅ prominence + density로 자동 계산
- ❌ "hover는 어떤 색?" → ✅ intent + state로 자동 생성
- ❌ "Sidebar에서는 작게?" → ✅ sectionType으로 자동 조정
- ❌ "개발자마다 다른 스타일" → ✅ 누가 작성해도 동일

### 언제 사용하는가?

- ✅ 일관된 디자인이 중요한 엔터프라이즈 앱
- ✅ 여러 개발자가 협업하는 프로젝트
- ✅ 디자인 시스템 기반 개발
- ❌ 극도로 커스텀한 디자인
- ❌ 디자인 시스템이 없는 프로토타입

### 다음 단계

Token Engine을 실제로 사용하려면:

1. **IDDL 개념 이해**: `docs/2-areas/spec/` 문서 읽기
2. **실습**: `src/apps/PAGE/pages/page/PageShowcasePage.tsx`에서 실시간 테스트
3. **디버깅**: IDDL Inspector (Cmd+D)로 생성된 className 확인
4. **확장**: 새로운 role/prominence 조합 추가

---

**작성일**: 2026-01-12
**작성자**: Claude (AI Assistant)
**버전**: Token Engine v3.1 (Adaptive Scale System)
