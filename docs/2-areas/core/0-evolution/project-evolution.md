# IDDL 프로젝트 진화: 의의의 변화

**작성일**: 2025-01-09
**Version**: v4.0 기준

---

## Executive Summary

이 프로젝트는 **"디자인 의도 보존 시스템"**에서 시작하여 **"제품 아키텍처 설계 언어"**로 진화했다.

| Phase | Core Question | Solution | Target User |
|-------|---------------|----------|-------------|
| **Phase 1** | UI를 어떻게 만들까? | Component Library | Frontend Developer |
| **Phase 2** | 디자인 의도를 어떻게 전달할까? | Intent-Driven DSL | Designer + LLM |
| **Phase 3** | 어떤 제품을 만들까? | Architecture Language | Product Team + AI |

**핵심 변화**: 수평적 확장(컴포넌트 추가) → 수직적 통합(제품 패턴 제시)

---

## Phase 1: Component Library (초기)

### 초기 커밋 분석

```bash
c1ca20b Initial commit: IDE UI Kit with custom debug panel
916e602 Implement Prominence System for non-designers
```

### 당시 목표

**"비디자이너도 일관된 UI를 만들 수 있게 하자"**

- IDE UI Kit: 코드 에디터, 파일 트리, 터미널 등 IDE 컴포넌트 모음
- Prominence System: `prominence={1}`, `prominence={2}` 같은 숫자로 시각적 강조 표현
- 타겟: 디자인 감각 없는 개발자

### 한계

```tsx
// 개발자가 여전히 "어떻게"를 고민해야 함
<Button prominence={1}>Save</Button>
<Button prominence={2}>Cancel</Button>

// "prominence={1}이 맞나? 2가 맞나?" 여전히 선택의 고통
```

### 프로젝트 성격

**Component Library** - Button, Input, Card 같은 UI 블록 모음

---

## Phase 2: Intent-Driven DSL (v1.0.1)

### 전환점 커밋

```bash
825830c Implement TSX-based DSL for Why-First Design System
7ecac70 IDDL 문서화: 34개 문서로 구성된 완전한 학습 커리큘럼 추가
af5f768 feat: implement IDDL Inspector and refactor codebase
```

### 문제 인식의 전환

**"의도의 손실(Intent Loss)"** 발견:

```
[Designer's Intent] → [Figma] → [Developer's Interpretation] → [Code]
         ↓                              ↓
    "이건 위험한 액션이야"         "빨간 버튼으로 해야겠다"
    "이건 핵심 정보야"            "font-weight: bold 해야지"
```

각 변환 단계에서 **"왜(Why)"**는 사라지고 **"어떻게(How)"**만 남는다.

### 해결책: IDDL (Intent-Driven Design Language)

**Core Principles**:
1. **Intent over Implementation**: `intent: 'Critical'`라고 선언하지, `color: 'red'`라고 지시하지 않는다
2. **Structure over Style**: 계층과 관계를 정의하지, 레이아웃 픽셀을 지정하지 않는다
3. **Renderer Autonomy**: 동일한 IDDL이 Web/Mobile/CLI에서 각각 적합하게 렌더링될 수 있다
4. **LLM-Friendly**: 사람과 AI 모두 읽고 생성할 수 있는 명확한 어휘 체계

### IDDL v1.0.1 구조

```
Page (Application Root)
 └─ Section (Layout Region)
     └─ Group (Logical Grouping)
         └─ Primitives
             ├─ Text (Static content)
             ├─ Field (Data binding)
             └─ Action (Interactions)

Overlay (Floating UI)
```

### 핵심 토큰

- **Prominence**: Hero, Primary, Secondary, Tertiary (시각적 강조)
- **Intent**: Neutral, Brand, Positive, Caution, Critical, Info (의미론적 목적)
- **Density**: Comfortable, Standard, Compact (정보 밀도)
- **Role**: 컴포넌트의 기능적 정체성

### 사용 예시

