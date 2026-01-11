# IDDL: Intent-Driven Design Language

> **HTML for Documents. IDDL for Applications.**

웹은 30년간 **문서의 언어(HTML)**로 **앱**을 만들어왔습니다.
이제 앱을 위한 언어가 필요합니다.

---

## 🤔 The Problem: 잘못된 도구

### HTML은 문서를 위해 만들어졌습니다

1993년, HTML이 탄생했습니다. **문서를 공유하기 위한 언어**였습니다.

```html
<h1>제목</h1>
<p>문단</p>
<a href="...">다른 문서로</a>
```

30년이 지난 지금, 우리는 여전히 이 언어로 Figma를, Notion을, VSCode를 만듭니다.

```html
<div class="button" onclick="...">
<div class="list">
  <div class="item" tabindex="0" role="option" aria-selected="true">
```

**문서의 언어로 도구를 만들고 있습니다.**

---

### 문서와 앱은 근본적으로 다릅니다

| | 문서 (Document) | 앱 (Tool/Application) |
|--|----------------|----------------------|
| 사용자 행동 | 읽는다, 클릭한다 | 탐색한다, 선택한다, 조작한다, 만든다 |
| 키보드 | Tab으로 링크 이동 | 모든 조작이 가능해야 함 (↑↓←→, Space, Enter) |
| 선택 | 텍스트 드래그 | 항목 선택 → 명령 실행 (Shift+클릭, Ctrl+A) |
| 멘탈 모델 | "페이지를 본다" | "도구를 쓴다" |

**HTML에는 앱의 개념이 없습니다.**

```
HTML이 아는 것:
- 제목 (h1), 문단 (p), 링크 (a)
- 폼 (form, input)
- 표 (table)

HTML이 모르는 것:
- 탐색 (Navigation): ↑↓로 항목 이동
- 선택 (Selection): Shift+클릭 범위 선택
- 포커스 관리 (Focus Scope): 모달 안에서 포커스 갇히기
- 계층 (Hierarchy): 앱의 구조적 의미
- 의도 (Intent): 왜 이 버튼이 파란색인가?
- 중요도 (Prominence): 어떤 요소가 중요한가?
```

그래서 **모든 웹 개발자는 같은 코드를 반복해서 작성합니다.**

```javascript
// 키보드 탐색? 직접 만들어야 합니다
element.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') { /* 다음 항목으로 */ }
  if (e.key === 'ArrowUp') { /* 이전 항목으로 */ }
  if (e.key === 'Home') { /* 맨 처음으로 */ }
  if (e.key === 'End') { /* 맨 끝으로 */ }
  if (e.key === ' ') { /* 선택 토글 */ }
  if (e.shiftKey && e.key === 'ArrowDown') { /* 범위 선택 */ }
  // ... 수백 줄
});

// 다중 선택? 직접 만들어야 합니다
const [selected, setSelected] = useState(new Set());
const handleClick = (id, e) => {
  if (e.shiftKey) { /* 범위 선택 로직 */ }
  else if (e.ctrlKey) { /* 토글 선택 로직 */ }
  else { /* 단일 선택 로직 */ }
};

// 포커스 관리? ARIA? 접근성? 모두 직접 만들어야 합니다...
```

**Figma 팀도, Notion 팀도, Linear 팀도 모두 같은 코드를 작성합니다.**

---

### 반면, 네이티브 앱 개발자는...

```swift
// iOS - 끝. 선택, 탐색, 접근성 모두 자동.
List(items, selection: $selected) { item in
    Text(item.name)
}
```

```kotlin
// Android - 끝.
LazyColumn {
    items(list) { item ->
        SelectableItem(item)
    }
}
```

**"그냥 됩니다."**
웹 개발자만 고통받고 있습니다.

---

## ✨ The Solution: IDDL

### IDDL은 앱을 위한 선언적 언어입니다

```tsx
// IDDL로 선언하면
<Navigable orientation="vertical">
  <Selectable mode="extended">
    <Block role="List">
      <Action role="ListItem" id="1">Item 1</Action>
      <Action role="ListItem" id="2">Item 2</Action>
      <Action role="ListItem" id="3">Item 3</Action>
    </Block>
  </Selectable>
</Navigable>
```

**자동으로 되는 것:**

