# IDDL Role Catalog v0.1 (De-facto Terms → Canonical Roles)

## 공통 규칙 (모든 Role에 적용)

* Renderer는 **Native HTML 시멘틱 우선**으로 출력한다. 불가피한 경우에만 ARIA role/state/property를 부가한다. ([W3C][2])
* 접근성 이름/설명은 **BaseProps 공용 키**로 통일:

    * `name` = Accessible Name
    * `description` = Accessible Description (help/hint/tooltip/error text의 “그릇”)
* 키보드 규칙은 **Role Contract의 일부**이며, 이벤트 핸들러(`onKeyDown`)를 IDDL에 도입하지 않는다.

---

## 1) Page Roles (문서/라우트/앱 껍질)

| Level | Canonical Role | De-facto 용어(동의어)                      | 최소 IDDL 형태                                              | 최소 HTML/ARIA 출력 계약                                | 키보드/접근성 계약                        |
| ----- | -------------- | ------------------------------------- | ------------------------------------------------------- | ------------------------------------------------- | --------------------------------- |
| Page  | `Document`     | Document, Static Page, Marketing Page | `<Page role="Document" title?>…`                        | `<main>`을 반드시 1개 포함(MUST)                         | 문서 구조(Heading) 레벨 일관성 권장          |
| Page  | `AppShell`     | App, Shell, Layout, Frame             | `<Page role="AppShell">…`                               | `<main>` + (선택) `<header>/<nav>/<aside>/<footer>` | Landmark가 2개 이상이면 `name`으로 구분(권장) |
| Page  | `Screen`       | View, Route, Screen                   | `<Page role="Screen">…`                                 | 라우트 단위: `<main>` 존재(MUST)                         | SR/키보드 탐색의 기준점이 main              |
| Page  | `ModalScreen`  | Modal Route, Fullscreen Dialog        | `<Page role="ModalScreen"> <Section role="Modal" …/> …` | dialog contract는 Section Modal에 위임                | ESC/포커스 트랩은 Modal contract        |

> Material/MUI가 “앱/화면/앱바/드로어” 같은 어휘를 사실상 표준으로 쓰는 맥락을 Role로 흡수하는 형태입니다. ([Material Design][1])

---

## 2) Section Roles (랜드마크/영역: 화면의 뼈대)

| Level   | Canonical Role | De-facto 용어(동의어)              | 최소 IDDL 형태                                        | 최소 HTML/ARIA 출력 계약                                            | 키보드/접근성 계약                       |                                                                        |                                  |
| ------- | -------------- | ----------------------------- | ------------------------------------------------- | ------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------- | -------------------------------- |
| Section | `Header`       | App Header, Top Bar 영역        | `<Section role="Header">…`                        | `<header>`                                                    | 내부 컨트롤은 정상 Tab 순서                |                                                                        |                                  |
| Section | `Main`         | Content, Body                 | `<Section role="Main">…`                          | `<main>` (페이지당 1개 MUST)                                       | 스킵 링크 대상이 될 수 있음(권장)             |                                                                        |                                  |
| Section | `Footer`       | Site Footer                   | `<Section role="Footer">…`                        | `<footer>`                                                    | -                                |                                                                        |                                  |
| Section | `Navigation`   | Nav, GNB/LNB, Menu Area       | `<Section role="Navigation" name?>…`              | `<nav>`; nav 2개 이상이면 `name` 필수(MUST)                          | 메뉴/탭 등 내부 Block contract에 위임     |                                                                        |                                  |
| Section | `Sidebar`      | Aside, Panel                  | `<Section role="Sidebar" name?>…`                 | `<aside>`                                                     | 보조 landmark 다중 시 `name` 권장       |                                                                        |                                  |
| Section | `Search`       | Search Bar Area               | `<Section role="Search" name?>…`                  | `<form role="search">` 또는 `<search>`(가능 시)                    | 검색 입력은 Field contract            |                                                                        |                                  |
| Section | `Region`       | Named Region, Content Group   | `<Section role="Region" name="…">…`               | `<section aria-label="…">` (name MUST)                        | SR 탐색용 이름 필수                     |                                                                        |                                  |
| Section | `Modal`        | Dialog, Modal, AlertDialog    | `<Section role="Modal" name? description?>…`      | `<dialog>`(권장) 또는 `<div role="dialog">` + `aria-modal="true"` | ESC 닫기 + 포커스 트랩(MUST) ([W3C][2]) |                                                                        |                                  |
| Section | `Drawer`       | Navigation Drawer, Side Sheet | `<Section role="Drawer" spec={{ kind:'navigation' | 'dialog'                                                      | 'complementary' }} …>`           | kind에 따라 `<nav>`/`<dialog>`/`<aside>`로 출력(MUST) ([Material Design][3]) | kind='dialog'면 Modal contract 동일 |

