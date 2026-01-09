# Project Philosophy

이 문서는 **IDE UI Kit 프로젝트의 핵심 철학과 의의**를 설명합니다.

---

## 1. AI 시대의 디자인 시스템 패러다임 전환

### 기존 방식의 한계

```tsx
// ❌ 기존: AI도, 주니어 개발자도 어려워하는 방식
<div className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold
     hover:bg-blue-600 focus:ring-2 focus:ring-blue-400">
  Save
</div>
```

**문제점**:
- 스타일링 세부사항(색상, 간격, 둥근 모서리)에 집중
- 일관성 유지 어려움
- AI가 매번 다른 스타일 생성
- 접근성 누락 (ARIA, 키보드 네비게이션)

### 새로운 접근: Why-based Design

```tsx
// ✅ IDDL: 의도만 명시하면 시스템이 처리
<Action role="Button" prominence="Primary" intent="Save">
  Save
</Action>
```

**자동 적용**:
- ✅ Accent 색상 (prominence="Primary")
- ✅ 적절한 패딩 및 폰트 크기
- ✅ Hover/Focus 상태
- ✅ `role="button"` ARIA 속성
- ✅ 키보드 접근성

### 의의

> **AI가 "왜"를 이해하면 "어떻게"를 일관되게 생성할 수 있습니다.**

이것은 **Claude Code 같은 AI 코딩 도구의 핵심 요구사항**입니다. 명확한 규칙이 있으면:
- AI는 일관된 코드 생성
- 개발자는 의도만 명시
- 디자인 시스템은 자동으로 적용

---

## 2. 접근성(Accessibility)의 민주화

### 현실의 문제

- **WCAG 2.1 AA 준수**는 전문가 영역
- **ARIA 속성**은 복잡하고 실수하기 쉬움
- **키보드 네비게이션**은 대부분 누락
- **스크린 리더** 지원은 선택 사항

결과: 대부분의 웹 애플리케이션은 접근성이 부족합니다.

### 이 프로젝트의 해결책

```tsx
// role="Modal"이라고만 쓰면 자동으로:
// - aria-modal="true"
// - role="dialog"
// - focus trap (모달 내부로 포커스 가두기)
// - ESC 키 처리
// - 배경 스크롤 잠금
// - 이전 포커스 복원
<Overlay role="Modal">
  <ModalContent />
</Overlay>
```

**적용되는 패턴** (자동):
1. **Focus Management** (`docs/patterns/01-behavior-patterns.md`)
   - FocusTrap, RestoreFocus
2. **ARIA Patterns** (`docs/patterns/02-accessibility-patterns.md`)
   - Live Regions, LandmarkRegions
3. **Keyboard Accessibility**
   - ESC 키, Tab 순환, 키보드 단축키

### 의의

> **접근성이 "선택"이 아닌 "기본값"이 됩니다.**

- 개발자가 ARIA를 몰라도 자동 적용
- WCAG 2.1 AA 준수가 기본
- 모든 사용자가 동등하게 사용 가능

---

## 3. 규칙 기반 디자인의 힘

### 완성된 체계

#### 3.1 16개 토큰 시스템

**TokensApp에서 확인 가능** (`/tokens` 라우트)

| 카테고리 | 토큰 개수 | 예시 |
|---------|----------|------|
| **색상** | 6개 | accent, surface-base, text-primary, border-default... |
| **크기** | 4개 | sm, md, lg, xl |
| **굵기** | 2개 | 500 (medium), 600 (semibold) |
| **간격** | 4개 | 8px, 16px, 24px, 32px |

**설계 원칙**:
- **더 많으면**: 혼란 (선택 피로)
- **더 적으면**: 표현력 부족
- **16개가 최적**: 충분한 표현력 + 관리 가능

#### 3.2 7단계 Depth 시스템 (0-6)

| Depth | 용도 | 배경 | 그림자 | 예시 |
|-------|------|------|--------|------|
| 0 | App base | `#fafafa` | none | 앱 배경 |
| 1 | Sunken | `#f5f5f5` | inset | Input 필드 |
| 2 | Base surface | `#ffffff` | none | 사이드바 |
| 3 | Primary surface | `#ffffff` | subtle | 에디터 |
| 4 | Elevated | `#ffffff` | medium | 툴바 |
| 5 | Floating | `#ffffff` | strong | Popover |
| 6 | Overlay | `#ffffff` | strongest | Modal |

