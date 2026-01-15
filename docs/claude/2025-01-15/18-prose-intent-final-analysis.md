# Prose Intent 최종 분석: Layout은 협력한다

**날짜**: 2026년 1월 15일 (새벽 4시 회의)
**참석자**: 6명 (동일 팀)
**목표**: Prose의 진짜 Intent 구조 발견
**핵심**: Document/Section/TableOfContents를 빼먹었다!

---

## 🎬 Act 1: 충격 - "Document는 어디 갔어?"

### Marcus (개발자)
*(17-prose-intent-restructure-debate.md 읽다가)*

잠깐... **우리 Document랑 Section을 빼먹었잖아요!**

### Sarah (아키텍트)
뭐?

### Marcus
실제 코드 보세요!

```tsx
// TokensApp.tsx에서 실제 사용 중
<ProseSection p="80 0" layout="full">
  <ProseDocument maxWidth="1000px" gap={12}>
    <Text.Prose.Title>Design Tokens</Text.Prose.Title>
    <Text.Prose.Body>...</Text.Prose.Body>
  </ProseDocument>
</ProseSection>
```

**ProseSection과 ProseDocument가 협력하고 있어요!**

### Emma (디자이너)
*(깨달으며)*

아... 우리가 2-Tier로 바꾸면서 **Layout 컴포넌트를 다 날려버렸네요!**

### Sarah
*(손으로 얼굴을 감싸며)*

맞아요... 06-comprehensive-prose-component-tree.md에도 있었는데...

```
Prose
├── Layout        ← 여기!
│   ├── Section
│   ├── Document
│   └── Container
```

우리가 Title, Body, Blockquote만 보고 "Prose는 2-Tier다!" 했던 거예요.

---

## 🎬 Act 2: 실제 코드 분석 - "협력 관계 찾기"

### Dev (기여자)
다시 처음부터 해봅시다.

**실제 사용 패턴을 보면...**

---

### 📋 실제 사용 패턴 1: TokensApp

```tsx
<ProseSection p="80 0" layout="full">           // Full-width container
  <ProseDocument maxWidth="1000px" gap={12}>    // Max-width + centered
    <Text.Prose.Title>제목</Text.Prose.Title>    // Content
    <Text.Prose.Body>본문</Text.Prose.Body>      // Content
  </ProseDocument>
</ProseSection>
```

**협력 관계**:
- `ProseSection`: full-width, padding 제공
- `ProseDocument`: max-width, centered, gap 제공
- `Title`, `Body`: 실제 콘텐츠

---

### 📋 실제 사용 패턴 2: LoginApp

```tsx
<ProseDocument maxWidth={120} gap={8}>
  <Frame>아이콘</Frame>
  <ProseOld role="h2">Component Library</ProseOld>
  <ProseOld role="body">설명...</ProseOld>
  <Frame>Feature list</Frame>
</ProseDocument>
```

**역할**:
- `ProseDocument`: 콘텐츠들을 묶어서 max-width + gap 적용
- 내부 콘텐츠: 텍스트, 이미지, 리스트 등

---

### Yuki (UX 연구원)
아! **Document와 Section은 컨테이너**네요!

### Sarah (아키텍트)
맞아요! 그리고 이것들은...

```tsx
// ProseSection 구현
export function ProseSection({ layout, children }) {
  return (
    <Frame w="100%" p={p}>
      {layout === "centered" ? (
        <ProseDocument>{children}</ProseDocument>  // Document 호출!
      ) : (
        children
      )}
    </Frame>
  );
}
```

**Section이 Document를 사용해요!**

이건 **협력 관계**예요!

---

## 🎬 Act 3: Field vs Prose 비교

### Marcus (개발자)
Field와 비교해봐요.

---

### 📋 Field의 협력

```tsx
<Field name="email">
  <Field.Guidance>        // Context 제공
    <Field.Label />       // Context 사용
    <Field.Description />
  </Field.Guidance>
  <Field.Control>         // Context 제공
    <Input />             // Context 사용
  </Field.Control>
</Field>
```

