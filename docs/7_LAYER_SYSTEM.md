# 7-Layer Depth System - 면으로 깊이를 표현하는 계층 구조

## 핵심 원칙

1. **각 레이어는 독립적이고 명확한 용도를 가짐**
2. **숫자가 클수록 더 위에 떠있음 (사용자에게 가까움)**
3. **색상 차이 + 그림자 조합으로 깊이감 표현**
4. **Border 대신 면의 차이로만 구분**
5. **모든 요소에 border-radius 적용 (minimal한 느낌)**
6. **Minimal Philosophy: No backdrop, No animations - 순수하게 면과 그림자만으로 표현**

---

## Layer 정의

### Layer 0: Background (배경)
**용도**: 전체 앱 배경, 가장 깊숙한 층

**색상**:
- Light: `#f6f6f6` (246, 246, 246)
- Dark: `#0a0a0a` (10, 10, 10)

**그림자**: 없음

**사용처**:
- App 전체 배경 (`<Layer level={0}>`)

---

### Layer 1: Sunken (함몰)
**용도**: Input fields, Terminal, 눌린 느낌의 영역

**색상**:
- Light: `#f0f0f0` (240, 240, 240)
- Dark: `#121212` (18, 18, 18)

**그림자**: `inset 0 2px 4px rgba(0, 0, 0, 0.06)` - 함몰감 표현

**사용처**:
- Input 필드
- Textarea
- Terminal
- Search box
- 눌려진 버튼 상태

---

### Layer 2: Base Surface (기본 표면)
**용도**: Sidebar, Panel의 기본 배경

**색상**:
- Light: `#fafafa` (250, 250, 250)
- Dark: `#1a1a1a` (26, 26, 26)

**그림자**: 없음 (색상 차이로만 구분)

**Tone Variations** (같은 레이어 내 면 구분):
- Warm: Workspace Nav
- Cool: File Tree
- Neutral: AI Chat

**사용처**:
- Workspace Navigation (왼쪽 아이콘 바)
- File Tree Sidebar
- Right Sidebar (AI Chat)
- Bottom Panel

---

### Layer 3: Primary Surface (주요 표면)
**용도**: Editor, Main Content Area - 주요 작업 공간

**색상**:
- Light: `#ffffff` (255, 255, 255) - 순백
- Dark: `#222222` (34, 34, 34)

**그림자**:
```css
0 1px 2px rgba(0, 0, 0, 0.03),
0 2px 8px rgba(0, 0, 0, 0.02)
```
매우 은은한 이중 그림자

**Tone Variations**:
- Warm: Editor Tabs
- Cool: Editor
- Neutral: Right Panel Header

**사용처**:
- Code Editor
- Markdown Viewer
- Main content area
- Empty state placeholder

---

### Layer 4: Elevated (부각)
**용도**: Toolbar, Active Tab, 떠있는 컨트롤

**색상**:
- Light: `#ffffff` (255, 255, 255)
- Dark: `#2a2a2a` (42, 42, 42)

**그림자**:
```css
0 1px 3px rgba(0, 0, 0, 0.05),
0 4px 12px rgba(0, 0, 0, 0.04)
```
이중 그림자로 명확히 떠있음

**사용처**:
- Top Toolbar (IntelliJ style)
- Active Tab
- Floating action buttons
- Toolbar buttons

---

### Layer 5: Floating (떠있음)
**용도**: Dropdown, Popover, Context Menu

**색상**:
- Light: `#ffffff` (255, 255, 255)
- Dark: `#323232` (50, 50, 50)

**그림자**:
```css
0 2px 8px rgba(0, 0, 0, 0.08),
0 8px 24px rgba(0, 0, 0, 0.06)
```
강한 그림자, 떠있는 느낌

**사용처**:
- Dropdown menus
- Popover
- Context menus
- Autocomplete suggestions
- Tooltips (rich)

---

### Layer 6: Overlay (오버레이)
**용도**: Modal, Dialog, Toast - 최상단 UI

**색상**:
- Light: `#ffffff` (255, 255, 255)
- Dark: `#3a3a3a` (58, 58, 58)

**그림자**:
```css
0 4px 16px rgba(0, 0, 0, 0.12),
0 16px 64px rgba(0, 0, 0, 0.10)
```
최강 그림자, 모달/다이얼로그

**사용처**:
- Modals
- Dialogs
- Alerts
- Toast notifications
- Full-screen overlays

---

## Layer 간 색상 차이 (Light Theme)

