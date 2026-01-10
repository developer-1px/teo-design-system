## 통합 최종본

### IDDL Component Hierarchy

IDDL은 다음과 같은 계층 구조를 가집니다:

```
Page
└── Section (레이아웃 영역)
    └── Group (컨테이너)
        └── Item (UI 프리미티브 그룹)
            ├── Action (상호작용)
            ├── Field (데이터 입력)
            └── Text (정적 콘텐츠)
```

**Item**은 Action, Field, Text를 그룹화하는 타입으로, UI의 원자적 구성 요소(atomic primitives)를 담당합니다. Item은 사용자 상호작용, 데이터 표시, 데이터 입력을 처리하는 가장 작은 단위의 빌딩 블록입니다.

---

### 0. Item

Item은 UI 프리미티브(Action, Field, Text)를 그룹화하는 타입입니다. Item 타입은 컴포넌트 자체가 아니라 **개념적 분류(conceptual grouping)**로 사용됩니다.

**특징**:
- **원자적 구성 요소**: 더 이상 쪼갤 수 없는 가장 작은 UI 단위
- **단일 책임**: 각 Item은 하나의 명확한 역할을 수행 (상호작용 / 입력 / 표시)
- **재사용 가능**: 다양한 Group과 Section에서 재사용 가능
- **독립적 렌더링**: 부모 컨텍스트 없이도 독립적으로 렌더링 가능

**Item 하위 타입**:
- **Action**: 사용자 상호작용 트리거 (버튼, 링크 등)
- **Field**: 데이터 입력 및 수정 (input, select 등)
- **Text**: 정적 콘텐츠 표시 (텍스트, 라벨 등)

**파일 구조**:
```
src/components/Item/
├── Action/      # 상호작용 컴포넌트
├── Field/       # 데이터 입력 컴포넌트
├── Text/        # 정적 콘텐츠 컴포넌트
└── types.ts     # 공통 타입 정의
```

---

### 1. Action

| Role | FE Component | HTML Tag | ARIA Role | 필수 속성 / 비고 |
|---|---|---|---|---|
| `Button` | Button | `<button>` | `button` | - |
| `IconButton` | IconButton | `<button>` | `button` | `aria-label` 필수 |
| `Link` | Link, Anchor | `<a>` | `link` | `href` 필수 |
| `Tab` | Tab | `<button>` | `tab` | `aria-selected`, `aria-controls` |
| `MenuItem` | MenuItem | `<button>`, `<li>` | `menuitem` | Menu 내부 |
| `SwitchItem` | SwitchItem | `<button>` | `menuitemcheckbox` | 메뉴 내 토글 |
| `Chip` | Chip | `<button>` | `button` | `aria-pressed` (선택 시) |
| `BreadcrumbItem` | BreadcrumbItem | `<a>`, `<span>` | `link` | `aria-current="page"` (현재) |
| `AccordionTrigger` | AccordionTrigger | `<button>` | `button` | `aria-expanded`, `aria-controls` |

---

### 2. Text

| Role | FE Component | HTML Tag | ARIA Role | 필수 속성 / 비고 |
|---|---|---|---|---|
| `Title` | Heading | `<h1>`-`<h6>` | `heading` | `aria-level` 자동 |
| `Body` | Text, Paragraph | `<p>`, `<span>` | - | - |
| `Label` | Label | `<label>` | - | `htmlFor` 연결 |
| `Caption` | Text, HelperText | `<small>`, `<span>` | - | muted 색상 |
| `Code` | Code | `<code>`, `<pre>` | - | monospace 폰트 |
| `Kbd` | Kbd | `<kbd>` | - | 키보드 단축키 |
| `Badge` | Badge | `<span>` | `status` | 짧은 상태 정보 |
| `Tag` | Tag | `<span>` | - | 카테고리/분류 |
| `Price` | Text | `<span>` | - | 숫자 포맷팅 |
| `Date` | Text | `<time>` | - | `datetime` 속성 |

---

### 3. Field