- ✅ ↑↓ 키보드 탐색 (Navigable)
- ✅ Home/End 처음/끝으로
- ✅ 클릭 선택 (Selectable)
- ✅ Ctrl+클릭 토글
- ✅ Shift+클릭 범위 선택
- ✅ Ctrl+A 전체 선택
- ✅ Space 토글
- ✅ Typeahead (글자 입력으로 점프)
- ✅ `role="listbox"`, `aria-selected` 자동
- ✅ 스크린리더 완벽 호환
- ✅ 포커스 링 표시

**개발자가 한 일: 의도를 선언했을 뿐입니다.**

---

## 🎯 Core Concepts: 핵심 개념

### 1. Intent over Implementation

IDDL은 **"어떻게 보이는가"**가 아니라 **"무엇을 의도하는가"**를 선언합니다.

```tsx
// ❌ 구현 중심 (HTML/CSS)
<button className="bg-red-500 text-white px-4 py-2 rounded">
  삭제
</button>

// ✅ 의도 중심 (IDDL)
<Action intent="Critical" prominence="Primary">
  삭제
</Action>
```

`intent="Critical"`은 "위험한 행동"이라는 **의미**입니다.
빨간색일 수도, 경고 아이콘일 수도, 확인 다이얼로그가 뜰 수도 있습니다.
**렌더러가 결정합니다.** 의도는 보존됩니다.

### 2. Behavior Primitives: 선언적 인터랙션

인터랙션도 선언합니다. 구현하지 않습니다.

| Primitive | 의도 | 자동으로 제공되는 것 |
|-----------|------|---------------------|
| `<Navigable>` | "키보드로 탐색할 수 있다" | ↑↓←→, Home/End, Typeahead, 포커스 관리 |
| `<Selectable>` | "선택할 수 있다" | 클릭, Shift+클릭, Ctrl+A, Space, ARIA |
| `<FocusScope>` | "포커스가 갇힌다" | Tab 순환, Escape, 포커스 복원 |
| `<Reorderable>` | "순서를 바꿀 수 있다" | Drag & Drop, 키보드 이동, ARIA |
| `<Expandable>` | "펼치고 접을 수 있다" | → 펼치기, ← 접기, ARIA |
| `<Dismissable>` | "닫을 수 있다" | Escape, 외부 클릭, ARIA |

**예시: 파일 탐색기 (실제 작동 코드)**

```tsx
<Navigable orientation="vertical" typeahead>
  <Selectable mode="extended">
    <Block role="List">
      <Action role="ListItem" id="1">📄 README.md</Action>
      <Action role="ListItem" id="2">📁 src</Action>
      <Action role="ListItem" id="3">📄 package.json</Action>
    </Block>
  </Selectable>
</Navigable>
```

이것만으로:
- ↑↓로 탐색 (Navigable)
- 'r' 입력하면 README로 점프 (Typeahead)
- Shift+↓로 범위 선택 (Selectable)
- Ctrl+A로 전체 선택
- Space로 토글
- **코드 0줄로 완벽한 인터랙션**

### 3. Two-Track Architecture

IDDL은 **두 종류의 개발자**를 위해 설계되었습니다.

#### Track 1: 앱 개발자 (당신)

**Role만 선언합니다.** 복잡한 인터랙션은 신경 쓰지 않습니다.

```tsx
// 이것만 작성하면 됩니다
<Block role="List" selection="extended">
  <Action role="ListItem" id="1">항목 1</Action>
</Block>
```

#### Track 2: 렌더러/테마 개발자

**Behavior Primitives와 Hooks**로 렌더러를 구현합니다.

```tsx
// List 렌더러 구현 (한 번만)
registerRenderer('List', ({ children, spec }) => (
  <Navigable orientation="vertical">
    <Selectable mode={spec?.selection ?? 'none'}>
      <ul className="my-brand-list">
        {children}
      </ul>
    </Selectable>
  </Navigable>
));
```

**복잡성이 올바르게 분배됩니다:**

| | 앱 개발자 | 렌더러 개발자 |
|--|----------|--------------|
| 해야 할 일 | 비즈니스 로직, 의도 선언 | 인터랙션 구현, 스타일링 |
| 복잡도 | 낮음 | 높음 (하지만 한 번만) |
| 반복 여부 | 앱마다 작성 | 한 번 만들면 재사용 |

