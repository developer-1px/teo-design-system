# Purpose-Based Design System

**디자인을 못하는 사람을 위한 Why 기반 디자인 시스템**

---

## 철학

### 기존 디자인 시스템의 문제점

```tsx
// ❌ How를 일일이 결정해야 함
<button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md font-semibold">
  Save
</button>
```

개발자가 결정해야 하는 것들:
- 색상은 무슨 색?
- 크기는 얼마나?
- 여백은?
- 그림자는?
- 글꼴 굵기는?

**→ 디자인 결정이 너무 많음**

### Purpose-Based 접근

```tsx
// ✅ Why만 설명하면 됨
<Group purpose="action" prominence={1}>
  <Item>Save</Item>
</Group>
```

개발자가 하는 일:
1. **그룹화**: 이 영역의 역할은? → `purpose="action"`
2. **주목도**: 얼마나 중요한가? → `prominence={1}`

**→ 시스템이 나머지를 자동으로 결정**

---

## 이론적 배경

### 1. Gestalt 원칙 (그룹핑의 심리학)

| 원칙 | 설명 | 시스템 적용 |
|------|------|-------------|
| **Proximity** | 가까운 것끼리 그룹으로 인식 | 구획의 기본 원리 |
| **Similarity** | 비슷하게 생긴 것끼리 그룹 | 같은 prominence는 같은 스타일 |
| **Common Region** | 경계 안의 것들을 그룹으로 인식 | Container/Section의 근거 |
| **Figure/Ground** | 중요한 것과 배경을 구분 | Depth와 prominence의 근거 |

### 2. LATCH (정보 조직화)

Richard Saul Wurman의 정보 구조화 5가지 방법:
- **L**ocation (위치)
- **A**lphabet (알파벳)
- **T**ime (시간)
- **C**ategory (카테고리)
- **H**ierarchy (위계) ← **우리의 prominence**

### 3. Visual Hierarchy (시각적 위계)

prominence를 표현하는 수단들:
- Scale (크기)
- Color/Contrast (색상/대비)
- Typography weight (글꼴 굵기)
- Spacing (여백)
- Depth/Shadow (깊이/그림자)

**우리 시스템의 혁신**: 이 모든 것을 자동화

---

## 시스템 구조

### 1. 그룹 타입 (Group Type)

구조적 역할 기준 분류:

| 타입 | 역할 | 특징 | 예시 |
|------|------|------|------|
| **Page** | 화면 전체 | 최상위 컨테이너 | 홈, 설정, 프로필 |
| **Region** | 구조적 영역 | header, main, sidebar, footer | 앱 레이아웃 구조 |
| **Section** | 의미 단위 구역 | 하나의 목적/주제 | "최근 주문", "추천 상품" |
| **Group** | 관련 항목 집합 | 함께 동작하거나 읽히는 것들 | 폼 필드 묶음, 버튼 그룹 |
| **Item** | 개별 단위 | 더 쪼갤 필요 없는 최소 단위 | 카드 하나, 리스트 아이템 |

### 2. Purpose (목적)

"이 그룹이 왜 존재하는가?"

| Purpose | 의미 | 예시 |
|---------|------|------|
| **navigation** | 다른 곳으로 이동하기 위해 | 메뉴, 탭, 브레드크럼 |
| **action** | 무언가를 실행하기 위해 | CTA 버튼, 버튼 그룹, 툴바 |
| **form** | 데이터를 입력받기 위해 | 입력 필드, 폼 그룹, 검색바 |
| **content** | 정보를 전달하기 위해 | 텍스트 블록, 설명, 아티클 |
| **list** | 여러 항목을 보여주기 위해 | 카드 리스트, 테이블, 피드 |
| **media** | 시각적 콘텐츠를 보여주기 위해 | 이미지, 비디오, 갤러리 |
| **status** | 현재 상태를 알려주기 위해 | 알림, 뱃지, 프로그레스 |
| **info** | 부가 정보를 제공하기 위해 | 힌트, 툴팁, 캡션, 푸터 |

### 3. Prominence (주목도)

"얼마나 중요한가?"

| 레벨 | 이름 | 의미 |
|------|------|------|
| **1** | Primary | 가장 먼저 봐야 할 것 |
| **2** | Secondary | 그 다음으로 중요한 것 |
| **3** | Tertiary | 보조적인 것, 있으면 좋은 것 |

---

## 디자인 토큰 (최소화)

### Color (6개)

```typescript
// Foreground
foreground-1: 가장 진함 (텍스트 기본)
foreground-2: 중간 (보조 텍스트)
foreground-3: 연함 (비활성, 힌트)

// Background
background: 배경
surface: 카드/섹션 배경 (선택적)

// Accent
accent: 강조색 1개 (action용)
```

### Typography (4단계)

