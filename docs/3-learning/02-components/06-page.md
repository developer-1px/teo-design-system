# Page 컴포넌트

**난이도**: ⭐⭐⭐⭐☆
**소요 시간**: 30분
**선행 학습**: [Type](../01-fundamentals/05-type.md), [Section](./05-section.md)

---

## 📌 이 문서에서 배울 내용

- Page가 무엇인가?
- 6가지 PageRole과 물리 법칙
- 7가지 PageLayout과 Grid Template
- Role × Layout 조합 이해
- 실전 활용 패턴 (Document, Application, Focus, Studio)
- 자주 하는 실수와 해결법

---

## 🎯 Page란?

**Page**는 **IDDL 애플리케이션의 최상위 루트 컴포넌트**입니다.

```tsx
// Page = 전체 화면을 정의하는 루트
<Page role="Application" layout="Studio">
  <Section role="ActivityBar">...</Section>
  <Section role="PrimarySidebar">...</Section>
  <Section role="Editor">...</Section>
  <Section role="Panel">...</Section>
</Page>
```

**핵심 특징**:
- **Type**: Page (IDDL 계층의 최상위)
- **용도**: 전체 화면의 물리 법칙 + 공간 구획 정의
- **자식**: Section만 허용 (Block, Element 직접 배치 불가)
- **2축 시스템**: Role (물리 법칙) × Layout (공간 구획)

---

## 🏗️ 2축 시스템: Role × Layout

Page는 **두 가지 독립적인 축**으로 동작합니다.

| 축 | 역할 | 결정하는 것 |
|----|------|------------|
| **Role** | 물리 법칙 (Physics) | 높이, 스크롤 주체, 뷰포트 고정 여부 |
| **Layout** | 공간 구획 (Zoning) | Grid Template, Section 배치 |

```tsx
// Role: Application (100vh 고정, 내부 스크롤)
// Layout: Studio (IDE 스타일 다중 패널)
<Page role="Application" layout="Studio">
  ...
</Page>

// Role: Document (window scroll, 유동적 높이)
// Layout: HolyGrail (3단 레이아웃)
<Page role="Document" layout="HolyGrail">
  ...
</Page>
```

---

## 📚 PageRole (물리 법칙)

### 1. Document (기본값)

**용도**: 일반 웹 문서, 블로그, 뉴스 기사

**물리 법칙**:
- `min-height: 100vh` (최소 높이만 보장)
- **Window Scroll** (전체 페이지가 스크롤)
- 반응형 (콘텐츠 길이에 따라 높이 자동 증가)

**Use Case**: 블로그 포스트, 뉴스 기사, 문서 페이지, 랜딩 페이지

```tsx
<Page role="Document" layout="Single" maxWidth="4xl" centered>
  <Section role="Header">
    <Text role="Title">Article Title</Text>
  </Section>

  <Section role="Main">
    <Text role="Body">Long article content...</Text>
  </Section>

  <Section role="Footer">
    <Text role="Caption">© 2026</Text>
  </Section>
</Page>
```

---

### 2. Application

**용도**: 웹 애플리케이션, 대시보드, 관리자 패널

**물리 법칙**:
- `height: 100vh; overflow: hidden` (뷰포트 고정)
- **Container Scroll** (Section 내부가 스크롤)
- CSS Grid 기반 레이아웃

**Use Case**: IDE, Studio, Admin Dashboard, SaaS 앱

```tsx
<Page role="Application" layout="Studio">
  <Section role="ActivityBar">...</Section>
  <Section role="PrimarySidebar">...</Section>
  <Section role="Editor" scrollable>...</Section>  {/* 여기서 스크롤 */}
  <Section role="Panel" scrollable>...</Section>
</Page>
```

---

### 3. Focus

**용도**: 단일 행동 집중 페이지

**물리 법칙**:
- `min-height: 100vh; display: flex; align-items: center; justify-center`
- **Center 정렬** (화면 중앙)
- No Navigation (Nav, Aside 없음)

**Use Case**: 로그인, 결제, 단일 작업 플로우

```tsx
<Page role="Focus" maxWidth="md" centered>
  <Section role="Main">
    <Block role="Form">
      <Text role="Title" prominence="Strong">Sign In</Text>
      <Field label="Email" dataType="email" />
      <Field label="Password" dataType="password" />
      <Action prominence="Strong" intent="Positive">Sign In</Action>
    </Block>
  </Section>
</Page>
```

---

### 4. Immersive

