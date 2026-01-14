# Prose Intent 정의: "긴 글을 읽는다는 것"

**날짜**: 2026년 1월 15일 (오후 회의)
**참석자**: 6명 (동일 팀)
**목표**: 3-Tier Intent System을 Prose에 적용
**방법**: WHY → Intent → Component 순서로 설계

---

## 🎬 Act 1: 문제 제기 - "Prose는 뭐가 다를까?"

### Sarah (아키텍트)
*(회의 시작)*

좋아요! 이제 Prose를 3-Tier로 재설계해봅시다.

Field와 Action은 했으니, 이제 Prose 차례예요.

### Marcus (개발자)
Prose도 같은 방식으로 하면 되나요?

```tsx
<Prose name="article">
  <Prose.Guidance label="Title" />  // ❓
  <Prose.Control><Text /></Prose.Control>  // ❓
</Prose>
```

### Yuki (UX 연구원)
*(고개를 젓며)*

뭔가... 이상한데요? Prose는 Field랑 다르잖아요!

### Sarah
정확해요! **Prose는 완전히 다른 목적**을 가져요.

먼저 **WHY**부터 시작해봅시다.

---

## 🎬 Act 2: WHY 분석 - "왜 Prose가 필요한가?"

### Sarah (아키텍트)
*(화이트보드에)*

**Field의 WHY**:
- 사용자가 데이터를 입력한다
- 올바른 데이터 수집이 목표

**Prose의 WHY**:
- 사용자가 긴 글을 읽는다
- ??? 뭐가 목표죠?

### Emma (디자이너)
음... 읽기 쉽게?

### Yuki (UX 연구원)
좀 더 구체적으로 생각해봐요.

**사용자가 블로그 글을 읽을 때 무엇이 어려운가요?**

### Alex (문서 작성자)
제가 글 쓰는 사람으로서...

1. **어디서 시작하지?** - 제목이 뭐고 부제목이 뭔지 헷갈림
2. **이게 중요한 부분인가?** - 어떤 문단이 핵심인지 모름
3. **너무 길어...** - 계속 읽어야 하나 싶음
4. **이미지가 어디 있지?** - 시각적 휴식 필요
5. **나중에 다시 찾을 수 있나?** - 특정 섹션 찾기 어려움

### Sarah
완벽해요!

**Prose의 WHY**:

```
사용자 문제:
1. 긴 글은 시작점을 찾기 어렵다
2. 구조를 파악하기 어렵다
3. 어디가 중요한지 모른다
4. 계속 읽기 지친다
5. 특정 부분을 다시 찾기 어렵다

→ Prose의 목적:
"긴 글을 읽기 쉽고, 스캔 가능하고, 매력적으로 만든다"
```

### Dev (기여자)
오! Field는 "데이터 계약", Prose는 **"읽기 경험"**이네요!

---

## 🎬 Act 3: 사용자 질문 도출 - "독자는 무엇을 궁금해하는가?"

### Yuki (UX 연구원)
사용자가 글을 읽을 때 하는 질문들을 나열해봐요.

### Emma (디자이너)
*(화이트보드에 쓰며)*

**독자의 5가지 핵심 질문**:

1. **"이 글 어디서 시작하지?"**
   - 제목이 뭐야?
   - 부제목은?
   - 작성자는 누구?
   - 언제 썼어?

2. **"이게 제목인가 본문인가?"**
   - 계층이 뭐지?
   - H1? H2? H3?
   - 이게 중요한 부분인가?

3. **"읽기 편한가?"**
   - 글자 크기가 적당한가?
   - 줄 간격은?
   - 너비가 너무 넓지 않나?
   - 색상 대비가 충분한가?

4. **"어디가 중요한 부분이지?"**
   - 강조된 텍스트
   - 인용구
   - 경고/팁 박스
   - 코드 블록

5. **"이 글 빨리 스캔할 수 있나?"**
   - 목차가 있나?
   - 섹션 점프 가능?
   - 현재 위치 표시?

### Marcus (개발자)
오! 이제 질문이 명확하네요!

---

## 🎬 Act 4: Intent 도출 - "질문을 Intent로"

### Sarah (아키텍트)
좋아요! 이제 각 질문을 **Intent**로 변환해봅시다.

---

### 📋 사용자 질문 → Intent 매핑

