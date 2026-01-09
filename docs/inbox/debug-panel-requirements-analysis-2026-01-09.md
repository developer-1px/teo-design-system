# Debug Panel 요구사항 분석 및 현재 구현 내용

**작성일**: 2026-01-09
**목적**: Debug Panel의 현재 구현을 분석하고 중복/불필요한 코드를 식별

---

## 📊 현재 구현 개요

### 코드 통계
- **총 라인 수**: 1,424줄 (TypeScript)
- **빌드 결과**: 994줄, 28.85 kB (gzip: 6.79 kB)
- **모듈 개수**: 8개 (types, state, styles, react-utils, overlay, panel, keyboard, index)

### 파일별 크기
```
styles.ts       11 KB (294 lines)  - 가장 큼
overlay.ts      8.1 KB (284 lines)
panel.ts        4.8 KB (173 lines)
react-utils.ts  4.1 KB (158 lines)
keyboard.ts     3.1 KB (125 lines)
index.ts        1.9 KB (83 lines)
state.ts        1.2 KB (73 lines)
types.ts        1.2 KB (69 lines)
```

---

## 🎯 핵심 기능 (Core Features)

### 1. **디버그 모드 토글** (Keyboard Manager)

**키 바인딩**:
- `Cmd+D` / `Ctrl+D`: 디버그 모드 순환 (0 → 1 → 2 → 0)
- `ESC`: 패널 닫기

**디버그 모드 레벨**:
```typescript
0: OFF         // 디버그 모드 꺼짐
1: IDDL        // 모든 IDDL 컴포넌트 표시 (8가지 타입)
2: BTN         // 버튼만 표시
```

**구현 위치**: `keyboard.ts`
- ✅ **필수**: 토글 로직
- ⚠️ **검토 필요**: 키보드 입력 차단 (setupKeyboardBlocking)

### 2. **오버레이 시각화** (Overlay Manager)

**기능**:
- 인터랙티브 요소 / IDDL 컴포넌트 외곽선 표시
- Hover 상태 강조
- 클릭 시 패널 표시
- Pulse 애니메이션

**컴포넌트 선택 로직**:
```typescript
// Level 1: IDDL 컴포넌트
[data-component-type="Page"]
[data-component-type="Section"]
[data-component-type="Group"]
[data-component-type="Action"]
[data-component-type="Item"]
[data-component-type="Field"]
[data-component-type="Text"]
[data-component-type="Overlay"]

// Level 2: 버튼만
button, [role="button"]

// Level 0 (미사용): 모든 인터랙티브 요소
button, a, input, textarea, select, ...
```

**구현 위치**: `overlay.ts`
- ✅ **필수**: 요소 찾기, 박스 생성, 위치 업데이트
- ⚠️ **중복 가능성**: Level 0 선택자 (현재 사용 안 됨)

### 3. **컴포넌트 정보 패널** (Panel Manager)

**표시 정보**:
- Component Hierarchy (컴포넌트 계층 구조)
- Component Name (`<ComponentName />`)
- File Path (`src/apps/IDE/pages/ide/IDEPage.tsx:93:5`)
- Props (JSON 형식, 토글 가능)

**위치 계산**:
- 화면 상단/하단 기준으로 자동 배치
- 화면 좌우 기준으로 자동 배치
- z-index 자동 조정

**구현 위치**: `panel.ts`
- ✅ **필수**: 패널 생성, 위치 계산, Props 표시
- ✅ **효율적**: 코드 간결하고 명확

### 4. **React Fiber 탐색** (React Utils)

**기능**:
- HTML 요소 → React Fiber 인스턴스 찾기
- Fiber 트리 순회하여 컴포넌트 계층 구조 추출
- Props 추출 및 정제

**지원 방식**:
1. `__REACT_DEVTOOLS_GLOBAL_HOOK__` (React DevTools)
2. `_reactRootContainer` (React 17 이하)
3. `__reactFiber$...` (Fiber 직접 접근)