**핵심 규칙**:
- ✅ 배경색 차이로 계층 표현
- ✅ Depth 2-6은 **같은 배경색**
- ✅ 그림자만 다름 (물리적 elevation)
- ❌ **NEVER** reverse depth (dark inside light)

#### 3.3 8가지 Purpose

| Purpose | 설명 | 예시 |
|---------|------|------|
| `navigation` | 탐색, 이동 | 메뉴, 탭, 브레드크럼 |
| `action` | 실행, 트리거 | 버튼, 아이콘 버튼 |
| `form` | 입력, 데이터 수집 | Input, Select, Checkbox |
| `content` | 정보 표시 | 텍스트, 카드, 테이블 |
| `list` | 항목 나열 | 리스트, 그리드 |
| `media` | 미디어 콘텐츠 | 이미지, 비디오 |
| `status` | 상태 표시 | Badge, Toast, Alert |
| `info` | 추가 정보 | Tooltip, Helper Text |

#### 3.4 3단계 Prominence

| Prominence | 설명 | 시각적 처리 |
|-----------|------|------------|
| **Primary** | 주요 요소 | Accent 색상, 높은 대비 |
| **Secondary** | 보조 요소 | 중간 대비, Ghost 스타일 |
| **Tertiary** | 부가 요소 | 낮은 대비, Muted 색상 |

### 의의

> **예외를 문서화해야 하는 강력한 규칙은 일관성을 강제합니다.**

```tsx
// EXCEPTION: Using border here instead of layer difference
// Reason: User specifically requested visual separator
// Reference: DESIGN_PRINCIPLES.md Part 3.2
<div className="border-b border-border" />
```

- **AI는 규칙을 완벽히 따름**
- **사람은 예외 시 이유를 명시**
- **코드 리뷰가 명확해짐**

---

## 4. Component Role Mapping의 혁명

### 완성된 매핑

**`docs/component-role-mapping.md`** 참조

#### 분류 체계

| 카테고리 | 컴포넌트 수 | 예시 |
|---------|-----------|------|
| Layout | 10개 | Container, Grid, Stack, Divider |
| Navigation | 12개 | Menu, Tabs, Breadcrumb, Pagination |
| Data Display | 15개 | Table, List, Tree, Timeline, Card |
| Input | 14개 | Button, Input, Select, Checkbox, Slider |
| Feedback | 9개 | Alert, Toast, Progress, Spinner |
| Overlay | 8개 | Modal, Drawer, Popover, Tooltip |
| Typography | 7개 | Heading, Text, Code, Link |
| Utility | 6개 | Portal, FocusTrap, ClickOutside |
| Form | 5개 | Form, FormField, FormError, FormLabel |
| Specialized | 14개 | Calendar, Chart, Gantt, Kanban |

**총 100여 개 컴포넌트**

#### IDDL + ARIA 매핑

```tsx
// TreeView 예시
<Group role="Tree" prominence="Primary">
  {/* IDDL Role: Tree */}
  {/* ARIA Role: tree */}
  {/* Pattern: 01-behavior-patterns.md → ArrowNavigation */}

  <Action role="TreeItem" prominence="Secondary">
    {/* ARIA: role="treeitem" + aria-expanded */}
    Folder 1
  </Action>

  <Group role="Tree" prominence="Secondary">
    {/* Nested tree */}
    <Action role="TreeItem">File 1</Action>
  </Group>
</Group>
```

### 의의

> **이것은 디자인 시스템의 "사전(Dictionary)"입니다.**

이제 "TreeView를 만들어"라고 하면:

1. **IDDL**: `Group role="Tree"` + `Action role="TreeItem"` 사용
2. **ARIA**: `role="tree"` + `role="treeitem"` + `aria-expanded` 자동 적용
3. **Behavior**: `ArrowNavigation` 패턴 적용 (위/아래 키)
4. **Style**: Prominence에 따라 시각적 계층 자동 적용

**AI는 이 매핑을 참조하여 일관된 코드를 생성합니다.**

---

## 5. 8개 패턴 문서의 교육적 가치

### 완성된 패턴 라이브러리