**용도**: 몰입형 경험, 스크롤 스냅 프레젠테이션

**물리 법칙**:
- `height: 100vh; overflow-y: scroll; scroll-snap-type: y mandatory`
- **Scroll Snap** (섹션별 끊어서 스크롤)

**Use Case**: 랜딩 페이지, 프레젠테이션, 스토리텔링

```tsx
<Page role="Immersive">
  <Section className="snap-start h-screen">Section 1</Section>
  <Section className="snap-start h-screen">Section 2</Section>
  <Section className="snap-start h-screen">Section 3</Section>
</Page>
```

---

### 5. Overlay

**용도**: 모달형 전체 페이지

**물리 법칙**:
- `position: fixed; inset: 0; z-index: 50; background: rgba(0,0,0,0.5)`
- **Dimmed Background** (뒷배경 어둡게)

**Use Case**: Quick View, Preview, 모달 페이지

```tsx
<Page role="Overlay">
  <Section role="Main">
    <Block role="Card">
      <Text>Preview Content</Text>
    </Block>
  </Section>
</Page>
```

---

### 6. Paper

**용도**: 인쇄용 고정 규격 문서

**물리 법칙**:
- `width: 210mm; min-height: 297mm` (A4 크기)
- **Fixed Aspect Ratio**
- Print-optimized

**Use Case**: 인보이스, 이력서, PDF 미리보기

```tsx
<Page role="Paper">
  <Section role="Header">
    <Text>Invoice #12345</Text>
  </Section>
  <Section role="Main">
    {/* 인보이스 내용 */}
  </Section>
</Page>
```

---

## 🗺️ PageLayout (공간 구획)

### 1. Single (기본값)

**구조**: 1단 레이아웃 (Header - Main - Footer)

**Grid Template**:
```css
grid-template-areas:
  "header"
  "main"
  "footer";
```

**Use Case**: 블로그 포스트, 단순 문서

```tsx
<Page layout="Single">
  <Section role="Header">Header</Section>
  <Section role="Main">Main Content</Section>
  <Section role="Footer">Footer</Section>
</Page>
```

---

### 2. Sidebar

**구조**: 2단 레이아웃 (Nav + Main)

**Grid Template**:
```css
grid-template-columns: 250px 1fr;
grid-template-areas:
  "header header"
  "nav    main"
  "nav    footer";
```

**Use Case**: 문서 사이트, 설정 페이지

```tsx
<Page layout="Sidebar">
  <Section role="Header">Header</Section>
  <Section role="Nav">Navigation</Section>
  <Section role="Main">Content</Section>
  <Section role="Footer">Footer</Section>
</Page>
```

**결과**:
```
┌─────────────────────┐
│      Header         │
├────────┬────────────┤
│  Nav   │   Main     │
│        │            │
├────────┴────────────┤
│      Footer         │
└─────────────────────┘
```

---

### 3. Aside

**구조**: 2단 레이아웃 (Main + Aside)

**Grid Template**:
```css
grid-template-columns: 1fr 300px;
grid-template-areas:
  "header header"
  "main   aside"
  "footer footer";
```

**Use Case**: 블로그 (우측 TOC), 문서 (우측 정보)

```tsx
<Page layout="Aside">
  <Section role="Header">Header</Section>
  <Section role="Main">Content</Section>
  <Section role="Aside">TOC / Info</Section>
  <Section role="Footer">Footer</Section>
</Page>
```

---

### 4. HolyGrail

**구조**: 3단 레이아웃 (Nav + Main + Aside)

**Grid Template**:
```css
grid-template-columns: 250px 1fr 300px;
grid-template-areas:
  "header header header"
  "nav    main   aside"
  "footer footer footer";
```

**Use Case**: 문서 사이트 (좌측 메뉴 + 우측 TOC)

```tsx
<Page layout="HolyGrail">
  <Section role="Header">Header</Section>
  <Section role="Nav">Navigation</Section>
  <Section role="Main">Content</Section>
  <Section role="Aside">TOC</Section>
  <Section role="Footer">Footer</Section>
</Page>
```

**결과**:
```
┌────────────────────────────┐
│         Header             │
├────────┬──────────┬────────┤
│  Nav   │   Main   │ Aside  │
│        │          │        │
├────────┴──────────┴────────┤
│         Footer             │
└────────────────────────────┘
```

---

### 5. Mobile

**구조**: 모바일 앱 레이아웃 (Header + Main + Dock)

