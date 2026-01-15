# Prose Context System Proposal

## 문제 정의

현재 `Text.Prose.*`는 **텍스트 컴포넌트**이지만, `ProseDocument`와 `ProseSection`은 **레이아웃 컴포넌트**입니다.

```tsx
// 현재 상태: 혼재된 네임스페이스
import { Text } from "design-system/text/Text"
import { ProseDocument, ProseSection } from "design-system/ProseOld"

<ProseSection>           {/* ← Layout component */}
  <ProseDocument>        {/* ← Layout component */}
    <Text.Prose.Title>  {/* ← Text component */}
    <Text.Prose.Body>   {/* ← Text component */}
  </ProseDocument>
</ProseSection>
```

**문제**:
1. ❌ `Text.Prose`와 `ProseDocument`가 별도 네임스페이스
2. ❌ AI가 둘의 관계를 추론하기 어려움
3. ❌ "Prose"라는 단어가 두 곳에 사용되지만 의미가 다름

---

## 제안: Prose.{Context}.{Component}

### 핵심 아이디어

**Prose는 "읽기 중심 콘텐츠"를 위한 독립적인 시스템**입니다.

```
Prose
├── Layout (레이아웃 컴포넌트)
│   ├── Section
│   ├── Document
│   └── Container
│
└── Text (텍스트 컴포넌트)
    ├── Title
    ├── Body
    ├── Note
    └── Code
```

---

## Option 1: Flat Structure (단순)

### 구조

```
Prose
├── Section         레이아웃: 전체 너비 섹션
├── Document        레이아웃: 중앙 정렬 콘텐츠
├── Container       레이아웃: 단순 래퍼
│
├── Title           텍스트: 제목 (h1-h4)
├── Body            텍스트: 본문
├── Note            텍스트: 주석/캡션
└── Code            텍스트: 코드 블록
```

### 사용법

```tsx
import { Prose } from "design-system/Prose"

<Prose.Section>
  <Prose.Title variant="xl">Article Title</Prose.Title>
  <Prose.Body>First paragraph...</Prose.Body>
  <Prose.Body>Second paragraph...</Prose.Body>
  <Prose.Note>Published on Jan 14</Prose.Note>
</Prose.Section>
```

### 장점
- ✅ 단순하고 직관적
- ✅ 모든 Prose 관련 요소가 한 네임스페이스에
- ✅ import 하나로 해결

### 단점
- ⚠️ 레이아웃과 텍스트가 같은 레벨 (구분 없음)
- ⚠️ `Prose.Section`과 `Prose.Body`가 동일 계층

---

## Option 2: Nested Structure (명확한 분리)

### 구조

```
Prose
├── Layout                    레이아웃 네임스페이스
│   ├── Section               전체 너비 섹션
│   │   ├── Centered          중앙 정렬 (기본)
│   │   └── Full              자유 레이아웃
│   │
│   ├── Document              중앙 정렬 문서
│   │   ├── Default           800px (기본)
│   │   ├── Narrow            640px
│   │   └── Wide              1024px
│   │
│   └── Container             단순 래퍼
│       ├── Default           maxWidth 없음
│       └── Bounded           maxWidth 있음
│
└── Text                      텍스트 네임스페이스
    ├── Title                 제목
    │   ├── variant="xl"      Display (80px)
    │   ├── variant="lg"      H1 (56px)
    │   ├── variant="md"      H2 (40px)
    │   └── variant="sm"      H3 (24px)
    │
    ├── Body                  본문
    │   ├── Default           20px
    │   └── Small             16px
    │
    ├── Note                  주석/캡션
    │   └── Default           14px
    │
    └── Code                  코드 블록
        └── Default           Monospace
```

### 사용법

```tsx
import { Prose } from "design-system/Prose"

<Prose.Layout.Section>
  <Prose.Text.Title variant="xl">Article Title</Prose.Text.Title>
  <Prose.Text.Body>First paragraph...</Prose.Text.Body>
  <Prose.Text.Body>Second paragraph...</Prose.Text.Body>
  <Prose.Text.Note>Published on Jan 14</Prose.Text.Note>
</Prose.Layout.Section>
```