---

## 3) Block Roles (Capability 중심: 우리가 “지원하는 UI 패턴”)

아래 Block Role은 **현대 FE에서 가장 자주 등장**하며, Material/MUI/Radix/APG에서 반복되는 컴포넌트 어휘를 “IDDL Canonical Role”로 수렴한 셋입니다. ([Material Design][1])

### 3.1 Layout / Container

| Level | Canonical Role | De-facto 용어(동의어)                | 최소 IDDL 형태                                              | 최소 HTML/ARIA 출력 계약                       | 키보드/접근성 계약                  |                        |                                      |
| ----- | -------------- | ------------------------------- | ------------------------------------------------------- | ---------------------------------------- | --------------------------- | ---------------------- | ------------------------------------ |
| Block | `Card`         | Card, Panel, Surface            | `<Block role="Card">…`                                  | `<section>` 또는 `<div>` (region으로 만들지 않음) | -                           |                        |                                      |
| Block | `Stack`        | VStack/HStack, Flex, Row/Column | `<Block role="Stack" spec={{ direction:'row'            | 'column', gap?:'standard'                | 'compact' }}>…`             | `<div>`                | 레이아웃은 a11y 트리 영향 없게                  |
| Block | `GridLayout`   | Grid, Masonry(레이아웃)             | `<Block role="GridLayout" spec={{ columns?:number }}>…` | `<div>`                                  | “데이터 그리드”와 구분(아래 DataTable) |                        |                                      |
| Block | `ScrollArea`   | Scroll Area, ScrollView         | `<Block role="ScrollArea" spec={{ axis:'x'              | 'y'                                      | 'both' }}>…`                | `<div>`(native scroll) | 스크롤 컨테이너 포커스 정책(렌더러) ([Radix UI][4]) |

### 3.2 Navigation / Wayfinding

| Level | Canonical Role | De-facto 용어(동의어)                    | 최소 IDDL 형태                                                            | 최소 HTML/ARIA 출력 계약                         | 키보드/접근성 계약                |
| ----- | -------------- | ----------------------------------- | --------------------------------------------------------------------- | ------------------------------------------ | ------------------------- |
| Block | `AppBar`       | App Bar, Top Bar, Navbar ([MUI][5]) | `<Block role="AppBar">…`                                              | `<div role="banner">` 또는 Header 내부 `<div>` | 내부는 Toolbar로 구성 권장        |
| Block | `Toolbar`      | Toolbar, Action Bar                 | `<Block role="Toolbar">…`                                             | `<div role="toolbar">`                     | Tab 이동 자연스러움(필수)          |
| Block | `Breadcrumbs`  | Breadcrumb                          | `<Block role="Breadcrumbs" name? spec={{ items:[{label,to}] }}>`      | `<nav aria-label="Breadcrumb"> <ol>…`      | 링크는 Action(navigate)      |
| Block | `Tabs`         | Tabs ([MUI][6])                     | `<Block role="Tabs" spec={{ items:[{id,label}], activeId? }}>…`       | ARIA tabs pattern(탭리스트/탭/패널)               | 좌우/상하 화살표 이동 + 활성화(필수)    |
| Block | `Pagination`   | Pager, Pagination                   | `<Block role="Pagination" spec={{ page:number, pageCount:number }}>…` | `<nav aria-label="Pagination">…`           | 현재 페이지는 aria-current=page |

### 3.3 Data Display / Collections