| dataType | control | FE Component | HTML Tag | ARIA Role | 비고 |
|---|---|---|---|---|---|
| `text` | `input` | Input | `<input type="text">` | `textbox` | 기본값 |
| `text` | `textarea` | Textarea | `<textarea>` | `textbox` | `aria-multiline` |
| `text` | `password` | Input | `<input type="password">` | - | - |
| `text` | `search` | SearchInput | `<input type="search">` | `searchbox` | - |
| `text` | `email` | Input | `<input type="email">` | - | - |
| `text` | `url` | Input | `<input type="url">` | - | - |
| `text` | `phone` | Input | `<input type="tel">` | - | - |
| `text` | `otp` | OTPInput | multiple `<input>` | - | PIN 입력 |
| `number` | `input` | NumberInput | `<input type="number">` | `spinbutton` | 기본값 |
| `number` | `slider` | Slider | `<input type="range">` | `slider` | `aria-valuenow` |
| `number` | `rating` | Rating | custom | `slider` | 별점 |
| `number` | `stepper` | Stepper | custom | `spinbutton` | +/- 버튼 |
| `boolean` | `checkbox` | Checkbox | `<input type="checkbox">` | `checkbox` | 기본값 |
| `boolean` | `switch` | Switch | `<button>` | `switch` | `aria-checked` |
| `boolean` | `toggle` | ToggleButton | `<button>` | `button` | `aria-pressed` |
| `select` | `dropdown` | Select | `<select>` | `combobox` | 기본값 |
| `select` | `combobox` | Combobox | custom | `combobox` | 검색 가능 |
| `select` | `radio` | RadioGroup | `<fieldset>` | `radiogroup` | - |
| `select` | `checkbox-group` | CheckboxGroup | `<fieldset>` | `group` | 다중 선택 |
| `select` | `listbox` | ListBox | custom | `listbox` | - |
| `date` | `picker` | DatePicker | `<input>` + dialog | `combobox` | 기본값 |
| `date` | `calendar` | Calendar | custom | `grid` | 인라인 캘린더 |
| `date` | `input` | Input | `<input type="date">` | - | native |
| `datetime` | `picker` | DateTimePicker | `<input>` + dialog | `combobox` | - |
| `time` | `picker` | TimePicker | `<input>` + dialog | `combobox` | - |
| `file` | `upload` | FileUpload | `<input type="file">` | - | 기본값 |
| `file` | `dropzone` | Dropzone | custom | - | 드래그앤드롭 |
| `file` | `image` | ImageUpload | `<input type="file">` | - | 이미지 전용 |
| `color` | `picker` | ColorPicker | `<input type="color">` | - | - |
| `richtext` | `editor` | RichTextEditor | `<div contenteditable>` | `textbox` | - |

---

### 4. Group

| Role | FE Component | HTML Tag | ARIA Role | 비고 |
|---|---|---|---|---|
| `Container` | Box, Stack | `<div>` | - | 범용 래퍼 |
| `Card` | Card | `<article>` | `article` | 독립 콘텐츠 |
| `Form` | Form | `<form>` | `form` | - |
| `Fieldset` | Fieldset | `<fieldset>` | `group` | `<legend>` 포함 |
| `List` | List | `<ul>`, `<ol>` | `list` | - |
| `ListItem` | ListItem | `<li>` | `listitem` | - |
| `Table` | Table | `<table>` | `table` | - |
| `Grid` | DataGrid | `<div>` | `grid` | 인터랙티브 |
| `Menu` | Menu | `<ul>`, `<div>` | `menu` | - |
| `MenuGroup` | MenuGroup | `<div>` | `group` | 메뉴 내 그룹 |
| `Tree` | Tree | `<ul>` | `tree` | - |
| `TreeItem` | TreeItem | `<li>` | `treeitem` | `aria-expanded` |
| `TabList` | TabList | `<div>` | `tablist` | - |
| `Accordion` | Accordion | `<div>` | - | - |
| `AccordionItem` | AccordionItem | `<div>` | - | trigger + panel |
| `Toolbar` | Toolbar | `<div>` | `toolbar` | 화살표 키 이동 |
| `ButtonGroup` | ButtonGroup | `<div>` | `group` | - |
| `Breadcrumb` | Breadcrumb | `<nav>` | `navigation` | `aria-label` |
| `Pagination` | Pagination | `<nav>` | `navigation` | `aria-label` |
| `Steps` | Steps | `<ol>` | `list` | `aria-current="step"` |
| `Alert` | Alert | `<div>` | `alert` | `aria-live="assertive"` |
| `Progress` | Progress | `<progress>` | `progressbar` | `aria-valuenow` |
| `Spinner` | Spinner | `<div>` | `status` | `aria-busy`, `aria-label` |
| `Skeleton` | Skeleton | `<div>` | - | `aria-busy="true"` |
| `Avatar` | Avatar | `<img>`, `<div>` | `img` | `alt` 또는 `aria-label` |
| `AvatarGroup` | AvatarGroup | `<div>` | `group` | - |
| `Statistic` | Statistic | `<figure>` | `figure` | 숫자 강조 |
| `EmptyState` | Empty | `<div>` | `status` | - |
| `Timeline` | Timeline | `<ul>` | `list` | - |
| `Divider` | Divider | `<hr>` | `separator` | `aria-orientation` |
| `Inline` | HStack | `<div>` | - | inline-flex |
| `Stack` | VStack | `<div>` | - | flex-direction |