### 장점
- ✅ 레이아웃과 텍스트가 명확히 분리
- ✅ 계층 구조가 논리적
- ✅ AI가 역할 추론 가능

### 단점
- ⚠️ Import path가 길어짐
- ⚠️ 타이핑이 많아짐 (`Prose.Layout.*`, `Prose.Text.*`)

---

## Option 3: Hybrid (실용적)

### 구조

```
Prose
├── Section                   레이아웃: 섹션
│   ├── Centered              중앙 정렬 (기본)
│   └── Full                  전체 너비
│
├── Document                  레이아웃: 문서 컨테이너
│   ├── Default               800px (기본)
│   ├── Narrow                640px
│   └── Wide                  1024px
│
├── Title                     텍스트: 제목
│   └── variant               xl/lg/md/sm
│
├── Body                      텍스트: 본문
│   └── variant               (optional) small
│
├── Note                      텍스트: 주석
│
└── Code                      텍스트: 코드
```

### 사용법

```tsx
import { Prose } from "design-system/Prose"

// 기본 패턴
<Prose.Section>
  <Prose.Title variant="xl">Article Title</Prose.Title>
  <Prose.Body>First paragraph...</Prose.Body>
  <Prose.Note>Published on Jan 14</Prose.Note>
</Prose.Section>

// 명시적 Document
<Prose.Section.Full surface="primary">
  <Prose.Document.Wide>
    <Prose.Title variant="lg">Wide Content</Prose.Title>
    <Prose.Body>Content with wider layout...</Prose.Body>
  </Prose.Document.Wide>
</Prose.Section.Full>
```

### 장점
- ✅ 레이아웃과 텍스트 모두 접근 가능
- ✅ 짧은 타이핑 (자주 쓰는 것은 최상위)
- ✅ 명시적 변형은 nested (`Prose.Document.Wide`)

### 단점
- ⚠️ 혼합된 계층 구조 (일관성 약간 부족)

---

## Option 4: Dual Import (현재 시스템 개선)

### 구조

```
Text.Prose                    텍스트 시스템
├── Title
├── Body
├── Note
└── Code

Prose (별도 네임스페이스)     레이아웃 시스템
├── Section
│   ├── Centered
│   └── Full
│
└── Document
    ├── Default
    ├── Narrow
    └── Wide
```

### 사용법

```tsx
import { Text } from "design-system/text/Text"
import { Prose } from "design-system/Prose"

<Prose.Section>
  <Text.Prose.Title variant="xl">Article</Text.Prose.Title>
  <Text.Prose.Body>Content...</Text.Prose.Body>
</Prose.Section>
```

### 장점
- ✅ Text 시스템과 분리 유지
- ✅ 명확한 역할 구분 (Text vs Layout)
- ✅ 기존 Text.Prose 유지 가능

### 단점
- ⚠️ 두 개 import 필요
- ⚠️ `Prose`가 두 곳에 (Text.Prose, Prose)

---

## 권장: Option 3 (Hybrid) 상세 설계

### 완전한 트리 구조

```
Prose
│
├─── Section                  전체 너비 섹션 컨테이너
│    ├── Centered (default)   자동으로 Document 생성
│    │   └── Props
│    │       ├── p             패딩 (기본: "80 0")
│    │       ├── surface       배경 (base, sunken, primary)
│    │       ├── maxWidth      내부 Document 최대 너비
│    │       └── gap           내부 Document gap
│    │
│    └── Full                  자유 레이아웃 (Document 없음)
│        └── Props
│            ├── p             패딩
│            └── surface       배경
│
├─── Document                 중앙 정렬 콘텐츠 래퍼
│    ├── Default              800px (최적 읽기 너비)
│    ├── Narrow               640px (짧은 글, 시)
│    └── Wide                 1024px (기술 문서)
│    └── Props
│        ├── gap              자식 간격 (기본: 4)
│        └── p                좌우 패딩 (기본: "0 6")
│
├─── Title                    제목 요소
│    └── Variants
│        ├── xl               Display (80px / 1.1 / -0.03em / 700)
│        ├── lg               H1 (56px / 1.2 / -0.02em / 700)
│        ├── md               H2 (40px / 1.3 / -0.01em / 600)
│        └── sm               H3 (24px / 1.4 / 0em / 600)
│
├─── Body                     본문 단락
│    └── Variants
│        ├── Default          20px / 1.6 / 0em / 400
│        └── Small            16px / 1.6 / 0em / 400
│
├─── Note                     주석/캡션/메타데이터
│    └── Default              14px / 1.5 / 0.05em / 500
│
└─── Code                     코드 블록/인라인 코드
     └── Default              Monospace / 12px
```

