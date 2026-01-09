# Page vs App 분리 설계 (2025-01-09)

## 핵심 개념

### App (Application Root)
- **역할:** 전체 애플리케이션의 루트 컨테이너
- **특징:**
  - Full screen (h-screen w-screen)
  - Overflow hidden (스크롤 없음)
  - Section들을 직접 배치하는 레이아웃 컨테이너
  - 주로 `flex` 또는 `grid` 사용

### Page (Document/Content Page)
- **역할:** 스크롤 가능한 콘텐츠 페이지
- **특징:**
  - Full height (h-full)
  - Overflow auto (스크롤 가능)
  - 중앙 정렬, max-width 제한 가능
  - 주로 `flex column` 사용

---

## 사용 사례 분석

### 1. IDE/Studio App (Showcase)

**요구사항:**
- Full screen, 고정 레이아웃
- 스크롤 없음 (각 Section이 자체 스크롤)
- Toolbar (상단) + Sidebar (좌) + Editor (중앙) + Panel (우)

**Layout:**
```
┌─────────────────────────────────┐
│        Toolbar (고정)            │
├──────┬──────────────────┬───────┤
│      │                  │       │
│ Side │     Editor       │ Panel │
│ bar  │   (스크롤 가능)    │ (스크롤)│
│      │                  │       │
└──────┴──────────────────┴───────┘
```

**해결책: App + Grid**
```tsx
<App layout="grid" template="studio">
  <Section role="Toolbar">...</Section>
  <Section role="PrimarySidebar">...</Section>
  <Section role="Editor">...</Section>
  <Section role="SecondarySidebar">...</Section>
</App>
```

**CSS Grid Template:**
```css
grid-template-rows: auto 1fr;
grid-template-columns: 250px 1fr 300px;
grid-template-areas:
  "toolbar toolbar toolbar"
  "sidebar editor panel";
```

---

### 2. Dashboard App

**요구사항:**
- Full screen
- 헤더 고정, 콘텐츠 스크롤 가능

**Layout:**
```
┌─────────────────────────────────┐
│        Header (고정)             │
├─────────────────────────────────┤
│                                  │
│     Main Content (스크롤)         │
│                                  │
└─────────────────────────────────┘
```

**해결책: App + Flex Column**
```tsx
<App layout="flex" direction="column">
  <Section role="Header">...</Section>
  <Section role="Container" className="flex-1 overflow-y-auto">
    <Group role="Grid" layout="grid">
      {cards}
    </Group>
  </Section>
</App>
```

---

### 3. Document Page

**요구사항:**
- 전체 페이지 스크롤
- 중앙 정렬, max-width 제한
- Breadcrumbs + Title + Content

**Layout:**
```
┌─────────────────────────────────┐
│    Breadcrumbs                   │
├─────────────────────────────────┤
│    Title                         │
├─────────────────────────────────┤
│                                  │
│    Content (스크롤)               │
│    max-w-4xl, centered           │
│                                  │
└─────────────────────────────────┘
```

**해결책: Page + Flex Column**
```tsx
<Page layout="flex" direction="column" maxWidth="4xl" centered>
  <Section role="Container">
    <Text role="Body">Breadcrumbs...</Text>
  </Section>
  <Section role="Container">
    <Text role="Title">Page Title</Text>
  </Section>
  <Section role="Container">
    {content}
  </Section>
</Page>
```

---

### 4. Settings Page (Sidebar + Content)

**요구사항:**
- 전체 페이지 스크롤
- 왼쪽 네비게이션 + 오른쪽 콘텐츠

**해결책: Page + Grid**
```tsx
<Page layout="grid" template="sidebar">
  <Section role="Navigator">...</Section>
  <Section role="Container">...</Section>
</Page>
```

---

## 설계 결정

### App vs Page 구분 기준

| 구분 | App | Page |
|------|-----|------|
| **용도** | Application root | Content page |
| **높이** | `h-screen` (100vh) | `h-full` (부모에 맞춤) |
| **스크롤** | `overflow-hidden` | `overflow-y-auto` |
| **레이아웃** | Section들을 배치 | Content를 담음 |
| **예시** | IDE, Studio, Dashboard | Document, Blog, Settings |

### Layout 시스템

**공통 Props:**
```typescript
interface LayoutProps {
  layout: 'flex' | 'grid';

  // flex 전용
  direction?: 'row' | 'column';
  gap?: number;

  // grid 전용
  template?: 'studio' | 'sidebar' | 'dashboard' | '3-col' | 'custom';
  gridTemplateAreas?: string;
  gridTemplateRows?: string;
  gridTemplateColumns?: string;
}
```

### 스크롤 전략

**App (No Scroll):**
- Container 자체는 스크롤 없음
- 각 Section이 개별 스크롤
- `overflow-hidden` 필수

**Page (Full Scroll):**
- Container 전체가 스크롤
- Section들은 스크롤 없음 (콘텐츠에 따라 늘어남)
- `overflow-y-auto` 기본

**Mixed (App + Scrollable Section):**
```tsx
<App layout="grid" template="studio">
  <Section role="Toolbar">...</Section>  {/* 고정 */}
  <Section role="Editor" className="overflow-y-auto">  {/* 스크롤 */}
    {longContent}
  </Section>
</App>
```

---

## Grid Templates 정의