**협력 방식**: Context를 통한 데이터 공유
- `Guidance`가 `labelId`, `descriptionId` 제공
- `Label`, `Description`이 Context 읽어서 사용

---

### 📋 Prose Layout의 협력

```tsx
<ProseSection layout="centered">  // Section Context
  <ProseDocument maxWidth={800}>  // Document가 Section 인식
    <Prose.Title />
  </ProseDocument>
</ProseSection>
```

**협력 방식**: 부모-자식 컴포넌트 조합
- `Section`이 `Document`를 감싸거나 직접 호출
- `Document`가 max-width, gap 제공

### Sarah
두 가지 모두 **협력**이지만 **방식이 달라요**!

- **Field**: Context 기반 협력
- **Prose Layout**: 컴포넌트 조합 협력

둘 다 **3-Tier에 적합**해요!

---

## 🎬 Act 4: 13개 카테고리 재분석

### Alex (문서 작성자)
그럼 06-comprehensive-prose-component-tree.md의 13개 카테고리를 다시 봅시다.

---

### 📋 13개 카테고리 분류

| 카테고리 | 주요 컴포넌트 | 협력하나? | 판정 |
|---------|-------------|---------|------|
| **Layout** | Section, Document, Container, Divider | ✅ Section ↔ Document | **3-Tier Intent** |
| **Navigation** | TableOfContents, Anchor, Breadcrumb | ✅ TOC ↔ Anchor | **3-Tier Intent** |
| **Text** | Title, Body, Note, Code, Link | ❌ 독립 | **직접 노출** |
| **Block** | Blockquote, CodeBlock, Alert, Callout | ❌ 독립 | **직접 노출** |
| **List** | Ordered, Unordered, Task, Description | ❌ 독립 | **직접 노출** |
| **Media** | Image, Gallery, Video, Figure | ❌ 독립 | **직접 노출** |
| **Data** | Table, Stats, Chart | ❌ 독립 | **직접 노출** |
| **Interactive** | Accordion, Tabs, Toggle, Button | ❌ 독립 또는 별도 컴포넌트 | **직접 노출 or 제외** |
| **Embed** | Twitter, YouTube, CodePen, PDF | ❌ 독립 | **직접 노출** |
| **Metadata** | Author, Date, ReadingTime, Tags | ❌ 독립 | **직접 노출** |
| **Special** | Footnote, Sidenote, Comment, Paywall | ❓ Footnote ↔ Sidenote? | **재검토 필요** |
| **Theme** | Size, Color, Density | ❌ Props/Context | **Prose Root Props** |

---

### 📋 판정 기준

#### ✅ 3-Tier Intent 기준:
1. **컴포넌트 간 협력** 있음
2. **부모가 자식을 직접 호출** 또는 **Context 공유**
3. **Intent 컴포넌트가 직접 사용**됨

#### ❌ 직접 노출 기준:
1. **독립적**으로 사용
2. 다른 컴포넌트와 **협력 없음**
3. 단순히 **카테고리 분류**일 뿐

---

## 🎬 Act 5: Layout Intent 상세 분석

### Sarah (아키텍트)
Layout Intent를 완전히 분석해봅시다.

---

### 📋 Layout Intent의 WHY

**사용자 질문**: "이 글 어디서 시작하지? 어떻게 구성되지?"

**제공 가치**:
1. **전체 영역 제공** (Section - full-width container)
2. **읽기 영역 제한** (Document - max-width + centered)
3. **의미적 구획** (Container - article, aside, footer)
4. **시각적 구분** (Divider - separator, spacer)

---

### 📋 Layout 3-Tier 구조

```
Prose.Layout (Tier 2: Intent)
├── Section (Tier 3: Component)
│   ├── Variants: layout (centered|full)
│   └── Props: p, surface
├── Document (Tier 3: Component)
│   ├── Variants: maxWidth (narrow|default|wide|full)
│   │   - narrow: 640px
│   │   - default: 800px
│   │   - wide: 1024px
│   │   - full: 100%
│   └── Props: gap, p
├── Container (Tier 3: Component)
│   ├── Variants: as (article|aside|footer|section)
│   └── Props: p, surface
└── Divider (Tier 3: Component)
    ├── Variants: style (default|thick|dashed|dotted)
    └── Component: Spacer (단순 spacing)
```