**Grid Template**:
```css
grid-template-rows: auto 1fr auto;
grid-template-areas:
  "header"
  "main"
  "dock";
```

**Use Case**: 모바일 웹 앱

```tsx
<Page layout="Mobile">
  <Section role="Header">App Bar</Section>
  <Section role="Main" scrollable>Content</Section>
  <Section role="Dock">Bottom Tab Bar</Section>
</Page>
```

---

### 6. Split

**구조**: 분할 레이아웃 (50:50 또는 Master-Detail)

**Grid Template**:
```css
grid-template-columns: 1fr 1fr;
grid-template-areas: "left right";
```

**Use Case**: Master-Detail, 코드 비교

```tsx
<Page role="Application" layout="Split">
  <Section role="Master" scrollable>List</Section>
  <Section role="Detail" scrollable>Detail</Section>
</Page>
```

**결과**:
```
┌──────────┬──────────┐
│  Master  │  Detail  │
│          │          │
│          │          │
└──────────┴──────────┘
```

---

### 7. Studio

**구조**: IDE 스타일 다중 패널

**Grid Template**:
```css
grid-template-columns: 48px 250px 1fr 300px;
grid-template-rows: 1fr 300px 24px;
grid-template-areas:
  "activity sidebar editor secondary"
  "activity sidebar panel  secondary"
  "status   status  status status";
```

**Use Case**: IDE, Studio 앱

```tsx
<Page role="Application" layout="Studio">
  <Section role="ActivityBar">AB</Section>
  <Section role="PrimarySidebar" resizable>Sidebar</Section>
  <Section role="Editor" scrollable>Editor</Section>
  <Section role="Panel" resizable>Panel</Section>
  <Section role="Status">Status</Section>
</Page>
```

**결과**:
```
┌──┬────────┬──────────┬──────────┐
│AB│Sidebar │  Editor  │Secondary │
│  │        │          │          │
│  ├────────┼──────────┤          │
│  │ Sidebar│  Panel   │          │
├──┴────────┴──────────┴──────────┤
│         Status Bar              │
└─────────────────────────────────┘
```

---

## 🎨 Role × Layout 조합 이해

### Document + Sidebar

```tsx
<Page role="Document" layout="Sidebar">
  <Section role="Header">Header</Section>
  <Section role="Nav">Nav (Sticky)</Section>
  <Section role="Main">Main (Window Scroll)</Section>
</Page>
```

**동작**:
- Window Scroll (전체 페이지 스크롤)
- Nav는 sticky (스크롤 시 고정)
- 반응형 (콘텐츠 길이에 따라 높이 증가)

---

### Application + Studio

```tsx
<Page role="Application" layout="Studio">
  <Section role="ActivityBar">AB</Section>
  <Section role="PrimarySidebar">Sidebar (Fixed)</Section>
  <Section role="Editor" scrollable>Editor (Scroll)</Section>
  <Section role="Panel" scrollable>Panel (Scroll)</Section>
</Page>
```

**동작**:
- 100vh 고정 (전체 화면 채움)
- Editor와 Panel만 독립적으로 스크롤
- 나머지 Section은 고정

---

## 🎯 실전 패턴

### 1. 블로그 포스트 (Document + Single)

```tsx
function BlogPost() {
  return (
    <Page role="Document" layout="Single" maxWidth="4xl" centered>
      <Section role="Header">
        <Block role="Toolbar">
          <Text role="Title">My Blog</Text>
          <Action>Search</Action>
        </Block>
      </Section>

      <Section role="Main">
        <Block role="Stack">
          <Text role="Title" prominence="Hero">
            Getting Started with IDDL
          </Text>
          <Text role="Caption">
            Published on Jan 11, 2026 • 10 min read
          </Text>
          <Text role="Body">
            IDDL is an Intent-Driven Design Language...
          </Text>
        </Block>
      </Section>

      <Section role="Footer">
        <Text role="Caption" className="text-center">
          © 2026 My Blog
        </Text>
      </Section>
    </Page>
  );
}
```

---

### 2. 관리자 대시보드 (Application + Sidebar)