| 사용자 질문 | Intent | 제공 가치 |
|------------|--------|----------|
| "이 글 어디서 시작하지?" | **Structure** | 문서의 전체 구조 제공 (Section, Document, Container) |
| "이게 제목인가 본문인가?" | **Hierarchy** | 시각적 계층 구조 (Title xl/lg/md/sm, Body, Note) |
| "읽기 편한가?" | **Readability** | 최적의 읽기 환경 (font size, line height, max-width, spacing) |
| "어디가 중요한 부분이지?" | **Emphasis** | 주목할 콘텐츠 강조 (Blockquote, Callout, Code, Mark) |
| "이미지는? 동영상은?" | **Media** | 시각적 콘텐츠 삽입 (Image, Video, Gallery, Figure) |
| "이 글 빨리 스캔할 수 있나?" | **Navigation** | 문서 탐색 지원 (TOC, Anchor, Progress, Breadcrumb) |

### Yuki (UX 연구원)
완벽해요! 6가지 Intent네요!

### Marcus (개발자)
Field도 6개 Intent, Action도 6개 Intent, Prose도 6개 Intent...

우연일까요?

### Sarah
*(웃으며)*

우연이 아니에요. **인간의 인지 한계**예요.

심리학에서 "매직 넘버 7±2" - 사람은 5-9개 정도의 카테고리를 동시에 다룰 수 있어요.

---

## 🎬 Act 5: 기존 Prose 구조 분석

### Alex (문서 작성자)
우리 이미 Prose 컴포넌트 트리가 있잖아요?

`06-comprehensive-prose-component-tree.md` 파일이요!

### Sarah
맞아요! 한번 분석해봅시다.

*(파일 열기)*

### 📋 기존 Prose 트리 (13개 카테고리)

```
Prose
├── Layout        레이아웃
├── Text          텍스트
├── Block         블록
├── List          리스트
├── Media         미디어
├── Data          데이터
├── Interactive   인터랙티브
├── Embed         임베드
├── Navigation    네비게이션
├── Metadata      메타데이터
├── Special       특수
└── Theme         테마
```

### Emma (디자이너)
13개나 되네요! 너무 많은데...

### Sarah
맞아요. 이걸 우리가 도출한 **6개 Intent로 재분류**해봅시다!

---

## 🎬 Act 6: 재분류 작업 - "13개를 6개로"

### Sarah (아키텍트)
*(화이트보드에 표 그리며)*

기존 13개 카테고리를 우리의 6개 Intent로 매핑해봐요!

---

### 📋 재분류 표

| 기존 카테고리 | → | 새 Intent | 이유 |
|--------------|---|-----------|------|
| **Layout** | → | **Structure** | 문서 구조를 만듦 |
| **Text** | → | **Hierarchy** | 시각적 계층을 만듦 |
| **Block** | → | **Emphasis** | 특정 콘텐츠 강조 |
| **List** | → | **Hierarchy** | 정보 계층화 |
| **Media** | → | **Media** | 그대로 유지 |
| **Data** | → | **Emphasis** | 데이터는 강조 목적 |
| **Interactive** | → | ❌ **제외** | Prose는 읽기용, 인터랙션은 Field/Action |
| **Embed** | → | **Media** | 임베드는 미디어의 일종 |
| **Navigation** | → | **Navigation** | 그대로 유지 |
| **Metadata** | → | **Structure** | 문서 메타정보는 구조의 일부 |
| **Special** | → | **Emphasis** | 각주, 사이드노트 = 강조 |
| **Theme** | → | **Readability** | 읽기 편의성 제어 |

### Marcus (개발자)
`Interactive`는 왜 제외하나요?

### Sarah
Prose는 **읽기 전용 콘텐츠**예요.

버튼, 폼 같은 Interactive 요소는:
- `Action` (버튼)
- `Field` (폼)
- 별도 컴포넌트

Prose는 순수하게 **"읽는 경험"**에만 집중해야 해요.

### Yuki (UX 연구원)
아! 그럼 Accordion, Tabs는요?

### Sarah
좋은 질문이에요!

**두 가지 경우**:

1. **탐색용 Accordion** (긴 글 접기/펴기)
   → `Prose.Navigation` (글 스캔을 돕는 도구)

2. **기능용 Accordion** (설정 패널 등)
   → 별도 `Accordion` 컴포넌트 (Prose 밖)