### 4. 렌더러 자율성

같은 IDDL 문서가 **다른 모습**으로 렌더링될 수 있습니다.

```
[IDDL 문서]
     │
     ├──→ [렌더러 A: Material Design] → 구글 스타일 UI
     │
     ├──→ [렌더러 B: Apple HIG] → 애플 스타일 UI
     │
     └──→ [렌더러 C: 우리 브랜드] → 커스텀 UI
```

**의도는 보존됩니다.** 표현만 달라집니다.

---

## 🏗️ Architecture: IDDL 계층 구조

### Page → Section → Block → Element

```
Page (페이지)
  └─ Section (영역: Header, Sidebar, Main, Modal...)
       └─ Block (덩어리: Card, List, Form, Toolbar...)
            └─ Element (요소: Text, Field, Action, Separator...)
```

### 5축 (The 5 Axes)

모든 노드는 5가지 축으로 정의됩니다:

| 축 | 질문 | 예시 |
|----|------|------|
| **Type** | 이것은 무엇인가? | Text, Field, Action, Block |
| **Role** | 어떤 역할인가? | List, Card, Button, Modal |
| **Prominence** | 얼마나 중요한가? | Hero, Primary, Secondary, Tertiary |
| **Intent** | 어떤 의미인가? | Neutral, Brand, Positive, Critical |
| **Density** | 얼마나 촘촘한가? | Comfortable, Standard, Compact |

이 5가지 속성만으로 **모든 시각적 결정이 자동**으로 이루어집니다.

---

## 🎨 Example: Real-World Use Cases

### 파일 탐색기

```tsx
<Navigable orientation="vertical">
  <Selectable mode="extended">
    <Block role="TreeView">
      <Block role="TreeItem" id="docs" expanded>
        <Text role="Label">📁 Documents</Text>
        <Action role="TreeItem" id="doc-1">📄 report.pdf</Action>
        <Action role="TreeItem" id="doc-2">📄 notes.txt</Action>
      </Block>
    </Block>
  </Selectable>
</Navigable>
```

**자동으로 제공되는 것:**
- ↑↓ 탐색
- → 펼치기, ← 접기
- Shift+↑↓ 범위 선택
- Enter 열기
- Drag & Drop (Reorderable 추가 시)
- 완벽한 접근성 (ARIA, 스크린리더)

### 모달 다이얼로그

```tsx
<FocusScope trap restoreFocus>
  <Dismissable onEscape="close" onClickOutside="close">
    <Section role="Modal" title="파일 삭제 확인">
      <Block role="Card">
        <Text role="Heading">정말 삭제하시겠습니까?</Text>
        <Text role="Body">이 작업은 되돌릴 수 없습니다.</Text>

        <Block role="Toolbar">
          <Action prominence="Secondary">취소</Action>
          <Action intent="Critical">삭제</Action>
        </Block>
      </Block>
    </Section>
  </Dismissable>
</FocusScope>
```

**자동으로 제공되는 것:**
- 열릴 때 첫 번째 요소에 포커스
- Tab이 모달 안에서 순환
- Escape로 닫기
- 외부 클릭으로 닫기
- 닫힐 때 원래 위치로 포커스 복원
- `aria-modal="true"`, `role="dialog"` 자동

### 슬라이드 썸네일 (PPT-style)

```tsx
<Navigable orientation="both">
  <Selectable mode="extended">
    <Block role="Grid" layout="grid-4">
      <Action role="GridItem" id="slide-1">
        <ThumbnailPreview slide={slide1} />
      </Action>
      <Action role="GridItem" id="slide-2">
        <ThumbnailPreview slide={slide2} />
      </Action>
      {/* ... */}
    </Block>
  </Selectable>
</Navigable>
```

**자동으로 제공되는 것:**
- ↑↓←→ 2D 탐색
- Shift+클릭 범위 선택
- Delete 키로 삭제
- Enter로 편집 모드
- 체크마크 표시
- 완벽한 키보드 접근성

