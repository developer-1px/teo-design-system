# React Patterns (8개 패턴 백과사전)

> **재사용 가능한 React 패턴과 베스트 프랙티스**

---

## 📚 패턴 개요

이 폴더는 **8가지 React 패턴**을 다룹니다. 각 패턴은:

- ✅ **완전한 구현**: TypeScript + React
- ✅ **IDDL 통합**: IDDL 컴포넌트와 함께 사용하는 예제
- ✅ **ARIA & Accessibility**: 접근성 속성 자동 적용
- ✅ **우선순위**: High/Medium/Low로 구현 순서 제시
- ✅ **참고 자료**: 주요 라이브러리와 표준 문서 링크

---

## 🗂️ 8개 패턴 목록

### [01. Behavior Patterns](./01-behavior-patterns.md)
**컴포넌트 동작과 인터랙션 패턴**

- **Focus Management**: FocusTrap, RestoreFocus
- **Keyboard Navigation**: ArrowNavigation, KeyboardShortcuts
- **Interaction**: ClickOutside, EscapeHandler, LongPress
- **Scroll**: ScrollLock, ScrollIntoView, InfiniteScroll

**사용 시기**: Modal, Dropdown, List, Menu 등

---

### [02. Accessibility Patterns](./02-accessibility-patterns.md)
**WCAG 2.1 AA 준수를 위한 접근성 패턴**

- **Live Regions**: LiveAnnouncer, StatusMessages
- **ARIA Patterns**: SkipLink, LandmarkRegions
- **Keyboard Accessibility**: Roving TabIndex, GridNavigation
- **Screen Reader Support**: VisuallyHidden, Alternative Text

**사용 시기**: 모든 컴포넌트 (접근성 필수)

---

### [03. Data Patterns](./03-data-patterns.md)
**대용량 데이터 처리와 변환 패턴**

- **Virtualization**: VirtualList, VirtualGrid
- **Pagination**: Client-side, Server-side, Cursor-based
- **Infinite Scroll**: IntersectionObserver 기반
- **Data Transformation**: Sorting, Filtering, Grouping, Search

**사용 시기**: Table, List, Grid 등 대량 데이터 표시

---

### [04. Composition Patterns](./04-composition-patterns.md)
**컴포넌트 조합과 재사용 패턴**

- **Compound Components**: Tabs, Accordion (Context 공유)
- **Polymorphic**: `as` prop으로 HTML 태그 변경
- **Slots**: Named Slots (Vue-like)
- **Render Props**: Children as Function

**사용 시기**: 복잡한 UI 구성 (Tabs, Modal, Card 등)

---

### [05. State Patterns](./05-state-patterns.md)
**상태 관리 전략과 패턴**

- **Controlled/Uncontrolled**: Form 컴포넌트 상태
- **Form State**: Object-based State, Reducer Pattern
- **Loading States**: State Machine (idle/loading/success/error)
- **Error States**: Error Boundaries, Field-level Errors
- **Global State**: Context + useReducer, Zustand

**사용 시기**: Form, Modal, API 호출 등

---

### [06. Animation Patterns](./06-animation-patterns.md)
**UI 애니메이션과 트랜지션 패턴**

- **Presence**: Mount/Unmount 애니메이션
- **Transitions**: CSS Transitions, Shared Layout
- **Gestures**: Drag & Drop, Swipe to Dismiss
- **Scroll**: Scroll-triggered, Parallax, Progress Bar
- **Loading**: Spinner, Skeleton, Progress
- **Accessibility**: `prefers-reduced-motion`

**사용 시기**: Modal, Notification, Interactive UI

---

### [07. Layout Patterns](./07-layout-patterns.md)
**반응형 레이아웃 구성 패턴**

- **Responsive**: Breakpoint-based, Container Queries
- **Grid Systems**: 12-Column, CSS Grid Areas, Bento Grid
- **Flexbox**: Stack, Cluster, Sidebar Layout
- **Sizing**: Aspect Ratio, Clamp (Fluid Typography)
- **Scrollable**: Scroll Container, Horizontal Scroll, Sticky Header

**사용 시기**: Page 레이아웃, Dashboard, Grid

---

### [08. Performance Patterns](./08-performance-patterns.md)
**React 성능 최적화 패턴**

