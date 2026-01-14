# Overlay Design Token Decision Tree (3-Tier)

## 개요

Overlay는 **플로팅 UI 요소**를 위한 컴포넌트입니다. 이 문서는 Overlay가 사용할 디자인 토큰을 3-tier 의사 결정 트리로 정의합니다.

**3-Tier 구조:**
1. **Tier 1: Role (역할)** - 무엇인가? (Modal, Popover, Tooltip, Drawer, Dropdown)
2. **Tier 2: Context (맥락)** - 어디서 사용되는가? (Application, Document, Landing)
3. **Tier 3: Variant (변형)** - 어떤 크기/스타일인가? (Default, Compact, Large)

---

## Tier 1: Role (역할 기반 분류)

Overlay의 **의미론적 역할**에 따라 기본 토큰을 결정합니다.

```
Overlay.Role
│
├── Modal          전체 화면 집중 (중요한 결정)
├── Popover        맥락 기반 팝업 (추가 정보/액션)
├── Tooltip        간단한 설명 (힌트)
├── Drawer         사이드 패널 (상세 정보)
└── Dropdown       선택 메뉴 (옵션 목록)
```

### Role별 기본 토큰

#### 1. Modal (모달 대화상자)

**목적**: 사용자 집중이 필요한 중요한 결정이나 입력

```typescript
Overlay.Modal = {
  // Positioning
  position: "fixed",
  x: "50%",
  y: "50%",
  transform: "translate(-50%, -50%)",

  // Z-Index Layer
  zIndex: 1000,  // Highest priority

  // Backdrop
  blockInteraction: true,
  backdropOpacity: Opacity.n60,
  backdropBlur: "8px",

  // Interaction
  clickOutsideToDismiss: false,  // Requires explicit action
  escapeKeyDismiss: true,

  // Visual
  surface: "overlay",
  rounded: Radius.n12,
  shadow: Shadow["2xl"],

  // Sizing
  minWidth: Size.n320,
  maxWidth: Size.n512,
  padding: Space.n24,
}
```

**의사 결정:**
- ✅ 사용자가 반드시 응답해야 하는가? → Modal
- ✅ 다른 모든 UI를 차단해야 하는가? → Modal
- ✅ 중요한 정보나 경고인가? → Modal

---

#### 2. Popover (팝오버)

**목적**: 요소와 연결된 추가 정보나 액션

```typescript
Overlay.Popover = {
  // Positioning (상대 위치)
  position: "absolute",
  // x, y는 trigger 요소 기준으로 계산됨

  // Z-Index Layer
  zIndex: 500,  // Medium priority

  // Backdrop
  blockInteraction: false,  // 배경 클릭 가능
  backdropOpacity: Opacity.n0,

  // Interaction
  clickOutsideToDismiss: true,
  escapeKeyDismiss: true,

  // Visual
  surface: "raised",
  rounded: Radius.n8,
  shadow: Shadow.lg,
  border: BorderWidth.n1,

  // Sizing
  minWidth: Size.n192,
  maxWidth: Size.n384,
  padding: Space.n12,

  // Animation
  offset: Space.n8,  // trigger와의 거리
}
```

**의사 결정:**
- ✅ 특정 요소와 관련된 추가 정보인가? → Popover
- ✅ 사용자가 원할 때 열고 닫을 수 있어야 하는가? → Popover
- ✅ 배경 상호작용이 가능해야 하는가? → Popover

---

#### 3. Tooltip (툴팁)

**목적**: 간단한 설명이나 힌트

```typescript
Overlay.Tooltip = {
  // Positioning
  position: "absolute",

  // Z-Index Layer
  zIndex: 2000,  // Highest (always visible)

  // Backdrop
  blockInteraction: false,
  backdropOpacity: Opacity.n0,

  // Interaction
  clickOutsideToDismiss: false,  // hover로 제어
  escapeKeyDismiss: false,
  hoverDelay: 300,  // ms

  // Visual
  surface: "inverse",  // Dark background
  rounded: Radius.n6,
  shadow: Shadow.md,

  // Sizing
  maxWidth: Size.n224,
  padding: Space.n8,

  // Typography
  fontSize: FontSize.n12,
  textColor: "white",

  // Animation
  offset: Space.n4,
}
```

**의사 결정:**
- ✅ 한 줄 정도의 짧은 설명인가? → Tooltip
- ✅ hover로 표시되는가? → Tooltip
- ✅ 상호작용이 필요 없는가? → Tooltip

---

#### 4. Drawer (드로어)

**목적**: 사이드에서 슬라이드되는 상세 정보 패널