| Level | Canonical Role | De-facto 용어(동의어)                                       | 최소 IDDL 형태                                                                  | 최소 HTML/ARIA 출력 계약                                    | 키보드/접근성 계약                     |                             |
| ----- | -------------- | ------------------------------------------------------ | --------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------ | --------------------------- |
| Block | `List`         | List ([MUI][7])                                        | `<Block role="List" spec={{ ordered?:boolean }}>…`                          | `<ul>/<ol>` + 자식은 `<li>`로 래핑(MUST)                    | -                              |                             |
| Block | `DataTable`    | Data Table, Table, DataGrid(개념) ([Material Design][1]) | `<Block role="DataTable" name? spec={{ columns:[...], sort?:{col,dir} }}>…` | 기본 `<table>` 사용(MUST). sort가 있으면 헤더에 대응(예: aria-sort) | 키보드 최소: 헤더 정렬 토글은 키보드 가능(MUST) |                             |
| Block | `TreeView`     | Tree, TreeView                                         | `<Block role="TreeView" name? spec={{ items:[...], selection:'single'       | 'multi' }}>…`                                         | ARIA tree pattern에 준수(필수)      | 화살표/홈엔드/확장축소(필수) ([W3C][2]) |
| Block | `EmptyState`   | Empty, Zero State                                      | `<Block role="EmptyState" spec={{ title, message, action? }}>…`             | `<section>`                                           | 시각 중심, a11y는 name/description로 |                             |

### 3.4 Forms / Data Entry (복잡한 위젯은 Block로 묶는다)

| Level | Canonical Role | De-facto 용어(동의어)                  | 최소 IDDL 형태                                                              | 최소 HTML/ARIA 출력 계약        | 키보드/접근성 계약               |
| ----- | -------------- | --------------------------------- | ----------------------------------------------------------------------- | ------------------------- | ------------------------ |
| Block | `Form`         | Form                              | `<Block role="Form" name? description?>…`                               | `<form>`                  | submit Action은 Enter로 동작 |
| Block | `FieldGroup`   | Fieldset, Group                   | `<Block role="FieldGroup" spec={{ legend:string }}>…`                   | `<fieldset><legend>…`     | 그룹명은 legend로 제공(MUST)    |
| Block | `Combobox`     | Autocomplete, ComboBox ([W3C][2]) | `<Block role="Combobox" spec={{ items:[...], value?, placeholder? }}>…` | ARIA combobox pattern 준수  | 화살표/엔터/ESC/타이핑(필수)       |
| Block | `FilterBar`    | Filters, Search+Filter            | `<Block role="FilterBar" spec={{ fields:[...], actions:[...] }}>…`      | `<div>`(내부는 Field/Action) | -                        |

### 3.5 Overlays / Popups (Radix/MUI가 쓰는 de-facto 용어를 그대로 Role화)

| Level | Canonical Role | De-facto 용어(동의어)                    | 최소 IDDL 형태                                                         | 최소 HTML/ARIA 출력 계약                     | 키보드/접근성 계약                                 |                                    |                |
| ----- | -------------- | ----------------------------------- | ------------------------------------------------------------------ | -------------------------------------- | ------------------------------------------ | ---------------------------------- | -------------- |
| Block | `Menu`         | Menu, Dropdown Menu ([Radix UI][8]) | `<Block role="Menu" spec={{ items:[...], triggerLabel:string }}>…` | menu/menuitem 패턴(또는 menu button 패턴) 준수 | 위/아래 이동 + Enter + ESC(필수)                  |                                    |                |
| Block | `Popover`      | Popover, Flyout                     | `<Block role="Popover" name? description? spec={{ trigger:'click'  | 'hover' }}>…`                          | `<div role="dialog">`(비모달) 또는 tooltip-like | ESC 닫기(권장), 포커스 관리                 |                |
| Block | `Tooltip`      | Tooltip ([MUI][9])                  | `<Block role="Tooltip" description="…">…`                          | `role="tooltip"` + describedby 연결      | hover+focus에서 노출, 포커스 방해 금지                |                                    |                |
| Block | `Toast`        | Snackbar/Toast ([MUI][10])          | `<Block role="Toast" spec={{ kind:'info'                           | 'success'                              | 'error', timeoutMs? }}>…`                  | live region(role=status/alert)로 공지 | 키보드로 닫기 가능(필수) |

---

## 4) Element Roles (leaf: Action / Field / Text / Image)