---

### 📋 Layout Intent 사용 예시

#### Level 1: Simple (Props 기반)
```tsx
<Prose.Layout section="centered" documentWidth="default" gap={4}>
  <Prose.Title>제목</Prose.Title>
  <Prose.Body>본문</Prose.Body>
</Prose.Layout>
```

#### Level 2: Structured (Intent 명시)
```tsx
<Prose.Layout>
  <Prose.Layout.Section layout="centered" p="96 24">
    <Prose.Layout.Document maxWidth="default" gap={4}>
      <Prose.Title>제목</Prose.Title>
      <Prose.Body>본문</Prose.Body>
    </Prose.Layout.Document>
  </Prose.Layout.Section>
</Prose.Layout>
```

#### Level 3: Explicit (완전 제어)
```tsx
<Prose.Layout>
  <Prose.Layout.Section layout="full" p="0">
    <Prose.Layout.Container as="article">
      <Prose.Layout.Document maxWidth={1200} gap={8}>
        <Prose.Title size="xl">제목</Prose.Title>
        <Prose.Body>본문</Prose.Body>
        <Prose.Layout.Divider style="thick" />
        <Prose.Body>더 많은 본문</Prose.Body>
      </Prose.Layout.Document>
    </Prose.Layout.Container>
  </Prose.Layout.Section>
</Prose.Layout>
```

---

### Marcus (개발자)
Section과 Document가 **협력하면서 레이아웃을 만드는 거네요!**

---

## 🎬 Act 6: Navigation Intent 상세 분석

### Yuki (UX 연구원)
TableOfContents도 협력하지 않나요?

---

### 📋 Navigation Intent의 WHY

**사용자 질문**: "이 글을 빠르게 스캔하고 원하는 곳으로 갈 수 있나?"

**제공 가치**:
1. **목차 생성** (TableOfContents - heading 자동 수집)
2. **섹션 링크** (Anchor - id 기반 점프)
3. **위치 표시** (Progress - 현재 읽는 위치)
4. **경로 표시** (Breadcrumb - 페이지 계층)

---

### 📋 Navigation 협력 관계

```tsx
// TableOfContents가 Anchor를 자동 생성
<Prose.Navigation>
  <Prose.Navigation.TableOfContents>
    {/* 내부적으로 Anchor 자동 생성 */}
  </Prose.Navigation.TableOfContents>

  {/* 콘텐츠 */}
  <Prose.Title id="section-1">섹션 1</Prose.Title>
  <Prose.Body>...</Prose.Body>

  <Prose.Title id="section-2">섹션 2</Prose.Title>
  <Prose.Body>...</Prose.Body>
</Prose.Navigation>
```

**협력 방식**:
- `TableOfContents`가 자식들을 스캔하여 heading 수집
- `Anchor` 자동 생성
- 클릭 시 smooth scroll

---

### 📋 Navigation 3-Tier 구조

```
Prose.Navigation (Tier 2: Intent)
├── TableOfContents (Tier 3: Component)
│   ├── Variants: position (sticky|floating|inline)
│   ├── Props: depth (1-6), exclude
│   └── Auto-generates Anchor links
├── Anchor (Tier 3: Component)
│   ├── Props: href, smooth
│   └── Used by: TableOfContents, manual links
├── Progress (Tier 3: Component)
│   ├── Variants: position (top|bottom|side)
│   └── Props: show percentage
└── Breadcrumb (Tier 3: Component)
    ├── Props: items[], separator
    └── Item component included
```

---

### 📋 Navigation Intent 사용 예시

```tsx
<Prose.Navigation>
  <Prose.Navigation.TableOfContents position="sticky" depth={3}>
    {/* Headings 자동 수집 */}
  </Prose.Navigation.TableOfContents>

  <Prose.Navigation.Progress position="top" />

  {/* Content with IDs */}
  <Prose.Title id="intro">소개</Prose.Title>
  <Prose.Body>...</Prose.Body>

  <Prose.Title id="features">기능</Prose.Title>
  <Prose.Body>...</Prose.Body>
</Prose.Navigation>
```