**→ [Live Demo: /behavior](http://localhost:5175/#/behavior)** - 3가지 실제 작동 예제

---

## 🎯 Accessibility is Default

IDDL로 만든 앱은 **자동으로 접근성을 갖습니다.**

```tsx
// 개발자가 작성
<Selectable mode="multiple">
  <Block role="List">
    <Action role="ListItem" id="1">Apple</Action>
  </Block>
</Selectable>

// 렌더링 결과 (자동)
<ul role="listbox" aria-multiselectable="true">
  <li role="option" aria-selected="false" tabindex="-1" id="1">
    Apple
  </li>
</ul>
```

**자동으로 제공:**
- ARIA 역할 자동 설정
- 키보드 탐색 자동 지원
- 스크린리더 호환
- 포커스 관리 자동

**접근성을 "추가"하는 게 아닙니다. 접근성이 "기본"입니다.**

---

## 🤖 AI Era: LLM-Friendly

### AI가 UI를 생성하려면 구조화된 언어가 필요합니다

```
❌ "빨간 버튼 만들어줘"
   → AI: <button style="background: red">???</button>
   → 의도 소실, 접근성 없음, 맥락 없음

✅ "위험한 액션 버튼 만들어줘"
   → AI: <Action intent="Critical">삭제</Action>
   → 의도 보존, 접근성 자동, 렌더러가 해석
```

IDDL은 **AI가 이해하고 생성할 수 있는 언어**입니다.

**LLM이 IDDL을 생성하는 방법:**

```
User: "슬라이드 썸네일 리스트를 만들어줘.
       방향키로 탐색 가능하고, 여러 개 선택할 수 있어야 해."

LLM 추론:
1. "방향키로 탐색" → <Navigable>
2. "여러 개 선택" → <Selectable mode="extended">
3. "썸네일 리스트" → <Block role="Grid">

생성된 코드:
<Navigable orientation="both">
  <Selectable mode="extended">
    <Block role="Grid">
      <Action role="GridItem" id="1">Slide 1</Action>
      <Action role="GridItem" id="2">Slide 2</Action>
    </Block>
  </Selectable>
</Navigable>
```

---

## 🚀 Current Status

### ✅ Phase 1: Declarative UI (~80% Complete)

| 기능 | 상태 |
|------|------|
| **IDDL Core** | ✅ Spec 완성 |
| **Behavior Primitives** | ✅ Navigable, Selectable 완성 |
| **Design Tokens** | ✅ 색상, 간격, 타이포그래피 |
| **Layout System** | ✅ Depth-based 계층 |
| **Theme System** | ✅ Light/Dark, Density |
| **Page Component** | ✅ 4가지 PageRole |
| **Resizable Panels** | ✅ 드래그 리사이징 |
| **Command Palette** | ✅ Cmd+K 검색 |
| **IDDL Inspector** | ✅ Cmd+D 디버깅 |

### 🚧 Phase 2-3: Coming Soon

- **Phase 2**: 데이터 바인딩 & 상태 (model, validation)
- **Phase 3**: 고급 인터랙션 (Drag & Drop, Undo/Redo, Context Menu)

**→ [Full Roadmap](./docs/2-areas/core/0-evolution/application-platform-vision.md)**

---

## 🎯 Quick Start

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/ide-ui-kit.git
cd ide-ui-kit

# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Open browser
# http://localhost:5175
```

### Your First IDDL

```tsx
import { Navigable, Selectable } from '@/shared/lib/behavior';
import { Block, Action } from '@/components/types';

function FileExplorer() {
  return (
    <Navigable orientation="vertical" typeahead>
      <Selectable mode="extended">
        <Block role="List">
          <Action role="ListItem" id="1">📄 README.md</Action>
          <Action role="ListItem" id="2">📁 src</Action>
          <Action role="ListItem" id="3">📄 package.json</Action>
        </Block>
      </Selectable>
    </Navigable>
  );
}
```

**That's it.** 키보드 탐색, 선택, 접근성 모두 자동.

---

## 📚 Documentation

### Learning Path

**[📖 Full Documentation](./docs/)**

1. **[Getting Started](./docs/2-areas/core/1-getting-started/)** - IDDL 소개 (30분)
2. **[Core Concepts](./docs/2-areas/core/behavior/)** - Navigable, Selectable (1시간)
3. **[Components](./docs/2-areas/spec/)** - Page, Section, Block, Element (2시간)
4. **[Behavior Showcase](http://localhost:5175/#/behavior)** - 실제 작동 예제

### Key Documents

**Vision & Strategy:**
- [Application Platform Vision](./docs/2-areas/core/0-evolution/application-platform-vision.md)
- [Phase 1: Declarative UI](./docs/2-areas/core/0-evolution/phase-1-declarative-ui.md)
- [Enterprise Features Checklist](./docs/2-areas/core/0-evolution/enterprise-features-checklist.md)

**Behavior Primitives:**
- [Web vs App: 본질적 차이](./docs/2-areas/core/behavior/01-web-vs-app.md)
- [Navigable Specification](./docs/2-areas/core/behavior/02-navigable.md)
- [Selectable Specification](./docs/2-areas/core/behavior/03-selectable.md)
- [PPT Thumbnail Example](./docs/2-areas/core/behavior/04-ppt-thumbnail-example.md)

**IDDL Specification:**
- [IDDL 1.0 Spec](./docs/2-areas/spec/iddl-spec-1.0.1.md)
- [Field Specification](./docs/2-areas/spec/5-field/field.spec.md)
- [Page Specification](./docs/2-areas/spec/1-page/)

---

## 🌍 Vision

### Timeline

```
2026: IDDL 1.0 출시
      - 코어 스펙 확정
      - Behavior Primitives (Navigable, Selectable, FocusScope)
      - 기본 렌더러 (React)

2027: 생태계 성장
      - 다양한 렌더러 (Vue, Svelte, React Native)
      - 디자인 도구 연동
      - AI 생성 지원

2028: 표준화
      - W3C 제안
      - 브라우저 네이티브 논의

20XX: 웹의 새로운 기본
      - HTML + IDDL
      - 문서와 앱의 공존
```

### Why Now?

#### 1. 복잡해지는 웹 앱

- Figma, Notion, Linear, VSCode Web
- 모두 같은 인터랙션 패턴 구현
- 공통의 언어 필요

#### 2. AI 시대

- AI가 UI를 생성하려면 구조화된 언어 필요
- IDDL은 AI가 이해하고 생성할 수 있는 언어

#### 3. 접근성 위기

- 웹 앱의 80%가 접근성 부족
- IDDL은 접근성을 기본으로 제공

---

## 🤝 Contributing

IDDL은 오픈소스 프로젝트입니다.

### How to Contribute

1. **Renderer 구현**: Vue, Svelte, React Native 등
2. **Behavior Primitives**: 새로운 primitive 제안
3. **문서 개선**: 번역, 예시 추가
4. **피드백**: Issue에 사용 사례 공유

### Community

- **GitHub**: [Issues](https://github.com/your-org/ide-ui-kit/issues) | [Discussions](https://github.com/your-org/ide-ui-kit/discussions)
- **Documentation**: [Full Docs](./docs/)

---

## 📄 License

MIT License

---

## 🙏 Acknowledgments

IDDL은 다음에서 영감을 받았습니다:

- **Declarative UI**: SwiftUI, Flutter, React
- **Design Tokens**: Design System 커뮤니티
- **Intent-Based Design**: Material Design, Human Interface Guidelines
- **Accessibility**: WAI-ARIA, WCAG
- **LLM-Friendly DSL**: OpenAPI, JSON Schema

---

## 마무리

> 우리는 30년간 문서의 언어로 앱을 만들어왔습니다.
>
> `<div>`로 버튼을 만들고,
> `<span>`으로 뱃지를 만들고,
> JavaScript로 키보드를 붙이고,
> CSS로 의미를 표현했습니다.
>
> 이제 앱의 언어가 필요합니다.
>
> 의도를 선언하면 구현이 따라오는.
> 키보드가 기본인.
> 접근성이 당연한.
> 브랜드가 바뀌어도 의미는 보존되는.
>
> **IDDL.**
> **Intent-Driven Design Language.**
>
> *앱의 언어.*

---

<p align="center">
  <strong>HTML for Documents. IDDL for Applications.</strong>
</p>

<p align="center">
  <strong>Status</strong>: Phase 1 (Declarative UI) ~80% Complete | Phase 2-3 Coming Soon
</p>

<p align="center">
  Built with ❤️ for Enterprise Applications
</p>