### 1. Studio Template
```css
.grid-template-studio {
  height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-template-columns: 250px 1fr 300px;
  grid-template-areas:
    "toolbar toolbar toolbar"
    "sidebar editor panel";
  gap: 0;
}
```

**사용:**
```tsx
<App layout="grid" template="studio">
  <Section role="Toolbar" gridArea="toolbar">...</Section>
  <Section role="PrimarySidebar" gridArea="sidebar">...</Section>
  <Section role="Editor" gridArea="editor">...</Section>
  <Section role="SecondarySidebar" gridArea="panel">...</Section>
</App>
```

### 2. Sidebar Template
```css
.grid-template-sidebar {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 0;
}
```

### 3. Dashboard Template
```css
.grid-template-dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}
```

### 4. 3-Column Template
```css
.grid-template-3col {
  display: grid;
  grid-template-columns: 250px 1fr 250px;
  gap: 0;
}
```

---

## 최종 API 제안

### App 컴포넌트
```tsx
interface AppProps {
  // Layout
  layout: 'flex' | 'grid';
  direction?: 'row' | 'column';  // flex only
  template?: 'studio' | 'sidebar' | '3-col';  // grid only

  // Design Tokens
  prominence?: Prominence;
  density?: Density;
  intent?: Intent;

  // React
  children: ReactNode;
  className?: string;
}

// 사용 예시
<App layout="grid" template="studio">
  <Section role="Toolbar">...</Section>
  <Section role="PrimarySidebar">...</Section>
  <Section role="Editor">...</Section>
  <Section role="SecondarySidebar">...</Section>
</App>

<App layout="flex" direction="column">
  <Section role="Header">...</Section>
  <Section role="Container">...</Section>
</App>
```

### Page 컴포넌트
```tsx
interface PageProps {
  // Layout
  layout?: 'flex' | 'grid';
  direction?: 'row' | 'column';  // flex only
  template?: 'sidebar' | 'dashboard';  // grid only

  // Constraints
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'none';
  centered?: boolean;

  // Design Tokens
  prominence?: Prominence;
  density?: Density;
  intent?: Intent;

  // Meta (optional)
  title?: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];

  // React
  children: ReactNode;
  className?: string;
}

// 사용 예시
<Page layout="flex" direction="column" maxWidth="4xl" centered>
  <Section role="Container">
    <Text role="Title">Document Title</Text>
  </Section>
  <Section role="Container">
    {content}
  </Section>
</Page>

<Page layout="grid" template="sidebar">
  <Section role="Navigator">...</Section>
  <Section role="Container">...</Section>
</Page>
```

---

## 구현 체크리스트

- [x] App 컴포넌트 신규 작성
  - [x] AppProps 타입 정의
  - [x] flex/grid variants (CVA)
  - [x] grid templates (studio, sidebar, 3-col)
  - [x] h-screen, overflow-hidden 강제

- [x] Page 컴포넌트 리팩토링
  - [x] `<main>` 태그 제거
  - [x] flex/grid로 단순화
  - [x] maxWidth, centered 지원
  - [x] h-full, overflow-y-auto 기본

- [x] Grid Template CSS 작성
  - [x] studio template
  - [x] sidebar template
  - [x] 3-col template
  - [x] dashboard template

- [x] Section에 gridArea prop 추가
  - [x] SectionProps에 gridArea?: string
  - [x] data-grid-area 속성 출력

- [x] Showcase 앱 마이그레이션
  - [x] `<Page layout="studio">` → `<App layout="grid" template="studio">`
  - [x] Section에 gridArea 추가

- [ ] 명세 문서 업데이트
  - [ ] App vs Page 구분 설명
  - [ ] Layout 시스템 문서화
  - [ ] Grid templates 문서화

## 완료 상태 (2025-01-09)

모든 구현이 완료되었습니다!

**구현된 파일:**
- `/src/components/types/App/App.tsx` - App 컴포넌트
- `/src/components/types/App/grid-templates.css` - Grid templates CSS
- `/src/components/types/Page/Page.tsx` - 리팩토링된 Page 컴포넌트
- `/src/components/types/Section/Section.tsx` - gridArea 지원 추가
- `/src/components/types/Item/types.ts` - AppProps, GridTemplate 타입 추가
- `/src/apps/showcase/pages/showcase/ShowcaseApp.tsx` - App 컴포넌트로 마이그레이션

**사용 예시:**
```tsx
// Showcase App
<App layout="grid" template="studio">
  <Section role="Toolbar" gridArea="toolbar">...</Section>
  <Section role="PrimarySidebar" gridArea="sidebar">...</Section>
  <Section role="Editor" gridArea="editor">...</Section>
  <Section role="SecondarySidebar" gridArea="panel">...</Section>
</App>
```

---

## 예상 파일 구조

```
src/components/types/
├── App/
│   ├── App.tsx           # 새로운 App 컴포넌트
│   └── grid-templates.css  # Grid template 정의
├── Page/
│   └── Page.tsx          # 리팩토링된 Page
├── Section/
│   └── Section.tsx       # gridArea prop 추가
└── Item/
    └── types.ts          # AppProps, PageProps 타입
```

---

## 다음 단계

1. App 컴포넌트 먼저 구현
2. Grid templates CSS 작성
3. Page 리팩토링 (main 제거)
4. Showcase 마이그레이션
5. 명세 문서 업데이트

이 설계로 진행할까요?