### Emma (디자이너)
완벽해요! **목적**에 따라 분류하는 거네요!

---

## 🎬 Act 7: Prose 6대 Intent 확정

### Sarah (아키텍트)
*(최종 정리)*

---

### 📋 Prose 6대 Intent 정의

#### 1️⃣ Structure (구조)

**WHY**: 독자가 문서의 시작점과 전체 구조를 파악해야 한다

**WHAT**:
- Section - 전체 너비 섹션 컨테이너
- Document - 중앙 정렬 콘텐츠 래퍼 (최적 읽기 너비)
- Container - 의미론적 컨테이너 (article, aside, footer)
- Metadata - 작성자, 날짜, 읽기 시간

**사용자 질문**: "이 글 어디서 시작하지?"

---

#### 2️⃣ Hierarchy (계층)

**WHY**: 독자가 정보의 중요도와 계층을 시각적으로 파악해야 한다

**WHAT**:
- Title (xl/lg/md/sm) - H1, H2, H3, H4
- Body - 본문 텍스트
- Note - 부가 설명, 캡션
- List - 순서/비순서/작업/설명 목록

**사용자 질문**: "이게 제목인가 본문인가?"

---

#### 3️⃣ Readability (가독성)

**WHY**: 독자가 편안하게 오래 읽을 수 있어야 한다

**WHAT**:
- Font Size - 최적 크기 (20px body)
- Line Height - 최적 줄 간격 (1.6)
- Max Width - 최적 읽기 너비 (65-75자)
- Spacing - 단락 간 간격
- Color - 충분한 대비 (WCAG AA)
- Theme - 밝기, 크기, 밀도 조절

**사용자 질문**: "읽기 편한가?"

---

#### 4️⃣ Emphasis (강조)

**WHY**: 독자가 중요한 정보를 빠르게 찾아야 한다

**WHAT**:
- Blockquote - 인용구
- Callout - 주의/팁/경고 박스
- Code - 코드 블록, 인라인 코드
- Mark - 강조 표시 (Strong, Em, Underline)
- Alert - 알림 박스 (Info, Success, Warning, Error)
- Card - 콘텐츠 카드
- Data - 표, 통계, 차트

**사용자 질문**: "어디가 중요한 부분이지?"

---

#### 5️⃣ Media (미디어)

**WHY**: 독자가 시각적 콘텐츠를 통해 이해하고 휴식을 취해야 한다

**WHAT**:
- Image - 이미지 (캡션, 크기 변형)
- Gallery - 이미지 갤러리
- Video - 비디오 (YouTube, Vimeo, 네이티브)
- Audio - 오디오 (Podcast, Spotify)
- Figure - 캡션이 있는 미디어
- Embed - 소셜 미디어, 외부 콘텐츠

**사용자 질문**: "이미지는? 동영상은?"

---

#### 6️⃣ Navigation (탐색)

**WHY**: 독자가 긴 글을 빠르게 스캔하고 원하는 부분으로 점프해야 한다

**WHAT**:
- TableOfContents - 목차 (Sticky, Floating, Inline)
- Anchor - 섹션 링크 (해시 링크, 스무스 스크롤)
- Progress - 읽기 진행률 표시
- Breadcrumb - 현재 위치 표시
- Pagination - 페이지 네비게이션
- Accordion - 접기/펼치기 (긴 섹션용)

**사용자 질문**: "이 글 빨리 스캔할 수 있나?"

---

### Marcus (개발자)
완벽해요! 이제 Field, Action, Prose 전부 6개 Intent네요!

---

## 🎬 Act 8: 3-Tier 구조 설계

### Sarah (아키텍트)
이제 3-Tier 구조로 만들어봅시다!

---

### 📋 Prose 3-Tier 구조

