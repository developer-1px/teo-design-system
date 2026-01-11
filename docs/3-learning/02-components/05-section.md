# Section 컴포넌트

**난이도**: ⭐⭐⭐☆☆
**소요 시간**: 25분
**선행 학습**: [Type](../01-fundamentals/05-type.md), [Block](./04-block.md)

---

## 📌 이 문서에서 배울 내용

- Section이 무엇인가?
- 3가지 SectionRole 카테고리 완전 이해
- Page Layout과의 관계 (Grid Area 자동 배치)
- Resizable/Collapsible 기능
- 실전 활용 패턴 (IDE 레이아웃, 문서 페이지)
- 자주 하는 실수와 해결법

---

## 🎯 Section이란?

**Section**은 **Page 내의 시맨틱 영역**을 정의하는 IDDL 컴포넌트입니다.

```tsx
// Page를 논리적 영역(Section)으로 분할
<Page role="Application" layout="Studio">
  <Section role="ActivityBar">
    {/* 앱 전환 버튼 */}
  </Section>

  <Section role="PrimarySidebar">
    {/* 파일 트리 */}
  </Section>

  <Section role="Editor">
    {/* 메인 에디터 */}
  </Section>

  <Section role="Panel">
    {/* 터미널, 디버그 콘솔 */}
  </Section>
</Page>
```

