# Surface Token Border Variants Strategy

**작성일**: 2026-01-16
**태그**: #Surface #Tokens #Design #Border #Elevation

## 1. 현재 상황 분석

### 1.1 Surface 토큰 구조

**정의된 토큰** (총 9개):
```typescript
// src/design-system/lib/types.ts
type SurfaceToken =
  | "base"      // 기본 배경
  | "sunken"    // 음각 (낮은 레이어)
  | "raised"    // 양각 (높은 레이어)
  | "overlay"   // 최상단 오버레이
  | "primary"   // 강조 액센트
  | "selected"  // 선택 상태
  | "panel"     // 사이드바 (특수)
  | "card"      // 카드 (특수)
  | "hover"     // 호버 상태 (특수)
```

**실제 색상** (tokens.palette.css):
```css
:root {
  --surface-page: #ffffff;       /* base */
  --surface-panel: #f9f9fb;      /* sunken (살짝 grey) */
  --surface-card: #ffffff;       /* raised */
  --surface-overlay: #ffffff;    /* overlay */
  --surface-primary: #18181b;    /* black */
}

/* 실제로는 3색뿐: white, light grey (#f9f9fb), black */
```

**시각적 구분 메커니즘** (surface.css):
```css
.surface-base {
  background: var(--surface-base);
  /* border, shadow 없음 */
}

.surface-sunken {
  background: var(--surface-sunken);
  /* border, shadow 없음 */
}

.surface-raised {
  background: var(--surface-raised);
  box-shadow: var(--shadow-sm);           /* ✅ shadow */
  border: 1px solid var(--border-color);  /* ✅ border */
}

.surface-overlay {
  background: var(--surface-overlay);
  box-shadow: var(--shadow-lg);           /* ✅ shadow (더 큼) */
  border: 1px solid var(--border-color);  /* ✅ border */
}
```

**핵심 발견**:
- 색상은 3개뿐이지만, **border + shadow 조합으로 4+ depth 표현**
- `raised`와 `overlay`는 **항상 border + shadow 포함** (CSS에 하드코딩)
- Border를 제거하고 싶어도 방법 없음 (override 불가)

### 1.2 컴포넌트별 Surface 사용 패턴

#### A. Container (Frame) - 정적 배경
```tsx
<Frame surface="raised" />  // border + shadow (변경 불가)
```
- **목적**: 정적 배경, 시각적 구분
- **Interactive state 없음**
- Border/shadow는 CSS 고정값

#### B. Input (Field) - Component Token
```css
/* tokens.components.css */
--field-bg: var(--control-bg-default);          /* #f4f4f5 (sunken) */
--field-bg-hover: var(--control-bg-hover);      /* #f4f4f5 (유지) */
--field-bg-focus: var(--control-bg-focus);      /* #ffffff (base) */

--field-border: var(--control-border-default);  /* rgba(0,0,0,0.08) */
--field-border-hover: var(--text-dim);          /* #d4d4d8 */
--field-border-focus: var(--text-muted);        /* #a1a1aa */

/* index.css */
.field-base {
  border: 1px solid var(--field-border);  /* ✅ 항상 border */
  background: var(--field-bg);
}
.field-base:hover {
  border-color: var(--field-border-hover);
}
.field-base:focus-within {
  background: var(--field-bg-focus);      /* sunken → base (상승) */
  border-color: var(--field-border-focus);
}
```

**특징**:
- **항상 border 존재** (Input의 본질)
- State 전환: `sunken` → `base` (focus 시)
- Border 색상만 변경 (구조 유지)

#### C. Button (Action) - Variant System
```css
/* ghost: 투명 → hover 시 배경 */
.action-ghost { color: var(--text-body); }
.action-ghost:hover { background: var(--control-bg-hover); }
.action-ghost:active { background: var(--surface-overlay); }

/* surface: base + border → hover 시 상승 */
.action-surface {
  background: var(--surface-base);
  border: 1px solid var(--border-color);
}
.action-surface:hover { background: var(--surface-raised); }
.action-surface:active { background: var(--surface-overlay); }

/* primary: 강조 → hover 시 opacity */
.action-primary { background: var(--primary-bg); }
.action-primary:hover { opacity: 0.9; }
.action-primary:active { opacity: 0.8; }
```

**State Transition 전략**:
- `ghost`: 없음 → `sunken` → `overlay`
- `surface`: `base` → `raised` → `overlay` (상승)
- `primary`: opacity 감소 (색상 유지)