```
Layer 0: 246 (#f6f6f6)
   ↓ -6 (더 어두움)
Layer 1: 240 (#f0f0f0)
   ↓ +10 (더 밝음)
Layer 2: 250 (#fafafa)
   ↓ +5 (순백으로)
Layer 3: 255 (#ffffff)
   ↓ 0 (같은 색상, 그림자로 구분)
Layer 4: 255 (#ffffff)
   ↓ 0
Layer 5: 255 (#ffffff)
   ↓ 0
Layer 6: 255 (#ffffff)
```

**Layer 2-6는 모두 순백이지만, 그림자의 강도로 깊이를 구분**

---

## Layer 간 색상 차이 (Dark Theme)

```
Layer 0: 10 (#0a0a0a)
   ↓ +8
Layer 1: 18 (#121212)
   ↓ +8
Layer 2: 26 (#1a1a1a)
   ↓ +8
Layer 3: 34 (#222222)
   ↓ +8
Layer 4: 42 (#2a2a2a)
   ↓ +8
Layer 5: 50 (#323232)
   ↓ +8
Layer 6: 58 (#3a3a3a)
```

**Dark에서는 각 레이어마다 일정한 색상 차이 (8씩 증가)**

---

## Border Radius 시스템

**원칙**: 모든 요소에 border-radius를 사용하여 부드러운 느낌
**예외**: 전체 화면 영역 (App container), 정렬이 필요한 경우만 제외

```css
--radius-none: 0        /* 예외적으로만 사용 */
--radius-sm: 4px        /* Icon, Badge, Small Button */
--radius-md: 6px        /* Button, Input, Tab (기본) */
--radius-lg: 8px        /* Sidebar, Panel, Card */
--radius-xl: 10px       /* Modal, Dialog */
--radius-2xl: 12px      /* Image, Media */
--radius-full: 9999px   /* Circle: Avatar, Dot */
```

### 자동 적용 (Global CSS)

모든 버튼, input, panel 등에 자동으로 적용:

```css
button { border-radius: var(--radius-md); }
input, textarea { border-radius: var(--radius-md); }
[class*='panel'] { border-radius: var(--radius-lg); }
img, video { border-radius: var(--radius-lg); }
```

**Tailwind 클래스를 최소화하는 Minimal 컨셉**

---

## 사용 예제

### 기본 사용

```tsx
// App 배경
<Layer level={0}>

// Sidebar
<Layer level={2} className="bg-layer-2-warm">

// Editor
<Layer level={3}>

// Toolbar
<Layer level={4}>

// Dropdown Menu
<Layer level={5} rounded="lg">

// Modal
<Layer level={6} rounded="xl">
```

### Rounded 옵션

```tsx
// 기본 (lg)
<Layer level={5} rounded>

// 특정 크기
<Layer level={5} rounded="sm">
<Layer level={5} rounded="md">
<Layer level={5} rounded="xl">
<Layer level={5} rounded="2xl">
```

---

## 같은 Layer 내 면 구분 전략

같은 Layer를 가진 서로 다른 패널이 붙어있을 때:

### 1. Tone Shift (색조 변화) - 최우선
RGB 2-3 차이로 미묘하게 다른 색조

```tsx
<Layer level={2} className="bg-layer-2-warm">  // Workspace Nav
<Layer level={2} className="bg-layer-2-cool">  // File Tree
<Layer level={2} className="bg-layer-2-neutral"> // AI Chat
```

### 2. Boundary Shadow (경계 그림자) - 보조
```tsx
<Layer level={2} className="boundary-shadow-left">
```

### 3. Opacity Variation (투명도) - 인터랙션
```tsx
className="hover:bg-layer-3/90"
```

### 4. Accent Indicator (강조) - Active 상태
```tsx
className="accent-indicator" // 초록색 세로줄
```

---

## Design Philosophy

### "확실하지만 은은하게"

- **확실하게**: 레이어 구분이 즉시 인식됨 (색상 차이 + 이중 그림자)
- **은은하게**: 선이 없고, blur로 부드럽게 처리 (큰 blur + 낮은 opacity)

### "Minimal Tailwind"

- 모든 기본 스타일을 테마에 정의
- Tailwind 클래스 사용 최소화
- 컴포넌트는 의미적인 props만 사용 (`level`, `rounded`)

### "Borderless Design"

- 모든 구분은 면(surface)의 차이로만 표현
- Border를 최소화
- 계층적 깊이감을 shadow와 색상으로 표현

---

## 마이그레이션 가이드

### Before (5-Layer)
```tsx
<Layer level={3} className="rounded-lg shadow-layer-3">
```

### After (7-Layer)
```tsx
<Layer level={4} rounded>
```

**변경사항**:
- Layer 0-6으로 확장 (7단계)
- rounded prop으로 간소화
- 자동 shadow 적용 (className 불필요)
- Tailwind 클래스 최소화