**구현 위치**: `react-utils.ts`
- ✅ **필수**: React 정보 추출 핵심 로직
- ✅ **효율적**: 여러 React 버전 지원

### 5. **스타일 시스템** (Styles)

**CSS 크기**: 11 KB (294 lines)

**스타일 범주**:
1. **레거시 호환** (7 lines)
   - `[data-debug-target]` 스타일
2. **오버레이 레이어** (12 lines)
   - `#debug-overlay-layer` 기본 스타일
3. **인터랙티브 박스** (58 lines)
   - `.debug-interactive-box` 기본/hover/pulse
4. **Debug Mode 2 (버튼)** (29 lines)
   - `body[data-debug-mode="2"]` 스타일 오버라이드
5. **IDDL 컴포넌트 타입** (132 lines) ⚠️ 가장 큼
   - 8가지 컴포넌트 × 기본/hover/label = 24개 스타일 블록
6. **박스 라벨** (20 lines)
7. **패널 스타일** (36 lines)

**구현 위치**: `styles.ts`
- ⚠️ **검토 필요**: IDDL 타입별 스타일 중복 패턴
- ⚠️ **과도한 크기**: 전체 코드의 20% 차지

---

## 🔍 중복 및 불필요 코드 분석

### 1. **IDDL 컴포넌트 타입별 스타일 중복** ⚠️ 높은 우선순위

**현재 상태** (132 lines):
```css
/* Page - Purple */
.debug-iddl-page {
  border: 2px solid rgba(139, 92, 246, 0.4) !important;
  background: rgba(139, 92, 246, 0.05) !important;
}
.debug-iddl-page.hover { ... }
.debug-iddl-page .debug-box-label { ... }

/* Section - Blue */
.debug-iddl-section {
  border: 2px solid rgba(59, 130, 246, 0.4) !important;
  background: rgba(59, 130, 246, 0.05) !important;
}
.debug-iddl-section.hover { ... }
.debug-iddl-section .debug-box-label { ... }

/* ... 6개 더 반복 (Group, Action, Item, Field, Text, Overlay) */
```

**문제점**:
- 8개 컴포넌트 × 3개 블록 = 24개 스타일 블록
- 패턴이 동일하고 색상만 다름
- 유지보수 어려움 (새 컴포넌트 추가 시 3개 블록 추가)

**개선안 1**: CSS Variables 사용
```css
/* Base IDDL component style */
.debug-iddl {
  border: 2px solid var(--debug-color-border) !important;
  background: var(--debug-color-bg) !important;
}

.debug-iddl.hover {
  border-color: var(--debug-color-border-hover) !important;
  background: var(--debug-color-bg-hover) !important;
}

.debug-iddl .debug-box-label {
  background: var(--debug-color-label) !important;
}

/* Color definitions */
.debug-iddl-page {
  --debug-color-border: rgba(139, 92, 246, 0.4);
  --debug-color-bg: rgba(139, 92, 246, 0.05);
  --debug-color-border-hover: rgba(139, 92, 246, 0.8);
  --debug-color-bg-hover: rgba(139, 92, 246, 0.12);
  --debug-color-label: rgba(139, 92, 246, 0.95);
}

.debug-iddl-section { ... } /* 색상만 정의 */
```

**절감 효과**: 132 lines → ~60 lines (55% 감소)

**개선안 2**: JavaScript 동적 스타일
```typescript
// 컴포넌트 타입 → 색상 매핑
const IDDL_COLORS: Record<string, string> = {
  Page: '139, 92, 246',     // Purple
  Section: '59, 130, 246',  // Blue
  Group: '6, 182, 212',     // Cyan
  Action: '249, 115, 22',   // Orange
  Item: '34, 197, 94',      // Green
  Field: '245, 158, 11',    // Amber
  Text: '236, 72, 153',     // Pink
  Overlay: '239, 68, 68',   // Red
};

// 박스 생성 시 인라인 스타일 적용
box.style.borderColor = `rgba(${color}, 0.4)`;
box.style.background = `rgba(${color}, 0.05)`;
```