```tsx
function AdminDashboard() {
  return (
    <Page role="Application" layout="Sidebar">
      <Section role="Header">
        <Block role="Toolbar">
          <Text role="Title">Admin Dashboard</Text>
          <Block role="Spacer" />
          <Action role="IconButton" title="Settings"><Settings /></Action>
        </Block>
      </Section>

      <Section role="Nav" className="w-64">
        <Block role="List">
          <Action role="ListItem" selected>Dashboard</Action>
          <Action role="ListItem">Users</Action>
          <Action role="ListItem">Products</Action>
          <Action role="ListItem">Orders</Action>
        </Block>
      </Section>

      <Section role="Main" scrollable>
        <Block role="Grid" spec={{ columns: 3 }}>
          <Block role="Card">
            <Text role="Label">Total Users</Text>
            <Text role="Title" prominence="Hero">12,345</Text>
          </Block>
          <Block role="Card">
            <Text role="Label">Revenue</Text>
            <Text role="Title" prominence="Hero">$45,678</Text>
          </Block>
          <Block role="Card">
            <Text role="Label">Orders</Text>
            <Text role="Title" prominence="Hero">1,234</Text>
          </Block>
        </Block>
      </Section>
    </Page>
  );
}
```

---

### 3. 로그인 페이지 (Focus + Single)

```tsx
function LoginPage() {
  return (
    <Page role="Focus" maxWidth="md" centered>
      <Section role="Main">
        <Block role="Form" prominence="Strong" className="p-8">
          <Text role="Title" prominence="Strong">Sign In</Text>
          <Text role="Body" prominence="Subtle">
            Enter your credentials to continue
          </Text>

          <Field label="Email" dataType="email" required />
          <Field label="Password" dataType="password" required />

          <Block role="Toolbar" className="justify-end">
            <Action prominence="Standard">Cancel</Action>
            <Action prominence="Strong" intent="Positive">
              Sign In
            </Action>
          </Block>
        </Block>
      </Section>
    </Page>
  );
}
```

---

### 4. IDE (Application + Studio)

```tsx
function IDEPage() {
  return (
    <Page role="Application" layout="Studio">
      <Section role="ActivityBar">
        <Block role="Stack" className="items-center py-2">
          <Action role="IconButton" title="Explorer" selected>
            <Files size={24} />
          </Action>
          <Action role="IconButton" title="Search">
            <Search size={24} />
          </Action>
        </Block>
      </Section>

      <Section
        role="PrimarySidebar"
        resizable={{ direction: 'horizontal', minSize: 200, maxSize: 400 }}
        collapsible
      >
        <Block role="List">
          {/* 파일 트리 */}
        </Block>
      </Section>

      <Section role="Editor" scrollable>
        <Block role="Tabs">
          <Action role="Tab" selected>file1.tsx</Action>
        </Block>
        {/* 코드 에디터 */}
      </Section>

      <Section
        role="Panel"
        resizable={{ direction: 'vertical', minSize: 100, maxSize: 600 }}
        collapsible
      >
        <Block role="Tabs">
          <Action role="Tab" selected>Terminal</Action>
        </Block>
        {/* 터미널 */}
      </Section>

      <Section role="Status">
        <Text role="Label">Line 42, Column 10</Text>
      </Section>
    </Page>
  );
}
```

---

## 🚫 자주 하는 실수

### 실수 1: Page에 Block/Element 직접 배치

```tsx
// ❌ BAD - Page에 Block 직접 배치
<Page role="Document">
  <Block role="Form">
    <Field label="Name" dataType="text" />
  </Block>
</Page>

// ✅ GOOD - Section으로 감싸기
<Page role="Document">
  <Section role="Main">
    <Block role="Form">
      <Field label="Name" dataType="text" />
    </Block>
  </Section>
</Page>
```

**이유**: IDDL 계층 규칙: Page → Section → Block → Element

---

### 실수 2: Application인데 scrollable 누락

```tsx
// ❌ BAD - Application인데 Section에 scrollable 없음
<Page role="Application" layout="Sidebar">
  <Section role="Main">
    {/* 긴 콘텐츠 */}
  </Section>
</Page>

// ✅ GOOD - scrollable 명시
<Page role="Application" layout="Sidebar">
  <Section role="Main" scrollable>
    {/* 긴 콘텐츠 */}
  </Section>
</Page>
```

**이유**: Application은 100vh 고정이므로 내부 스크롤 필요.

---

### 실수 3: Role과 Layout 불일치

```tsx
// ❌ BAD - Focus인데 Nav, Aside 사용
<Page role="Focus" layout="HolyGrail">
  <Section role="Nav">Nav</Section>
  <Section role="Main">Main</Section>
  <Section role="Aside">Aside</Section>
</Page>

// ✅ GOOD - Focus는 Single layout만
<Page role="Focus" layout="Single">
  <Section role="Main">Main</Section>
</Page>
```

