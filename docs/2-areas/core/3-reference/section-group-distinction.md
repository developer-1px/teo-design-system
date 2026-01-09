# Section vs Group 구분 (IDDL v4.0)

## 핵심 개념

### Section = 시맨틱 영역 (Semantic Region)
**"Page가 만들어주는 영역"**

- **목적**: HTML 시맨틱 태그 매핑 + Page template의 named slot
- **결정 주체**: Page의 `template` prop이 결정
- **시각적 특성**: 최소한의 스타일 (배경색, 보더 정도)
- **배치 방식**: Page의 CSS Grid `grid-area`로 배치됨
- **렌더링**: 적절한 시맨틱 HTML 태그 (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`)

#### Section의 역할

```tsx
// Page template이 Section role을 결정
<Page role="App" template="studio">
  <Section role="ActivityBar">...</Section>      {/* <nav> + grid-area: activitybar */}
  <Section role="PrimarySidebar">...</Section>   {/* <aside> + grid-area: sidebar */}
  <Section role="Editor">...</Section>           {/* <main> + grid-area: editor */}
  <Section role="Panel">...</Section>            {/* <section> + grid-area: panel */}
</Page>
```

**Section role 예시**:
- **Universal**: `Header`, `Footer`, `Main`, `Container`
- **Web Standard**: `Navigator`, `Aside`
- **IDE/Studio**: `ActivityBar`, `PrimarySidebar`, `Editor`, `Panel`
- **Master-Detail**: `Master`, `Detail`
- **Dialog**: `DialogHeader`, `DialogContent`, `DialogFooter`

### Group = 기능적 컴포넌트 (Functional Component)
**"기능적 목적을 가진 UI 조합"**

- **목적**: 기능적 역할 정의 (Form, Card, Toolbar, List, Table 등)
- **결정 주체**: 개발자가 UI의 기능적 의도에 따라 선택
- **시각적 특성**: **시각적 요소를 가질 수 있음** (배경, 보더, 패딩, 그림자 등)
- **배치 방식**: 부모의 layout 시스템 (flex, grid, stack 등)
- **렌더링**: 기능에 맞는 HTML 태그 (`<form>`, `<ul>`, `<div role="...">`)

#### Group의 역할

```tsx
// Section 안에서 기능적 컴포넌트로 사용
<Section role="PrimarySidebar">
  <Group role="Toolbar">
    <Action>New File</Action>
    <Action>Search</Action>
  </Group>

  <Group role="List">
    <Group role="Card">File 1</Group>
    <Group role="Card">File 2</Group>
  </Group>
</Section>
```

**Group role 예시**:
- **Container**: 일반 컨테이너 (기본값)
- **Form**: 입력 폼 (`<form>`)
- **Fieldset**: 필드 그룹 (`<fieldset>`)
- **Toolbar**: 액션 모음 (가로 정렬)
- **List**: 항목 리스트 (`<ul>`, `<ol>`)
- **Grid**: 그리드 레이아웃
- **Table**: 테이블 (`<table>`)
- **Card**: 카드 UI (배경 + 보더 + 패딩)
- **Tabs**: 탭 컨테이너
- **Steps**: 단계별 진행

## 계층 구조

```
Page (Application Root)
 └─ template="studio" (Grid Layout 정의)
     ├─ Section role="ActivityBar" (grid-area: activitybar, <nav>)
     │   └─ Group role="Toolbar"
     │       ├─ Action
     │       └─ Action
     │
     ├─ Section role="PrimarySidebar" (grid-area: sidebar, <aside>)
     │   ├─ Group role="Toolbar"
     │   └─ Group role="List"
     │       ├─ Group role="Card"
     │       └─ Group role="Card"
     │
     └─ Section role="Editor" (grid-area: editor, <main>)
         └─ Group role="Form"
             ├─ Group role="Fieldset"
             └─ Action
```

## 주요 차이점

| 측면 | Section | Group |
|------|---------|-------|
| **의미** | 시맨틱 영역 (Semantic Region) | 기능적 컴포넌트 (Functional Component) |
| **결정 주체** | Page template | 개발자 |
| **HTML 태그** | 시맨틱 태그 (`<header>`, `<nav>`, `<main>`) | 기능적 태그 (`<form>`, `<ul>`, `<div>`) |
| **배치** | Page의 CSS Grid | 부모의 layout 시스템 |
| **시각적 요소** | 최소한 (배경색, 보더) | **가질 수 있음** (Card, Fieldset 등) |
| **중첩** | Section 안에 Section 가능 | Group 안에 Group 가능 |
| **Template 종속** | ✅ Template-aware (validation) | ❌ Template 무관 |

## 설계 원칙

### Section 설계 원칙

1. **Page template과 1:1 대응**
   - `template="studio"` → `ActivityBar`, `PrimarySidebar`, `Editor`, `Panel` 등
   - `template="sidebar-content"` → `Navigator`, `Main`, `Aside` 등

2. **시맨틱 우선**
   - 적절한 HTML 시맨틱 태그 선택 (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`)
   - ARIA landmark 자동 설정