```typescript
text-xl:  제목 (1.5rem)
text-lg:  소제목 (1.25rem)
text-md:  본문 (1rem)
text-sm:  캡션 (0.875rem)
```

### Font Weight (2단계)

```typescript
weight-normal: 400
weight-bold:   600
```

### Spacing (4단계)

```typescript
space-xs: 4px
space-sm: 8px
space-md: 16px
space-lg: 32px
```

**총 토큰 수: 16개** (최소화)

---

## Prominence → 토큰 매핑

### prominence: 1 (Primary)
```typescript
color:   foreground-1
size:    text-lg 또는 text-xl
weight:  weight-bold
spacing: space-md 또는 space-lg
```

### prominence: 2 (Secondary)
```typescript
color:   foreground-1
size:    text-md
weight:  weight-normal
spacing: space-sm 또는 space-md
```

### prominence: 3 (Tertiary)
```typescript
color:   foreground-2 또는 foreground-3
size:    text-sm
weight:  weight-normal
spacing: space-xs 또는 space-sm
```

---

## Purpose → UI 패턴 매핑

| Purpose | prominence: 1 | prominence: 2 | prominence: 3 |
|---------|---------------|---------------|---------------|
| **navigation** | Primary Nav, Tab Bar | Secondary Nav | Footer Nav, Breadcrumb |
| **action** | Primary Button, CTA | Secondary Button | Text Link, Icon Button |
| **form** | Main Input, Search | Optional Field | Hidden/Advanced |
| **content** | Hero Text, Headline | Body Text, Paragraph | Caption, Fine Print |
| **list** | Card Grid, Featured | List View, Table | Compact List |
| **media** | Hero Image, Video | Thumbnail, Gallery | Icon, Avatar |
| **status** | Alert, Banner | Badge, Tag | Dot, Indicator |
| **info** | Callout, Notice | Hint, Help Text | Tooltip, Footnote |

---

## 시멘틱 HTML 매핑

### Group Type → HTML

| Type | HTML Element |
|------|--------------|
| **Page** | `<body>` 또는 `<div id="app">` |
| **Region(header)** | `<header>` |
| **Region(main)** | `<main>` |
| **Region(sidebar)** | `<aside>` |
| **Region(footer)** | `<footer>` |
| **Section** | `<section>` |
| **Group** | `<div>` 또는 목적에 맞는 태그 |
| **Item** | 내용에 따라 결정 |

### Purpose → HTML

| Purpose | HTML Element | Role/Attribute |
|---------|--------------|----------------|
| **navigation** | `<nav>` | `role="navigation"` |
| **action** | `<button>` | `type="button"` |
| **form** | `<form>`, `<input>`, `<label>` | `role="form"` |
| **content** | `<article>`, `<p>`, `<h1-6>` | - |
| **list** | `<ul>`, `<ol>`, `<li>` | `role="list"` |
| **media** | `<figure>`, `<img>` | `alt` 필수 |
| **status** | `<output>` | `role="status"`, `aria-live` |
| **info** | `<aside>`, `<small>` | `role="complementary"` |

---

## 키보드 접근성

### Focus 표시

```css
:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
```

### 탭 순서 = prominence 순서

```
prominence: 1 → 먼저 탭
prominence: 2 → 그 다음
prominence: 3 → 마지막 (또는 tabindex="-1")
```

### Purpose별 키보드 동작

| Purpose | 키보드 동작 |
|---------|------------|
| **navigation** | ← → 화살표로 이동 |
| **action** | Enter/Space로 실행 |
| **form** | Tab으로 필드 이동 |
| **list** | ↑ ↓ 화살표로 항목 이동 |

---

## 사용 예시

### 기본 문법

```tsx
Page
├── Region(type: header)
│   ├── Group(purpose: navigation, prominence: 1)
│   └── Group(purpose: action, prominence: 2)
│
├── Region(type: main)
│   ├── Section(prominence: 1)
│   │   ├── Group(purpose: content, prominence: 1)
│   │   └── Group(purpose: action, prominence: 1)
│   │
│   ├── Section(prominence: 2)
│   │   ├── Group(purpose: content, prominence: 1)
│   │   └── Group(purpose: list, prominence: 2)
│   │
│   └── Section(prominence: 3)
│       └── Group(purpose: info, prominence: 3)
│
└── Region(type: footer)
    ├── Group(purpose: navigation, prominence: 3)
    └── Group(purpose: info, prominence: 3)
```

### 실제 코드 예시