---

## 실제 사용 예제

### Example 1: 기본 블로그 글

```tsx
import { Prose } from "design-system/Prose"

export function BlogPost() {
  return (
    <Frame layout={Layout.Base.Default} fill overflow="auto">
      {/* Hero Section */}
      <Prose.Section.Centered p="120 0" surface="sunken">
        <Prose.Title variant="xl">
          Understanding Design Systems
        </Prose.Title>
        <Prose.Note>
          Published on Jan 14, 2026 • 10 min read
        </Prose.Note>
      </Prose.Section.Centered>

      {/* Main Content */}
      <Prose.Section.Centered p="80 0">
        <Prose.Body>
          Design systems are the foundation of modern UI development...
        </Prose.Body>

        <Prose.Title variant="md">
          What is a Design System?
        </Prose.Title>

        <Prose.Body>
          A design system is a collection of reusable components...
        </Prose.Body>

        <Prose.Code>
          const button = &lt;Button variant="primary" /&gt;;
        </Prose.Code>
      </Prose.Section.Centered>
    </Frame>
  );
}
```

### Example 2: 랜딩 페이지 (Full Width)

```tsx
export function LandingPage() {
  return (
    <Frame layout={Layout.Base.Default} fill overflow="auto">
      {/* Hero - Full Width Background */}
      <Prose.Section.Centered
        p="160 0"
        surface="primary"
        maxWidth={Container.n640}  // 좁은 Hero 텍스트
      >
        <Prose.Title variant="xl" style={{ textAlign: "center" }}>
          Build Faster
        </Prose.Title>
        <Prose.Body style={{ textAlign: "center" }}>
          The modern design system for AI-first teams
        </Prose.Body>
      </Prose.Section.Centered>

      {/* Features - Full Width Layout */}
      <Prose.Section.Full p="80 0">
        <Prose.Document.Wide>
          <Prose.Title variant="lg">Features</Prose.Title>
        </Prose.Document.Wide>

        {/* Feature grid outside Document */}
        <Frame
          layout={Layout.Grid.Cards.Default}
          override={{ maxWidth: Container.n1200, style: { margin: "0 auto" } }}
        >
          {/* Feature cards */}
        </Frame>
      </Prose.Section.Full>

      {/* CTA */}
      <Prose.Section.Centered p="120 0" surface="sunken">
        <Prose.Title variant="lg" style={{ textAlign: "center" }}>
          Ready to start?
        </Prose.Title>
        <Frame layout={Layout.Row.Actions.Default} justify="center">
          <Action variant="primary" label="Get Started" />
        </Frame>
      </Prose.Section.Centered>
    </Frame>
  );
}
```

### Example 3: Documentation (Wide Layout)

```tsx
export function DocsPage() {
  return (
    <Prose.Section.Centered p="40 0">
      <Prose.Document.Wide gap={8}>
        <Prose.Title variant="lg">API Reference</Prose.Title>

        <Prose.Title variant="md">Installation</Prose.Title>
        <Prose.Code>npm install minimal-design-kit</Prose.Code>

        <Prose.Body>
          After installation, you can import components...
        </Prose.Body>

        <Prose.Title variant="md">Basic Usage</Prose.Title>
        <Prose.Body>Here's a simple example...</Prose.Body>
      </Prose.Document.Wide>
    </Prose.Section.Centered>
  );
}
```

### Example 4: 시/짧은 글 (Narrow Layout)