| 패턴 문서 | 주요 내용 | 파일 |
|---------|---------|------|
| **Behavior** | FocusTrap, KeyboardShortcuts, ClickOutside, ScrollLock | `01-behavior-patterns.md` |
| **Accessibility** | LiveRegions, RovingTabIndex, VisuallyHidden, SkipLink | `02-accessibility-patterns.md` |
| **Data** | Virtualization, Pagination, Filtering, Sorting | `03-data-patterns.md` |
| **Composition** | Compound Components, Polymorphic, Slots, Render Props | `04-composition-patterns.md` |
| **State** | Controlled/Uncontrolled, State Machine, Error Boundaries | `05-state-patterns.md` |
| **Animation** | Presence, Gestures, Scroll Animations, prefers-reduced-motion | `06-animation-patterns.md` |
| **Layout** | Grid Systems, Stack, Responsive Patterns, Aspect Ratio | `07-layout-patterns.md` |
| **Performance** | Memoization, Code Splitting, Debouncing, Virtualization | `08-performance-patterns.md` |

### 각 문서의 구성

1. **개요** (왜 필요한가?)
2. **패턴 설명** (언제 사용하는가?)
3. **완전한 구현** (TypeScript + React)
4. **IDDL 통합 예제**
5. **ARIA & Accessibility**
6. **구현 우선순위** (High/Medium/Low)
7. **참고 자료** (라이브러리, 표준 문서)

### 의의

> **이것은 사실상 "React 베스트 프랙티스 백과사전"입니다.**

#### 신입 개발자에게
- **Q**: "FocusTrap을 어떻게 만들지?"
- **A**: `01-behavior-patterns.md` → useFocusTrap 구현 참조

#### 시니어 개발자에게
- 팀 표준 문서로 활용
- 코드 리뷰 기준 제시
- 온보딩 자료

#### AI 에이전트에게
- 패턴을 참조하여 일관된 코드 생성
- "Accordion 만들어" → `04-composition-patterns.md` 참조
- ARIA 속성 자동 적용

---

## 6. Why-First Philosophy의 실현

### 전통적 방식: How-based

```tsx
// 개발자: "파란색 배경, 둥근 모서리, 패딩 12px, 그림자..."
<button
  style={{
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    fontWeight: 600,
  }}
>
  Save
</button>
```

**문제점**:
- ❌ HOW (어떻게)에 집중
- ❌ 매번 같은 스타일 반복
- ❌ 일관성 깨짐 (다른 개발자는 다른 값 사용)
- ❌ 유지보수 어려움 (색상 변경 시 모든 곳 수정)

### IDDL 방식: Why-based

```tsx
// 개발자: "이건 주요 액션 버튼이야"
<Action role="Button" prominence="Primary" intent="Save">
  Save
</Action>

// 시스템: "알았어, prominence=Primary니까 accent 색상 적용할게"
```

**장점**:
- ✅ WHY (왜)에 집중
- ✅ 스타일은 시스템이 자동 적용
- ✅ 일관성 보장 (같은 prominence는 같은 스타일)
- ✅ 유지보수 쉬움 (토큰만 변경하면 전체 반영)

### 의의

> **인지 부하 감소**. 개발자는 비즈니스 로직에 집중하고, 스타일링은 시스템이 처리합니다.

**Before**:
```
개발자 시간 배분:
- 비즈니스 로직: 40%
- 스타일링: 40%
- 접근성: 20%
```

**After**:
```
개발자 시간 배분:
- 비즈니스 로직: 80%
- 의도 명시: 15%
- 접근성: 5% (자동)
```

---

## 7. 실제 프로젝트 구조의 완성도

### 현재 완성된 앱들

#### 7.1 TokensApp

**경로**: `/tokens`

**기능**:
- 3-tier 토큰 시스템 시각화
- Primitive → Semantic → Component 토큰 표시
- CSS 변수 코드 복사 기능
- Compact한 정보 밀도
- Sticky 목차 네비게이션

**의의**: **디자인 토큰의 살아있는 문서**

```tsx
// TokensApp에서 확인 가능
var(--color-accent)           // Primitive
var(--color-button-bg)        // Semantic
var(--color-button-primary)   // Component
```

#### 7.2 Showcase Apps

**경로**: `/showcase/*`

**앱 목록**:
- IDDL Atoms Showcase
- IDDL Molecules Showcase
- Layout Demos
- Prominence Demos