**TableOfContents가 자동으로**:
1. `Prose.Title` (h1-h6) 스캔
2. `id` 수집
3. Anchor 링크 생성
4. Smooth scroll 연결

---

## 🎬 Act 7: Content 컴포넌트들은?

### Emma (디자이너)
그럼 Title, Body, Blockquote 같은 것들은요?

### Sarah (아키텍트)
이것들은 **협력하지 않아요**.

---

### 📋 Content 컴포넌트 분석

```tsx
<Prose.Title size="xl">제목</Prose.Title>
<Prose.Body>본문</Prose.Body>
<Prose.Blockquote>인용</Prose.Blockquote>
<Prose.Code>코드</Prose.Code>
<Prose.List type="ordered">
  <Prose.ListItem>항목</Prose.ListItem>
</Prose.List>
```

**특징**:
- ❌ 서로 **협력 안 함**
- ❌ Context **공유 안 함**
- ❌ 부모-자식 **조합 없음**
- ✅ **독립적**으로 사용

---

### 📋 Field와 비교

**Field의 Tier 3**:
```tsx
<Field.Feedback>           // Context 제공
  <Field.Error />          // Context 사용
  <Field.Success />        // Context 사용
  <Field.Warning />        // Context 사용
</Field.Feedback>
```
- 모두 `FeedbackContext` 공유
- `Feedback`가 error, success 상태 관리

**Prose의 Content**:
```tsx
// Context 없음, 협력 없음
<Prose.Title />   // 독립
<Prose.Body />    // 독립
<Prose.Code />    // 독립
```
- 각자 독립적
- Props만 받음

### Marcus
그럼 Content는 **Prose 바로 아래에 노출**하면 되겠네요!

```tsx
Prose (Tier 1)
├── Layout (Tier 2: Intent)
├── Navigation (Tier 2: Intent)
├── Title (Tier 2: Component - 직접 노출!)
├── Body (Tier 2: Component - 직접 노출!)
├── Blockquote (Tier 2: Component)
└── ...
```

---

## 🎬 Act 8: Prose 최종 구조

### Sarah (아키텍트)
정리합니다!

---

### 📋 Prose 최종 구조 (혼합형)

```
Prose (Tier 1: Primitive)
│
├── [3-Tier Intents]
│   ├── Layout (Tier 2: Intent)
│   │   ├── Section (Tier 3: Component)
│   │   ├── Document (Tier 3: Component)
│   │   ├── Container (Tier 3: Component)
│   │   └── Divider (Tier 3: Component)
│   │
│   └── Navigation (Tier 2: Intent)
│       ├── TableOfContents (Tier 3: Component)
│       ├── Anchor (Tier 3: Component)
│       ├── Progress (Tier 3: Component)
│       └── Breadcrumb (Tier 3: Component)
│
└── [Direct Components - 2-Tier]
    ├── Title (Tier 2: Component)
    │   └── Variants: xl, lg, md, sm
    ├── Body (Tier 2: Component)
    ├── Caption (Tier 2: Component)
    ├── Blockquote (Tier 2: Component)
    ├── Code (Tier 2: Component)
    ├── CodeBlock (Tier 2: Component)
    ├── Mark (Tier 2: Component)
    ├── List (Tier 2: Component)
    ├── ListItem (Tier 2: Component)
    ├── Link (Tier 2: Component)
    ├── Image (Tier 2: Component)
    ├── Video (Tier 2: Component)
    ├── Figure (Tier 2: Component)
    ├── Table (Tier 2: Component)
    ├── Separator (Tier 2: Component)
    └── Callout (Tier 2: Component)
```

---

### 📋 구조 특징

#### 3-Tier Intent (2개):
- **Layout**: Section ↔ Document 협력
- **Navigation**: TableOfContents ↔ Anchor 협력