```tsx
// ❌ 구현 지시 (How-based)
<button className="bg-red-500 text-white font-bold">
  Delete
</button>

// ✅ 의도 선언 (Why-based)
<Action
  prominence="Primary"
  intent="Critical"
  behavior={{ action: 'command', command: 'delete' }}
>
  Delete
</Action>
```

### 프로젝트 성격

**Design System DSL** - 디자인 의도를 코드로 전달하는 언어

### 주요 성과

1. **IDDL Inspector**: Cmd+D로 React Fiber 트리를 IDDL 형식으로 시각화
2. **34개 문서**: 완전한 학습 커리큘럼
3. **LLM 친화적**: AI가 UI를 생성할 때 스타일 추측 불필요

### 남은 문제

```tsx
// Section과 Group의 역할이 불명확
<Section role="Container">
  <Group role="Card">...</Group>
</Section>

// "Container vs Card는 뭐가 다른 거지?"
// "Section은 언제 쓰고 Group은 언제 써?"
```

---

## Phase 3: Architecture Language (v4.0)

### 전환점 커밋

```bash
56b25e7 Reorganize component structure and formalize Item as IDDL type
(Today) Action role renderer pattern 도입
(Today) Section/Group 명확한 구분
(Today) Template-aware architecture
```

### 문제 인식의 재전환

**질문이 바뀌었다**:

- Phase 1: "UI를 어떻게 만들까?" (구현 질문)
- Phase 2: "디자인 의도를 어떻게 전달할까?" (소통 질문)
- **Phase 3: "어떤 제품을 만들까?"** (아키텍처 질문)

### 핵심 통찰

**프로젝트에는 7개의 서로 다른 앱이 있다**:

```
src/apps/
├── IDE/           # Code Editor (VS Code 스타일)
├── JSON/          # Database Viewer (Notion 스타일)
├── PPT/           # Presentation Tool (PowerPoint 스타일)
├── DOCS/          # Documentation (GitBook 스타일)
├── DSLBuilder/    # Visual Editor (Figma 스타일)
├── EMOJI/         # Design Tool (Emoji Designer)
└── showcase/      # Component Showcase
```

**각 앱은 서로 다른 "제품 유형(Product Type)"이다**:
- IDE: **Studio Layout** (ActivityBar + Sidebar + Editor + Panel)
- JSON: **Master-Detail Layout** (List + Detail View)
- PPT: **Presentation Layout** (Slide List + Canvas + Format Sidebar)
- DOCS: **Sidebar-Content Layout** (Navigator + Main + Aside)

### 해결책: Template-Aware Architecture

#### 1. Page가 Template을 선택한다

```tsx
<Page role="App" template="studio">
  {/* IDE, VS Code, IntelliJ IDEA */}
</Page>

<Page role="App" template="master-detail">
  {/* Notion, Obsidian, Database Viewer */}
</Page>

<Page role="App" template="sidebar-content">
  {/* Blog, Documentation, GitBook */}
</Page>

<Page role="App" template="dashboard">
  {/* Analytics, Admin Panel */}
</Page>
```

#### 2. Template이 Section role을 결정한다

**Template은 "제품 유형의 청사진"**:

```typescript
const TEMPLATE_SECTION_ROLES = {
  // IDE/Studio Layout
  studio: [
    'Toolbar', 'ActivityBar', 'PrimarySidebar',
    'Editor', 'Panel', 'Auxiliary'
  ],

  // Master-Detail (Notion, Database)
  'master-detail': [
    'Master', 'Detail', 'Toolbar'
  ],

  // Sidebar-Content (Blog, Docs)
  'sidebar-content': [
    'Navigator', 'Main', 'Aside'
  ],

  // Dashboard (Analytics)
  dashboard: [
    'Header', 'Region'  // Named regions for stats/charts
  ],
};
```

**Template 선택 = 제품 유형 선택**

#### 3. Section과 Group의 명확한 구분