**기능**:
- 실제 사용 예제
- Before/After 비교
- 인터랙티브 데모

#### 7.3 IDE UI Kit (전체 프로젝트)

**구조**:
```
<Layout variant="grid" template="ide">
  <Layout.Island area="header">
    <TopToolbar />
  </Layout.Island>

  <Layout.Island area="sidebar">
    <FileTree />
  </Layout.Island>

  <Layout.Island area="editor">
    <CodeEditor />
  </Layout.Island>

  <Layout.Island area="panel">
    <RightSidebar />
  </Layout.Island>
</Layout>
```

**테마 시스템**:
- Light/Dark 모드
- 4가지 Accent 색상 (emerald, blue, purple, red)
- 3가지 Density (compact, normal, comfortable)

### 의의

> **이론뿐 아니라 실제 동작하는 시스템**입니다. 문서와 코드가 일치합니다.

---

## 8. 프로젝트의 핵심 의의 정리

### 1. AI 시대 대비

- ✅ Claude Code, Copilot 같은 AI가 이해하고 생성할 수 있는 명확한 규칙
- ✅ "의도 기반 프롬프팅"과 완벽히 일치
- ✅ 일관된 코드 생성 가능

**예시**:
```
프롬프트: "주요 저장 버튼 만들어"
AI 생성: <Action role="Button" prominence="Primary" intent="Save">
```

### 2. 접근성 표준화

- ✅ ARIA, 키보드, 스크린 리더 지원이 자동
- ✅ WCAG 2.1 AA 준수가 기본값
- ✅ 전문가 없이도 접근성 보장

### 3. 개발자 경험 혁신

- ✅ "왜"만 명시하면 "어떻게"는 자동
- ✅ 16개 토큰으로 무한한 표현력
- ✅ 8개 패턴으로 모든 UI 케이스 커버
- ✅ 100개 컴포넌트 매핑으로 명확한 가이드

### 4. 유지보수성

- ✅ 규칙 기반이라 예측 가능
- ✅ 예외는 반드시 문서화 (인라인 주석)
- ✅ 팀 전체가 같은 품질 유지
- ✅ 코드 리뷰가 명확해짐

### 5. 교육적 가치

- ✅ 신입 개발자의 학습 곡선 단축
- ✅ 베스트 프랙티스의 집대성
- ✅ 살아있는 문서 (코드와 문서 동기화)
- ✅ React 패턴 백과사전

---

## 9. 이 프로젝트가 해결하는 진짜 문제

### 문제 1: "AI가 일관성 없는 코드를 생성해요"

**현상**:
```tsx
// AI가 매번 다르게 생성
<button className="bg-blue-500 px-4 py-2">Save</button>
<button className="bg-indigo-600 px-6 py-3">Submit</button>
<button style={{ background: '#007bff', padding: '10px 20px' }}>Confirm</button>
```

**해결**:
```tsx
// 명확한 규칙 → 일관된 생성
<Action role="Button" prominence="Primary">Save</Action>
<Action role="Button" prominence="Primary">Submit</Action>
<Action role="Button" prominence="Primary">Confirm</Action>
```

### 문제 2: "접근성은 너무 어려워요"

**현상**:
- ARIA 속성 누락
- 키보드 네비게이션 안 됨
- 스크린 리더 지원 없음

**해결**:
```tsx
// role만 명시하면 자동
<Overlay role="Modal">  {/* 자동: aria-modal, focus trap, ESC 키 */}
  <Content />
</Overlay>
```

### 문제 3: "디자인 시스템이 너무 복잡해요"

**현상**:
- 토큰 수백 개
- 컴포넌트 variant 수십 개
- 문서 찾기 어려움

**해결**:
- 16개 토큰으로 단순화
- 3단계 prominence로 통일
- 8개 purpose로 분류

### 문제 4: "매번 같은 패턴을 다시 만들어요"

**현상**:
- FocusTrap을 매번 구현
- Debouncing을 매번 작성
- Virtualization을 매번 고민

**해결**:
- 8개 패턴 문서에 완전한 구현
- Copy & Paste로 즉시 사용
- TypeScript 타입까지 제공

### 문제 5: "팀원마다 스타일이 달라요"