```typescript
Overlay.Drawer = {
  // Positioning
  position: "fixed",
  // right: 0 or left: 0 (측면 기준)
  top: 0,
  bottom: 0,

  // Z-Index Layer
  zIndex: 900,

  // Backdrop
  blockInteraction: true,
  backdropOpacity: Opacity.n40,

  // Interaction
  clickOutsideToDismiss: true,
  escapeKeyDismiss: true,

  // Visual
  surface: "base",
  rounded: Radius.n0,  // 화면 끝까지
  shadow: Shadow.xl,
  border: BorderWidth.n1,

  // Sizing
  width: Size.n384,  // Fixed width
  height: Size.screen,
  padding: Space.n20,

  // Animation
  slideFrom: "right",  // or "left"
}
```

**의사 결정:**
- ✅ 많은 정보를 표시해야 하는가? → Drawer
- ✅ 측면에서 슬라이드되어야 하는가? → Drawer
- ✅ 전체 높이를 차지해야 하는가? → Drawer

---

#### 5. Dropdown (드롭다운)

**목적**: 선택 가능한 옵션 목록

```typescript
Overlay.Dropdown = {
  // Positioning
  position: "absolute",

  // Z-Index Layer
  zIndex: 600,

  // Backdrop
  blockInteraction: false,
  backdropOpacity: Opacity.n0,

  // Interaction
  clickOutsideToDismiss: true,
  escapeKeyDismiss: true,

  // Visual
  surface: "raised",
  rounded: Radius.n8,
  shadow: Shadow.md,
  border: BorderWidth.n1,

  // Sizing
  minWidth: Size.n192,
  maxWidth: Size.n320,
  maxHeight: Size.n384,  // 스크롤 가능
  padding: Space.n4,  // 내부 리스트 간격

  // Animation
  offset: Space.n4,
}
```

**의사 결정:**
- ✅ 선택 가능한 옵션 목록인가? → Dropdown
- ✅ 버튼이나 필드 아래에 나타나는가? → Dropdown
- ✅ 한 번에 하나만 선택하는가? → Dropdown

---

## Tier 2: Context (맥락 기반 스케일링)

Experience 레벨에 따라 토큰 값이 스케일링됩니다.

```
Context
│
├── Application     (Dense, 작은 UI)
├── Document        (Readable, 중간 UI)
└── Landing         (Large, 큰 UI)
```

### Context별 스케일 배율

```css
/* Application Context */
[data-experience="application"] {
  --overlay-scale: 1.0;
  --overlay-padding-scale: 1.0;
  --overlay-shadow-scale: 1.0;
}

/* Document Context */
[data-experience="document"] {
  --overlay-scale: 1.15;
  --overlay-padding-scale: 1.25;
  --overlay-shadow-scale: 1.2;
}

/* Landing Context */
[data-experience="landing"] {
  --overlay-scale: 1.3;
  --overlay-padding-scale: 1.5;
  --overlay-shadow-scale: 1.5;
}
```

### Context 적용 예시

#### Modal in Application

```typescript
Overlay.Modal.Application = {
  minWidth: Size.n320,   // 320px
  maxWidth: Size.n512,   // 512px
  padding: Space.n24,    // 24px
  rounded: Radius.n12,   // 12px
  shadow: Shadow["2xl"],
}
```

#### Modal in Landing

```typescript
Overlay.Modal.Landing = {
  minWidth: Size.n384,   // 384px (320 * 1.2)
  maxWidth: Size.n640,   // 640px (512 * 1.25)
  padding: Space.n36,    // 36px (24 * 1.5)
  rounded: Radius.n16,   // 16px (12 * 1.33)
  shadow: Shadow["2xl"], // 더 강한 shadow
}
```

**의사 결정 흐름:**

```
1. 현재 Experience는? → [Application | Document | Landing]
2. Role은? → [Modal | Popover | Tooltip | Drawer | Dropdown]
3. Context 스케일 배율 적용 → 최종 토큰 값
```

---

## Tier 3: Variant (크기/스타일 변형)

동일한 Role + Context에서도 크기나 스타일 변형이 필요할 수 있습니다.

```
Variant
│
├── Default         (표준 크기)
├── Compact         (작은 크기)
└── Large           (큰 크기)
```

### Variant별 배율

```typescript
const VariantScale = {
  Compact: 0.85,
  Default: 1.0,
  Large: 1.2,
}
```

### Variant 적용 예시

#### Modal Variants

