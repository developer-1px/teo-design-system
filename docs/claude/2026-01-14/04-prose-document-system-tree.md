# Prose Document System Tree

## 왜 ProseDocument와 ProseSection이 필요한가?

### 문제 정의

일반적인 **블로그 글, 문서, 랜딩 페이지**를 만들 때 반복되는 패턴:

1. **가독성을 위한 중앙 정렬 + 최대 너비 제한**
   - 전체 화면 너비로 텍스트를 표시하면 가독성이 떨어짐
   - 최적 읽기 너비: 600-800px (60-80 글자)
   - 중앙 정렬: `margin: 0 auto`

2. **전체 너비 섹션 + 내부 중앙 콘텐츠**
   - 배경색/이미지는 전체 너비
   - 텍스트는 중앙 제한 너비

3. **수직 리듬 (Vertical Rhythm)**
   - 단락 간 일관된 간격
   - 제목과 본문 간 적절한 여백

### 해결책: 문서 레이아웃 추상화

```
문서 구조의 계층
│
├── ProseSection (Full-Width Container)
│   └── ProseDocument (Max-Width Centered Content)
│       └── Prose Elements (Text Content)
```

---

## 시스템 구조

```
Prose Document System
│
├── ProseSection            전체 너비 섹션 컨테이너
│   ├── layout="centered"   (기본) 내부에 ProseDocument 자동 생성
│   ├── layout="full"       자유 레이아웃 (ProseDocument 없음)
│   ├── p="80 0"            섹션 패딩 (수직 여백)
│   └── w=Size.full         전체 너비
│
├── ProseDocument           중앙 정렬 콘텐츠 래퍼
│   ├── maxWidth            최대 너비 제한 (가독성)
│   │   ├── Container.n640  (640px) - 좁은 글
│   │   ├── Container.n800  (800px) - 기본 (블로그)
│   │   └── Container.n1024 (1024px) - 넓은 문서
│   ├── gap                 자식 요소 간 간격 (수직 리듬)
│   ├── p="0 6"             좌우 패딩 (모바일 여백)
│   └── marginLeft/Right="auto"  중앙 정렬
│
└── Prose Elements          실제 텍스트 요소
    ├── Text.Prose.Title    제목 (h1-h4)
    ├── Text.Prose.Body     본문 단락
    ├── Text.Prose.Note     주석/캡션
    └── Text.Prose.Code     코드 블록
```

---

## 사용 패턴

### Pattern 1: 기본 문서 (Centered Layout)

**용도**: 블로그 글, 문서, 기사

```tsx
<ProseSection p="80 0" layout="centered">
  {/* ProseDocument가 자동으로 생성됨 */}
  <Text.Prose.Title variant="xl">Article Title</Text.Prose.Title>
  <Text.Prose.Body>
    First paragraph of the article...
  </Text.Prose.Body>
  <Text.Prose.Body>
    Second paragraph...
  </Text.Prose.Body>
</ProseSection>
```

**렌더링 결과**:
```
┌────────────────────────────────────────────────────┐
│ (Full Width Section - p="80 0")                    │
│                                                    │
│        ┌─────────────────────────┐                │
│        │ (Max-Width: 800px)      │                │
│        │ Article Title           │                │
│        │                         │                │
│        │ First paragraph of the  │                │
│        │ article...              │                │
│        │                         │                │
│        │ Second paragraph...     │                │
│        └─────────────────────────┘                │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

### Pattern 2: 명시적 ProseDocument (커스텀 너비)

**용도**: 다양한 콘텐츠 너비 요구사항

```tsx
<Frame layout={Layout.Base.Default} fill overflow="auto">
  <ProseSection p="80 0" layout="full">
    <ProseDocument maxWidth={Container.n1024} gap={12}>
      <Text.Prose.Title>Wide Document</Text.Prose.Title>
      <Text.Prose.Body>
        This document uses a wider max-width for better
        layout with images and diagrams.
      </Text.Prose.Body>
    </ProseDocument>
  </ProseSection>