### 1.3 4색 정리 관점 분석

**UI Tree 구조**:
```
App (depth 0)
└─ Sidebar (depth 1)
   └─ Card (depth 2)
      └─ Dropdown (depth 3)
```

**현재 매핑**:
```
depth 0: sunken  (#f9f9fb)
depth 1: base    (#ffffff)
depth 2: raised  (#ffffff + border + shadow-sm)
depth 3: overlay (#ffffff + border + shadow-lg)
```

**4색 정리 원칙**:
> 평면 그래프는 4색으로 인접 영역을 모두 다른 색으로 칠할 수 있다.

**UI는 Tree = Planar Graph**:
- 4 depth = 4색으로 **충분**
- 하지만 **같은 depth에서 중첩** 시 문제:
  ```tsx
  <Frame surface="overlay">           // depth 2
    <Frame surface="overlay" />       // depth 3 (같은 surface!)
  </Frame>
  ```
  → **시각적 구분 불가**

## 2. 문제 정의

### 2.1 핵심 문제: 같은 Surface 중첩

**SlideApp 사례** (src/apps/SlideApp.tsx:76-90):
```tsx
<Frame
  surface="overlay"              // white + border + shadow-lg
  override={{
    gap: Space.n4,
    p: Space.n4,
    shadow: "sm",
  }}
>
  <Frame
    override={{ w: Size.n28, h: Size.n28 }}
    surface="overlay"            // white + border + shadow-lg (똑같음!)
  />
</Frame>
```

**문제**:
- 부모와 자식이 **완전히 동일한 스타일**
- Border + shadow가 겹쳐서 구분 어려움
- `override.shadow`로 조정 시도했지만 불완전

### 2.2 Border Variant 필요성

**요구사항**:
1. **Input은 항상 border** (사용자 인터랙션 명확화)
2. **Container는 선택적 border** (디자인 유연성)
3. **같은 surface 중첩 시 구분 가능**

**현재 한계**:
```tsx
// ❌ 불가능
<Frame surface="raised" border={false} />  // border 제거 안 됨 (CSS 고정)

// ❌ 우회책 (타입 안정성 상실)
<Frame surface="raised" style={{ border: "none" }} />
```

### 2.3 Interactive State 전략 불일치

**Field vs Action 비교**:

| 구분 | Field | Action |
|------|-------|--------|
| **기본 상태** | `sunken` + border | variant 의존 |
| **Hover** | border 색상 변경 | 배경 변경 (상승) |
| **Focus/Active** | `base` (상승) | `overlay` (상승) |
| **Border** | 항상 존재 | variant에 따라 |

**불일치 포인트**:
- Field는 Component Token 사용
- Action은 Surface Token 재사용
- Frame은 정적 (state 없음)

## 3. 해결 방안

### Option A: Surface Elevation Variants (복합 토큰)

#### 개념
Surface 이름에 **elevation style**을 포함하여 명확히 구분

```typescript
type SurfaceElevation =
  | "default"      // border + shadow (현재 raised/overlay)
  | "bordered"     // border만
  | "floating"     // shadow만
  | "flat"         // 배경색만 (border/shadow 없음)

type SurfaceToken =
  // 정적 배경 (항상 flat)
  | "base"
  | "sunken"

  // Raised variants
  | "raised"              // = raised-default (border + shadow)
  | "raised-bordered"     // border만
  | "raised-floating"     // shadow만
  | "raised-flat"         // 배경색만

  // Overlay variants
  | "overlay"             // = overlay-default (border + shadow)
  | "overlay-bordered"    // border만
  | "overlay-floating"    // shadow만
  | "overlay-flat"        // 배경색만

  // 특수 (변경 없음)
  | "primary"
  | "selected"
```

#### CSS 구현
```css
/* Raised - Flat (배경색만) */
.surface-raised-flat {
  background-color: var(--surface-raised);
}

/* Raised - Bordered (border만) */
.surface-raised-bordered {
  background-color: var(--surface-raised);
  border: 1px solid var(--border-color);
}

/* Raised - Floating (shadow만) */
.surface-raised-floating {
  background-color: var(--surface-raised);
  box-shadow: var(--shadow-sm);
}

/* Raised - Default (border + shadow) */
.surface-raised {
  background-color: var(--surface-raised);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

/* Overlay도 동일 패턴 (shadow-lg 사용) */
```