> 사용자가 예시로 주신 범위(“Action, Field, Text, Image”)에 맞춰 최소 Catalog만 확정합니다.

| Level   | Canonical Role | De-facto 용어(동의어)                          | 최소 IDDL 형태                                                  | 최소 HTML/ARIA 출력 계약                     | 키보드/접근성 계약                               |                        |                       |
| ------- | -------------- | ----------------------------------------- | ----------------------------------------------------------- | -------------------------------------- | ---------------------------------------- | ---------------------- | --------------------- |
| Element | `Text`         | Typography, Label, Heading                | `<Text role="Heading                                        | Body                                   | Label" content="…" spec={{ level? }} />` | heading은 `<h1..h6>` 우선 | heading level 일관성(권장) |
| Element | `Image`        | Image, Avatar, Icon                       | `<Image src alt />`                                         | `<img src alt>`                        | alt 필수(MUST)                             |                        |                       |
| Element | `Field`        | Input, TextField, Checkbox, Radio, Select | `<Field label model type required? disabled? description?>` | `<label for>` 연결 + native input/select | Tab/Space/Enter 등 native 동작 유지           |                        |                       |
| Element | `Action`       | Button, Link, IconButton                  | `<Action label behavior=… intent? prominence?>`             | navigate면 `<a>`, 나머진 `<button>`        | Enter/Space 활성화, focus-visible 보장        |                        |                       |

---

# Catalog 사용 가이드 (실무 합의 포인트)

* “ARIA 속성 지원 여부”를 논의하지 말고, **Role 지원 여부**를 논의합니다.
  예: `aria-sort` 지원? (X) → `DataTable` 지원? (O)
* “이 Role을 지원한다”는 말은 곧 아래 3개를 함께 약속하는 것입니다:

    1. 최소 HTML 시멘틱 출력
    2. 최소 ARIA 결과물
    3. 최소 키보드 패턴(APG 수준)

(APG 패턴은 combobox/menu/treeview/tabs/dialog 같은 복합 위젯의 기준점입니다.) ([W3C][2])

---


동의합니다. Field는 “FE 디팩터 용어”가 가장 많이 쌓인 영역이라, **Role Catalog를 안 만들면** 곧바로 TextField/Input/Select/Autocomplete/Combobox/Switch/Checkbox/RadioGroup/Slider/DatePicker…가 각자 다른 키를 요구하면서 **props 폭발**이 납니다.
아래는 **Element: Field**를 “Capability 기준”으로 **MECE하게 세분화한 Field Role Catalog v0.1**입니다. 원칙은 동일합니다.
* **우리는 aria-를 직접 지원하는 게 아니라, FieldRole을 지원한다.*
* FieldRole이 내부적으로 필요한 HTML/ARIA/키보드 계약을 **렌더러가 책임**진다.
* IDDL은 **공통 키 풀을 최소화**하고, 나머지는 FieldRole별 spec(또는 Part 2의 state/value)로 흡수한다.

⠀
# 1) Field Role Catalog v0.1 (MECE)
컬럼 설명
* **Canonical FieldRole**: IDDL에서 외우는 표준 이름
* **De-facto 용어**: 업계에서 흔히 부르는 이름들
* **Value Shape**: 값의 형태(Part 2에서 value 표준화할 때 기준)
* **Native HTML 우선 출력**: 기본 태그/타입(네이티브 우선)
* **A11y/Keyboard 최소 계약**: 렌더러가 반드시 보장해야 하는 결과물
* **Spec v0.1**: Part 1에서 “role 성립에 필요한” 최소 spec 키