</Frame>
```

**ProseDocument 너비 가이드**:
- `Container.n640` (640px) - 좁은 글, 시 (40-50 글자/줄)
- `Container.n800` (800px) - **기본**, 블로그 글 (60-70 글자/줄)
- `Container.n1024` (1024px) - 기술 문서, 튜토리얼 (80+ 글자/줄)

---

### Pattern 3: Full Width Section (배경 + 중앙 콘텐츠)

**용도**: Hero 섹션, 배경 이미지가 있는 섹션

```tsx
<ProseSection
  p="120 0"
  layout="centered"
  surface="primary"  // 전체 너비 배경
>
  {/* 텍스트는 자동으로 중앙 제한 너비 */}
  <Text.Prose.Title variant="xl" style={{ textAlign: "center" }}>
    Hero Title
  </Text.Prose.Title>
  <Text.Prose.Body style={{ textAlign: "center" }}>
    Tagline text here
  </Text.Prose.Body>
</ProseSection>
```

**렌더링 결과**:
```
┌────────────────────────────────────────────────────┐
│ ████████████████████████████████████████████████ │ ← 전체 너비 배경
│ ████                                    ████████ │
│ ████    ┌─────────────────────┐        ████████ │
│ ████    │   Hero Title        │        ████████ │
│ ████    │   Tagline text here │        ████████ │
│ ████    └─────────────────────┘        ████████ │
│ ████                                    ████████ │
│ ████████████████████████████████████████████████ │
└────────────────────────────────────────────────────┘
```

---

### Pattern 4: Multiple Sections (랜딩 페이지)

**용도**: 여러 섹션이 있는 랜딩 페이지

```tsx
<Frame layout={Layout.Base.Default} fill overflow="auto">
  {/* Hero Section */}
  <ProseSection p="120 0" layout="centered" surface="primary">
    <Text.Prose.Title variant="xl">Welcome</Text.Prose.Title>
    <Text.Prose.Body>Introduction text</Text.Prose.Body>
  </ProseSection>

  {/* Feature Section */}
  <ProseSection p="80 0" layout="centered" surface="base">
    <Text.Prose.Title variant="lg">Features</Text.Prose.Title>
    <Text.Prose.Body>Feature description</Text.Prose.Body>
  </ProseSection>

  {/* Footer Section */}
  <ProseSection p="60 0" layout="centered" surface="sunken">
    <Text.Prose.Body>Footer content</Text.Prose.Body>
  </ProseSection>
</Frame>
```

---

## 핵심 개념 비교

### ProseSection vs Frame

| Feature | ProseSection | Frame |
|---------|-------------|-------|
| **목적** | 문서의 논리적 섹션 | 범용 레이아웃 컨테이너 |
| **너비** | 항상 전체 너비 (w=full) | 지정 필요 |
| **패딩** | 수직 위주 (p="80 0") | 자유 지정 |
| **자식 제한** | 자동 ProseDocument 생성 가능 | 없음 |
| **사용 사례** | 블로그 섹션, 랜딩 페이지 | 모든 레이아웃 |

### ProseDocument vs Frame

| Feature | ProseDocument | Frame |
|---------|--------------|-------|
| **목적** | 읽기 콘텐츠 중앙 정렬 | 범용 레이아웃 |
| **maxWidth** | 기본값 있음 (800px) | 지정 필요 |
| **중앙 정렬** | 자동 (margin: auto) | 수동 지정 |
| **좌우 패딩** | 기본값 있음 (p="0 6") | 지정 필요 |
| **gap** | 기본값 있음 (4) | 지정 필요 |
| **사용 사례** | 읽기 콘텐츠 래퍼 | 모든 레이아웃 |

---

## 디자인 의사 결정

### Q1: 언제 ProseSection을 사용하는가?

```
START: 페이지에 콘텐츠를 추가해야 함

├─ Q: 전체 너비 배경/구분이 필요한가?
│  ├─ Yes → ProseSection 사용
│  │   ├─ Q: 중앙 제한 너비가 필요한가?
│  │   │   ├─ Yes → layout="centered" (기본)
│  │   │   └─ No  → layout="full"
│  │   └─ surface, p 설정
│  │
│  └─ No → 직접 ProseDocument 사용
```

### Q2: 언제 ProseDocument를 사용하는가?

```
START: 읽기 콘텐츠를 배치해야 함

