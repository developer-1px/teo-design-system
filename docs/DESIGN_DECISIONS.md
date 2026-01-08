# IDE UI Kit - Design Decisions

## Core Design Philosophy

### 1. Borderless Design (선 없는 디자인)
**원칙**: 모든 영역 구분은 면(surface)의 차이로만 표현하며, border를 최소화한다.

**이유**:
- Modern UI의 clean한 느낌
- Dense layout에서 시각적 noise 감소
- 계층적 깊이감을 shadow와 색상으로 표현

---

## Surface Differentiation Strategy (같은 Layer 면 구분 전략)

### 문제 상황
같은 Z-Layer를 가진 서로 다른 기능의 패널들이 붙어있을 때, **border 없이 어떻게 구분할 것인가?**

예시:
- Workspace Nav (Layer 2) + File Tree (Layer 2) - 붙어있음
- File Tree (Layer 2) + AI Chat (Layer 2) - 에디터가 중간에 있어 떨어짐

---

## Solution: 4-Tier Differentiation Strategy

### Tier 1: Tone Shift (색조 변화) ⭐⭐⭐ 최우선
**적용**: 같은 Layer 2이지만 인접한 서로 다른 기능 영역

```css
/* Light Theme */
--layer-2-warm: 252 252 252;   /* #fcfcfc - Workspace Nav (약간 따뜻한 흰색) */
--layer-2-cool: 255 255 255;   /* #ffffff - File Tree (순백) */
--layer-2-neutral: 253 253 253; /* #fdfdfd - AI Chat (중립 톤) */

/* Dark Theme */
--layer-2-warm: 35 35 35;   /* #232323 - 약간 밝음 */
--layer-2-cool: 38 38 38;   /* #262626 - 기본 */
--layer-2-neutral: 36 36 36; /* #242424 - 중립 */
```

**효과**:
- RGB 값 2-3 차이로 육안으로는 거의 구분 안 됨
- 하지만 무의식적으로 "다른 영역"으로 인식
- 자연스러운 시각적 그룹핑

**적용 위치**:
- Workspace Nav: `bg-layer-2-warm`
- File Tree: `bg-layer-2-cool`
- AI Chat: `bg-layer-2-neutral`

---

### Tier 2: Boundary Shadow (경계 그림자) ⭐⭐ 보조
**적용**: 인접한 패널의 경계면에 아주 은은한 inset shadow

```css
/* Light Theme */
.boundary-shadow-left {
  box-shadow: inset 1px 0 0 rgba(0, 0, 0, 0.03); /* 3% 불투명도 */
}

/* Dark Theme */
.boundary-shadow-left {
  box-shadow: inset 1px 0 0 rgba(255, 255, 255, 0.05); /* 5% 불투명도 */
}
```

**효과**:
- 선처럼 보이지 않으면서도 경계를 암시
- inset이라 "선"이 아닌 "깊이" 느낌
- 1px만 사용해 매우 미세함

**적용 위치**:
- File Tree 왼쪽 경계: `boundary-shadow-left`
- AI Chat 왼쪽 경계: `boundary-shadow-left`
- Bottom Panel 위쪽 경계: `boundary-shadow-top`

---

### Tier 3: Opacity Variation (투명도 변화) ⭐⭐
**적용**: 같은 패널 내부의 상태 변화 (hover, inactive)

```tsx
// File Tree Item
기본: bg-layer-2
hover: bg-layer-3/90  // 90% opacity
```

**효과**:
- 상태 전환이 부드러움
- 같은 레이어지만 시각적으로 구분
- 애니메이션 효과가 자연스러움

**적용 위치**:
- File Tree 항목 hover
- Workspace Nav inactive icons (opacity-70)

---

### Tier 4: Accent Indicator (강조 표시) ⭐
**적용**: Active/Selected 상태의 명확한 표시

```css
.accent-indicator::before {
  width: 2px;
  height: 60%;
  background-color: rgb(var(--accent)); /* 초록색 세로줄 */
}
```