**핵심 특징**:
- **Type**: Section (Page의 자식, Block의 부모)
- **용도**: Page를 논리적 영역으로 분할
- **HTML 매핑**: 시맨틱 HTML 태그 (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`)
- **Grid 배치**: Page layout에 따라 자동으로 위치 결정
- **Nesting**: Section 안에는 Block만 허용

---

## 📚 SectionRole 카테고리

Section은 **사용 목적**에 따라 3개 카테고리로 분류됩니다.

### 1. Core Roles (HTML5 표준)

**용도**: 웹 표준 시맨틱 영역

| Role | 의미 | HTML | Grid Area | Use Case |
|------|------|------|-----------|----------|
| **Header** | 상단 헤더 | `<header>` | `header` | 로고, GNB, 페이지 타이틀 |
| **Nav** | 네비게이션 | `<nav>` | `nav` | 좌측 메뉴, LNB, 사이드바 |
| **Main** | 메인 콘텐츠 | `<main>` | `main` | 핵심 콘텐츠 (필수) |
| **Aside** | 보조 정보 | `<aside>` | `aside` | 우측 정보, TOC, 필터 |
| **Footer** | 하단 푸터 | `<footer>` | `footer` | 카피라이트, 사이트맵 |

**예시**:
```tsx
// 문서 페이지 (Document)
<Page role="Document" maxWidth="lg">
  <Section role="Header">
    <Block role="Toolbar">
      <Text role="Title">Documentation</Text>
      <Action>Search</Action>
    </Block>
  </Section>

  <Section role="Main" scrollable>
    <Block role="Stack">
      <Text role="Title" prominence="Hero">Getting Started</Text>
      <Text role="Body">Welcome to IDDL...</Text>
    </Block>
  </Section>

  <Section role="Footer">
    <Text role="Caption">© 2026 IDDL</Text>
  </Section>
</Page>
```

---

### 2. App-Specific Roles (앱 전용)

**용도**: 모바일/데스크톱 앱용 특수 영역

| Role | 의미 | HTML | Grid Area | Use Case |
|------|------|------|-----------|----------|
| **Dock** | 하단 탭바 | `<nav>` | `dock` | 모바일 하단 고정 탭 |
| **Status** | 상태바 | `<footer>` | `status` | IDE/Studio 최하단 상태 표시 |
| **Panel** | 분할 패널 | `<section>` | `panel` | Split/Studio의 서브 작업창 |

**예시**:
```tsx
// 모바일 앱 (Dock 사용)
<Page role="Application" layout="Mobile">
  <Section role="Main">
    {/* 메인 콘텐츠 */}
  </Section>

  <Section role="Dock">
    <Block role="Toolbar">
      <Action role="Tab">Home</Action>
      <Action role="Tab">Search</Action>
      <Action role="Tab">Profile</Action>
    </Block>
  </Section>
</Page>

// IDE 레이아웃 (Status, Panel 사용)
<Page role="Application" layout="Studio">
  <Section role="Editor">
    {/* 에디터 */}
  </Section>

  <Section role="Panel" resizable collapsible>
    {/* 터미널 */}
  </Section>

  <Section role="Status">
    <Text role="Label">Line 42, Column 10</Text>
  </Section>
</Page>
```

---

### 3. IDE-Specific Roles (IDE/Studio 전용)

**용도**: VS Code, IntelliJ 스타일 IDE 레이아웃

| Role | Grid Area | 기본 크기 | Use Case |
|------|-----------|----------|----------|
| **ActivityBar** | `activitybar` | 48px | 앱 전환 버튼 (좌측 최외곽) |
| **PrimarySidebar** | `sidebar` | 250px | 파일 트리, 검색, Git |
| **Editor** | `editor` | 1fr | 메인 에디터 영역 |
| **Panel** | `panel` | 300px | 터미널, 디버그 콘솔 |
| **SecondarySidebar** | `secondarySidebar` | 300px | 아웃라인, 타임라인 |
| **Toolbar** | `toolbar` | auto | 툴바 영역 |

**예시**:
```tsx
// VS Code 스타일 IDE
<Page role="Application" layout="Studio">
  <Section role="ActivityBar">
    <Block role="Stack">
      <Action role="IconButton" title="Explorer"><Files /></Action>
      <Action role="IconButton" title="Search"><Search /></Action>
      <Action role="IconButton" title="Git"><GitBranch /></Action>
    </Block>
  </Section>

  <Section role="PrimarySidebar" resizable collapsible>
    <Block role="Tabs">
      <Action role="Tab" selected>Explorer</Action>
    </Block>
    <Block role="List">
      {/* 파일 트리 */}
    </Block>
  </Section>

  <Section role="Editor">
    <Block role="Tabs">
      <Action role="Tab" selected>file1.tsx</Action>
      <Action role="Tab">file2.tsx</Action>
    </Block>
    {/* 코드 에디터 */}
  </Section>

  <Section role="Panel" resizable collapsible>
    <Block role="Tabs">
      <Action role="Tab" selected>Terminal</Action>
      <Action role="Tab">Debug Console</Action>
    </Block>
    {/* 터미널 콘텐츠 */}
  </Section>
</Page>
```

---

## 🎨 Page Layout과의 관계

Section의 핵심은 **Page layout에 따라 자동으로 배치**된다는 것입니다.

### Grid Area 자동 매핑

Page의 `layout` prop에 따라 각 SectionRole은 고유한 `grid-area`를 가집니다.

**예시 1: HolyGrail Layout**

```tsx
<Page role="Application" layout="HolyGrail">
  <Section role="Header">Header</Section>
  <Section role="Nav">Nav</Section>
  <Section role="Main">Main</Section>
  <Section role="Aside">Aside</Section>
  <Section role="Footer">Footer</Section>
</Page>
```

**자동 생성되는 CSS Grid**:
```css
grid-template-areas:
  "header  header  header"
  "nav     main    aside"
  "footer  footer  footer";

grid-template-columns: 250px 1fr 300px;
grid-template-rows: auto 1fr auto;
```

**결과**:
```
┌─────────────────────────────────┐
│          Header                 │
├────────┬──────────────┬─────────┤
│  Nav   │     Main     │  Aside  │
│        │              │         │
├────────┴──────────────┴─────────┤
│          Footer                 │
└─────────────────────────────────┘
```

---

**예시 2: Studio Layout (IDE)**

```tsx
<Page role="Application" layout="Studio">
  <Section role="ActivityBar">AB</Section>
  <Section role="PrimarySidebar">Sidebar</Section>
  <Section role="Editor">Editor</Section>
  <Section role="Panel">Panel</Section>
</Page>
```

**자동 생성되는 CSS Grid**:
```css
grid-template-areas:
  "activitybar sidebar editor panel";

grid-template-columns: 48px 250px 1fr 300px;
grid-template-rows: 1fr;
```

**결과**:
```
┌──┬────────┬──────────────┬────────┐
│AB│Sidebar │   Editor     │ Panel  │
│  │        │              │        │
└──┴────────┴──────────────┴────────┘
```

---

### Alias Role 정규화

개발자가 습관적으로 쓰는 이름도 자동으로 Core Role로 변환됩니다.

| 입력 (Alias) | 정규화 (Core Role) |
|-------------|-------------------|
| `Navigator`, `Sidebar`, `LNB` | **Nav** |
| `Container`, `Content`, `Body` | **Main** |
| `TopBar`, `AppBar`, `TitleBar` | **Header** |
| `Inspector`, `Detail`, `TOC` | **Aside** |

```tsx
// ✅ 모두 동일하게 동작
<Section role="Navigator">...</Section>
<Section role="Sidebar">...</Section>
<Section role="Nav">...</Section>  {/* 정규화된 이름 */}
```

---

## 🔧 핵심 기능

### 1. Resizable (크기 조절)

Section의 크기를 사용자가 조절할 수 있게 만듭니다.

```tsx
<Section
  role="PrimarySidebar"
  resizable={{
    direction: 'horizontal',  // 가로 방향 크기 조절
    minSize: 200,            // 최소 200px
    maxSize: 400             // 최대 400px
  }}
>
  {/* 파일 트리 */}
</Section>
```

**동작**:
- Section 우측에 드래그 핸들 표시
- 마우스로 드래그하여 너비 조절
- `minSize`와 `maxSize` 범위 내에서만 조절 가능

---

### 2. Collapsible (접기/펼치기)

Section을 접었다 펼 수 있게 만듭니다.

```tsx
<Section
  role="Panel"
  collapsible
  defaultCollapsed={false}  // 기본적으로 펼쳐진 상태
>
  {/* 터미널 */}
</Section>
```

**동작**:
- Section 헤더에 토글 버튼 자동 표시
- 클릭하면 접히고, 다시 클릭하면 펼쳐짐
- 접힌 상태에서는 최소 크기 (예: 32px)로 축소

---

### 3. Scrollable (스크롤)

Section 내부에 스크롤을 허용합니다.

```tsx
<Section role="Main" scrollable>
  {/* 긴 콘텐츠 */}
  <Block role="Stack">
    <Text>Content 1</Text>
    <Text>Content 2</Text>
    {/* ... 많은 콘텐츠 ... */}
  </Block>
</Section>
```

**동작**:
- `overflow-y: auto` 자동 적용
- Section 높이를 넘어가는 콘텐츠는 스크롤로 표시
- Page가 `role="Application"`일 때 Main은 기본적으로 `scrollable={true}`

---

## 🎯 실전 패턴

### 1. 문서 페이지 (3-Column Layout)

```tsx
function DocumentationPage() {
  return (
    <Page role="Document" maxWidth="7xl" centered>
      <Section role="Header">
        <Block role="Toolbar">
          <Text role="Title">IDDL Documentation</Text>
          <Block role="Spacer" />
          <Action prominence="Strong">Search</Action>
        </Block>
      </Section>

      <Block layout="split" className="min-h-screen">
        <Section role="Nav" className="w-64">
          <Block role="Stack">
            <Text role="Title" prominence="Standard">Contents</Text>
            <Block role="List">
              <Action role="ListItem" selected>Introduction</Action>
              <Action role="ListItem">Getting Started</Action>
              <Action role="ListItem">Components</Action>
            </Block>
          </Block>
        </Section>

        <Section role="Main" scrollable>
          <Block role="Stack" className="max-w-3xl mx-auto">
            <Text role="Title" prominence="Hero">Introduction</Text>
            <Text role="Body">IDDL is...</Text>
          </Block>
        </Section>

        <Section role="Aside" className="w-64">
          <Block role="Stack">
            <Text role="Title" prominence="Standard">On This Page</Text>
            <Block role="List">
              <Action role="Link">What is IDDL?</Action>
              <Action role="Link">Core Concepts</Action>
              <Action role="Link">Quick Start</Action>
            </Block>
          </Block>
        </Section>
      </Block>
    </Page>
  );
}
```

---

### 2. IDE 레이아웃 (Studio)

```tsx
function IDEPage() {
  return (
    <Page role="Application" layout="Studio">
      {/* 1. ActivityBar (48px) */}
      <Section role="ActivityBar">
        <Block role="Stack" className="items-center py-2">
          <Action role="IconButton" title="Explorer" selected>
            <Files size={24} />
          </Action>
          <Action role="IconButton" title="Search">
            <Search size={24} />
          </Action>
          <Action role="IconButton" title="Git">
            <GitBranch size={24} />
          </Action>
        </Block>
      </Section>

      {/* 2. PrimarySidebar (250px, resizable) */}
      <Section
        role="PrimarySidebar"
        resizable={{
          direction: 'horizontal',
          minSize: 200,
          maxSize: 400
        }}
        collapsible
      >
        <Block role="Tabs">
          <Action role="Tab" selected>Explorer</Action>
        </Block>
        <Block role="List">
          {/* 파일 트리 */}
        </Block>
      </Section>

      {/* 3. Editor (1fr) */}
      <Section role="Editor">
        <Block role="Tabs">
          <Action role="Tab" selected>file1.tsx</Action>
          <Action role="Tab">file2.tsx</Action>
        </Block>
        {/* 코드 에디터 */}
      </Section>

      {/* 4. Panel (300px, resizable, collapsible) */}
      <Section
        role="Panel"
        resizable={{
          direction: 'vertical',
          minSize: 100,
          maxSize: 600
        }}
        collapsible
        defaultCollapsed={false}
      >
        <Block role="Tabs">
          <Action role="Tab" selected>Terminal</Action>
          <Action role="Tab">Debug Console</Action>
        </Block>
        {/* 터미널 콘텐츠 */}
      </Section>
    </Page>
  );
}
```

---

### 3. 설정 페이지 (Sidebar + Main)

```tsx
function SettingsPage() {
  return (
    <Page role="Application" layout="Sidebar">
      <Section role="Nav" className="w-64">
        <Block role="Stack">
          <Text role="Title" prominence="Strong">Settings</Text>
          <Block role="List">
            <Action role="ListItem" selected>Profile</Action>
            <Action role="ListItem">Security</Action>
            <Action role="ListItem">Notifications</Action>
            <Action role="ListItem">Billing</Action>
          </Block>
        </Block>
      </Section>

      <Section role="Main" scrollable>
        <Block role="Stack" className="max-w-2xl p-8">
          <Text role="Title" prominence="Hero">Profile Settings</Text>
          <Block role="Form">
            <Field label="Name" dataType="text" />
            <Field label="Email" dataType="email" />
            <Field label="Bio" dataType="textarea" />

            <Block role="Toolbar" className="justify-end">
              <Action prominence="Standard">Cancel</Action>
              <Action prominence="Strong" intent="Positive">Save</Action>
            </Block>
          </Block>
        </Block>
      </Section>
    </Page>
  );
}
```

---

### 4. 모바일 앱 (Dock)

```tsx
function MobileApp() {
  return (
    <Page role="Application" layout="Mobile">
      <Section role="Main" scrollable>
        {/* 메인 콘텐츠 */}
      </Section>

      <Section role="Dock">
        <Block role="Toolbar" layout="inline" className="justify-around">
          <Action role="IconButton" title="Home" selected>
            <Home size={24} />
          </Action>
          <Action role="IconButton" title="Search">
            <Search size={24} />
          </Action>
          <Action role="IconButton" title="Notifications">
            <Bell size={24} />
          </Action>
          <Action role="IconButton" title="Profile">
            <User size={24} />
          </Action>
        </Block>
      </Section>
    </Page>
  );
}
```

---

## 🚫 자주 하는 실수

### 실수 1: Section에 Element 직접 배치

```tsx
// ❌ BAD - Section에 Element 직접 배치
<Section role="Main">
  <Text role="Title">Title</Text>
  <Field label="Name" dataType="text" />
</Section>

// ✅ GOOD - Block으로 감싸기
<Section role="Main">
  <Block role="Stack">
    <Text role="Title">Title</Text>
    <Field label="Name" dataType="text" />
  </Block>
</Section>
```

**이유**: IDDL 계층 규칙: Page → Section → Block → Element

---

### 실수 2: Main 없이 Page 구성

```tsx
// ❌ BAD - Main이 없음
<Page role="Application" layout="Sidebar">
  <Section role="Nav">Nav</Section>
  <Section role="Aside">Aside</Section>
</Page>

// ✅ GOOD - Main은 필수
<Page role="Application" layout="Sidebar">
  <Section role="Nav">Nav</Section>
  <Section role="Main">Main Content</Section>
</Page>
```

**이유**: Main은 페이지의 핵심 콘텐츠 영역으로 필수입니다.

---

### 실수 3: role과 layout 불일치

```tsx
// ❌ BAD - Studio layout인데 Header/Footer 사용
<Page role="Application" layout="Studio">
  <Section role="Header">Header</Section>
  <Section role="Editor">Editor</Section>
  <Section role="Footer">Footer</Section>
</Page>

// ✅ GOOD - Studio layout에 맞는 role 사용
<Page role="Application" layout="Studio">
  <Section role="ActivityBar">AB</Section>
  <Section role="PrimarySidebar">Sidebar</Section>
  <Section role="Editor">Editor</Section>
  <Section role="Panel">Panel</Section>
</Page>
```

**이유**: 각 Page layout은 특정 SectionRole 조합을 기대합니다.

---

### 실수 4: resizable 방향 오류

```tsx
// ❌ BAD - 좌우 배치인데 vertical resizable
<Section role="PrimarySidebar" resizable={{ direction: 'vertical' }}>
  ...
</Section>

// ✅ GOOD - 좌우 배치는 horizontal resizable
<Section role="PrimarySidebar" resizable={{ direction: 'horizontal' }}>
  ...
</Section>
```

**이유**: Sidebar는 좌우로 크기를 조절해야 합니다.

---

### 실수 5: scrollable 누락

```tsx
// ❌ BAD - 긴 콘텐츠인데 scrollable 없음
<Page role="Application" layout="Sidebar">
  <Section role="Main">
    {/* 화면보다 긴 콘텐츠 */}
  </Section>
</Page>

// ✅ GOOD - scrollable 명시
<Page role="Application" layout="Sidebar">
  <Section role="Main" scrollable>
    {/* 화면보다 긴 콘텐츠 */}
  </Section>
</Page>
```

**이유**: Application 페이지는 고정 높이이므로 스크롤 명시 필요.

---

## 📝 실습: 블로그 레이아웃

### 요구사항

다음 요구사항을 만족하는 블로그 레이아웃을 만드세요:

1. **레이아웃**:
   - Header: 블로그 제목 + 검색 버튼
   - Nav: 좌측 카테고리 메뉴 (200-400px, resizable)
   - Main: 포스트 목록 (scrollable)
   - Aside: 우측 인기 태그 (고정 300px)
   - Footer: 저작권 정보

2. **스타일**:
   - Page는 HolyGrail layout
   - Main은 최대 너비 800px, 중앙 정렬

### 정답 예시

```tsx
function BlogLayout() {
  return (
    <Page role="Application" layout="HolyGrail">
      {/* Header */}
      <Section role="Header">
        <Block role="Toolbar">
          <Text role="Title" prominence="Strong">My Blog</Text>
          <Block role="Spacer" />
          <Action prominence="Strong">Search</Action>
        </Block>
      </Section>

      {/* Nav (resizable) */}
      <Section
        role="Nav"
        resizable={{
          direction: 'horizontal',
          minSize: 200,
          maxSize: 400
        }}
      >
        <Block role="Stack">
          <Text role="Title" prominence="Standard">Categories</Text>
          <Block role="List">
            <Action role="ListItem" selected>All Posts</Action>
            <Action role="ListItem">Tech</Action>
            <Action role="ListItem">Design</Action>
            <Action role="ListItem">Life</Action>
          </Block>
        </Block>
      </Section>

      {/* Main (scrollable) */}
      <Section role="Main" scrollable>
        <Block role="Stack" className="max-w-3xl mx-auto">
          {/* 포스트 목록 */}
          <Block role="Card" prominence="Strong">
            <Text role="Title">Post 1</Text>
            <Text role="Body">Summary...</Text>
          </Block>
          <Block role="Card" prominence="Strong">
            <Text role="Title">Post 2</Text>
            <Text role="Body">Summary...</Text>
          </Block>
        </Block>
      </Section>

      {/* Aside (고정) */}
      <Section role="Aside" className="w-[300px]">
        <Block role="Stack">
          <Text role="Title" prominence="Standard">Popular Tags</Text>
          <Block role="Row" className="flex-wrap">
            <Action role="Chip">React</Action>
            <Action role="Chip">TypeScript</Action>
            <Action role="Chip">IDDL</Action>
          </Block>
        </Block>
      </Section>

      {/* Footer */}
      <Section role="Footer">
        <Text role="Caption" className="text-center">
          © 2026 My Blog. All rights reserved.
        </Text>
      </Section>
    </Page>
  );
}
```

**체크리스트**:
- [ ] HolyGrail layout 사용?
- [ ] 5개 Section (Header, Nav, Main, Aside, Footer)?
- [ ] Nav가 resizable?
- [ ] Main이 scrollable?
- [ ] Aside 너비 300px?

---

## 💡 고급 기능

### 1. Section with Actions

Section 헤더에 액션 버튼을 추가할 수 있습니다.

```tsx
<Section
  role="PrimarySidebar"
  title="Explorer"
  actions={
    <Block role="Row">
      <Action role="IconButton" title="New File"><FilePlus /></Action>
      <Action role="IconButton" title="New Folder"><FolderPlus /></Action>
    </Block>
  }
>
  {/* 파일 트리 */}
</Section>
```

---

### 2. Conditional Rendering

```tsx
<Section
  role="Panel"
  condition={showPanel}  // showPanel이 false면 렌더링 안 함
>
  {/* 터미널 */}
</Section>
```

---

### 3. Custom Grid Area

```tsx
<Section
  role="Main"
  gridArea="custom-area"  // 커스텀 grid-area 지정
>
  {/* 콘텐츠 */}
</Section>
```

---

## ✅ 이 문서를 읽고 나면

- [x] Section의 역할을 이해했다
- [x] 3가지 SectionRole 카테고리를 파악했다
- [x] Page Layout과의 관계를 이해했다
- [x] Resizable/Collapsible 기능을 사용할 수 있다
- [x] 실전 패턴 (IDE, 문서, 설정, 모바일)을 익혔다

---

## 🔗 다음 단계

[Page 컴포넌트](./06-page.md) - Application vs Document, Layout 시스템

---

**최종 업데이트**: 2026-01-11
**난이도**: 중급
**예상 소요 시간**: 25분