- **Memoization**: React.memo, useMemo, useCallback
- **Code Splitting**: React.lazy, Route-based, Component-based
- **Lazy Loading**: Intersection Observer, Native Lazy Loading
- **Virtualization**: VirtualList (대용량 리스트)
- **Debouncing & Throttling**: useDebounce, useThrottle
- **Bundle Optimization**: Tree Shaking, Dynamic Imports

**사용 시기**: 성능 문제 발생 시, 대규모 앱

---

## 🎯 패턴 선택 가이드

### 상황별 필요한 패턴

#### "Modal을 만들어야 해"
```
1. Behavior Patterns → FocusTrap, EscapeHandler
2. Accessibility Patterns → ARIA Modal Pattern
3. Animation Patterns → Presence (Mount/Unmount)
4. State Patterns → Controlled State
```

#### "대용량 테이블을 보여줘야 해"
```
1. Data Patterns → Virtualization, Pagination
2. Performance Patterns → Memoization
3. Layout Patterns → Scroll Container
```

#### "복잡한 Form을 만들어야 해"
```
1. State Patterns → Form State (React Hook Form)
2. Accessibility Patterns → Form Accessibility
3. Composition Patterns → Compound Components (Field + Label + Error)
```

#### "재사용 가능한 Tabs를 만들어야 해"
```
1. Composition Patterns → Compound Components
2. Behavior Patterns → ArrowNavigation (키보드)
3. Accessibility Patterns → ARIA Tabs Pattern
4. Animation Patterns → Shared Layout Transitions
```

---

## 📊 구현 우선순위

### 🔴 High Priority (즉시 구현)
필수 패턴 - 대부분의 앱에서 사용

| 패턴 | 이유 |
|------|------|
| **Behavior: FocusTrap** | Modal, Dialog 필수 |
| **Behavior: ClickOutside** | Dropdown, Popover 필수 |
| **Accessibility: ARIA Patterns** | 모든 컴포넌트 |
| **State: Controlled/Uncontrolled** | Form 기본 |
| **Performance: Memoization** | 불필요한 리렌더링 방지 |

### 🟡 Medium Priority
자주 사용되는 패턴

| 패턴 | 이유 |
|------|------|
| **Composition: Compound Components** | 복잡한 UI (Tabs, Accordion) |
| **Animation: Presence** | Modal, Notification |
| **Layout: Responsive** | 모바일 대응 |
| **Data: Pagination** | 데이터 표시 |

### 🟢 Low Priority
특정 사용 사례에만 필요

| 패턴 | 이유 |
|------|------|
| **Data: Virtualization** | 대용량 리스트 (10,000개 이상) |
| **Animation: Gestures** | 모바일 인터랙션 |
| **Performance: Code Splitting** | 번들 크기 최적화 (필요 시) |

---

## 🔗 패턴 간 관계

```
Composition Patterns (구조)
    ↓
Behavior Patterns (동작)
    ↓
Accessibility Patterns (접근성)
    ↓
State Patterns (상태 관리)
    ↓
Animation Patterns (시각적 효과)
    ↓
Performance Patterns (최적화)
```

---

## 📖 학습 순서

### 초보자
1. **State Patterns** (기본)
2. **Behavior Patterns** (인터랙션)
3. **Accessibility Patterns** (접근성)

### 중급자
4. **Composition Patterns** (구조화)
5. **Animation Patterns** (UX 향상)
6. **Layout Patterns** (레이아웃)

### 고급자
7. **Data Patterns** (대용량 처리)
8. **Performance Patterns** (최적화)

---

## 🔗 관련 문서

- [Core: Reference](../core/3-reference/) - IDDL 컴포넌트 레퍼런스
- [Core: How-to](../core/2-how-to/) - 패턴 적용 가이드
- [Design System](../design-system/) - 디자인 원칙

---

## 📚 주요 참고 라이브러리

- **React Aria**: https://react-spectrum.adobe.com/react-aria/
- **Radix UI**: https://www.radix-ui.com/
- **Headless UI**: https://headlessui.com/
- **Framer Motion**: https://www.framer.com/motion/
- **React Window**: https://react-window.vercel.app/

---

**이 패턴들은 IDDL 컴포넌트와 함께 사용하여 일관되고 접근 가능한 UI를 구축하는 데 사용됩니다.**