**효과**:
- active 상태가 즉시 식별됨
- 색상으로 강한 시선 집중
- 작은 요소로 큰 효과

**적용 위치**:
- IconButton active 상태
- Workspace Nav active icon

---

## Application Matrix (적용 매트릭스)

| 영역 | Layer | Tone | Boundary Shadow | 적용 이유 |
|------|-------|------|-----------------|----------|
| **Workspace Nav** | 2 | warm (#fcfcfc) | - | File Tree와 구분 |
| **File Tree** | 2 | cool (#ffffff) | left | Workspace Nav와 구분 |
| **Editor Tabs** | 2 | neutral (#fcfcfc) | - | Editor(L3)와 자연스러운 연결 |
| **Editor** | 3 | - | - | 주요 작업 공간 (elevated) |
| **AI Chat** | 2 | neutral (#fdfdfd) | left | Editor와 구분 |
| **Bottom Panel** | 1 | - | top | Editor 아래 (sunken) |

---

## Interaction States (인터랙션 상태)

### Hover State Strategy
```
기본 Layer → Hover Layer
Layer 2   → Layer 3/90 (opacity)
```

**예시**:
- File Tree 항목: `bg-layer-2` → `hover:bg-layer-3/90`
- Button ghost: `bg-transparent` → `hover:bg-layer-2`

---

## Visual Hierarchy Rules (시각적 계층 규칙)

### 1. Z-Index Hierarchy - "확실하지만 은은한" 계층

**Light Theme:**
```
Layer 0: #f8f8f8 - 전체 배경 (기준점)
   ↓ 색상 차이 7 (확실한 구분)
Layer 1: #f2f2f2 + inset shadow - 함몰된 영역 (Terminal, Input)
   ↓ 색상 차이 13 (명확한 부각)
Layer 2: #ffffff (순백) - 기본 표면 (Sidebars, Panels)
   ↓  └─ warm(#fcfcfc), cool(#ffffff), neutral(#fdfdfd) - Tone으로 구분
   ↓ 같은 색상, 이중 그림자로 구분
Layer 3: #ffffff + 이중 shadow - 부각된 요소 (Editor, Toolbar)
   ↓
Layer 4: #ffffff + 강한 shadow - 떠있는 UI (Dropdown) [미사용]
   ↓
Layer 5: #ffffff + 최강 shadow - 최상단 (Modal) [미사용]
```

**Dark Theme (색상 차이를 더 크게):**
```
Layer 0: #0c0c0c
   ↓ +8
Layer 1: #141414
   ↓ +10
Layer 2: #1e1e1e
   ↓ +8
Layer 3: #262626
   ↓ +7
Layer 4: #2d2d2d
   ↓ +7
Layer 5: #343434
```
Dark Mode에서는 색상 차이만으로도 명확한 구분이 가능

### 2. Same Layer Differentiation
```
같은 Layer 2에서 구분 필요 시:
1순위: Tone Shift (#fcfcfc vs #ffffff)
2순위: Boundary Shadow (inset 1px)
3순위: Opacity (hover 상태)
4순위: Accent Indicator (active 상태)
```

---

## Shadow Philosophy (그림자 철학) - "확실하지만 은은하게"

### 핵심 원칙: 큰 Blur + 낮은 Opacity = 부드럽지만 명확한 깊이감

### Box Shadow는 "깊이"만 표현
- **Layer 0**: Shadow 없음 (배경색만)
- **Layer 1**: `inset shadow` (함몰된 느낌)
- **Layer 2**: Shadow 없음 (색상만으로 구분)
- **Layer 3**: 이중 그림자 `0 1px 3px + 0 4px 12px` (명확한 부각감)
  - 가까운 그림자(1px) + 먼 그림자(4px)로 자연스러운 깊이
- **Layer 4-5**: 더 강한 이중 그림자 (완전히 떠있음)

### Boundary Shadow는 "경계"만 암시
- **Light Mode**: `inset 2px 0 4px -2px rgba(0,0,0,0.06)`
  - 2px spread로 더 넓은 범위
  - 4px blur로 부드러운 그라데이션
  - -2px로 안쪽만 영향
  - 6% opacity로 확실하지만 은은하게
- **Dark Mode**: `inset 2px 0 6px -2px rgba(0,0,0,0.3)`
  - 더 큰 blur(6px)와 높은 opacity(30%)
  - Dark에서는 더 명확한 구분 필요

**원칙**: Shadow는 장식이 아닌 **기능적 의미**만 가진다. 하지만 "확실하게" 보여야 한다.

---

## Button Design Principles

### 버튼에 Shadow 금지
**이유**: 인라인 요소(버튼)는 "떠있는" 느낌이 부적절

```tsx
// ❌ 잘못된 예
<Button className="shadow-layer-3">

// ✅ 올바른 예
<Button variant="accent">  // 배경색만으로 강조
<Button variant="ghost">   // 투명 배경, hover시 layer-2
```

### Accent 버튼은 화면당 1개만
**이유**: Primary action이 명확해야 함

---

## Spacing Philosophy (간격 철학)

### Gap 대신 Padding
**원칙**: 요소 사이에 gap을 주지 않고, 각 요소의 padding으로 시각적 간격 생성

```tsx
// ❌ Gap 사용 (Layer 0이 보임)
<div className="flex gap-2">

// ✅ Padding 사용 (자연스러운 연결)
<div className="pr-1">  // 오른쪽 여백
<div className="pl-1">  // 왼쪽 여백 (결과적으로 2px 간격)
```

**효과**: 완전히 붙어있는 dense한 느낌 유지

---

## "확실하지만 은은하게" 전략 (Clear but Subtle Strategy)

### 디자인 목표
사용자가 **즉시 계층을 인식**할 수 있으면서도, **시각적으로 부드럽고 편안한** UI

### 구현 방법

#### 1. Layer 간 구분 (Inter-Layer Distinction)
**색상 차이 확대 + 이중 그림자**

```css
/* Light Theme: 색상 차이를 크게 */
Layer 0 → 1: RGB 6 차이 (248→242)
Layer 1 → 2: RGB 13 차이 (242→255)

/* Layer 3는 Layer 2와 같은 색상, 이중 그림자로 구분 */
Layer 2: #ffffff + no shadow
Layer 3: #ffffff + dual shadow
  ↓
  shadow-layer-3:
    0 1px 3px rgba(0,0,0,0.04),  /* 가까운 그림자: 선명한 윤곽 */
    0 4px 12px rgba(0,0,0,0.03)  /* 먼 그림자: 부드러운 깊이감 */
```

**효과**:
- 가까운 그림자(1px offset): 요소의 윤곽을 명확히
- 먼 그림자(4px offset): 큰 blur(12px)로 부드러운 깊이감
- 낮은 opacity(3-4%): 은은하지만 확실히 보임

#### 2. 같은 Layer 내 구분 (Intra-Layer Distinction)
**Boundary Shadow 강화**

```css
/* Before: 선처럼 보이는 1px shadow */
box-shadow: inset 1px 0 0 rgba(0,0,0,0.03);

/* After: 그라데이션처럼 보이는 blur shadow */
box-shadow: inset 2px 0 4px -2px rgba(0,0,0,0.06);
  ↓
  - 2px spread: 더 넓은 범위에 영향
  - 4px blur: 선이 아닌 그라데이션
  - -2px: 안쪽으로만 그림자 표시
  - 0.06 opacity: 2배 증가 (3%→6%)
```

**효과**:
- 경계가 "선"이 아닌 "은은한 그림자"로 인식
- Blur 덕분에 부드럽지만, opacity 증가로 명확함

#### 3. Dark Mode 특별 전략
**색상 차이를 더욱 크게**

```css
/* Dark Theme: 각 레이어마다 7-10 차이 */
Layer 0: 12 (#0c0c0c)
Layer 1: 20 (#141414) ← +8
Layer 2: 30 (#1e1e1e) ← +10
Layer 3: 38 (#262626) ← +8
Layer 4: 45 (#2d2d2d) ← +7
Layer 5: 52 (#343434) ← +7

/* Boundary Shadow도 훨씬 강하게 */
inset 2px 0 6px -2px rgba(0,0,0,0.3) ← 30% opacity!
```

**이유**:
- Dark Mode에서는 색상 차이가 Light보다 덜 명확
- 색상 간격을 넓히고 그림자를 강하게 해서 보완

### Before vs After 비교

| 항목 | Before (은은함 우선) | After (확실함 + 은은함) | 개선 효과 |
|------|---------------------|----------------------|----------|
| **Layer 0** | #fafafa (250) | #f8f8f8 (248) | -2, 더 어둡게 → 대비 증가 |
| **Layer 1** | #f5f5f5 (245) | #f2f2f2 (242) | -3, 함몰감 강화 |
| **Layer 0→1 차이** | 5 | 6 | 20% 증가 |
| **Layer 1→2 차이** | 10 | 13 | 30% 증가 |
| **Layer 3 Shadow** | Single (0.05) | Dual (0.04 + 0.03) | 이중 그림자로 깊이감 향상 |
| **Boundary Shadow** | 1px 0.03 | 2px 4px blur 0.06 | 2배 강화 + blur 추가 |
| **Dark Boundary** | 1px 0.05 | 2px 6px blur 0.30 | 6배 강화! |

### 결과
✅ **확실하게**: 레이어 구분이 즉시 인식됨 (색상 차이 +20~30% + 이중 그림자)
✅ **은은하게**: 선이 없고, blur로 부드럽게 처리 (큰 blur + 낮은 opacity)

---

## Dark Mode Considerations

### Tone Shift는 Dark에서 더 중요
Light에서는 RGB 2-3 차이가 거의 안 보이지만,
Dark에서는 더 명확하게 보임 → 오히려 효과적

```css
/* Dark Mode에서 차이가 더 큼 */
28 vs 30 vs 29 (Layer 2 tone variations)
```

### Dark Mode에서 색상 차이를 크게
Light: Layer 0→1→2 = 6→13 차이
Dark: Layer 0→1→2 = 8→10 차이

---

## Future Considerations

### Layer 4-5는 예약
현재는 사용하지 않지만, 미래의 기능을 위해 예약:
- **Layer 4**: Command Palette, Quick Actions
- **Layer 5**: Confirmation Modals, Error Dialogs

### Theme Expansion
현재 Emerald만 있지만, Blue/Purple/Red 준비됨:
```css
data-color-scheme="blue"
data-color-scheme="purple"
data-color-scheme="red"
```

---

## Summary (요약)

### "확실하지만 은은하게" - 핵심 전략

**1. Layer 간 구분 (Inter-Layer)**:
- **색상 차이 확대**: Light에서 6-13 차이, Dark에서 7-10 차이
- **이중 그림자**: 가까운 그림자(윤곽) + 먼 그림자(깊이감)
- **큰 Blur + 낮은 Opacity**: 12px blur에 3-4% opacity로 부드럽지만 명확하게

**2. 같은 Layer 내 구분 (Intra-Layer)**:
- **Tone Shift**: RGB 2-3 차이로 미묘하게 다른 색조 (#fcfcfc vs #ffffff)
- **Boundary Shadow 강화**: `inset 2px 0 4px -2px rgba(0,0,0,0.06)`
  - 선이 아닌 그라데이션 효과
  - Light: 6% opacity, Dark: 30% opacity
- **Opacity Variation**: hover 상태를 90% opacity로 표현
- **Accent Indicator**: active 상태를 초록색 세로줄로 표시

**3. Dark Mode 전략**:
- 색상 차이를 Light보다 크게 (레이어당 7-10 차이)
- Boundary Shadow를 훨씬 강하게 (30% opacity)
- 색상만으로도 명확한 구분 가능

**결과**:
✅ Border 없이도 **즉시 인식 가능한** 계층 구조
✅ 큰 blur와 낮은 opacity로 **부드럽고 편안한** 시각적 경험
✅ Dense하고 Modern한 UI