**절감 효과**: 132 lines CSS 제거, ~20 lines TypeScript 추가

### 2. **Level 0 (미사용) 선택자** ⚠️ 중간 우선순위

**현재 상태** (`overlay.ts:91-105`):
```typescript
// Default: Interactive elements (현재 사용 안 됨)
else {
  selectors = [
    'button',
    'a',
    'input',
    'textarea',
    'select',
    '[role="button"]',
    '[role="link"]',
    '[role="tab"]',
    '[role="menuitem"]',
    '[onclick]',
    '[tabindex]:not([tabindex="-1"])',
    '[data-interactive="true"]',
  ];
}
```

**문제점**:
- 현재 디버그 모드는 1 (IDDL), 2 (Button)만 사용
- Level 0으로는 절대 진입하지 않음 (else 브랜치 Dead Code)

**개선안**:
```typescript
// Level 1: IDDL components
if (debugMode === 1) {
  selectors = [...IDDL selectors...];
}
// Level 2: Buttons only
else {
  selectors = ['button', '[role="button"]'];
}
```

**절감 효과**: ~10 lines 제거

### 3. **레거시 스타일 호환성** ⚠️ 낮은 우선순위

**현재 상태** (`styles.ts:6-11`):
```css
/* 레거시 스타일 (호환성 유지) */
[data-debug-target] {
  outline: 1px solid rgb(16, 185, 129) !important;
  outline-offset: 1px !important;
  cursor: pointer !important;
}
```

**문제점**:
- `data-debug-target` 속성은 현재 코드에서 사용되지 않음
- `clearTarget()` 메서드에서 제거만 함 (`overlay.ts:268`)

**개선안**: 삭제 가능 (사용처 없음)

**절감 효과**: ~7 lines 제거

### 4. **키보드 입력 차단 로직** ⚠️ 검토 필요

**현재 상태** (`keyboard.ts:45-84`):
```typescript
private setupKeyboardBlocking(): void {
  const blockingEvents = ['keydown', 'keypress', 'keyup', 'input'];

  blockingEvents.forEach(eventType => {
    window.addEventListener(eventType, (event) => {
      // 디버그 모드일 때 모든 키보드 입력 차단
      if (getDebugMode() === 0) return;

      // 패널 내부는 허용
      if (target.closest('#debug-panel')) return;

      // Cmd+D, ESC는 허용
      // ...

      // 나머지 차단
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
    }, true);
  });
}
```

**의문점**:
- 디버그 모드에서 왜 모든 키보드 입력을 차단하는가?
- 사용자가 앱을 테스트하는 데 방해가 될 수 있음
- 특히 Level 1 (IDDL) 모드에서는 입력이 필요할 수 있음

**개선안 1**: 제거
- 디버그 모드에서도 앱 정상 동작 허용
- Cmd+D, ESC만 처리

**개선안 2**: 옵션화
- `setupKeyboardBlocking(shouldBlock: boolean)` 파라미터 추가
- 필요시에만 활성화

**절감 효과**: ~40 lines 제거 가능

### 5. **PropValue 타입** ⚠️ 낮은 우선순위

**현재 상태** (`types.ts:51`):
```typescript
export type PropValue = unknown;
```

**문제점**:
- `unknown` 타입은 사실상 타입 체크 없음
- 실제 사용처에서 타입 가드 없음

**개선안**: 사용하지 않으면 제거
```typescript
// react-utils.ts에서
export function getPropsForFiber(fiber: Fiber): Record<string, unknown> {
  // PropValue 대신 unknown 직접 사용
}
```

**절감 효과**: 타입 정의 1줄 제거

---

## 📋 기능별 우선순위

### ✅ 필수 유지 (Core)

| 기능 | 파일 | 이유 |
|------|------|------|
| 디버그 모드 토글 | `keyboard.ts` | 핵심 기능 |
| IDDL 컴포넌트 탐색 | `overlay.ts` | 핵심 기능 |
| 컴포넌트 정보 패널 | `panel.ts` | 핵심 기능 |
| React Fiber 추출 | `react-utils.ts` | 핵심 기능 |
| 전역 상태 관리 | `state.ts` | 필수 인프라 |
| 타입 정의 | `types.ts` | 필수 인프라 |