```typescript
// Modal.Default (표준)
Overlay.Modal.Default = {
  minWidth: Size.n320,
  maxWidth: Size.n512,
  padding: Space.n24,
}

// Modal.Compact (작은 확인 대화상자)
Overlay.Modal.Compact = {
  minWidth: Size.n256,   // 320 * 0.8
  maxWidth: Size.n384,   // 512 * 0.75
  padding: Space.n16,    // 24 * 0.67
}

// Modal.Large (상세 정보 대화상자)
Overlay.Modal.Large = {
  minWidth: Size.n448,   // 320 * 1.4
  maxWidth: Size.n768,   // 512 * 1.5
  padding: Space.n32,    // 24 * 1.33
}
```

#### Popover Variants

```typescript
// Popover.Default
Overlay.Popover.Default = {
  minWidth: Size.n192,
  maxWidth: Size.n384,
  padding: Space.n12,
}

// Popover.Compact (작은 팁)
Overlay.Popover.Compact = {
  minWidth: Size.n160,
  maxWidth: Size.n256,
  padding: Space.n8,
}

// Popover.Large (리치 팝오버)
Overlay.Popover.Large = {
  minWidth: Size.n256,
  maxWidth: Size.n512,
  padding: Space.n16,
}
```

---

## Z-Index Layer System

Overlay 간의 계층 구조를 명확히 정의합니다.

```typescript
const ZIndexLayers = {
  // Base Layer
  Base: 0,

  // Overlay Layers
  Dropdown: 600,      // 일반 드롭다운
  Popover: 500,       // 팝오버
  Drawer: 900,        // 드로어 (전체 화면 차지)
  Modal: 1000,        // 모달 (최우선 집중)
  Tooltip: 2000,      // 툴팁 (항상 최상위)

  // System Layers
  Toast: 1500,        // 알림 (모달 위)
  Debug: 9999,        // 디버그 오버레이
}
```

**의사 결정:**

```
Q: 다른 Overlay 위에 나타나야 하는가?
├─ Yes → zIndex 높은 Role 사용 (Modal, Tooltip)
└─ No  → zIndex 낮은 Role 사용 (Popover, Dropdown)

Q: 여러 개가 동시에 열릴 수 있는가?
├─ Yes → zIndex 중복 방지 메커니즘 필요 (stack 관리)
└─ No  → 고정 zIndex 사용
```

---

## Animation & Transition Tokens

Overlay 등장/퇴장 애니메이션을 위한 토큰입니다.

```typescript
const OverlayAnimation = {
  // Duration
  duration: {
    instant: "0ms",
    fast: "150ms",
    normal: "250ms",
    slow: "350ms",
  },

  // Easing
  easing: {
    enter: "cubic-bezier(0.16, 1, 0.3, 1)",      // ease-out-expo
    exit: "cubic-bezier(0.7, 0, 0.84, 0)",       // ease-in-expo
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)", // spring bounce
  },

  // Transform Origin
  origin: {
    center: "center center",
    top: "center top",
    bottom: "center bottom",
    left: "left center",
    right: "right center",
  },
}
```

### Role별 애니메이션

```typescript
// Modal: Fade + Scale
Overlay.Modal.animation = {
  enter: {
    duration: "250ms",
    easing: "spring",
    transform: "scale(0.95) → scale(1)",
    opacity: "0 → 1",
  },
  exit: {
    duration: "200ms",
    easing: "ease-in-expo",
    transform: "scale(1) → scale(0.95)",
    opacity: "1 → 0",
  },
}

// Popover: Slide + Fade
Overlay.Popover.animation = {
  enter: {
    duration: "200ms",
    easing: "ease-out-expo",
    transform: "translateY(-8px) → translateY(0)",
    opacity: "0 → 1",
  },
  exit: {
    duration: "150ms",
    easing: "ease-in-expo",
    transform: "translateY(0) → translateY(-4px)",
    opacity: "1 → 0",
  },
}

// Tooltip: Instant Fade
Overlay.Tooltip.animation = {
  enter: {
    duration: "100ms",
    easing: "ease-out",
    opacity: "0 → 1",
  },
  exit: {
    duration: "75ms",
    easing: "ease-in",
    opacity: "1 → 0",
  },
}

// Drawer: Slide from side
Overlay.Drawer.animation = {
  enter: {
    duration: "300ms",
    easing: "ease-out-expo",
    transform: "translateX(100%) → translateX(0)",  // from right
  },
  exit: {
    duration: "250ms",
    easing: "ease-in-expo",
    transform: "translateX(0) → translateX(100%)",
  },
}

// Dropdown: Scale + Fade
Overlay.Dropdown.animation = {
  enter: {
    duration: "150ms",
    easing: "ease-out-expo",
    transform: "scale(0.95) → scale(1)",
    transformOrigin: "top center",
    opacity: "0 → 1",
  },
  exit: {
    duration: "100ms",
    easing: "ease-in",
    transform: "scale(1) → scale(0.95)",
    opacity: "1 → 0",
  },
}
```