```tsx
export function PoemPage() {
  return (
    <Prose.Section.Centered p="120 0">
      <Prose.Document.Narrow gap={6}>
        <Prose.Title variant="lg" style={{ textAlign: "center" }}>
          The Road Not Taken
        </Prose.Title>

        <Prose.Note style={{ textAlign: "center" }}>
          by Robert Frost
        </Prose.Note>

        <Prose.Body style={{ textAlign: "center" }}>
          Two roads diverged in a yellow wood,<br />
          And sorry I could not travel both<br />
          And be one traveler, long I stood...
        </Prose.Body>
      </Prose.Document.Narrow>
    </Prose.Section.Centered>
  );
}
```

---

## 내부 구현 (TypeScript)

### Prose Namespace 구조

```typescript
// src/design-system/Prose.tsx

import { Frame } from "./Frame"
import { Layout } from "./Layout"
import { Container, Size } from "./token/token.const.1tier"

// --- Section Components ---

interface SectionBaseProps {
  children: React.ReactNode;
  p?: string | number;
  surface?: SurfaceToken;
}

interface SectionCenteredProps extends SectionBaseProps {
  maxWidth?: ContainerToken;  // Document maxWidth
  gap?: number | string;      // Document gap
}

function SectionCentered({
  children,
  p = "80 0",
  surface = "base",
  maxWidth = Container.n800,
  gap = 4,
  ...props
}: SectionCenteredProps) {
  return (
    <Frame layout={Layout.Base.Default} override={{ w: Size.full, p, surface }} {...props}>
      <ProseDocument maxWidth={maxWidth} gap={gap}>
        {children}
      </ProseDocument>
    </Frame>
  );
}

function SectionFull({
  children,
  p = "80 0",
  surface = "base",
  ...props
}: SectionBaseProps) {
  return (
    <Frame layout={Layout.Base.Default} override={{ w: Size.full, p, surface }} {...props}>
      {children}
    </Frame>
  );
}

// --- Document Components ---

interface DocumentProps {
  children: React.ReactNode;
  gap?: number | string;
  p?: string | number;
}

function DocumentDefault({ children, gap = 4, p = "0 6" }: DocumentProps) {
  return (
    <Frame
      layout={Layout.Base.Default}
      override={{
        maxWidth: Container.n800,
        gap,
        p,
        style: { marginLeft: "auto", marginRight: "auto" }
      }}
    >
      {children}
    </Frame>
  );
}

function DocumentNarrow({ children, gap = 4, p = "0 6" }: DocumentProps) {
  return (
    <Frame
      layout={Layout.Base.Default}
      override={{
        maxWidth: Container.n640,
        gap,
        p,
        style: { marginLeft: "auto", marginRight: "auto" }
      }}
    >
      {children}
    </Frame>
  );
}

function DocumentWide({ children, gap = 4, p = "0 6" }: DocumentProps) {
  return (
    <Frame
      layout={Layout.Base.Default}
      override={{
        maxWidth: Container.n1024,
        gap,
        p,
        style: { marginLeft: "auto", marginRight: "auto" }
      }}
    >
      {children}
    </Frame>
  );
}

// --- Text Components (from Text.Prose.*) ---

import { Text } from "./text/Text"

const ProseTitle = Text.Prose.Title;
const ProseBody = Text.Prose.Body;
const ProseNote = Text.Prose.Note;
const ProseCode = Text.Prose.Code;

// --- Exports ---

export const Prose = {
  Section: {
    Centered: SectionCentered,
    Full: SectionFull,
  },
  Document: {
    Default: DocumentDefault,
    Narrow: DocumentNarrow,
    Wide: DocumentWide,
  },
  Title: ProseTitle,
  Body: ProseBody,
  Note: ProseNote,
  Code: ProseCode,
};
```

---

## 의사 결정 트리