### ⚠️ 리팩토링 필요 (Refactor)

| 기능 | 파일 | 문제점 | 절감 예상 |
|------|------|--------|-----------|
| IDDL 타입별 스타일 | `styles.ts` | 중복 패턴 | 70 lines |
| Level 0 선택자 | `overlay.ts` | Dead code | 10 lines |
| 레거시 스타일 | `styles.ts` | 사용 안 됨 | 7 lines |

### 🤔 검토 필요 (Review)

| 기능 | 파일 | 이유 | 의견 |
|------|------|------|------|
| 키보드 입력 차단 | `keyboard.ts` | UX 방해 가능성 | 제거 또는 옵션화 (40 lines) |
| PropValue 타입 | `types.ts` | 미사용 또는 불필요 | 제거 가능 (1 line) |
| Pulse 애니메이션 | `overlay.ts` | 필요성 검토 | 유지 또는 간소화 |

---

## 🎯 최적화 제안

### Phase 1: 스타일 리팩토링 (높은 효과)

**작업**:
1. IDDL 컴포넌트 스타일을 CSS Variables로 통합
2. 레거시 스타일 제거
3. Level 0 선택자 제거

**예상 효과**:
- 87 lines 제거 (styles.ts: 294 → 207 lines, -30%)
- 10 lines 제거 (overlay.ts: 284 → 274 lines, -3.5%)
- **총 97 lines 제거 (전체: 1,424 → 1,327 lines, -7%)**

### Phase 2: 기능 검토 (UX 개선)

**작업**:
1. 키보드 입력 차단 제거
2. PropValue 타입 정리
3. 불필요한 주석 제거

**예상 효과**:
- 40 lines 제거 (keyboard.ts: 125 → 85 lines, -32%)
- 더 나은 UX (디버그 모드에서도 앱 테스트 가능)

### Phase 3: 추가 개선 (선택사항)

**작업**:
1. Pulse 애니메이션 간소화 또는 제거
2. Panel 위치 계산 로직 최적화
3. MutationObserver 디바운싱 조정

**예상 효과**:
- 성능 향상
- 코드 가독성 향상

---

## 📊 최종 목표

### 현재 상태
```
Total: 1,424 lines (TypeScript source)
Build: 994 lines, 28.85 kB (gzip: 6.79 kB)
```

### 최적화 후 예상
```
Total: ~1,287 lines (-137 lines, -9.6%)
Build: ~900 lines, ~26 kB (gzip: ~6.3 kB)
```

### 유지할 핵심 기능
✅ Cmd+D 토글
✅ IDDL 컴포넌트 시각화 (8가지 타입, 색상 구분)
✅ 컴포넌트 계층 구조 패널
✅ Props 표시 (토글 가능)
✅ React Fiber 추출

### 제거/개선할 부분
❌ 레거시 호환 스타일
❌ Level 0 (미사용) 선택자
❌ 키보드 입력 차단 (옵션: 제거 또는 옵션화)
🔄 IDDL 스타일 중복 → CSS Variables 통합

---

## 🚀 실행 계획

### 우선순위 1: 스타일 리팩토링
1. `styles.ts`: IDDL 컴포넌트 스타일을 CSS Variables로 통합
2. `styles.ts`: 레거시 스타일 제거
3. `overlay.ts`: Level 0 선택자 제거

### 우선순위 2: 기능 검토
1. `keyboard.ts`: 키보드 입력 차단 제거 또는 옵션화 여부 결정
2. `types.ts`: PropValue 타입 제거

### 우선순위 3: 문서화
1. 각 모듈의 역할과 책임 명확화
2. 주요 함수에 JSDoc 주석 추가

---

**작성 완료일**: 2026-01-09
**다음 단계**: Phase 1 스타일 리팩토링 착수