---

### 5. Section

| Role | FE Component | HTML Tag | ARIA Role | 비고 |
|---|---|---|---|---|
| `Container` | Container, Main | `<main>`, `<section>` | `main`, `region` | `aria-label` |
| `Header` | Header | `<header>` | `banner` | 페이지당 1개 |
| `Footer` | Footer | `<footer>` | `contentinfo` | 페이지당 1개 |
| `Toolbar` | Toolbar | `<div>` | `toolbar` | 상단 툴바 (v1.2.0) |
| `Navigator` | Sidebar, Nav | `<nav>` | `navigation` | `aria-label` |
| `Aside` | Aside | `<aside>` | `complementary` | 보조 정보 |
| `ActivityBar` | ActivityBar | `<div>` | `navigation` | IDE/Studio 액티비티 바 (v1.1.0) |
| `PrimarySidebar` | PrimarySidebar | `<div>` | `navigation` | IDE/Studio 메인 사이드바 (v1.1.0) |
| `SecondarySidebar` | SecondarySidebar | `<div>` | `complementary` | IDE/Studio 보조 사이드바 (v1.1.0) |
| `Editor` | Editor | `<div>` | `region` | IDE/Studio 에디터 영역 (v1.1.0) |
| `Panel` | Panel | `<div>` | `region` | IDE/Studio 하단 패널 (v1.1.0) |
| `Auxiliary` | Auxiliary | `<div>` | `complementary` | IDE/Studio 보조 패널 (v1.1.0) |
| `TabPanel` | TabPanel | `<div>` | `tabpanel` | `aria-labelledby` |
| `ScrollArea` | ScrollArea | `<div>` | `region` | 커스텀 스크롤바 |
| `Result` | Result | `<div>` | `status` | 성공/실패 페이지 |

---

### 6. Overlay

| Role | FE Component | HTML Tag | ARIA Role | 동작 요구사항 |
|---|---|---|---|---|
| `Modal` | Modal | `<div>` | `dialog` | `aria-modal="true"`, Backdrop, ESC, Focus trap |
| `Dialog` | Dialog | `<div>` | `dialog` | non-modal, Backdrop 없음 |
| `AlertDialog` | AlertDialog | `<div>` | `alertdialog` | 확인 필수, Focus trap |
| `Drawer` | Drawer | `<div>` | `dialog` | `aria-modal="true"`, 슬라이드 |
| `Sheet` | Sheet | `<div>` | `dialog` | 모바일 하단 |
| `Popover` | Popover | `<div>` | `dialog` | Trigger 앵커링 |
| `Dropdown` | DropdownMenu | `<div>` | `menu` | Trigger + Menu |
| `ContextMenu` | ContextMenu | `<div>` | `menu` | 우클릭 트리거 |
| `Tooltip` | Tooltip | `<div>` | `tooltip` | `aria-describedby` |
| `Toast` | Toast | `<div>` | `status` | `aria-live="polite"`, 자동 사라짐 |
| `Lightbox` | Lightbox | `<div>` | `dialog` | 미디어 뷰어 |
| `Command` | CommandPalette | `<div>` | `listbox` | 커맨드 팔레트 |

---

## 최종 카운트

| Type | Role 개수 | 비고 |
|---|---|---|
| **Item** | - | 개념적 분류 (Action, Field, Text의 상위 그룹) |
| Action | 9 | 상호작용 트리거 |
| Text | 10 | 정적 콘텐츠 표시 |
| Field | 7 dataType × 다수 control | 데이터 입력 |
| Group | 31 | 컨테이너 |
| Section | 15 | 레이아웃 영역 (v1.2.0: Toolbar 추가, IDE/Studio roles 포함) |
| Overlay | 12 | 오버레이 |

**전체 계층 구조**: Page → Section → Group → Item → {Action, Field, Text}