⠀**Canonical FieldRole** **De-facto 용어(동의어)** | **Value Shape** | **Native HTML 우선 출력** | **A11y/Keyboard 최소 계약** | **Spec v0.1 (role-dependent)** |
|:-:|:-:|:-:|:-:|:-:|---|
| TextInput | Input, TextField | string | <input type="text"> | label-for 연결 필수, Tab focus, Enter는 form submit에 위임 | inputMode?, maxLength?, pattern? |
| TextArea | Textarea, Multiline | string | <textarea> | label-for, Tab focus, 줄바꿈 입력 | rows?, maxLength? |
| NumberInput | Numeric, Spinbutton | number | null | <input type="number"> | label-for, min/max/step 반영 | min?, max?, step? |
| PasswordInput | Password | string | <input type="password"> | label-for, “보기/숨김”은 렌더러 옵션 | revealable? |
| EmailInput | Email | string | <input type="email"> | label-for, 모바일 키보드 힌트 | autoComplete? |
| SearchInput | SearchBox | string | <input type="search"> | clear affordance는 렌더러 옵션, Enter 검색은 폼/액션에 위임 | clearable? |
| Select | Select, Dropdown | string | number | null | <select><option> | label-for, 방향키 이동(네이티브) | options(필수), multiple? |
| Combobox | Autocomplete, Typeahead | string | number | object | null | 네이티브 대체 없음(대개 ARIA pattern) | **combobox 키보드 계약**(↑↓/Enter/Esc, active-descendant 등) | options(필수), filter?, freeSolo? |
| Checkbox | Checkbox | boolean | 'mixed' | <input type="checkbox"> | Space 토글, label 클릭 토글 | indeterminate? |
| Switch | Toggle, Switch | boolean | <button role="switch"> 또는 checkbox 스타일 | Space/Enter 토글, aria-checked 결과물 | (표현은 렌더러) |
| RadioGroup | RadioGroup | string | number | null | <fieldset><input type="radio"> | 그룹명(legend) 필요, 방향키 이동 | options(필수), legend? |
| DateInput | Date | string(YYYY-MM-DD) | <input type="date"> | label-for, locale UI는 브라우저 | min?, max? |
| TimeInput | Time | string(HH:mm) | <input type="time"> | label-for | min?, max?, step? |
| DateTimeInput | DateTime | string(ISO) | <input type="datetime-local"> | label-for | min?, max? |
| FileInput | FileUpload | File | File[] | null | <input type="file"> | label-for, 파일 선택 UX는 OS | accept?, multiple? |
| Slider | Range, Slider | number | [number, number] | <input type="range">(single) / (range는 커스텀) | ←→/↑↓로 변경, min/max/step 반영 | min(필수), max(필수), step?, range? |
| OTPInput | PIN, OTP, Code | string | 여러 <input inputmode="numeric"> | 자동 이동/백스페이스 이동(키보드 계약) | length(필수), numeric? |
| TagInput | Chips Input, MultiValue | string[] | 네이티브 없음(복합 위젯) | 삭제/추가 키보드 계약(Backspace, Enter) | suggestions?, maxItems? |
| Rating | Rating, Star rating | number | null | 네이티브 없음(대개 radio group) | 방향키/Space 선택, SR에 값 전달 | max(필수), step? |
**MECE 기준**
* (1) **단일 값 입력**(Text/Number/Password/Email/Search)
* (2) **선택**(Select/Combobox/Checkbox/Switch/RadioGroup)
* (3) **시간/파일**(Date/Time/DateTime/File)
* (4) **연속 범위/스케일**(Slider/Rating)
* (5) **복합 입력**(OTP/Tag)

⠀
# 2) Field 공통 키 풀과 “폭발 방지” 배치 규칙
## 2.1 Part 1에서 Field가 공통으로 가져야 할 키(최소)
이건 “외우기 쉬운 통일”이 목적이므로, Field 전체에서 동일하게 씁니다.
* label : 보이는 라벨(필수 권장)
* description : 도움말/힌트/오류 설명 텍스트의 **통합 그릇**
* model : (Part 1에 존재) 값의 “위치”
* required, disabled : (Part 1에 존재)

⠀추가로 Part 2에서 공통으로 확정할 예약 키(이걸로 업계 de-facto를 흡수)
* value, defaultValue
* state (invalid/open/loading 등)
* placeholder (TextInput/Combobox 등에서 공통)