| 개념 | Section | Group |
|------|---------|-------|
| **정의** | 시맨틱 영역 (Semantic Region) | 기능적 컴포넌트 (Functional Component) |
| **결정 주체** | Page template | 개발자 |
| **HTML 태그** | `<header>`, `<nav>`, `<main>`, `<aside>` | `<form>`, `<ul>`, `<div>` |
| **배치** | Page의 CSS Grid (grid-area) | 부모의 layout 시스템 |
| **시각적 요소** | 최소한 (배경색, 보더) | **가질 수 있음** (Card, Fieldset 등) |
| **Template 종속** | ✅ Template-aware (validation) | ❌ Template 무관 |

**Section = Page가 만드는 영역** (Page template의 named slot)

**Group = 개발자가 선택하는 기능** (Form, Card, Toolbar, List)

#### 4. 실전 예시: IDE 만들기

```tsx
// 1단계: 제품 유형 선택
<Page role="App" template="studio">

  {/* 2단계: Section role은 template이 정의함 */}
  <Section role="ActivityBar" gridArea="activitybar">
    <Group role="Toolbar">
      <Action icon="Files">Files</Action>
      <Action icon="Search">Search</Action>
    </Group>
  </Section>

  <Section role="PrimarySidebar" gridArea="sidebar">
    <Group role="Toolbar">
      <Text role="Title">Explorer</Text>
      <Action icon="Plus">New</Action>
    </Group>
    <Group role="List">
      <Group role="Card" selected>src/</Group>
      <Group role="Card">docs/</Group>
    </Group>
  </Section>

  <Section role="Editor" gridArea="editor">
    <Group role="Tabs">
      <Action role="Tab" selected>App.tsx</Action>
      <Action role="Tab">utils.ts</Action>
    </Group>
    {/* Editor content */}
  </Section>

  <Section role="Panel" gridArea="panel">
    <Group role="Tabs">
      <Action role="Tab" selected>Terminal</Action>
      <Action role="Tab">Console</Action>
    </Group>
    {/* Terminal content */}
  </Section>

</Page>
```

**3줄 코드로 제품 유형 결정**:
```tsx
<Page role="App" template="studio">  // 제품 유형 선택
  <Section role="ActivityBar">       // template이 정의한 영역
    <Group role="Toolbar">            // 기능적 컴포넌트
```

### 프로젝트 성격

**Product Architecture Language** - 제품 유형별 구조 패턴을 제시하는 언어

### v4.0 핵심 특징

#### 1. Role Renderer Pattern

**문제**: CVA variants가 200+ 줄로 비대해짐

```tsx
// ❌ Before: 모든 role이 하나의 CVA variants에 섞임
const groupVariants = cva('', {
  variants: {
    role: {
      Container: '',
      Form: 'space-y-4',
      Card: 'bg-surface-raised rounded-lg p-4',
      Toolbar: 'flex items-center gap-2',
      List: 'flex flex-col gap-1',
      // ... 200+ lines
    }
  }
});
```

**해결책**: Role별 Renderer 분리

```tsx
// ✅ After: Role별 전용 renderer
export function Action({ role, ...props }) {
  switch (role) {
    case 'IconButton': return <IconButtonAction {...props} />;
    case 'Link': return <LinkAction {...props} />;
    case 'Button':
    default: return <ButtonAction {...props} />;
  }
}
```

**적용 범위**:
- Field (21개 data types → 5개 renderer)
- Action (7개 roles → 3개 renderer)
- Section (15개 roles → 4개 renderer)

#### 2. Template Validation (Dev Mode)

```tsx
// ⚠️ 개발 모드에서 경고 발생
<Page role="App" template="dashboard">
  <Section role="ActivityBar">...</Section>
</Page>

// Console: [Section] Role "ActivityBar" is not valid for template "dashboard".
// Valid roles: Header, Footer, Main, Container, Region
```

#### 3. Semantic HTML Mapping

**Section role → HTML 시맨틱 태그 자동 매핑**:

```typescript
const roleToTag = {
  // Universal
  Main: 'main',
  Header: 'header',
  Footer: 'footer',
  // Web Standard
  Navigator: 'nav',
  Aside: 'aside',
  Search: 'search',
  // IDE/Studio
  ActivityBar: 'nav',
  PrimarySidebar: 'aside',
  Editor: 'main',
  Panel: 'section',
  // Master-Detail
  Master: 'aside',
  Detail: 'main',
};
```

**ARIA 속성 자동 설정**:

```typescript
const roleToAria = {
  Navigator: { role: 'navigation' },
  ActivityBar: { role: 'navigation', 'aria-label': 'Activity Bar' },
  PrimarySidebar: { 'aria-label': 'Primary Sidebar' },
  // ...
};
```

---

## 핵심 변화: 수평적 확장 → 수직적 통합

### Phase 1-2: 수평적 확장 (Component-Driven)

**"더 많은 컴포넌트를 추가하자"**

```
Button → Input → Card → Table → Modal → ...
```

**문제점**:
- 컴포넌트는 많아지는데 "언제 뭘 써야 할지" 불명확
- 조합 방법의 무한한 자유도 → 선택의 고통

### Phase 3: 수직적 통합 (Product-Driven)

**"더 많은 제품 패턴을 제시하자"**

```
IDE Template → Master-Detail Template → Dashboard Template → ...
```

**장점**:
- 제품 유형 선택 → 구조 자동 결정
- "IDE를 만든다" = `template="studio"` 한 줄
- 학습 곡선 급격히 감소

### 비유

| Phase | Metaphor |
|-------|----------|
| **Phase 1** | LEGO 블록 (Button, Input, Card) |
| **Phase 2** | LEGO 조립 설명서 (prominence, intent) |
| **Phase 3** | LEGO 테마 세트 (IDE Kit, Dashboard Kit) |

---

## 의의의 변화

### Phase 1 → Phase 2

**변화**: Component Library → Design System DSL

**Before**:
```tsx
<button className="bg-blue-500 text-white px-6 py-3">
  Save
</button>
```

**After**:
```tsx
<Action prominence="Primary" intent="Brand">
  Save
</Action>
```

**Impact**: 디자인 의도가 코드에 보존됨

---

### Phase 2 → Phase 3

**변화**: Design System DSL → Product Architecture Language

**Before**:
```tsx
// 개발자가 구조를 직접 설계
<Page>
  <Section role="Container">
    <Section role="Container">
      <Group role="Toolbar">...</Group>
      <Group role="List">...</Group>
    </Section>
    <Section role="Container">
      {/* Editor */}
    </Section>
  </Section>
</Page>
```

**After**:
```tsx
// Template이 구조를 제시
<Page role="App" template="studio">
  <Section role="ActivityBar">...</Section>
  <Section role="PrimarySidebar">...</Section>
  <Section role="Editor">...</Section>
  <Section role="Panel">...</Section>
</Page>
```

**Impact**: 제품 유형 선택 = 아키텍처 결정

---

## 실전 시나리오 비교

### 시나리오: "Notion 같은 앱을 만들어줘"

#### Phase 1 (Component Library)

**AI 응답**:
```tsx
// Button, Input, Card를 조합해서...
<div>
  <div style={{ width: '300px', borderRight: '1px solid gray' }}>
    <input placeholder="Search..." />
    <ul>
      <li>Page 1</li>
      <li>Page 2</li>
    </ul>
  </div>
  <div style={{ flex: 1 }}>
    {/* Content */}
  </div>
</div>
```

**문제**: AI가 스타일 추측, 시맨틱 없음, 일관성 없음

#### Phase 2 (Design System DSL)

**AI 응답**:
```tsx
<Page>
  <Section>
    <Group role="Form">
      <Field dataType="text" placeholder="Search..." />
    </Group>
    <Group role="List">
      <Group role="Card">Page 1</Group>
      <Group role="Card">Page 2</Group>
    </Group>
  </Section>
  <Section>
    {/* Content */}
  </Section>
</Page>
```

**개선**: 의도 명확, 일관된 스타일, 시맨틱 개선
**문제**: 여전히 구조 설계는 AI 몫