├─ Q: 가독성을 위한 너비 제한이 필요한가?
│  ├─ Yes → ProseDocument 사용
│  │   └─ maxWidth 선택 (640/800/1024)
│  │
│  └─ No → Frame 사용
```

### Q3: maxWidth를 어떻게 선택하는가?

```
Content Type Decision Tree:

├─ 시, 짧은 인용구
│  └─ Container.n640 (40-50 글자/줄)
│
├─ 블로그 글, 일반 문서
│  └─ Container.n800 (60-70 글자/줄) ← 기본
│
├─ 기술 문서, 코드가 많은 콘텐츠
│  └─ Container.n1024 (80+ 글자/줄)
│
└─ 전체 너비 (대시보드, 앱 UI)
   └─ maxWidth 없음 (Frame 사용)
```

---

## 실제 사용 예제

### Example 1: 블로그 글

```tsx
export function BlogPost() {
  return (
    <Frame layout={Layout.Base.Default} fill overflow="auto">
      {/* Hero Section with Background */}
      <ProseSection
        p="120 0"
        layout="centered"
        surface="sunken"
      >
        <Text.Prose.Title variant="xl">
          Understanding React Hooks
        </Text.Prose.Title>
        <Text.Prose.Note>
          Published on Jan 14, 2026 • 10 min read
        </Text.Prose.Note>
      </ProseSection>

      {/* Main Content */}
      <ProseSection p="80 0" layout="centered">
        <Text.Prose.Body>
          React Hooks revolutionized how we write components...
        </Text.Prose.Body>

        <Text.Prose.Title variant="md">
          What are Hooks?
        </Text.Prose.Title>

        <Text.Prose.Body>
          Hooks are functions that let you...
        </Text.Prose.Body>

        <Text.Prose.Code>
          const [state, setState] = useState(0);
        </Text.Prose.Code>
      </ProseSection>

      {/* Footer Section */}
      <ProseSection p="60 0" layout="centered" surface="base">
        <Text.Prose.Note>
          Thanks for reading!
        </Text.Prose.Note>
      </ProseSection>
    </Frame>
  );
}
```

### Example 2: 랜딩 페이지

```tsx
export function LandingPage() {
  return (
    <Frame layout={Layout.Base.Default} fill overflow="auto">
      {/* Hero */}
      <ProseSection
        p="160 0"
        layout="centered"
        surface="primary"
      >
        <Text.Prose.Title variant="xl" style={{ textAlign: "center" }}>
          Build Better Products
        </Text.Prose.Title>
        <Text.Prose.Body style={{ textAlign: "center" }}>
          The all-in-one platform for modern teams
        </Text.Prose.Body>
      </ProseSection>

      {/* Features - Full Width Layout */}
      <ProseSection p="80 0" layout="full">
        <ProseDocument maxWidth={Container.n1024}>
          <Text.Prose.Title variant="lg">
            Features
          </Text.Prose.Title>
        </ProseDocument>

        {/* Full-width feature grid outside ProseDocument */}
        <Frame layout={Layout.Grid.Cards.Default}>
          {/* Feature cards */}
        </Frame>
      </ProseSection>

      {/* CTA Section */}
      <ProseSection p="120 0" layout="centered" surface="sunken">
        <Text.Prose.Title variant="lg" style={{ textAlign: "center" }}>
          Ready to get started?
        </Text.Prose.Title>
        <Frame layout={Layout.Row.Actions.Default}>
          <Action variant="primary" label="Sign Up" />
        </Frame>
      </ProseSection>
    </Frame>
  );
}
```

### Example 3: Documentation Page

```tsx
export function DocsPage() {
  return (
    <Frame layout={Layout.Base.Default} fill overflow="auto">
      <ProseSection p="40 0" layout="full">
        {/* Wide layout for docs with sidebar */}
        <ProseDocument maxWidth={Container.n1024} gap={8}>
          <Text.Prose.Title variant="lg">
            API Reference
          </Text.Prose.Title>

          <Text.Prose.Title variant="md">
            Installation
          </Text.Prose.Title>

          <Text.Prose.Code>
            npm install minimal-design-kit
          </Text.Prose.Code>

          <Text.Prose.Body>
            After installation, import the components...
          </Text.Prose.Body>

          <Text.Prose.Title variant="md">
            Usage
          </Text.Prose.Title>

          <Text.Prose.Body>
            Here's a basic example...
          </Text.Prose.Body>
        </ProseDocument>
      </ProseSection>
    </Frame>
  );
}
```

---

## Layout Preset 대응 관계

ProseSection/ProseDocument는 Layout System과 다음처럼 대응됩니다:

```tsx
// ProseSection with centered layout
<ProseSection p="80 0" layout="centered">
  {children}