---

## 전체 의사 결정 플로우차트

```
START: Overlay가 필요함
│
├─ Q1: 무엇을 표시하는가? (Role)
│   ├─ 중요한 결정/입력 → Modal
│   ├─ 추가 정보/액션 → Popover
│   ├─ 간단한 힌트 → Tooltip
│   ├─ 상세 정보 패널 → Drawer
│   └─ 선택 옵션 목록 → Dropdown
│
├─ Q2: 어디서 사용되는가? (Context)
│   ├─ Application → 1.0x scale
│   ├─ Document → 1.15x scale
│   └─ Landing → 1.3x scale
│
├─ Q3: 어떤 크기인가? (Variant)
│   ├─ Compact → 0.85x scale
│   ├─ Default → 1.0x scale
│   └─ Large → 1.2x scale
│
└─ 최종 토큰 계산:
    BaseToken × ContextScale × VariantScale = FinalToken
```

---

## 사용 예제

### 1. Application에서 기본 Modal

```tsx
<Overlay
  role="modal"
  context="application"
  variant="default"
  // 자동 해석:
  // - minWidth: 320px
  // - maxWidth: 512px
  // - padding: 24px
  // - zIndex: 1000
  // - blockInteraction: true
  // - shadow: 2xl
>
  <Text.Card.Title>Delete Confirmation</Text.Card.Title>
  <Text.Card.Desc>Are you sure?</Text.Card.Desc>
  <Frame layout={Layout.Row.Actions.Default}>
    <Action variant="ghost" label="Cancel" />
    <Action variant="primary" label="Delete" />
  </Frame>
</Overlay>
```

### 2. Landing에서 큰 Popover

```tsx
<Overlay
  role="popover"
  context="landing"
  variant="large"
  // 자동 해석:
  // - minWidth: 256px * 1.3 * 1.2 = ~400px
  // - maxWidth: 512px * 1.3 * 1.2 = ~800px
  // - padding: 16px * 1.5 * 1.2 = ~29px
  // - zIndex: 500
  // - clickOutsideToDismiss: true
>
  <Text.Prose.Title variant="sm">Feature Details</Text.Prose.Title>
  <Text.Prose.Body>
    This feature helps you...
  </Text.Prose.Body>
</Overlay>
```

### 3. Application에서 Compact Tooltip

```tsx
<Overlay
  role="tooltip"
  context="application"
  variant="compact"
  // 자동 해석:
  // - maxWidth: 224px * 0.85 = ~190px
  // - padding: 8px * 0.85 = ~7px
  // - fontSize: 12px
  // - zIndex: 2000
>
  <Text.Card.Note>Click to edit</Text.Card.Note>
</Overlay>
```

---

## 토큰 네이밍 컨벤션

```
--overlay-{role}-{property}-{variant?}
```

**예시:**
```css
/* Modal */
--overlay-modal-min-width: 320px;
--overlay-modal-max-width: 512px;
--overlay-modal-padding: 24px;
--overlay-modal-z-index: 1000;

/* Modal Compact */
--overlay-modal-min-width-compact: 256px;
--overlay-modal-max-width-compact: 384px;
--overlay-modal-padding-compact: 16px;

/* Popover */
--overlay-popover-min-width: 192px;
--overlay-popover-max-width: 384px;
--overlay-popover-padding: 12px;
--overlay-popover-z-index: 500;

/* Tooltip */
--overlay-tooltip-max-width: 224px;
--overlay-tooltip-padding: 8px;
--overlay-tooltip-z-index: 2000;

/* Drawer */
--overlay-drawer-width: 384px;
--overlay-drawer-z-index: 900;

/* Dropdown */
--overlay-dropdown-min-width: 192px;
--overlay-dropdown-max-width: 320px;
--overlay-dropdown-max-height: 384px;
--overlay-dropdown-z-index: 600;
```

---

## 요약: 3-Tier 토큰 결정

```
Layer 1 (Role):     Modal | Popover | Tooltip | Drawer | Dropdown
                    ↓
Layer 2 (Context):  Application | Document | Landing
                    ↓
Layer 3 (Variant):  Compact | Default | Large
                    ↓
Final Token:        Base × Context × Variant
```

**핵심 원칙:**
1. **Role이 의미를 정의함** - 무엇을 표시하는가?
2. **Context가 크기를 조정함** - 어디서 사용되는가?
3. **Variant가 미세 조정함** - 특수한 경우인가?
4. **모든 토큰은 예측 가능** - AI가 추론 가능한 일관된 규칙