```
START: Prose 콘텐츠를 배치해야 함

├─ Q1: 전체 너비 섹션이 필요한가?
│  ├─ Yes → Prose.Section 사용
│  │   ├─ Q2: 중앙 제한 너비가 필요한가?
│  │   │   ├─ Yes → Prose.Section.Centered
│  │   │   │   └─ Q3: 어떤 너비?
│  │   │   │       ├─ 짧은 글 → maxWidth={Container.n640}
│  │   │   │       ├─ 일반 글 → (기본값, 800px)
│  │   │   │       └─ 기술 문서 → maxWidth={Container.n1024}
│  │   │   │
│  │   │   └─ No → Prose.Section.Full
│  │   │
│  │   └─ surface, p 설정
│  │
│  └─ No → 직접 Prose.Document 사용
│      └─ Q3: 어떤 너비?
│          ├─ 640px → Prose.Document.Narrow
│          ├─ 800px → Prose.Document.Default
│          └─ 1024px → Prose.Document.Wide
│
└─ 텍스트 요소 추가
    ├─ 제목 → Prose.Title variant="xl/lg/md/sm"
    ├─ 본문 → Prose.Body
    ├─ 주석 → Prose.Note
    └─ 코드 → Prose.Code
```

---

## Text.Prose와의 관계

### 현재 시스템

```tsx
Text.Prose.Title    // 텍스트 컴포넌트
Text.Prose.Body     // 텍스트 컴포넌트
ProseDocument       // 레이아웃 컴포넌트 (별도)
ProseSection        // 레이아웃 컴포넌트 (별도)
```

### 새로운 시스템 (Option A: 통합)

```tsx
Prose.Title        // 텍스트 (Text.Prose.Title 재export)
Prose.Body         // 텍스트 (Text.Prose.Body 재export)
Prose.Document.*   // 레이아웃
Prose.Section.*    // 레이아웃
```

### 새로운 시스템 (Option B: 분리 유지)

```tsx
Text.Prose.Title    // 텍스트 (변경 없음)
Text.Prose.Body     // 텍스트 (변경 없음)
Prose.Document.*    // 레이아웃 (새 네임스페이스)
Prose.Section.*     // 레이아웃 (새 네임스페이스)

// 사용 시 두 개 import
import { Text } from "design-system/text/Text"
import { Prose } from "design-system/Prose"

<Prose.Section.Centered>
  <Text.Prose.Title>...</Text.Prose.Title>
</Prose.Section.Centered>
```

---

## 최종 권장사항

### 🏆 Option 3 (Hybrid) 채택 이유

1. **실용성**: 자주 쓰는 요소는 짧게 (`Prose.Title`)
2. **명확성**: 변형은 nested (`Prose.Document.Wide`)
3. **일관성**: 모든 Prose 관련 요소가 한 네임스페이스
4. **마이그레이션**: `Text.Prose.*`를 재export하여 점진적 전환

### 구현 우선순위

**Phase 1: 레이아웃 통합**
```tsx
// 새로운 Prose 네임스페이스 생성
export const Prose = {
  Section: { Centered, Full },
  Document: { Default, Narrow, Wide },
  // Text는 아직 Text.Prose에서 사용
}
```

**Phase 2: 텍스트 재export**
```tsx
export const Prose = {
  Section: { ... },
  Document: { ... },
  Title: Text.Prose.Title,   // 재export
  Body: Text.Prose.Body,
  Note: Text.Prose.Note,
  Code: Text.Prose.Code,
}
```

**Phase 3: 마이그레이션**
```tsx
// 모든 앱을 Prose.* 로 변경
<Prose.Section.Centered>
  <Prose.Title>...</Prose.Title>
  <Prose.Body>...</Prose.Body>
</Prose.Section.Centered>
```

**Phase 4: Text.Prose 제거 (optional)**
```tsx
// Text.Prose.*를 deprecated 처리
// Prose.*만 사용 권장
```

---

## 요약

```
Prose.{Component}.{Variant}

Prose
├── Section.Centered        레이아웃 (자동 Document)
├── Section.Full            레이아웃 (자유형)
├── Document.Default        레이아웃 (800px)
├── Document.Narrow         레이아웃 (640px)
├── Document.Wide           레이아웃 (1024px)
├── Title                   텍스트 (xl/lg/md/sm)
├── Body                    텍스트
├── Note                    텍스트
└── Code                    텍스트
```

**핵심 가치**:
- ✅ 단일 네임스페이스로 모든 Prose 요소 통합
- ✅ 레이아웃과 텍스트 모두 접근 가능
- ✅ AI가 관계 추론 가능 (모두 `Prose.*`)
- ✅ 실용적인 API (짧고 명확)