3. **Grid Area 기반 배치**
   - `gridArea` prop으로 Page의 CSS Grid에 배치됨
   - 크기와 위치는 Page template이 결정

4. **최소한의 스타일**
   - 배경색, 보더 정도만 사용
   - 내부 콘텐츠는 Group이 담당

### Group 설계 원칙

1. **기능적 역할 우선**
   - "무엇을 하는가?"에 따라 role 선택
   - Form, Card, Toolbar, List, Table 등

2. **시각적 자유도**
   - 배경, 보더, 패딩, 그림자 등 자유롭게 사용 가능
   - prominence, intent에 따라 시각적 강도 조절

3. **재사용성**
   - 어떤 Section 안에서든 사용 가능
   - Template 무관하게 독립적으로 동작

4. **중첩 가능**
   - `Group role="List"` 안에 `Group role="Card"` 가능
   - `Group role="Form"` 안에 `Group role="Fieldset"` 가능

## 실전 예시

### IDE Layout (template="studio")

```tsx
<Page role="App" template="studio">
  {/* Section: 시맨틱 영역 (Page가 배치) */}
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
    {/* Panel content */}
  </Section>
</Page>
```

### Dashboard (template="dashboard")

```tsx
<Page role="App" template="dashboard">
  <Section role="Header" gridArea="header">
    <Group role="Toolbar">
      <Text role="Title">Dashboard</Text>
      <Action>Refresh</Action>
    </Group>
  </Section>

  <Section role="Main" gridArea="main">
    <Group role="Grid" layout="grid">
      <Group role="Card" prominence="Strong">
        <Text role="Title">Total Users</Text>
        <Text role="Body">1,234</Text>
      </Group>
      <Group role="Card">
        <Text role="Title">Revenue</Text>
        <Text role="Body">$56,789</Text>
      </Group>
      <Group role="Card">
        <Text role="Title">Growth</Text>
        <Text role="Body">+12.5%</Text>
      </Group>
    </Group>
  </Section>
</Page>
```

### Form Page (template="sidebar-content")

```tsx
<Page role="App" template="sidebar-content">
  <Section role="Navigator" gridArea="navigator">
    <Group role="List">
      <Action role="ListItem" selected>Profile</Action>
      <Action role="ListItem">Security</Action>
      <Action role="ListItem">Billing</Action>
    </Group>
  </Section>

  <Section role="Main" gridArea="content">
    <Group role="Form">
      <Text role="Title">Profile Settings</Text>

      <Group role="Fieldset">
        <Text role="Label">Personal Information</Text>
        <Field label="Name" dataType="text" />
        <Field label="Email" dataType="email" />
      </Group>

      <Group role="Fieldset">
        <Text role="Label">Preferences</Text>
        <Field label="Language" dataType="select" />
        <Field label="Timezone" dataType="select" />
      </Group>

      <Group role="Toolbar">
        <Action prominence="Standard">Cancel</Action>
        <Action prominence="Strong" intent="Brand">Save</Action>
      </Group>
    </Group>
  </Section>
</Page>
```

## 잘못된 사용 예시

### ❌ Section을 기능적 컴포넌트로 사용

```tsx
// ❌ WRONG: Section은 기능적 컴포넌트가 아님
<Section role="Card">
  <Text>Card content</Text>
</Section>

// ✅ CORRECT: Group 사용
<Group role="Card">
  <Text>Card content</Text>
</Group>
```

### ❌ Group을 Page 배치에 사용

```tsx
// ❌ WRONG: Group은 Page의 grid-area에 배치될 수 없음
<Page role="App" template="studio">
  <Group role="Sidebar" gridArea="sidebar">...</Group>
</Page>

// ✅ CORRECT: Section 사용
<Page role="App" template="studio">
  <Section role="PrimarySidebar" gridArea="sidebar">
    <Group role="List">...</Group>
  </Section>
</Page>
```

### ❌ Section role을 잘못된 template에 사용

```tsx
// ❌ WRONG: template="dashboard"에서 ActivityBar는 유효하지 않음
<Page role="App" template="dashboard">
  <Section role="ActivityBar">...</Section>
</Page>
// 경고: [Section] Role "ActivityBar" is not valid for template "dashboard"

// ✅ CORRECT: 해당 template의 유효한 role 사용
<Page role="App" template="studio">
  <Section role="ActivityBar">...</Section>
</Page>
```

## 요약

- **Section**: Page template이 정의하는 **시맨틱 영역** (시맨틱 태그 + grid-area)
- **Group**: 개발자가 선택하는 **기능적 컴포넌트** (Form, Card, Toolbar 등, 시각적 요소 가능)
- **Figma와 무관**: IDDL 고유의 정의를 따름
- **계층 구조**: Page → Section (시맨틱) → Group (기능) → Primitives (Text, Field, Action)