**이유**: Focus는 단일 행동 집중 페이지로 Nav/Aside 불필요.

---

### 실수 4: Document에 height 100vh 적용

```tsx
// ❌ BAD - Document에 height 제한
<Page role="Document" className="h-screen">
  ...
</Page>

// ✅ GOOD - Document는 min-height만
<Page role="Document">
  ...
</Page>
```

**이유**: Document는 콘텐츠 길이에 따라 자동 증가해야 함.

---

### 실수 5: maxWidth를 Application에 적용

```tsx
// ❌ BAD - Application에 maxWidth 제한
<Page role="Application" maxWidth="lg">
  ...
</Page>

// ✅ GOOD - maxWidth는 Document용
<Page role="Document" maxWidth="lg" centered>
  ...
</Page>
```

**이유**: Application은 전체 화면을 채워야 함.

---

## 📝 실습: 문서 사이트 레이아웃

### 요구사항

다음 요구사항을 만족하는 문서 사이트를 만드세요:

1. **Page**:
   - Document role (window scroll)
   - HolyGrail layout (3단)
   - 최대 너비 7xl, 중앙 정렬

2. **구조**:
   - Header: 제목 + 검색 버튼
   - Nav: 좌측 목차 (200-400px, resizable)
   - Main: 메인 콘텐츠 (scrollable)
   - Aside: 우측 "On This Page" (고정 300px)
   - Footer: 저작권 정보

### 정답 예시

```tsx
function DocsPage() {
  return (
    <Page role="Document" layout="HolyGrail" maxWidth="7xl" centered>
      {/* Header */}
      <Section role="Header">
        <Block role="Toolbar">
          <Text role="Title" prominence="Strong">
            IDDL Documentation
          </Text>
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
          <Text role="Title" prominence="Standard">Contents</Text>
          <Block role="List">
            <Action role="ListItem" selected>Introduction</Action>
            <Action role="ListItem">Getting Started</Action>
            <Action role="ListItem">Components</Action>
          </Block>
        </Block>
      </Section>

      {/* Main */}
      <Section role="Main" scrollable>
        <Block role="Stack" className="max-w-3xl mx-auto">
          <Text role="Title" prominence="Hero">
            Introduction
          </Text>
          <Text role="Body">
            IDDL is an Intent-Driven Design Language...
          </Text>
        </Block>
      </Section>

      {/* Aside */}
      <Section role="Aside" className="w-[300px]">
        <Block role="Stack">
          <Text role="Title" prominence="Standard">On This Page</Text>
          <Block role="List">
            <Action role="Link">What is IDDL?</Action>
            <Action role="Link">Core Concepts</Action>
            <Action role="Link">Quick Start</Action>
          </Block>
        </Block>
      </Section>

      {/* Footer */}
      <Section role="Footer">
        <Text role="Caption" className="text-center">
          © 2026 IDDL Documentation
        </Text>
      </Section>
    </Page>
  );
}
```

**체크리스트**:
- [ ] Document role + HolyGrail layout?
- [ ] maxWidth 7xl, centered?
- [ ] 5개 Section (Header, Nav, Main, Aside, Footer)?
- [ ] Nav resizable (200-400px)?
- [ ] Aside 고정 300px?

---

## 💡 고급 기능

### 1. Loading State

```tsx
<Page role="Document" loading={true}>
  {/* 자동으로 로딩 스피너 표시 */}
</Page>
```

---

### 2. Error State

```tsx
<Page role="Document" error="Failed to load page">
  {/* 자동으로 에러 메시지 표시 */}
</Page>
```

---

### 3. Custom Max Width

```tsx
<Page role="Document" maxWidth={1200} centered>
  {/* 커스텀 너비 (1200px) */}
</Page>
```

---

## ✅ 이 문서를 읽고 나면

- [x] Page의 역할을 이해했다
- [x] 6가지 PageRole과 물리 법칙을 파악했다
- [x] 7가지 PageLayout과 Grid Template을 이해했다
- [x] Role × Layout 조합을 활용할 수 있다
- [x] 실전 패턴 (블로그, 대시보드, 로그인, IDE)을 익혔다

---

## 🔗 다음 단계

[Overlay 컴포넌트](./07-overlay.md) - Dialog, Drawer, Toast, Tooltip

---

**최종 업데이트**: 2026-01-11
**난이도**: 고급
**예상 소요 시간**: 30분