#### 사용 예시
```tsx
// SlideApp 문제 해결
<Frame surface="overlay">                  {/* border + shadow */}
  <Frame surface="overlay-floating">      {/* shadow만 → 구분됨! */}
  </Frame>
</Frame>

// 다양한 조합
<Frame surface="raised-bordered">          {/* border만 */}
<Frame surface="raised-floating">          {/* shadow만 */}
<Frame surface="raised-flat">              {/* 배경색만 */}
```

#### 장점
1. **명확한 의도 표현**: 한 prop으로 완전한 스타일 정의
2. **타입 안정성**: TypeScript로 완벽히 제어
3. **4색 + 4 variants = 16가지**: 충분한 표현력
4. **Breaking change 최소**: 기본 이름 유지 (`raised` = `raised-default`)

#### 단점
1. **토큰 개수 증가**: 4개 → 10개
2. **네이밍 복잡도**: 이름이 길어짐
3. **학습 곡선**: 새로운 패턴 이해 필요

---

### Option B: Border/Shadow 분리 Props

#### 개념
Surface는 **색상만**, border/shadow는 **별도 prop**으로 제어

```typescript
interface FrameProps {
  surface?: SurfaceToken;           // 색상만 (sunken/base/raised/overlay)
  border?: boolean | BorderVariant; // border 제어
  shadow?: boolean | ShadowToken;   // shadow 제어
}

type BorderVariant =
  | boolean         // true = default, false = none
  | "default"       // 1px solid
  | "subtle"        // 0.5px or opacity 낮음
  | "strong"        // 2px or 진한 색
  | "none"

type ShadowToken =
  | boolean         // true = sm, false = none
  | "sm" | "md" | "lg" | "xl" | "2xl"
  | "none"
```

#### 사용 예시
```tsx
// SlideApp 문제 해결
<Frame surface="overlay" border shadow>           // border + shadow
  <Frame surface="overlay" border={false} shadow> // shadow만
  </Frame>
</Frame>

// 다양한 조합
<Frame surface="raised" border="default" shadow={false} />  // border만
<Frame surface="raised" border={false} shadow="sm" />       // shadow만
<Frame surface="raised" border={false} shadow={false} />    // 배경색만

// Field는 항상 border (강제)
<Field />  // border는 기본값 true (제거 불가)
```

#### CSS 구현
```css
/* Surface는 배경색만 */
.surface-raised {
  background-color: var(--surface-raised);
}

/* Border는 별도 클래스 */
.with-border {
  border: 1px solid var(--border-color);
}
.with-border-subtle {
  border: 1px solid rgba(0, 0, 0, 0.04);
}
.with-border-strong {
  border: 2px solid var(--text-muted);
}

/* Shadow는 기존 클래스 재사용 */
.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow-lg { box-shadow: var(--shadow-lg); }
```

#### 장점
1. **Surface 토큰 개수 유지**: 4개 그대로
2. **최대 유연성**: 모든 조합 가능
3. **직관적**: 각 prop이 명확히 분리됨

#### 단점
1. **3개 prop 조합 관리**: surface + border + shadow
2. **조합 폭발**: 잘못된 조합 가능성 (예: base + shadow)
3. **Default 규칙 필요**: 언제 border/shadow를 기본으로 줄지 불명확

---

### Option C: Interactive Class Pattern

#### 개념
Container는 정적, Interactive 요소는 **`.interactive` class**로 state transition 표준화

```typescript
// Container (정적)
<Frame surface="raised" />  // 변화 없음

// Interactive (동적)
<Frame surface="raised" className="interactive" />
```

#### CSS 구현
```css
/* Container는 정적 */
.surface-raised {
  background: var(--surface-raised);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

/* Interactive는 상승 */
.interactive.surface-base:hover {
  background: var(--surface-raised);
  box-shadow: var(--shadow-sm);
}

.interactive.surface-raised:hover {
  background: var(--surface-overlay);
  box-shadow: var(--shadow-lg);
}

.interactive.surface-raised:active {
  box-shadow: var(--shadow-xl);
}
```

#### 사용 예시
```tsx
// Container (정적)
<Frame surface="raised">
  Content
</Frame>

// Button (interactive)
<Frame surface="base" className="interactive" onClick={...}>
  Click me
</Frame>
```

#### 장점
1. **명확한 의도 분리**: Container vs Interactive
2. **일관된 state transition**: 모든 interactive가 같은 규칙
3. **Surface 토큰 개수 유지**: 4개 그대로