```tsx
// Hero 섹션
<Section prominence={1}>
  <Group purpose="content" prominence={1}>
    <Item as="h1">메인 제목</Item>
    <Item as="p" prominence={2}>설명 텍스트</Item>
  </Group>

  <Group purpose="action" prominence={1}>
    <Item as="button">시작하기</Item>
    <Item as="button" prominence={2}>더 알아보기</Item>
  </Group>
</Section>

// 기능 소개 섹션
<Section prominence={2}>
  <Group purpose="content" prominence={1}>
    <Item as="h2">주요 기능</Item>
  </Group>

  <Group purpose="list" prominence={2}>
    {features.map(feature => (
      <Item key={feature.id}>
        <h3>{feature.title}</h3>
        <p prominence={3}>{feature.description}</p>
      </Item>
    ))}
  </Group>
</Section>
```

---

## 시스템이 자동으로 하는 일

개발자가 선언:
```tsx
<Group purpose="action" prominence={1}>
  <Item>Save</Item>
</Group>
```

시스템이 판단:
```
"행동을 위한 것 + 가장 중요"
→ Primary Button 스타일 제안
```

시스템이 적용:
- 강조색 배경 (`accent`)
- 큰 사이즈 (`text-lg`)
- 높은 대비 (`foreground-1`)
- 넉넉한 패딩 (`space-md`)
- 시멘틱 HTML (`<button>`)
- 키보드 접근성 (focus, Enter/Space)
- 탭 순서 (prominence 기반)

---

## 부모-자식 관계 규칙

### 상대적 주목도

자식의 prominence는 부모의 맥락 안에서 해석된다:

```tsx
// Section A (prominence: 1)
<Section prominence={1}>
  <Group prominence={1}>  {/* 전체에서 가장 중요 */}
  <Group prominence={2}>  {/* 전체에서 두 번째 */}
</Section>

// Section B (prominence: 2)
<Section prominence={2}>
  <Group prominence={1}>  {/* 이 Section 안에서는 가장 중요하지만 */}
                         {/* Section A의 prominence:1보다는 약함 */}
</Section>
```

### Depth와 Prominence의 조합

- **Depth**: 물리적 계층 구조 (Layer System 0-6)
- **Prominence**: 같은 depth 내에서의 중요도

```tsx
<Layout depth={2}>  {/* 사이드바 */}
  <Group prominence={1}>중요한 링크</Group>
  <Group prominence={2}>일반 링크</Group>

  <Layout depth={3}>  {/* 사이드바 내부 패널 */}
    <Group prominence={1}>패널 제목</Group>
    <Group prominence={2}>패널 내용</Group>
  </Layout>
</Layout>
```

---

## Before/After 비교

### Before (How 기반)

```tsx
// ❌ 디자인 결정이 너무 많음
<div className="flex flex-col gap-4">
  <h1 className="text-2xl font-bold text-gray-900">
    제목
  </h1>
  <p className="text-base text-gray-600 leading-relaxed">
    설명
  </p>
  <div className="flex gap-2">
    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
      시작하기
    </button>
    <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200">
      더 알아보기
    </button>
  </div>
</div>
```

### After (Why 기반)

```tsx
// ✅ 그룹화 + 주목도만 지정
<Section prominence={1}>
  <Group purpose="content">
    <Item prominence={1}>제목</Item>
    <Item prominence={2}>설명</Item>
  </Group>

  <Group purpose="action">
    <Item prominence={1}>시작하기</Item>
    <Item prominence={2}>더 알아보기</Item>
  </Group>
</Section>
```

---

## 마이그레이션 가이드

### 1단계: 구조 파악

기존 코드를 보고 "왜 존재하는가?"를 판단:

```tsx
// Before
<div className="header">
  <nav>메뉴</nav>
  <button>로그인</button>
</div>
```

분석:
- header → `Region(type: header)`
- nav → `Group(purpose: navigation)`
- button → `Group(purpose: action)`

### 2단계: 주목도 판단

"얼마나 중요한가?"를 판단:

```tsx
// Before
<h1>메인 제목</h1>        // 가장 중요 → prominence: 1
<p>설명</p>               // 보조 → prominence: 2
<small>메타 정보</small>   // 덜 중요 → prominence: 3
```

### 3단계: 변환

```tsx
// After
<Region type="header">
  <Group purpose="navigation" prominence={1}>메뉴</Group>
  <Group purpose="action" prominence={2}>로그인</Group>
</Region>

<Section prominence={1}>
  <Item prominence={1}>메인 제목</Item>
  <Item prominence={2}>설명</Item>
  <Item prominence={3}>메타 정보</Item>
</Section>
```

---

## 요약

### 개발자가 하는 일

1. **그룹화**: 이 영역의 역할은? (purpose)
2. **주목도**: 얼마나 중요한가? (prominence)

### 시스템이 하는 일

1. purpose × prominence → 적절한 UI 패턴 제안
2. 토큰 자동 적용 (색상, 크기, 간격 등)
3. 시멘틱 HTML 생성
4. 키보드 접근성 설정
5. 일관된 시각적 계층 유지

---

**Why를 설명하면 How는 시스템이 알아서 해결한다.**