**현상**:
```tsx
// A 개발자
<div className="mt-3 mb-4">

// B 개발자
<div className="mt-4 mb-3">

// C 개발자
<div style={{ marginTop: 12, marginBottom: 16 }}>
```

**해결**:
```tsx
// 규칙 기반 → 스타일 통일
<Group gap={3}>  {/* 항상 16px */}
```

---

## 10. 결론: 차세대 디자인 시스템의 참조 구현

### 이 프로젝트는...

> **"AI가 이해할 수 있고, 접근성이 보장되고, 개발자가 의도만 명시하면 되는, 차세대 디자인 시스템의 참조 구현(Reference Implementation)"**

### 단순한 UI 라이브러리가 아닌:

#### ✅ 패러다임
- **Why-first Design**: HOW → WHY로 사고 전환
- **Intent-Driven**: 의도만 명시하면 시스템이 처리
- **Rule-based**: 강력한 규칙 + 문서화된 예외

#### ✅ 표준
- **Component Role Mapping**: 100개 컴포넌트의 IDDL + ARIA 매핑
- **3-Tier Token System**: Primitive → Semantic → Component
- **8 Purpose × 3 Prominence**: 명확한 분류 체계

#### ✅ 교육
- **8개 패턴 백과사전**: React 베스트 프랙티스
- **완전한 구현**: TypeScript + React
- **살아있는 문서**: 코드와 문서 동기화

#### ✅ 도구
- **TokensApp**: 디자인 토큰 시각화
- **Showcase Apps**: 인터랙티브 데모
- **IDE UI Kit**: 실제 동작하는 애플리케이션

#### ✅ 철학
- **규칙 > 예외**: 예외는 문서화 필수
- **접근성 기본값**: WCAG 2.1 AA 자동 준수
- **AI 친화적**: 명확한 규칙으로 일관된 생성

---

## 왜 2025년 이후 모든 디자인 시스템이 참고해야 하는가?

### 1. AI 시대에 살아남기

기존 디자인 시스템:
```
"이 버튼은 파란색, 패딩 12px, 둥근 모서리..."
→ AI가 이해하기 어려움
→ 매번 다른 코드 생성
```

이 프로젝트:
```
"이건 주요 액션 버튼"
→ AI가 즉시 이해
→ 일관된 코드 생성
```

### 2. 접근성이 선택이 아닌 필수가 되는 시대

- 법적 요구사항 강화 (ADA, EAA)
- 모든 사용자를 위한 디자인
- 이 프로젝트는 자동화로 해결

### 3. 개발자 경험이 경쟁력인 시대

- 빠른 프로토타이핑
- 낮은 학습 곡선
- 높은 코드 품질

### 4. 유지보수가 핵심인 시대

- 장기적 관점의 설계
- 명확한 규칙과 문서
- 팀 확장 가능성

---

## 참고 문서

### 핵심 문서
- **[PURPOSE_BASED_DESIGN.md](./PURPOSE_BASED_DESIGN.md)**: Why-based 디자인 시스템
- **[PROMINENCE_SYSTEM.md](./PROMINENCE_SYSTEM.md)**: Prominence 시스템 상세 가이드
- **[LAYOUT_SYSTEM.md](./LAYOUT_SYSTEM.md)**: Layout 시스템 완전 가이드
- **[DESIGN_PRINCIPLES.md](./DESIGN_PRINCIPLES.md)**: 디자인 원칙 (15개 파트)

### 참조 문서
- **[component-role-mapping.md](./component-role-mapping.md)**: 컴포넌트-역할 매핑
- **[patterns/](./patterns/)**: 8개 패턴 문서 폴더
- **[DESIGN_SYSTEM_SUMMARY.md](./DESIGN_SYSTEM_SUMMARY.md)**: 빠른 참조
- **[EXAMPLES.md](./EXAMPLES.md)**: Before/After 예제

---

## 마지막으로

이 프로젝트는 단순히 "UI를 만드는 방법"을 제공하는 것이 아닙니다.

**"왜 이렇게 만들어야 하는가"**에 대한 명확한 답을 제공합니다.

그리고 그 답은:
- ✅ AI가 이해할 수 있고
- ✅ 접근성이 보장되고
- ✅ 개발자가 쉽게 사용하고
- ✅ 장기적으로 유지보수 가능한

**차세대 디자인 시스템**입니다.

---

**2025년 1월**
IDE UI Kit Project Team