```
Prose (Tier 1: Primitive)
│
├── Structure (Tier 2: Intent)
│   ├── Section (Tier 3: Component)
│   │   ├── Centered
│   │   └── Full
│   ├── Document
│   │   ├── Narrow (640px)
│   │   ├── Default (800px)
│   │   └── Wide (1024px)
│   ├── Container
│   │   ├── Article
│   │   ├── Aside
│   │   └── Footer
│   └── Metadata
│       ├── Author
│       ├── Date
│       └── ReadingTime
│
├── Hierarchy (Tier 2: Intent)
│   ├── Title (Tier 3: Component)
│   │   ├── xl (Display - 80px)
│   │   ├── lg (H1 - 56px)
│   │   ├── md (H2 - 40px)
│   │   └── sm (H3 - 24px)
│   ├── Body
│   │   ├── Default (20px)
│   │   └── Small (16px)
│   ├── Note
│   │   └── Default (14px)
│   └── List
│       ├── Ordered
│       ├── Unordered
│       ├── Task
│       └── Description
│
├── Readability (Tier 2: Intent)
│   ├── Theme (Tier 3: Component)
│   │   ├── Size (sm, base, lg, xl)
│   │   ├── Color (light, dark, warm, cool)
│   │   └── Density (compact, default, comfortable)
│   ├── Spacing
│   │   └── Gap (tight, default, loose)
│   └── Width
│       └── MaxWidth (narrow, default, wide)
│
├── Emphasis (Tier 2: Intent)
│   ├── Blockquote (Tier 3: Component)
│   │   ├── Default
│   │   ├── Callout
│   │   └── Pullquote
│   ├── Callout
│   │   ├── Note
│   │   ├── Important
│   │   ├── Warning
│   │   └── Tip
│   ├── Code
│   │   ├── Inline
│   │   ├── Block
│   │   ├── WithLineNumbers
│   │   └── Diff
│   ├── Mark
│   │   ├── Strong
│   │   ├── Em
│   │   ├── Underline
│   │   └── Highlight
│   ├── Alert
│   │   ├── Info
│   │   ├── Success
│   │   ├── Warning
│   │   └── Error
│   └── Card
│       ├── Default
│       ├── Feature
│       └── Bookmark
│
├── Media (Tier 2: Intent)
│   ├── Image (Tier 3: Component)
│   │   ├── Default
│   │   ├── WithCaption
│   │   ├── Wide
│   │   └── Full
│   ├── Gallery
│   │   ├── Grid
│   │   ├── Masonry
│   │   └── Carousel
│   ├── Video
│   │   ├── Native
│   │   ├── YouTube
│   │   └── Vimeo
│   ├── Audio
│   │   ├── Native
│   │   └── Podcast
│   └── Figure
│       ├── Default
│       └── WithCredit
│
└── Navigation (Tier 2: Intent)
    ├── TableOfContents (Tier 3: Component)
    │   ├── Sticky
    │   ├── Floating
    │   └── Inline
    ├── Anchor
    │   ├── HashLink
    │   └── SmoothScroll
    ├── Progress
    │   ├── Bar
    │   └── Circle
    ├── Breadcrumb
    │   └── Default
    └── Accordion
        ├── Single
        └── Multiple
```

---

## 🎬 Act 9: 사용 예시 - 3가지 레벨

### Emma (디자이너)
실제로 어떻게 쓰는 거예요?

### Sarah
3가지 레벨로 보여드릴게요!

---

### Level 1: Simple (Props 기반)

```tsx
// 간단한 블로그 글
<Prose
  title="Understanding Design Systems"
  author="Sarah Chen"
  date="2026-01-15"
  maxWidth="default"
>
  <Prose.Body>
    Design systems are the foundation of modern UI development...
  </Prose.Body>

  <Prose.Title variant="md">What is a Design System?</Prose.Title>

  <Prose.Body>
    A design system is a collection of reusable components...
  </Prose.Body>

  <Prose.Image src="/image.jpg" caption="Example design system" />
</Prose>
```

**특징**: 빠르고 간단, 기본 읽기 경험 제공

---

### Level 2: Structured (Intent 그룹)

```tsx
// Intent별로 명확히 구분
<Prose>
  {/* Structure Intent */}
  <Prose.Structure>
    <Prose.Metadata>
      <Prose.Author name="Sarah Chen" avatar="/avatar.jpg" />
      <Prose.Date published="2026-01-15" />
      <Prose.ReadingTime minutes={10} />
    </Prose.Metadata>
  </Prose.Structure>

  {/* Hierarchy Intent */}
  <Prose.Hierarchy>
    <Prose.Title variant="xl">Understanding Design Systems</Prose.Title>
    <Prose.Body>Content here...</Prose.Body>
  </Prose.Hierarchy>

  {/* Emphasis Intent */}
  <Prose.Emphasis>
    <Prose.Callout type="note">
      This is an important concept!
    </Prose.Callout>
  </Prose.Emphasis>

  {/* Media Intent */}
  <Prose.Media>
    <Prose.Image src="/image.jpg" caption="Example" />
  </Prose.Media>
</Prose>
```