</ProseSection>

// ≈ Equivalent with Layout System
<Frame layout={Layout.Base.Default} override={{ w: Size.full, p: "80 0" }}>
  <Frame layout={Layout.Base.Default} override={{
    maxWidth: Container.n800,
    gap: 4,
    p: "0 6",
    style: { marginLeft: "auto", marginRight: "auto" }
  }}>
    {children}
  </Frame>
</Frame>
```

**문제**: 이렇게 매번 작성하는 것은 너무 장황함!

**해결책 옵션**:

### Option 1: 전용 Layout Preset 추가

```typescript
// Layout.ts
export const Layout = {
  // ...

  Prose: {
    Section: {
      Default: "prose.section",        // 전체 너비 + 중앙 콘텐츠
      Full: "prose.section.full",      // 전체 너비 자유 레이아웃
    },

    Document: {
      Default: "prose.document",       // 800px 중앙 정렬
      Narrow: "prose.document.narrow", // 640px
      Wide: "prose.document.wide",     // 1024px
    },
  },
}
```

**사용**:
```tsx
<Frame layout={Layout.Prose.Section.Default}>
  <Text.Prose.Title>Title</Text.Prose.Title>
  <Text.Prose.Body>Content</Text.Prose.Body>
</Frame>
```

### Option 2: ProseDocument/ProseSection 유지

**장점**:
- 명시적인 의도 표현 (문서 레이아웃임을 명확히)
- 간결한 API
- 가독성 좋음

**단점**:
- Layout 시스템과 별도 추상화
- 일관성 부족

---

## 권장사항

### 현재 상태

- ✅ **ProseSection/ProseDocument는 실용적인 추상화**
- ✅ 문서/랜딩 페이지에 반복되는 패턴을 효과적으로 캡슐화
- ⚠️ Layout System과 중복되는 측면 있음

### 미래 방향

**Option A: Layout Preset으로 통합**
```tsx
// 통일된 API
<Frame layout={Layout.Prose.Section.Default}>
<Frame layout={Layout.Prose.Document.Narrow}>
```

**Option B: 별도 유지하되 개선**
```tsx
// 더 명확한 네이밍
<DocumentSection p="80 0" layout="centered">
<DocumentContainer maxWidth="medium">
```

**Option C: 하이브리드 (추천)**
```tsx
// Layout으로 통합하되 편의 컴포넌트 제공
import { ProseSection } from "design-system/prose"

// 내부적으로 Layout.Prose.Section.Default 사용
<ProseSection>
  <Text.Prose.Title>Title</Text.Prose.Title>
</ProseSection>
```

---

## 결론

ProseSection과 ProseDocument는 **문서 중심 레이아웃의 반복 패턴을 추상화**하기 위해 만들어졌습니다:

1. **가독성 최적화**: 최대 너비 제한 + 중앙 정렬
2. **수직 리듬**: 일관된 콘텐츠 간격
3. **섹션 구분**: 전체 너비 배경 + 중앙 콘텐츠
4. **개발 편의**: 매번 maxWidth, margin auto 작성 불필요

**핵심 가치**: Frame + Layout으로도 가능하지만, 문서 레이아웃은 워낙 반복적이므로 전용 추상화가 정당화됨.