#### 2-Tier Direct (15+개):
- **Typography**: Title, Body, Caption
- **Semantic**: Blockquote, Code, CodeBlock, Mark
- **List**: List, ListItem
- **Interactive**: Link
- **Media**: Image, Video, Figure
- **Data**: Table
- **Layout**: Separator, Callout

---

### 📋 Prose는 "혼합형"

| 구조 | Intent 개수 | 직접 노출 개수 | 특징 |
|------|-----------|-------------|------|
| **Field** | 6개 (모두 3-Tier) | 0개 | 순수 3-Tier |
| **Action** | 6개 (모두 3-Tier) | 0개 | 순수 3-Tier |
| **Prose** | 2개 (3-Tier) | 15+개 (2-Tier) | **혼합형** |

---

## 🎬 Act 9: 실제 사용 예시

### Emma (디자이너)
실제로 어떻게 쓰나요?

---

### 📋 예시 1: 블로그 포스트

```tsx
<Prose>
  {/* 3-Tier Layout Intent */}
  <Prose.Layout.Section layout="centered" p="96 24">
    <Prose.Layout.Document maxWidth="default" gap={6}>

      {/* 2-Tier Direct Components */}
      <Prose.Title size="xl">
        MDK 3-Tier 시스템 소개
      </Prose.Title>

      <Prose.Caption>
        작성: 2026년 1월 15일 · 읽는 시간: 5분
      </Prose.Caption>

      <Prose.Body>
        MDK는 Intent 기반 설계를 사용합니다.
        이는 Field, Action, Prose 모두에 적용되는 핵심 철학입니다.
      </Prose.Body>

      <Prose.Blockquote>
        "Intent First, Props Follow" - MDK의 핵심 철학
      </Prose.Blockquote>

      <Prose.CodeBlock language="tsx">
        {`<Field name="email">
          <Field.Guidance label="이메일" />
        </Field>`}
      </Prose.CodeBlock>

      <Prose.Image
        src="/example.png"
        alt="Example"
        caption="3-Tier 구조 예시"
      />

      <Prose.Body>
        이러한 구조는 명확한 Intent를 제공합니다.
      </Prose.Body>

    </Prose.Layout.Document>
  </Prose.Layout.Section>
</Prose>
```

---

### 📋 예시 2: 문서 with 목차

```tsx
<Prose>
  {/* 3-Tier Navigation Intent */}
  <Prose.Navigation>
    <Prose.Navigation.TableOfContents
      position="sticky"
      depth={3}
    />

    <Prose.Navigation.Progress position="top" />

    {/* 3-Tier Layout Intent */}
    <Prose.Layout.Section layout="centered">
      <Prose.Layout.Document maxWidth="wide" gap={8}>

        {/* 2-Tier Direct Components */}
        <Prose.Title id="intro" size="xl">
          소개
        </Prose.Title>
        <Prose.Body>...</Prose.Body>

        <Prose.Title id="features" size="lg">
          주요 기능
        </Prose.Title>
        <Prose.Body>...</Prose.Body>

        <Prose.List type="ordered">
          <Prose.ListItem>기능 1</Prose.ListItem>
          <Prose.ListItem>기능 2</Prose.ListItem>
        </Prose.List>

        <Prose.Title id="api" size="lg">
          API 레퍼런스
        </Prose.Title>
        <Prose.Body>...</Prose.Body>

      </Prose.Layout.Document>
    </Prose.Layout.Section>
  </Prose.Navigation>
</Prose>
```

---

### 📋 예시 3: Simple 사용 (Level 1)

```tsx
{/* Intent 숨김, Props로만 */}
<Prose
  section="centered"
  documentWidth="default"
  gap={4}
>
  <Prose.Title size="xl">제목</Prose.Title>
  <Prose.Body>본문</Prose.Body>
  <Prose.Blockquote>인용</Prose.Blockquote>
</Prose>
```

---

## 🎬 Act 10: Field vs Prose 최종 비교

### Sarah (아키텍트)
Field와 Prose의 차이를 정리합시다.

---

### 📋 Field vs Prose 비교