**특징**: Intent가 명확, 구조화된 콘텐츠

---

### Level 3: Explicit (완전 제어)

```tsx
// 모든 Intent와 Component 명시
<Prose>
  {/* Structure Intent - Document Container */}
  <Prose.Structure.Section surface="sunken" p="120 0">
    <Prose.Structure.Document maxWidth="narrow">

      {/* Structure Intent - Metadata */}
      <Prose.Structure.Metadata>
        <Prose.Structure.Author>
          <Avatar src="/avatar.jpg" />
          <Name>Sarah Chen</Name>
          <Bio>Senior Architect</Bio>
        </Prose.Structure.Author>
        <Prose.Structure.Date>
          <Published>2026-01-15</Published>
          <Updated>2026-01-16</Updated>
        </Prose.Structure.Date>
      </Prose.Structure.Metadata>

      {/* Hierarchy Intent - Title */}
      <Prose.Hierarchy.Title variant="xl" align="center">
        Understanding Design Systems
      </Prose.Hierarchy.Title>

      {/* Navigation Intent - TOC */}
      <Prose.Navigation.TableOfContents sticky>
        <Prose.Navigation.Anchor href="#intro">Introduction</Prose.Navigation.Anchor>
        <Prose.Navigation.Anchor href="#basics">Basics</Prose.Navigation.Anchor>
      </Prose.Navigation.TableOfContents>

      {/* Hierarchy Intent - Body */}
      <Prose.Hierarchy.Body id="intro">
        Design systems are the foundation...
      </Prose.Hierarchy.Body>

      {/* Emphasis Intent - Callout */}
      <Prose.Emphasis.Callout type="important">
        <Prose.Emphasis.CalloutTitle>Key Takeaway</Prose.Emphasis.CalloutTitle>
        <Prose.Emphasis.CalloutBody>
          Always start with intent, not implementation.
        </Prose.Emphasis.CalloutBody>
      </Prose.Emphasis.Callout>

      {/* Media Intent - Figure */}
      <Prose.Media.Figure>
        <Prose.Media.Image src="/design-system.jpg" />
        <Prose.Media.Caption>
          Example of a design system architecture
        </Prose.Media.Caption>
        <Prose.Media.Credit>Photo by John Doe</Prose.Media.Credit>
      </Prose.Media.Figure>

    </Prose.Structure.Document>
  </Prose.Structure.Section>

  {/* Readability Intent - Theme Control */}
  <Prose.Readability.Theme size="lg" density="comfortable" />
</Prose>
```

**특징**: 최대 제어, 커스텀 UI, 복잡한 레이아웃

---

## 🎬 Act 10: Intent → Props 매핑

### Marcus (개발자)
각 Intent는 어떤 Props를 가져야 하나요?

### Sarah
Intent별로 정리해볼게요!

---

### 📋 Intent별 Props 표

#### Structure Intent Props

| Component | Props | Type | 설명 |
|-----------|-------|------|------|
| **Section** | `surface` | SurfaceToken | 배경 색상 |
| | `p` | string \| number | 패딩 |
| | `maxWidth` | ContainerToken | 내부 Document 최대 너비 |
| **Document** | `maxWidth` | "narrow"\|"default"\|"wide" | 최대 너비 (640/800/1024) |
| | `gap` | number | 자식 간격 |
| | `p` | string \| number | 좌우 패딩 |
| **Metadata** | `author` | string \| AuthorObject | 작성자 정보 |
| | `date` | string \| Date | 작성일 |
| | `readingTime` | number | 읽기 시간 (분) |

#### Hierarchy Intent Props

| Component | Props | Type | 설명 |
|-----------|-------|------|------|
| **Title** | `variant` | "xl"\|"lg"\|"md"\|"sm" | 크기 (80/56/40/24px) |
| | `as` | "h1"\|"h2"\|"h3"\|"h4" | HTML 태그 |
| | `align` | "left"\|"center"\|"right" | 정렬 |
| | `id` | string | 앵커 링크용 ID |
| **Body** | `variant` | "default"\|"small" | 크기 (20/16px) |
| | `as` | "p"\|"div" | HTML 태그 |
| **List** | `type` | "ordered"\|"unordered"\|"task" | 목록 타입 |
| | `marker` | string | 커스텀 마커 |