⠀2.2 de-facto props → IDDL canonical 매핑 규칙
Field에서 자주 터지는 것들을 “한 번에” 수렴합니다.
| **업계 de-facto props** | **의미** | **IDDL canonical** |
|:-:|:-:|:-:|
| helperText, hint, tooltipText, errorMessageText | 설명/도움/오류 텍스트 | description |
| aria-label, a11yName | 접근성 이름 | name (BaseProps) |
| isInvalid, error, validationState | 유효성 상태 | state.invalid (Part 2) |
| isDisabled, disabled | 비활성 | disabled (Field) / state.disabled(Part2로 통일 가능) |
| checked, defaultChecked | 체크 상태 | value/defaultValue (Part 2, Checkbox/Switch) |
| open, onOpenChange | 팝업/리스트 열림 | state.open (Part 2, Combobox) |
| onChange, onValueChange | 이벤트 | **IDDL에서 직접 금지** (Part 2 command/binding 모델로 흡수) |

# 3) IDDL 타입 형태로 “정의” (Field 세분화를 스펙에 반영)
현재 Part 1의 Field.type는 너무 거칠어서 “디팩터 용어 통일”이 어렵습니다. 가장 깔끔한 방식은:
* Field는 Element로 유지하되
* Field.role(=FieldRole)을 **표준 Role Catalog로 승격**
* spec은 role-dependent로 고정

⠀예시 타입(초안):
export type FieldRole =
| 'TextInput' | 'TextArea'
| 'NumberInput' | 'PasswordInput' | 'EmailInput' | 'SearchInput'
| 'Select' | 'Combobox'
| 'Checkbox' | 'Switch' | 'RadioGroup'
| 'DateInput' | 'TimeInput' | 'DateTimeInput'
| 'FileInput'
| 'Slider'
| 'OTPInput'
| 'TagInput'
| 'Rating';

export type Option = { label: string; value: string | number; disabled?: boolean };

export type FieldSpec =
| { role: 'TextInput'; inputMode?: 'text'|'numeric'|'email'|'tel'|'url'; maxLength?: number; pattern?: string }
| { role: 'TextArea'; rows?: number; maxLength?: number }
| { role: 'NumberInput'; min?: number; max?: number; step?: number }
| { role: 'PasswordInput'; revealable?: boolean }
| { role: 'EmailInput'; autoComplete?: string }
| { role: 'SearchInput'; clearable?: boolean }
| { role: 'Select'; options: Option[]; multiple?: boolean }
| { role: 'Combobox'; options: Option[]; freeSolo?: boolean; filter?: 'contains'|'startsWith'|'none' }
| { role: 'Checkbox'; indeterminate?: boolean }
| { role: 'Switch' }
| { role: 'RadioGroup'; options: Option[]; legend?: string }
| { role: 'DateInput'; min?: string; max?: string }
| { role: 'TimeInput'; min?: string; max?: string; step?: number }
| { role: 'DateTimeInput'; min?: string; max?: string }
| { role: 'FileInput'; accept?: string; multiple?: boolean }
| { role: 'Slider'; min: number; max: number; step?: number; range?: boolean }
| { role: 'OTPInput'; length: number; numeric?: boolean }
| { role: 'TagInput'; suggestions?: Option[]; maxItems?: number }
| { role: 'Rating'; max: number; step?: number };

export interface FieldProps extends BaseProps {
label: string;
model: string;
role: FieldRole;        // <-- Field.type 대신 role로 통일
spec?: Omit<Extract<FieldSpec, { role: FieldRole }>, 'role'>;
required?: boolean;
disabled?: boolean;
}

# 4) 최소 렌더러 구현 우선순위 제안 (현실적 MVP)
FieldRole은 많아 보이지만, “네이티브 우선”을 쓰면 MVP 범위가 명확합니다.
**MVP 1차(네이티브로 끝나는 것)**
* TextInput, TextArea, NumberInput, EmailInput, PasswordInput, SearchInput
* Checkbox, RadioGroup, Select
* DateInput/TimeInput/DateTimeInput
* FileInput
* Slider(single)

⠀**MVP 2차(ARIA/키보드 contract가 필요한 복합 위젯)**
* Combobox, Switch(정책 선택), OTPInput, TagInput, Rating, Slider(range)

⠀
원하시면 다음 단계로, 위 FieldRole 각각에 대해 “반드시 생성해야 하는 HTML 구조 + 필수 ARIA 결과물 + 최소 키보드 패턴”을 **테스트 케이스 표(validator 규칙 포함)** 로 바로 내려드리겠습니다. (이게 최소 렌더러 실험에서 가장 빨리 유효성을 검증하는 방법입니다.)



#iddl