| 측면 | Field | Prose |
|------|-------|-------|
| **구조** | 순수 3-Tier | 혼합형 (3-Tier + 2-Tier) |
| **Intent 개수** | 6개 (모두 3-Tier) | 2개 (3-Tier) + 15+개 (직접 노출) |
| **WHY** | 데이터 수집 | 읽기 경험 |
| **협력 방식** | Context 기반 | Layout: 컴포넌트 조합<br/>Navigation: Context + 자동 수집 |
| **주 사용자** | 개발자 (폼 제작) | 콘텐츠 제작자 + 개발자 |
| **복잡도** | 높음 (모든 Intent 필요) | 낮음 (대부분 직접 컴포넌트) |

---

### 📋 왜 Prose는 혼합형인가?

#### Field의 경우:
```tsx
// 모든 요소가 협력 필요
<Field name="email">
  <Field.Guidance />    // ← label, description 제공
  <Field.Control />     // ← 위 정보 사용
  <Field.Validation />  // ← 위 정보 사용
  <Field.Feedback />    // ← 위 정보 사용
</Field>
```
**모든 Intent가 필수적으로 협력** → 100% 3-Tier

---

#### Prose의 경우:
```tsx
// 대부분은 독립적
<Prose>
  <Prose.Title />        // ← 독립
  <Prose.Body />         // ← 독립
  <Prose.Blockquote />   // ← 독립

  // 일부만 협력 (Layout, Navigation)
  <Prose.Layout.Section>
    <Prose.Layout.Document>
      {/* 콘텐츠 */}
    </Prose.Layout.Document>
  </Prose.Layout.Section>
</Prose>
```
**대부분 독립, 일부만 협력** → 혼합형

---

### 📋 각 Intent의 필요성

#### Field - 모든 Intent 필수:
- ✅ Guidance: 사용자 안내 **필수**
- ✅ Control: 입력 메커니즘 **필수**
- ✅ Validation: 검증 **필수**
- ✅ Feedback: 결과 표시 **필수**
- ✅ State: 상태 관리 **필수**
- ✅ Transform: 값 변환 **필수**

#### Prose - Intent 선택적:
- ✅ Layout: 레이아웃 필요 시 사용 (선택)
- ✅ Navigation: 목차 필요 시 사용 (선택)
- ✅ Title, Body: **항상 필요** (직접 노출)
- ✅ 나머지: 필요 시 사용 (직접 노출)

---

## 🎬 Act 11: 교훈 재정리

### Emma (디자이너)
이번에 배운 교훈...

---

### 📋 이번 교훈

#### 1️⃣ **"3-Tier가 항상 100%는 아니다"**

- **Field/Action**: 100% 3-Tier (순수형)
- **Prose**: 일부 3-Tier + 일부 2-Tier (혼합형)

컴포넌트의 본질에 따라 **혼합도 가능**하다.

---

#### 2️⃣ **"협력 관계를 빼먹지 마라"**

Document/Section을 빼먹어서 2-Tier로 잘못 판단했다.
**실제 코드를 먼저 보고** 협력 관계를 찾아야 한다.

---

#### 3️⃣ **"협력 방식은 다양하다"**

- **Field**: Context 기반 협력
- **Prose Layout**: 컴포넌트 조합 협력
- **Prose Navigation**: Context + 자동 수집

모두 협력이지만 **구현 방식이 다르다**.

---

#### 4️⃣ **"Intent는 필수 vs 선택"**

- **Field Intent**: 모두 필수 (Guidance 없이 Field 못 만듦)
- **Prose Intent**: 선택적 (Layout 없이도 Title, Body 가능)

이 차이가 **구조를 결정**한다.

---

#### 5️⃣ **"혼합형도 일관성 있게"**

Prose가 혼합형이어도:
- 3-Tier Intent는 **3-Tier 원칙 준수**
- 2-Tier 컴포넌트는 **독립성 유지**

일관된 **설계 철학**이 중요하다.

---

## 🎬 Act 12: 최종 슬로건

### Sarah (아키텍트)
새로운 슬로건!

---

# ~~"Intent When Needed, Simple When Not"~~