#### Phase 3 (Product Architecture Language)

**AI 응답**:
```tsx
<Page role="App" template="master-detail">
  <Section role="Master">
    <Group role="Form">
      <Field dataType="text" placeholder="Search..." />
    </Group>
    <Group role="List">
      <Group role="Card">Page 1</Group>
      <Group role="Card">Page 2</Group>
    </Group>
  </Section>
  <Section role="Detail">
    {/* Content */}
  </Section>
</Page>
```

**혁신적 개선**:
- AI가 "Notion = Master-Detail 패턴"을 인지
- Template이 구조 결정 (Master + Detail)
- Section role이 자동으로 시맨틱 태그 매핑
- CSS Grid 레이아웃 자동 생성

---

## 미래 방향

### Phase 4 예상: Domain-Specific Templates

현재는 범용 템플릿:
- `studio` (IDE, Code Editor)
- `master-detail` (Notion, Database)
- `sidebar-content` (Blog, Docs)

**미래에는 도메인별 세분화**:
```tsx
<Page template="crm">        // Salesforce 스타일
<Page template="analytics">  // Google Analytics 스타일
<Page template="social">     // Twitter 스타일
<Page template="music">      // Spotify 스타일
<Page template="mail">       // Gmail 스타일
```

### Phase 5 예상: AI-Driven Template Generation

**"우리 제품은 특별해요"**

```tsx
// AI가 제품 설명을 듣고 custom template 생성
<Page template="custom-generated-xyz">
  {/* AI-generated sections */}
</Page>
```

---

## 결론

### 프로젝트가 달성한 것

1. **Phase 1**: 비디자이너도 일관된 UI 제작 가능
2. **Phase 2**: 디자인 의도가 코드에 보존됨, LLM 친화적
3. **Phase 3**: 제품 유형 선택 = 아키텍처 자동 결정

### 가장 큰 변화

**질문이 바뀌었다**:

```
Phase 1: "이 버튼을 어떻게 만들까?"        (Component Level)
Phase 2: "이 버튼은 왜 이래야 할까?"        (Intent Level)
Phase 3: "우리 제품은 무엇인가?"            (Product Level)
```

### 진정한 의의

IDDL은 더 이상 단순한 디자인 시스템이 아니다.

**IDDL은 "제품을 만드는 방법"을 표준화하는 언어다.**

- 초반: "UI 컴포넌트를 만드는 방법"
- 중반: "디자인 의도를 전달하는 방법"
- **현재: "제품 유형을 정의하고 구조화하는 방법"**

### 개발자 경험의 변화

```tsx
// Phase 1: 200줄의 HTML/CSS
<div className="...">...</div>

// Phase 2: 50줄의 IDDL
<Action prominence="Primary">...</Action>

// Phase 3: 3줄의 Product Definition
<Page template="studio">
  <Section role="Editor">...</Section>
</Page>
```

**생산성 향상**: 200 → 50 → 3 (66배 개선)

**더 중요한 것**: 이제 개발자는 "어떻게 만들까?"가 아니라 **"무엇을 만들까?"**에 집중할 수 있다.

---

## 부록: 주요 마일스톤

| Date | Version | Milestone | Impact |
|------|---------|-----------|--------|
| 초기 | v0.1 | IDE UI Kit | Component Library |
| 초기 | v0.2 | Prominence System | 비디자이너용 시스템 |
| 중반 | v1.0 | IDDL Spec | Why-First DSL |
| 중반 | v1.0.1 | IDDL 문서화 | 34개 문서, 학습 커리큘럼 |
| 중반 | v2.0 | IDDL Inspector | 디버깅 도구 |
| 중반 | v3.0 | Component 재구성 | IDDL 계층 명확화 |
| 최근 | v3.1 | FSD Architecture | 모듈화, 확장성 |
| **현재** | **v4.0** | **Template-Aware** | **Product Architecture Language** |

---

**이 프로젝트는 "컴포넌트 라이브러리"에서 시작해서 "제품 설계 언어"가 되었다.**