#### 단점
1. **Border variants 문제 미해결**: 여전히 border 제거 불가
2. **새로운 개념 도입**: `.interactive` class
3. **Action/Field와 중복**: 이미 variant 시스템 존재

---

## 4. 권장 사항

### 4.1 하이브리드 접근: Option A + Component Token

**전략**:
1. **Container (Frame)**: Option A (복합 토큰)
2. **Interactive (Field/Action)**: Component Token 유지

#### Container - 복합 Surface Token
```typescript
type SurfaceToken =
  | "base" | "sunken"
  | "raised" | "raised-bordered" | "raised-floating" | "raised-flat"
  | "overlay" | "overlay-bordered" | "overlay-floating" | "overlay-flat"
  | "primary" | "selected"
```

```tsx
// Frame 사용
<Frame surface="raised-bordered" />
<Frame surface="overlay-floating" />
```

#### Interactive - Component Token
```css
/* Field (변경 없음) */
.field-base {
  background: var(--field-bg);
  border: 1px solid var(--field-border);  /* 항상 border */
}

/* Action (변경 없음) */
.action-surface {
  background: var(--surface-base);
  border: 1px solid var(--border-color);
}
.action-surface:hover {
  background: var(--surface-raised);
}
```

### 4.2 Default 규칙

**Breaking Change 최소화**:
```typescript
// 기본 이름 = default variant
"raised" === "raised-default"   // border + shadow
"overlay" === "overlay-default" // border + shadow

// 명시적 variant
"raised-bordered"   // border만
"raised-floating"   // shadow만
"raised-flat"       // 배경색만
```

### 4.3 4색 정리 검증

**depth별 권장 토큰**:
```
depth 0 (App Background):     sunken
depth 1 (Main Content):       base
depth 2 (Cards/Panels):       raised-bordered 또는 raised
depth 3 (Dropdowns/Modals):   overlay-floating 또는 overlay
```

**같은 depth 중첩 시**:
```tsx
// depth 2에서 중첩
<Frame surface="raised">                  // border + shadow
  <Frame surface="raised-floating">      // shadow만 → 구분됨!
  </Frame>
</Frame>

// depth 3에서 중첩
<Frame surface="overlay">                 // border + shadow
  <Frame surface="overlay-bordered">     // border만 → 구분됨!
  </Frame>
</Frame>
```

**결론**: 4색 + 4 variants = **16가지 조합으로 충분**

## 5. 구현 예시

### 5.1 SlideApp 수정

**Before** (문제):
```tsx
<Frame
  surface="overlay"
  override={{ gap: Space.n4, p: Space.n4, shadow: "sm" }}
>
  <Frame
    override={{ w: Size.n28, h: Size.n28 }}
    surface="overlay"  // 구분 안 됨!
  />
</Frame>
```

**After** (해결):
```tsx
<Frame
  surface="overlay"  // border + shadow-lg
  override={{ gap: Space.n4, p: Space.n4 }}
>
  <Frame
    override={{ w: Size.n28, h: Size.n28 }}
    surface="overlay-floating"  // shadow만 → 구분됨!
  />
</Frame>
```

### 5.2 Field 패턴 (변경 없음)

```tsx
// Field는 항상 border (Component Token)
<Field
  label="X"
  value={x}
  onChange={setX}
/>

// CSS
.field-base {
  border: 1px solid var(--field-border);  /* 항상 */
  background: var(--field-bg);            /* sunken */
}
.field-base:focus-within {
  background: var(--field-bg-focus);      /* base (상승) */
  border-color: var(--field-border-focus);
}
```

### 5.3 Action 패턴 (변경 없음)

```tsx
// Action variant (Component Token)
<Action variant="ghost" icon={Icon} />
<Action variant="surface" label="Button" />
<Action variant="primary" label="Save" />

// CSS
.action-surface {
  background: var(--surface-base);
  border: 1px solid var(--border-color);
}
.action-surface:hover {
  background: var(--surface-raised);  // 상승
}
```

### 5.4 CSS 전체 구현