#### Readability Intent Props

| Component | Props | Type | 설명 |
|-----------|-------|------|------|
| **Theme** | `size` | "sm"\|"base"\|"lg"\|"xl" | 전체 크기 스케일 |
| | `color` | "light"\|"dark"\|"warm"\|"cool" | 색상 테마 |
| | `density` | "compact"\|"default"\|"comfortable" | 간격 밀도 |
| **Spacing** | `gap` | "tight"\|"default"\|"loose" | 단락 간격 |
| **Width** | `maxWidth` | number \| ContainerToken | 최대 너비 |

#### Emphasis Intent Props

| Component | Props | Type | 설명 |
|-----------|-------|------|------|
| **Blockquote** | `variant` | "default"\|"callout"\|"pullquote" | 스타일 |
| | `cite` | string | 출처 |
| **Callout** | `type` | "note"\|"important"\|"warning"\|"tip" | 타입 |
| | `title` | string | 제목 |
| | `icon` | ReactNode | 아이콘 |
| **Code** | `language` | string | 프로그래밍 언어 |
| | `showLineNumbers` | boolean | 줄 번호 표시 |
| | `highlight` | number[] | 강조할 줄 |
| **Alert** | `type` | "info"\|"success"\|"warning"\|"error" | 타입 |
| | `dismissible` | boolean | 닫기 가능 |

#### Media Intent Props

| Component | Props | Type | 설명 |
|-----------|-------|------|------|
| **Image** | `src` | string | 이미지 URL |
| | `alt` | string | 대체 텍스트 |
| | `caption` | string | 캡션 |
| | `width` | "default"\|"wide"\|"full" | 너비 |
| | `rounded` | boolean | 둥근 모서리 |
| **Video** | `src` | string | 비디오 URL |
| | `provider` | "native"\|"youtube"\|"vimeo" | 제공자 |
| | `autoplay` | boolean | 자동 재생 |
| **Gallery** | `layout` | "grid"\|"masonry"\|"carousel" | 레이아웃 |
| | `columns` | number | 그리드 열 수 |

#### Navigation Intent Props

| Component | Props | Type | 설명 |
|-----------|-------|------|------|
| **TableOfContents** | `position` | "sticky"\|"floating"\|"inline" | 위치 |
| | `depth` | number | 표시할 제목 깊이 (1-4) |
| | `activeId` | string | 현재 활성 섹션 |
| **Anchor** | `href` | string | 링크 (해시 포함) |
| | `smooth` | boolean | 스무스 스크롤 |
| **Progress** | `current` | number | 현재 스크롤 위치 |
| | `total` | number | 전체 길이 |
| | `variant` | "bar"\|"circle" | 표시 형태 |

---

## 🎬 Act 11: 최종 비교 - 기존 vs 새로운

### Alex (문서 작성자)
기존 구조와 어떻게 다른가요?

### Sarah
비교해볼게요!

---

### 📋 비교표: 기존 vs 새로운

| 측면 | 기존 (13 카테고리) | 새로운 (6 Intent) |
|------|-------------------|-------------------|
| **분류 기준** | 기술적 (Layout, Text, Block) | 사용자 중심 (Structure, Hierarchy, Readability) |
| **카테고리 수** | 13개 | 6개 |
| **API 구조** | Flat (`Prose.Section`, `Prose.Title`) | 3-Tier (`Prose.Structure.Section`, `Prose.Hierarchy.Title`) |
| **Intent 가시성** | 숨김 (문서에만) | 드러남 (API 구조) |
| **사용자 질문** | 없음 | 각 Intent마다 명확한 질문 |
| **확장성** | 새 컴포넌트마다 카테고리 고민 | Intent 맞추면 자동으로 위치 결정 |
| **학습 곡선** | 13개 카테고리 외우기 | 6개 Intent 이해하기 |
| **문서화** | 수동 (각 컴포넌트 설명) | 자동 (Intent가 목적 설명) |

### Yuki (UX 연구원)
6개 Intent가 훨씬 이해하기 쉬워요!

