# Page Specification (IDDL v5.0)

> "The Page is the Gateway to the Design System."

## 1. Philosophy: Responsibility & Role

**Page**는 애플리케이션의 **최상위 루트(Root)**로서, 다음 3가지 핵심 책임을 가집니다.

### 1-1. Gateway Principle (진입점)
Page는 단순한 `<div>`가 아닙니다. Design System의 모든 전역 상태(Token, Theme, Context)를 초기화하고 공급하는 **Gateway**입니다.
- 개발자가 별도의 `Provider`를 감쌀 필요가 없습니다. `<Page>` 하나만 선언하면 IDDL의 모든 기능이 활성화됩니다.

### 1-2. Physics (물리 법칙)
Page는 브라우저 뷰포트와의 **물리적 관계**를 규정합니다.
- **Scroll Subject (스크롤 주체)**: 스크롤이 `window`에서 발생하는가(`Document`), 내부 `div`에서 발생하는가(`Application`)?
- **Height Constraint (높이 제약)**: 콘텐츠만큼 늘어나는가(`Document`), 100vh에 고정되는가(`Application`)?
- **Overflow (넘침 처리)**: 넘쳤을 때 잘리는가(`Hidden`), 스크롤되는가(`Auto`)?

### 1-3. Zoning (공간 구획)
Page는 내부 콘텐츠의 **논리적 배치 전략**을 결정합니다.
- "헤더를 상단에, 사이드바를 좌측에, 내용을 중앙에 두겠다"라는 선언을 실제 Grid/Flex 구조로 변환합니다.

---

## 2. Why Divide Role & Layout? (Orthogonality)

왜 `PageType` 하나로 퉁치지 않고, `Role`과 `Layout`으로 나누었는가?
이 두 가지 속성은 서로 **직교(Orthogonal)**하기 때문입니다. 즉, 서로 독립적인 변수입니다.

### 2-1. Role (Physics) - "How it behaves"
사용자가 페이지를 '어떤 감각'으로 느끼는지를 결정합니다.
- **Document**: "웹 문서를 읽는다" (블로그, 뉴스)
- **Application**: "앱을 사용한다" (VS Code, Gmail)
- **Immersive**: "경험에 몰입한다" (제품 소개, PT)

### 2-2. Layout (Geometry) - "How it looks"
정보가 '어디에 위치'하는지를 결정합니다.
- **Single**: 중앙 집중형
- **Sidebar**: 좌측 탐색형
- **Workbench**: 다중 패널형

### 2-3. The Matrix (Coverage)
이 둘을 분리함으로써, 우리는 $M \times N$ 개의 조합을 최소한의 구현으로 커버할 수 있습니다.

| Layout \ Role | Document | Application |
| :--- | :--- | :--- |
| **Sidebar** | **Documentation** (Notion, GitBook)<br>_Window Scroll + Left Nav_ | **SaaS App** (Slack, Gmail)<br>_Div Scroll + Left Nav_ |
| **Single** | **Article** (Medium)<br>_Window Scroll + Centered_ | **Settings** (App Config)<br>_Div Scroll + Centered_ |

만약 분리하지 않았다면, `DocumentSidebar`, `ApplicationSidebar`... 와 같이 중복된 컴포넌트를 무한히 만들어야 했을 것입니다.

---

## 3. Specification

### 3-1. PageRole (Physics)

| Role | Concept | Scroll | Height | Use Cases |
| :--- | :--- | :--- | :--- | :--- |
| `Document` | **Web Page** | Window | `min-h-screen` | Landing, Blog, Docs |
| `Application` | **Native App** | Container | `h-screen fixed` | Admin, IDE, Dashboard |
| `Focus` | **Single Task** | None | `h-screen fixed` | Login, Payment, Wizard |
| `Paper` | **Physical** | Window | `Fixed Ratio` | Invoice, PDF Preview |

### 3-2. PageLayout (Geometry)

| Layout | Structure | Key Sections | Industry Term |
| :--- | :--- | :--- | :--- |
| `Single` | 1-Col | Header, Main, Footer | Standard |
| `Sidebar` | 2-Col (L) | Nav, Main | Drawer Layout |
| `Aside` | 2-Col (R) | Main, Aside (Meta) | Meta Panel |
| `ThreeColumn` | 3-Col | Nav, Main, Aside | Holy Grail |
| `Split` | 2-Col (50:50) | Panel A, Panel B | Master-Detail |
| `Workbench` | Multi-Panel | ActivityBar, Side, Main, Panel, Status | IDE Layout |
| `Mobile` | Stacked | Header, Main, Dock (Bottom) | App Layout |

---

## 4. Usage Example

```tsx
// 1. Standard Documentation Site
<Page role="Document" layout="Sidebar">
  <Section role="Nav">Menu</Section>
  <Section role="Main">Content</Section>
</Page>

// 2. Professional Admin Tool
<Page role="Application" layout="Sidebar">
  <Section role="Nav">Menu</Section> // Same Geometry!
  <Section role="Main">Grid Data</Section> // Different Physics!
</Page>

// 3. IDE Interface
<Page role="Application" layout="Workbench">
  <Section role="ActivityBar" />
  <Section role="Sidebar" />
  <Section role="Editor" />
  <Section role="Panel" />
</Page>
```

## 5. Rules (Constraints)

1. **Section Only**: Page의 직계 자식은 반드시 `<Section>`이어야 합니다. `<div>`나 다른 컴포넌트가 오면 Layout Slot팅이 불가능합니다.
2. **One Root**: 애플리케이션 내에서 `<Page>`는 중첩될 수 없습니다. (단, `<iframe>`이나 별도 라우트 제외)
3. **Prop Minimization**: `maxWidth`, `padding` 등 구체적인 스타일 값은 Props로 받지 않습니다. `Prominence`, `Density`를 통해 **Token Engine**이 결정합니다.