```css
/* --- 1. Base/Sunken (배경색만, variants 없음) --- */
.surface-base {
  background-color: var(--surface-base);
}

.surface-sunken {
  background-color: var(--surface-sunken);
}

/* --- 2. Raised Variants --- */
/* Default (기존 호환) */
.surface-raised {
  background-color: var(--surface-raised);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

/* Bordered (border만) */
.surface-raised-bordered {
  background-color: var(--surface-raised);
  border: 1px solid var(--border-color);
}

/* Floating (shadow만) */
.surface-raised-floating {
  background-color: var(--surface-raised);
  box-shadow: var(--shadow-sm);
}

/* Flat (배경색만) */
.surface-raised-flat {
  background-color: var(--surface-raised);
}

/* --- 3. Overlay Variants --- */
/* Default (기존 호환) */
.surface-overlay {
  background-color: var(--surface-overlay);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
}

/* Bordered (border만) */
.surface-overlay-bordered {
  background-color: var(--surface-overlay);
  border: 1px solid var(--border-color);
}

/* Floating (shadow만) */
.surface-overlay-floating {
  background-color: var(--surface-overlay);
  box-shadow: var(--shadow-lg);
}

/* Flat (배경색만) */
.surface-overlay-flat {
  background-color: var(--surface-overlay);
}

/* --- 4. Special (변경 없음) --- */
.surface-primary {
  background-color: var(--surface-primary);
  color: var(--primary-fg);
}

.surface-selected {
  background-color: var(--surface-selected);
}
```

## 6. 마이그레이션 전략

### 6.1 Breaking Change 최소화

**기본 이름 = Default Variant**:
```typescript
// 기존 코드 (변경 없음)
<Frame surface="raised" />
// → .surface-raised (border + shadow)

// 새로운 코드
<Frame surface="raised-floating" />
// → .surface-raised-floating (shadow만)
```

**Deprecation 없음**: 기존 토큰 이름 유지

### 6.2 단계별 적용

#### Phase 1: CSS 추가
1. `surface.css`에 새 variants 클래스 추가
2. 기존 `.surface-raised`, `.surface-overlay` 유지
3. TypeScript 타입 확장

#### Phase 2: 점진적 적용
1. 문제되는 컴포넌트부터 수정 (SlideApp 등)
2. 새 코드는 명시적 variant 사용 권장
3. 기존 코드는 그대로 유지

#### Phase 3: 가이드라인 문서화
1. Surface 선택 가이드
2. Depth별 권장 토큰
3. 중첩 시 variant 선택 기준

### 6.3 타입 정의 예시

```typescript
// src/design-system/lib/types.ts
export type SurfaceElevation =
  | "default"
  | "bordered"
  | "floating"
  | "flat";

export type SurfaceToken =
  // Static (no variants)
  | "base"
  | "sunken"

  // Raised variants
  | "raised"
  | "raised-bordered"
  | "raised-floating"
  | "raised-flat"

  // Overlay variants
  | "overlay"
  | "overlay-bordered"
  | "overlay-floating"
  | "overlay-flat"

  // Special (no variants)
  | "primary"
  | "selected"
  | "panel"
  | "card"
  | "hover";

// Helper type
export type SurfaceWithVariant<T extends "raised" | "overlay"> =
  | T
  | `${T}-bordered`
  | `${T}-floating`
  | `${T}-flat`;
```

## 7. 결론

### 핵심 결정 사항

1. **Container (Frame)**: Surface Elevation Variants (Option A)
   - `raised-bordered`, `raised-floating`, `raised-flat`
   - `overlay-bordered`, `overlay-floating`, `overlay-flat`

2. **Interactive (Field/Action)**: Component Token 유지
   - Field: 항상 border (변경 없음)
   - Action: Variant system (변경 없음)

3. **4색 정리 원칙**: 4 depth + 4 variants = 충분

### 장점

1. **명확한 의도**: 토큰 이름으로 스타일 완전 표현
2. **타입 안정성**: TypeScript로 완벽히 제어
3. **Breaking change 최소**: 기존 코드 그대로 작동
4. **충분한 표현력**: 16가지 조합으로 모든 케이스 대응
5. **중첩 문제 해결**: 같은 surface도 variant로 구분 가능

### 다음 단계

1. [ ] TypeScript 타입 정의 추가
2. [ ] `surface.css` variants 클래스 구현
3. [ ] SlideApp 수정 (검증)
4. [ ] Discord/CRM/CMS 앱 검토
5. [ ] Surface 선택 가이드 문서 작성
6. [ ] Storybook 예시 추가

---

**작성자**: Claude
**검토 필요**: Surface 토큰 네이밍, CSS 구현, 타입 정의