### Dev (기여자)
오픈소스 기여자도 Intent 보면 바로 알겠네요!

---

## 🎬 Act 12: 마이그레이션 전략

### Marcus (개발자)
기존 코드는 어떻게 하죠?

### Sarah
점진적으로 마이그레이션해요!

---

### 📋 마이그레이션 로드맵

#### Phase 1: 새 Prose Intent API 구현
```tsx
// 새 API 추가 (기존과 병행)
export const Prose = {
  Structure: { ... },
  Hierarchy: { ... },
  Readability: { ... },
  Emphasis: { ... },
  Media: { ... },
  Navigation: { ... },
}
```

#### Phase 2: 호환 레이어 제공
```tsx
// 기존 API도 작동 (deprecated)
Prose.Section → Prose.Structure.Section
Prose.Title → Prose.Hierarchy.Title
Prose.Body → Prose.Hierarchy.Body
```

#### Phase 3: 점진적 마이그레이션
```tsx
// 1단계: 앱 코드 마이그레이션
// 2단계: 문서 업데이트
// 3단계: 기존 API deprecated 표시
```

#### Phase 4: 기존 API 제거 (Major version)
```tsx
// Prose.Section 제거
// Prose.Structure.Section만 사용
```

---

## 🎬 Act 13: 최종 정리

### Sarah (아키텍트)
*(정리하며)*

오늘 우리는 Prose의 **WHY와 Intent**를 명확히 했어요!

---

### 📋 최종 요약

#### Prose WHY
**"긴 글을 읽기 쉽고, 스캔 가능하고, 매력적으로 만든다"**

#### Prose 6대 Intent

1. **Structure** - 문서의 시작점과 전체 구조 제공
2. **Hierarchy** - 시각적 계층 구조로 정보 조직화
3. **Readability** - 최적의 읽기 환경 제공
4. **Emphasis** - 중요한 콘텐츠 강조
5. **Media** - 시각적 콘텐츠로 이해 돕고 휴식 제공
6. **Navigation** - 빠른 스캔과 섹션 점프 지원

#### 사용자 질문 매핑

| Intent | 사용자 질문 |
|--------|------------|
| Structure | "이 글 어디서 시작하지?" |
| Hierarchy | "이게 제목인가 본문인가?" |
| Readability | "읽기 편한가?" |
| Emphasis | "어디가 중요한 부분이지?" |
| Media | "이미지는? 동영상은?" |
| Navigation | "이 글 빨리 스캔할 수 있나?" |

---

### Everyone
*(박수)*

**Prose Intent 정의 완료!** 🎉

---

## 📊 다음 단계

### 즉시
- [ ] Prose Intent API 구현 시작
- [ ] Structure Intent 우선 구현 (Section, Document)
- [ ] Hierarchy Intent 구현 (Title, Body, Note)

### 단기
- [ ] Readability Intent 구현 (Theme, Spacing)
- [ ] Emphasis Intent 구현 (Blockquote, Callout, Code)
- [ ] Media Intent 구현 (Image, Video, Figure)

### 중기
- [ ] Navigation Intent 구현 (TOC, Anchor, Progress)
- [ ] 기존 Prose 컴포넌트 마이그레이션
- [ ] Storybook 문서 업데이트

---

**회의 종료**: 2026년 1월 15일 오후 6시
**결과**: Prose 6대 Intent 정의 완료
**다음 회의**: Prose.Structure 구현 (내일 오전)

---

## 💡 핵심 인사이트

### Sarah의 마지막 말

> "Field는 '데이터 계약', Action은 '상태 변화', Prose는 **'읽기 경험'**이에요. 각각의 WHY가 다르니, Intent도 다를 수밖에 없어요. 3-Tier는 보편적이지만, Intent는 컴포넌트마다 고유해요."

### 3가지 교훈

1. **Same Pattern, Different Intent**
   - 3-Tier 패턴은 동일
   - Intent는 컴포넌트의 본질에서 도출

2. **User Questions Drive Intent**
   - 사용자 질문을 먼저 정의
   - 질문 → Intent → Component 순서

3. **Simplify Through Intent**
   - 13개 카테고리 → 6개 Intent
   - 더 적지만 더 명확

---

**MDK Prose 슬로건**:

# **"Read with Ease, Navigate with Intent"**
### 읽기는 쉽게, 탐색은 Intent로
