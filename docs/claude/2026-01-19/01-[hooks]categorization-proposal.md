# Hooks 디렉토리 범주화 제안

**Date**: 2026-01-19
**Tags**: `#hooks` `#folder-structure` `#categorization` `#refactoring`
**Status**: Proposal

---

## 목차

1. [현재 구조 분석](#현재-구조-분석)
2. [문제점](#문제점)
3. [범주화 제안](#범주화-제안)
4. [마이그레이션 계획](#마이그레이션-계획)
5. [참고 자료](#참고-자료)

---

## 현재 구조 분석

### 디렉토리 구조

```
src/design-system/hooks/
├── README.md
├── index.ts
├── logic/
│   └── CommandManager.ts
├── utils/
│   ├── keyUtils.ts
│   ├── useClickOutside.ts
│   ├── useControlledState.ts
│   ├── useFocusTrap.ts
│   ├── useId.ts
│   └── useScrollLock.ts
├── useAccordion.ts
├── useClipboard.ts
├── useCommandSystem.ts
├── useDropdown.ts
├── useFuzzySearch.ts
├── useGridSelection.ts
├── useHeadlessTable.ts
├── useHistory.ts
├── useHotKeys.ts
├── useKeyboardCommand.ts
├── useModal.ts
├── useNavigation.ts
├── useSelection.ts
├── useTabs.ts
├── useTooltip.ts
└── useVirtualScroll.ts
```

### 현재 분류 (index.ts 기준)

**index.ts**에서 이미 일부 범주화가 되어 있음:

```typescript
// Core Hooks
export { useAccordion } from "./useAccordion";
export { useDropdown } from "./useDropdown";

// Advanced Hooks (Phase 3)
export { useFuzzySearch } from "./useFuzzySearch";
export { useHotKeys } from "./useHotKeys";
export { useModal } from "./useModal";
export { useNavigation } from "./useNavigation";
export { useTabs } from "./useTabs";
export { useTooltip } from "./useTooltip";
export { useVirtualScroll } from "./useVirtualScroll";

// Utility Hooks
export { useClipboard } from "./useClipboard";
export { useHistory } from "./useHistory";
export { useSelection } from "./useSelection";
export { useHeadlessTable } from "./useHeadlessTable";

// Utils (from utils/)
export { useClickOutside } from "./utils/useClickOutside";
export { useControlledState } from "./utils/useControlledState";
export { useFocusTrap } from "./utils/useFocusTrap";
export { useId } from "./utils/useId";
export { useScrollLock } from "./utils/useScrollLock";
```

---

## 문제점

### 1. 불명확한 분류 기준

- **"Core" vs "Advanced"**: 무엇이 Core이고 무엇이 Advanced인지 명확하지 않음
  - `useAccordion`은 Core인데 `useTabs`는 Advanced?
  - `useDropdown`은 Core인데 `useModal`은 Advanced?

### 2. 일관성 없는 구조

- 대부분의 hooks는 루트에 평탄하게 위치
- 일부만 `utils/` 폴더에 분리
- `logic/` 폴더는 CommandManager 하나만 포함

### 3. 범주화 부재

- 17개의 hooks가 루트에 나열되어 있어 **목적별 탐색이 어려움**
- 새로운 hook을 추가할 때 **어디에 넣어야 할지 모호함**

### 4. Barrel Export 문제

- 모든 hooks를 `index.ts`에서 re-export하는 것은 번들 크기 증가 우려
- 사용자가 하나의 hook만 필요해도 모든 hooks를 import

---

## 범주화 제안

### 제안 1: 목적 기반 범주화 (Recommended)

**철학**: "이 hook은 **무엇을 위한 것인가**?"

```
src/design-system/hooks/
├── components/          # UI Component Headless Hooks (7개)
│   ├── useAccordion.ts      # 아코디언 컴포넌트
│   ├── useDropdown.ts       # 드롭다운/셀렉트
│   ├── useModal.ts          # 모달/다이얼로그
│   ├── useTabs.ts           # 탭 네비게이션
│   └── useTooltip.ts        # 툴팁/팝오버
│
├── data/                # Data Manipulation Hooks (3개)
│   ├── useHeadlessTable.ts  # 테이블 (sorting, filtering)
│   ├── useGridSelection.ts  # 그리드 선택 (Excel-like)
│   └── useVirtualScroll.ts  # 가상 스크롤 (성능 최적화)
│
├── interaction/         # Keyboard & Command Hooks (4개)
│   ├── useHotKeys.ts        # 단축키 (Cmd+K, Cmd+S 등)
│   ├── useKeyboardCommand.ts # 키보드 명령
│   ├── useCommandSystem.ts  # 명령 팔레트 시스템
│   └── useNavigation.ts     # 키보드 네비게이션
│
├── state/               # State Management Hooks (2개)
│   ├── useHistory.ts        # Undo/Redo 히스토리
│   └── useSelection.ts      # 다중 선택 상태 관리
│
├── search/              # Search & Clipboard Hooks (2개)
│   ├── useClipboard.ts      # 클립보드 복사/붙여넣기
│   └── useFuzzySearch.ts    # 퍼지 검색 (Fuse.js 스타일)
│
├── primitives/          # Low-level Primitive Hooks (5개)
│   ├── useClickOutside.ts   # 외부 클릭 감지
│   ├── useControlledState.ts # Controlled/Uncontrolled 패턴
│   ├── useFocusTrap.ts      # Focus trap (모달용)
│   ├── useId.ts             # 고유 ID 생성 (React 18 wrapper)
│   └── useScrollLock.ts     # Body scroll 잠금
│
├── lib/                 # Pure Functions & Utilities (2개)
│   ├── CommandManager.ts    # 명령 관리 클래스
│   └── keyUtils.ts          # 키보드 유틸리티 함수
│
├── index.ts             # Barrel export (all hooks)
└── README.md            # Documentation
```

---

### 제안 2: 계층 기반 범주화 (Alternative)

**철학**: "이 hook은 **얼마나 추상화되었는가**?"

```
src/design-system/hooks/
├── high-level/          # Complete UI Hooks
│   ├── useAccordion.ts
│   ├── useDropdown.ts
│   ├── useModal.ts
│   ├── useTabs.ts
│   ├── useTooltip.ts
│   ├── useHeadlessTable.ts
│   └── useCommandSystem.ts
│
├── mid-level/           # Composition Hooks
│   ├── useHotKeys.ts
│   ├── useKeyboardCommand.ts
│   ├── useNavigation.ts
│   ├── useGridSelection.ts
│   ├── useVirtualScroll.ts
│   ├── useHistory.ts
│   ├── useSelection.ts
│   ├── useClipboard.ts
│   └── useFuzzySearch.ts
│
├── low-level/           # Primitive Hooks
│   ├── useClickOutside.ts
│   ├── useControlledState.ts
│   ├── useFocusTrap.ts
│   ├── useId.ts
│   └── useScrollLock.ts
│
└── lib/                 # Pure Utilities
    ├── CommandManager.ts
    └── keyUtils.ts
```

**문제점**: "high-level" vs "mid-level" 구분이 주관적

---

### 제안 3: 도메인 기반 범주화 (Simplest)

**철학**: "이 hook은 **어떤 기능 영역**에 속하는가?"

```
src/design-system/hooks/
├── ui/                  # All UI-related hooks
│   ├── useAccordion.ts
│   ├── useDropdown.ts
│   ├── useModal.ts
│   ├── useTabs.ts
│   └── useTooltip.ts
│
├── table/              # Table-specific hooks
│   ├── useHeadlessTable.ts
│   ├── useGridSelection.ts
│   └── useVirtualScroll.ts
│
├── keyboard/           # Keyboard-related hooks
│   ├── useHotKeys.ts
│   ├── useKeyboardCommand.ts
│   └── useNavigation.ts
│
├── utils/              # General utilities
│   ├── useClipboard.ts
│   ├── useFuzzySearch.ts
│   ├── useHistory.ts
│   ├── useSelection.ts
│   ├── useClickOutside.ts
│   ├── useControlledState.ts
│   ├── useFocusTrap.ts
│   ├── useId.ts
│   └── useScrollLock.ts
│
└── lib/                # Pure functions
    ├── CommandManager.ts
    └── keyUtils.ts
```

---

## 권장 구조: 제안 1 (목적 기반)

### 선정 이유

1. ✅ **명확한 분류 기준**: "이 hook의 목적이 무엇인가?"
2. ✅ **탐색성**: 개발자가 원하는 hook을 쉽게 찾을 수 있음
3. ✅ **확장성**: 새로운 hook 추가 시 어디에 넣을지 명확함
4. ✅ **문서화**: 각 카테고리별 README 작성 가능
5. ✅ **일관성**: 업계 표준 (React Aria, Chakra UI)과 유사

---

## 카테고리별 설명

### 1. `components/` - UI Component Headless Hooks

**목적**: WAI-ARIA 패턴을 따르는 완전한 UI 컴포넌트 로직

**특징**:
- Prop Getter 패턴 (Downshift 스타일)
- ARIA 속성 자동 생성
- 키보드 네비게이션 완벽 지원
- Controlled/Uncontrolled 모드

**Hooks**:
- `useAccordion` - WAI-ARIA Accordion
- `useDropdown` - WAI-ARIA Listbox/Combobox
- `useModal` - WAI-ARIA Dialog
- `useTabs` - WAI-ARIA Tabs
- `useTooltip` - WAI-ARIA Tooltip

**참고**: React Aria, Headless UI, Radix UI

---

### 2. `data/` - Data Manipulation Hooks

**목적**: 대량의 데이터를 다루는 hook

**특징**:
- 성능 최적화 (가상화, 메모이제이션)
- Excel/Google Sheets 스타일 UX
- 정렬, 필터링, 페이지네이션

**Hooks**:
- `useHeadlessTable` - 테이블 로직 (Tanstack Table 스타일)
- `useGridSelection` - 셀 선택 (범위 선택, 복사/붙여넣기)
- `useVirtualScroll` - 가상 스크롤 (react-window 스타일)

**참고**: Tanstack Table, react-window

---

### 3. `interaction/` - Keyboard & Command Hooks

**목적**: 키보드 중심 인터랙션

**특징**:
- 단축키 시스템
- Command Palette (Cmd+K)
- 키보드 네비게이션 (Arrow keys)

**Hooks**:
- `useHotKeys` - 글로벌 단축키 (Cmd+K, Cmd+S)
- `useKeyboardCommand` - 키보드 명령 처리
- `useCommandSystem` - Command Palette 시스템
- `useNavigation` - Arrow key 네비게이션

**참고**: kbar, cmdk, react-hotkeys-hook

---

### 4. `state/` - State Management Hooks

**목적**: 복잡한 상태 관리 로직

**특징**:
- Undo/Redo 시스템
- 다중 선택 상태

**Hooks**:
- `useHistory` - Undo/Redo (Command Pattern)
- `useSelection` - 다중 선택 (Shift+Click, Cmd+Click)

**참고**: use-undo, @reduxjs/toolkit

---

### 5. `search/` - Search & Clipboard Hooks

**목적**: 검색 및 클립보드 관련 기능

**Hooks**:
- `useClipboard` - Clipboard API wrapper
- `useFuzzySearch` - 퍼지 검색 (Fuse.js 스타일)

**참고**: Fuse.js, Clipboard API

---

### 6. `primitives/` - Low-level Primitive Hooks

**목적**: 다른 hooks의 빌딩 블록

**특징**:
- 재사용 가능한 저수준 로직
- DOM 이벤트 처리
- React lifecycle 관리

**Hooks**:
- `useClickOutside` - 외부 클릭 감지
- `useControlledState` - Controlled/Uncontrolled 패턴
- `useFocusTrap` - Focus trap (Tab 순환)
- `useId` - 고유 ID 생성 (React 18 useId wrapper)
- `useScrollLock` - Body scroll 잠금

**참고**: React Aria utilities, @react-aria/utils

---

### 7. `lib/` - Pure Functions & Utilities

**목적**: Hook이 아닌 순수 함수와 클래스

**특징**:
- React에 의존하지 않음
- 테스트 용이
- 여러 곳에서 재사용

**Files**:
- `CommandManager.ts` - 명령 관리 클래스
- `keyUtils.ts` - 키보드 유틸리티 함수 (parseKeyCombo, matchKey 등)

---

## 마이그레이션 계획

### Phase 1: 폴더 구조 생성

```bash
cd src/design-system/hooks

# Create new directories
mkdir -p components
mkdir -p data
mkdir -p interaction
mkdir -p state
mkdir -p search
mkdir -p primitives
mkdir -p lib
```

### Phase 2: 파일 이동

```bash
# Components
mv useAccordion.ts components/
mv useDropdown.ts components/
mv useModal.ts components/
mv useTabs.ts components/
mv useTooltip.ts components/

# Data
mv useHeadlessTable.ts data/
mv useGridSelection.ts data/
mv useVirtualScroll.ts data/

# Interaction
mv useHotKeys.ts interaction/
mv useKeyboardCommand.ts interaction/
mv useCommandSystem.ts interaction/
mv useNavigation.ts interaction/

# State
mv useHistory.ts state/
mv useSelection.ts state/

# Search
mv useClipboard.ts search/
mv useFuzzySearch.ts search/

# Primitives (from utils/)
mv utils/useClickOutside.ts primitives/
mv utils/useControlledState.ts primitives/
mv utils/useFocusTrap.ts primitives/
mv utils/useId.ts primitives/
mv utils/useScrollLock.ts primitives/

# Lib
mv logic/CommandManager.ts lib/
mv utils/keyUtils.ts lib/

# Remove old folders
rmdir logic utils
```

### Phase 3: index.ts 업데이트

```typescript
/**
 * Headless UI Hooks
 *
 * Industry-standard headless hooks for building accessible components
 * References: Downshift, React Aria, Headless UI
 */

// ============================================
// Components - UI Component Headless Hooks
// ============================================
export { useAccordion } from "./components/useAccordion";
export type { UseAccordionOptions, UseAccordionReturn } from "./components/useAccordion";

export { useDropdown } from "./components/useDropdown";
export type { UseDropdownOptions, UseDropdownReturn } from "./components/useDropdown";

export { useModal } from "./components/useModal";
export type { UseModalOptions, UseModalReturn } from "./components/useModal";

export { useTabs } from "./components/useTabs";
export type { UseTabsOptions, UseTabsReturn } from "./components/useTabs";

export { useTooltip } from "./components/useTooltip";
export type { UseTooltipOptions, UseTooltipReturn } from "./components/useTooltip";

// ============================================
// Data - Data Manipulation Hooks
// ============================================
export { useHeadlessTable } from "./data/useHeadlessTable";
export type { HeadlessTableReturn, TableOptions } from "./data/useHeadlessTable";

export { useGridSelection } from "./data/useGridSelection";
export type { UseGridSelectionReturn } from "./data/useGridSelection";

export { useVirtualScroll } from "./data/useVirtualScroll";
export type { UseVirtualScrollOptions, UseVirtualScrollReturn } from "./data/useVirtualScroll";

// ============================================
// Interaction - Keyboard & Command Hooks
// ============================================
export { useHotKeys } from "./interaction/useHotKeys";
export type { HotKeyMap, UseHotKeysOptions } from "./interaction/useHotKeys";

export { useKeyboardCommand } from "./interaction/useKeyboardCommand";
export { useCommandSystem } from "./interaction/useCommandSystem";
export { useNavigation } from "./interaction/useNavigation";

// ============================================
// State - State Management Hooks
// ============================================
export { useHistory } from "./state/useHistory";
export type { UseHistoryReturn } from "./state/useHistory";

export { useSelection } from "./state/useSelection";
export type { UseSelectionReturn } from "./state/useSelection";

// ============================================
// Search - Search & Clipboard Hooks
// ============================================
export { useClipboard } from "./search/useClipboard";
export type { UseClipboardReturn } from "./search/useClipboard";

export { useFuzzySearch } from "./search/useFuzzySearch";
export type { UseFuzzySearchOptions } from "./search/useFuzzySearch";

// ============================================
// Primitives - Low-level Primitive Hooks
// ============================================
export { useClickOutside } from "./primitives/useClickOutside";
export { useControlledState } from "./primitives/useControlledState";
export { useFocusTrap } from "./primitives/useFocusTrap";
export type { UseFocusTrapOptions } from "./primitives/useFocusTrap";
export { useId } from "./primitives/useId";
export { useScrollLock } from "./primitives/useScrollLock";

// ============================================
// Lib - Pure Functions & Utilities
// ============================================
export { CommandManager } from "./lib/CommandManager";
export { parseKeyCombo, matchKey, formatKeyCombo } from "./lib/keyUtils";
```

### Phase 4: Import 경로 수정

**Before**:
```typescript
import { useAccordion } from "@/design-system/hooks";
```

**After** (여전히 동일하게 사용 가능):
```typescript
import { useAccordion } from "@/design-system/hooks";
```

**또는 직접 import** (번들 크기 최적화):
```typescript
import { useAccordion } from "@/design-system/hooks/components/useAccordion";
```

---

## 각 카테고리별 README.md 작성

### `components/README.md`

```markdown
# UI Component Headless Hooks

WAI-ARIA 패턴을 따르는 완전한 UI 컴포넌트 로직을 제공하는 hooks입니다.

## Hooks

- `useAccordion` - WAI-ARIA Accordion Pattern
- `useDropdown` - WAI-ARIA Listbox/Combobox Pattern
- `useModal` - WAI-ARIA Dialog Pattern
- `useTabs` - WAI-ARIA Tabs Pattern
- `useTooltip` - WAI-ARIA Tooltip Pattern

## 공통 특징

- ✅ Prop Getter 패턴 (Downshift 스타일)
- ✅ ARIA 속성 자동 생성
- ✅ 키보드 네비게이션 완벽 지원
- ✅ Controlled/Uncontrolled 모드

## 참고

- React Aria (Adobe)
- Headless UI (Tailwind Labs)
- Radix UI
```

### `data/README.md`

```markdown
# Data Manipulation Hooks

대량의 데이터를 효율적으로 다루기 위한 hooks입니다.

## Hooks

- `useHeadlessTable` - 테이블 로직 (정렬, 필터링, 페이지네이션)
- `useGridSelection` - 셀 선택 (Excel 스타일 범위 선택)
- `useVirtualScroll` - 가상 스크롤 (성능 최적화)

## 참고

- Tanstack Table
- react-window
- react-virtualized
```

(나머지 카테고리도 동일한 패턴으로 작성)

---

## 비교: 다른 라이브러리의 hooks 구조

### React Aria (Adobe)

```
@react-aria/
├── accordion/
├── button/
├── checkbox/
├── combobox/
├── dialog/
├── focus/
├── i18n/
├── interactions/
├── menu/
├── overlays/
├── selection/
├── table/
├── tabs/
├── tooltip/
└── utils/
```

**특징**: 컴포넌트별 패키지 분리 (monorepo)

---

### Chakra UI Hooks

```
@chakra-ui/hooks/
├── use-boolean
├── use-checkbox
├── use-clipboard
├── use-controllable
├── use-disclosure
├── use-focus-effect
├── use-merge-refs
├── use-outside-click
├── use-pan-gesture
└── use-shortcut
```

**특징**: 평탄한 구조, 패키지명으로 분리

---

### Radix UI

```
@radix-ui/react-*
├── react-accordion
├── react-alert-dialog
├── react-checkbox
├── react-dialog
├── react-dropdown-menu
├── react-popover
├── react-select
├── react-tabs
└── react-tooltip
```

**특징**: 완전한 컴포넌트 + hooks 포함 (monorepo)

---

## 결론 및 권장 사항

### ✅ 권장: 제안 1 (목적 기반 범주화)

**이유**:
1. **명확성**: 각 hook의 목적이 폴더명으로 드러남
2. **탐색성**: 개발자가 원하는 기능을 쉽게 찾을 수 있음
3. **확장성**: 새로운 hook 추가 시 어디에 넣을지 자명함
4. **문서화**: 각 카테고리별 README로 체계적인 문서 제공
5. **일관성**: 업계 표준 (React Aria)과 유사한 구조

### 예상 효과

**개선 전**:
```typescript
// 17개의 hooks가 평탄하게 나열
hooks/
├── useAccordion.ts
├── useClipboard.ts
├── useCommandSystem.ts
├── ... (14개 더)
```
→ 😵 "원하는 hook을 찾기 어려움"

**개선 후**:
```typescript
// 7개의 명확한 카테고리
hooks/
├── components/    (5개 hooks)
├── data/          (3개 hooks)
├── interaction/   (4개 hooks)
├── state/         (2개 hooks)
├── search/        (2개 hooks)
├── primitives/    (5개 hooks)
└── lib/           (2개 files)
```
→ 😊 "목적별로 쉽게 탐색 가능"

---

## 다음 단계

### 즉시 실행
1. ✅ 이 제안서 검토 및 승인
2. 📁 폴더 구조 생성
3. 📦 파일 이동 (git mv로 히스토리 보존)
4. 📝 index.ts 업데이트
5. 🔍 Import 경로 수정 (자동 검색 후 수정)

### 중기 실행
6. 📖 각 카테고리별 README.md 작성
7. 📚 전체 hooks 문서 업데이트
8. ✅ 타입 체크 및 빌드 검증

### 장기 실행
9. 🎯 각 카테고리별 추가 hooks 개발
10. 🧪 각 hook별 테스트 코드 작성
11. 📊 Storybook 예시 추가

---

## 참고 자료

### 업계 표준 Hook 라이브러리
- [React Aria (Adobe)](https://react-spectrum.adobe.com/react-aria/)
- [Headless UI (Tailwind Labs)](https://headlessui.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Chakra UI Hooks](https://chakra-ui.com/docs/hooks/use-boolean)
- [Downshift](https://www.downshift-js.com/)

### MDK 내부 문서
- `src/design-system/hooks/README.md` - 현재 hooks 문서
- `src/design-system/hooks/index.ts` - 현재 export 구조

---

## 부록: 전체 Hook 목록

| Hook | 현재 위치 | 제안 위치 | 목적 |
|------|-----------|-----------|------|
| `useAccordion` | `/` | `components/` | 아코디언 UI |
| `useDropdown` | `/` | `components/` | 드롭다운 UI |
| `useModal` | `/` | `components/` | 모달 UI |
| `useTabs` | `/` | `components/` | 탭 UI |
| `useTooltip` | `/` | `components/` | 툴팁 UI |
| `useHeadlessTable` | `/` | `data/` | 테이블 데이터 |
| `useGridSelection` | `/` | `data/` | 그리드 선택 |
| `useVirtualScroll` | `/` | `data/` | 가상 스크롤 |
| `useHotKeys` | `/` | `interaction/` | 단축키 |
| `useKeyboardCommand` | `/` | `interaction/` | 키보드 명령 |
| `useCommandSystem` | `/` | `interaction/` | 명령 시스템 |
| `useNavigation` | `/` | `interaction/` | 네비게이션 |
| `useHistory` | `/` | `state/` | Undo/Redo |
| `useSelection` | `/` | `state/` | 선택 상태 |
| `useClipboard` | `/` | `search/` | 클립보드 |
| `useFuzzySearch` | `/` | `search/` | 퍼지 검색 |
| `useClickOutside` | `utils/` | `primitives/` | 외부 클릭 |
| `useControlledState` | `utils/` | `primitives/` | Controlled 패턴 |
| `useFocusTrap` | `utils/` | `primitives/` | Focus trap |
| `useId` | `utils/` | `primitives/` | ID 생성 |
| `useScrollLock` | `utils/` | `primitives/` | Scroll lock |
| `CommandManager` | `logic/` | `lib/` | 명령 관리 |
| `keyUtils` | `utils/` | `lib/` | 키보드 유틸 |

**총 23개**: Hooks 21개 + Files 2개