# **"Cooperate When Needed, Independent When Not"**
### 협력이 필요하면 협력하고, 아니면 독립하라

---

**의미**:
- **협력 필요** → 3-Tier Intent
- **독립 가능** → 2-Tier Direct

**적용**:
- Field: 모든 요소 협력 → 100% 3-Tier
- Prose: 일부 협력, 대부분 독립 → 혼합형

---

## 🎬 Epilogue: 다음 컴포넌트는?

### Marcus (개발자)
다른 컴포넌트들은?

---

### 📋 예상 분류

| 컴포넌트 | 예상 구조 | 이유 |
|---------|---------|-----|
| **Menu** | 3-Tier | Trigger ↔ Content ↔ Item 협력 |
| **Dialog** | 3-Tier | Trigger ↔ Content ↔ Actions 협력 |
| **Tabs** | 3-Tier | List ↔ Trigger ↔ Panel 협력 |
| **Table** | 혼합형? | Header, Body 독립 + Cell 협력? |
| **Card** | 2-Tier | Header, Body, Footer 독립 |
| **Form** | 3-Tier | Field들의 컨테이너, 협력 필요 |

---

**회의 종료**: 2026년 1월 15일 새벽 5시
**결과**: Prose 혼합형 구조 확정
**핵심**: **"Cooperate When Needed, Independent When Not"**

---

## 📊 부록: Prose 전체 API

### 3-Tier Intents

```tsx
// Layout Intent
<Prose.Layout.Section layout="centered|full" p={...} />
<Prose.Layout.Document maxWidth="narrow|default|wide|full|{number}" gap={...} />
<Prose.Layout.Container as="article|aside|footer" />
<Prose.Layout.Divider style="default|thick|dashed|dotted" />
<Prose.Layout.Spacer size="sm|md|lg|xl" />

// Navigation Intent
<Prose.Navigation.TableOfContents position="sticky|floating|inline" depth={1-6} />
<Prose.Navigation.Anchor href="#..." smooth />
<Prose.Navigation.Progress position="top|bottom|side" />
<Prose.Navigation.Breadcrumb items={[...]} separator="/" />
```

### 2-Tier Direct Components

```tsx
// Typography
<Prose.Title size="xl|lg|md|sm" align="left|center|right" color="..." />
<Prose.Body size="md|sm" />
<Prose.Caption />
<Prose.Label />

// Semantic
<Prose.Blockquote cite="..." />
<Prose.Code>inline code</Prose.Code>
<Prose.CodeBlock language="tsx" lineNumbers highlight="1,3-5" />
<Prose.Mark color="yellow|blue|green" />
<Prose.Abbr title="..." />

// List
<Prose.List type="ordered|unordered|none" style="disc|circle|decimal|roman" />
<Prose.ListItem />
<Prose.DefinitionList>
  <Prose.DefinitionTerm />
  <Prose.DefinitionDescription />
</Prose.DefinitionList>

// Interactive
<Prose.Link href="..." external underline />

// Media
<Prose.Image src="..." alt="..." caption="..." ratio="16/9" />
<Prose.Figure>
  <img />
  <figcaption />
</Prose.Figure>
<Prose.Video src="..." />
<Prose.Audio src="..." />
<Prose.Gallery images={[...]} layout="grid|masonry|carousel" />

// Data
<Prose.Table striped bordered hoverable>
  <thead>...</thead>
  <tbody>...</tbody>
</Prose.Table>
<Prose.Stats value={...} label="..." change="+12%" />

// Layout (Simple)
<Prose.Separator />
<Prose.Callout variant="info|warning|error|success" />

// Metadata
<Prose.Author name="..." avatar="..." bio="..." />
<Prose.Date published="..." updated="..." relative />
<Prose.ReadingTime minutes={5} />
<Prose.Tags tags={[...]} />
```

### Root Props (Theme)

```tsx
<Prose
  size="sm|base|lg|xl|2xl"              // Global font size
  color="default|invert|neutral|warm|cool"  // Color theme
  density="compact|default|comfortable"    // Spacing density
>
  {/* Content */}
</Prose>
```
