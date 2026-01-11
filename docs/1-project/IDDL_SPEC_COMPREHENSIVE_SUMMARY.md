# IDDL Specification 종합 정리

**작성일**: 2026-01-11
**출처**: `/docs/2-areas/spec/` 전체 문서 분석
**목적**: IDDL(Intent-Driven Design Language) 스펙의 핵심 개념과 구조를 한 눈에 파악

---

## 🎯 IDDL이란?

**IDDL (Intent-Driven Design Language)**는 UI를 **구현(How)**이 아닌 **의도(Why)**로 선언하는 DSL입니다.

### 핵심 철학

1. **Intent over Implementation**: "빨간 버튼"이 아니라 "위험한 행동(Critical Action)"으로 선언
2. **Strict Structure**: 엄격한 계층 구조로 안정적 파싱/검증/생성
3. **Renderer Autonomy**: 렌더러가 브랜드에 맞게 재해석하되, **의도는 보존**
4. **ARIA Superset**: WAI-ARIA의 상위호환 (접근성 + 디자인 + 레이아웃 + 상태)

### ARIA vs IDDL 비교

| 측면 | ARIA | IDDL |
|------|------|------|
| **접근성** | ✅ role, aria-* | ✅ 자동 생성 |
| **디자인** | ❌ CSS 별도 필요 | ✅ prominence × intent 자동 결정 |
| **레이아웃** | ❌ HTML/CSS 별도 | ✅ role → 배치 자동 |
| **상태 시각화** | ❌ 별도 구현 | ✅ selected, loading 자동 |

**예시**:
```tsx
// ARIA + CSS (전통적)
<button role="tab" aria-selected="true" class="px-4 py-2 border-b-2 border-blue-500 text-blue-600">
  Profile
</button>

// IDDL (선언적)
<Action role="Tab" selected={true}>
  Profile
</Action>
```

---

## 📐 컴포넌트 계층 구조

```
Page (Root - Application level)
 ├─ role="Application": Full-screen app with dynamic grid
 ├─ role="Document": Scrollable content page
 ├─ role="Focus": Centered content (login, payment)
 └─ role="Fullscreen": Locked viewport (presentation)
      └─ Section (Layout regions)
          ├─ Type: Bar, Rail, Panel, Stage, Layer, Float (물리적 형태)
          ├─ Role: ActivityBar, PrimarySidebar, Editor, Panel, etc. (의미적 역할)
          └─ Block (Logical grouping - spec: "Group")
              ├─ Form, Card, Toolbar, List, Grid, Tabs, etc.
              └─ Element (Primitives - spec: "Item")
                  ├─ Text (Title, Body, Label, Code, Badge, etc.)
                  ├─ Field (21 dataTypes: text, email, number, select, etc.)
                  ├─ Action (Button, IconButton, Link, MenuItem)
                  └─ Separator (Horizontal, Vertical)

Overlay (Floating UI)
 └─ Dialog, Drawer, Popover, Toast, Tooltip, ContextMenu
```

**용어 주의**:
- **스펙 문서**: "Group", "Item" 사용
- **코드 구현**: `Block/`, `Element/` 폴더 사용 (일관성 + 예약어 충돌 방지)

---

## 🔑 5 Axes System (핵심 속성 체계)

모든 IDDL 컴포넌트는 **5가지 축**으로 정의됩니다:

| Axis | 질문 | 값 예시 | 설명 |
|------|------|---------|------|
| **Type** | 어떤 컴포넌트인가? | Page, Section, Block, Element, Overlay | 컴포넌트 분류 |
| **Role** | 구체적 역할은? | Button, Textbox, ActivityBar, Tabs | ARIA role 기반 (PascalCase) |
| **Prominence** | 얼마나 중요한가? | Hero, Primary, Secondary, Tertiary | 시각적 위계 |
| **Intent** | 어떤 의미인가? | Neutral, Brand, Positive, Caution, Critical, Info | 의미적 톤 |
| **Density** | 얼마나 빽빽한가? | Comfortable, Standard, Compact | 간격/크기 밀도 |

### 핵심 공식

```
prominence × intent × density × state → className (자동 생성)
```

개발자는 **"왜"(why)**만 선언하고, 시스템이 **"어떻게"(how)**를 자동 처리합니다.

---

## 📄 1. Page (Root Container)

### 1.1 Page Role (Physics - 물리적 행동)

| Role | Physical Laws | Use Case |
|------|---------------|----------|
| **Application** | `h-screen overflow-hidden` | IDE, Dashboard, 복잡한 앱 |
| **Document** | `min-h-screen overflow-y-auto` | 블로그, 문서, 폼 |
| **Focus** | `h-screen flex items-center justify-center` | 로그인, 결제, 단일 작업 |
| **Immersive** | `h-screen overflow-y-scroll snap-y snap-mandatory` | 랜딩 페이지, 프레젠테이션 |
| **Overlay** | `fixed inset-0 z-50 bg-black/50` | 모달 스타일 페이지 |
| **Paper** | `w-[210mm] h-[297mm] bg-white shadow-lg` | 인쇄용 문서 |

### 1.2 Page Layout (Zoning - 공간 구획)

| Layout | Section Roles | Use Case |
|--------|---------------|----------|
| **Studio** | ActivityBar, PrimarySidebar, Editor, Panel, SecondarySidebar | IDE/Studio (IntelliJ-style) |
| **HolyGrail** | Header, Navigator, Container, Aside, Footer | 3단 완전 레이아웃 |
| **Sidebar** | Navigator, Container | 문서, 설정 |
| **Split** | Master, Detail | Master-detail 뷰 |
| **Single** | Header, Container, Footer | 기본 단일 컬럼 |
| **Blank** | Container | 커스텀 레이아웃 |

### 1.3 Dynamic Grid System

Page role="Application"은 Section role에 따라 **자동으로 CSS Grid 생성**:

```tsx
<Page role="Application" layout="Studio">
  <Section role="ActivityBar">...</Section>  // Auto: 48px
  <Section role="PrimarySidebar">...</Section>  // Auto: 250px
  <Section role="Editor">...</Section>       // Auto: 1fr
  <Section role="Panel">...</Section>        // Auto: 300px
</Page>

// 생성된 CSS Grid:
// grid-template-areas: "activitybar sidebar editor panel"
// grid-template-columns: 48px 250px 1fr 300px
```

---

## 🗂️ 2. Section (Layout Regions)

### 2.1 Role vs Type 분리

| 개념 | 질문 | 성격 | 확장성 |
|------|------|------|--------|
| **Role** | "이 영역은 무슨 역할인가?" | 의미적 (Semantic) | 확장 가능 |
| **Type** | "이 영역은 어떤 형태인가?" | 물리적 (Physical) | 6개 고정 |

**핵심**: 같은 Role이 다른 Type으로 렌더링될 수 있습니다.
```tsx
// Desktop: Navigation이 Rail (왼쪽 세로 아이콘 메뉴)
<Section role="Navigation" type="Rail" />

// Mobile: Navigation이 Bar (하단 가로 탭)
<Section role="Navigation" type="Bar" />
```

### 2.2 Section Type (6개 고정 - 물리적 형태)

| Type | Physical Constraints | Text Scale (Hero/Standard/Subtle) | Use Case |
|------|---------------------|----------------------------------|----------|
| **Bar** | Height: 56px (가로 길고 세로 좁음) | 20/14/12px | Header, Toolbar |
| **Rail** | Width: 48-200px (세로 길고 가로 좁음) | 16/14/12px | ActivityBar, 세로 네비 |
| **Panel** | Width: 240-400px (사이드바) | 18/14/12px | Sidebar, Inspector |
| **Stage** | No constraints (자유 공간) | 48/16/14px | Main content area |
| **Layer** | Max-width: 560px, Max-height: 90vh | 24/16/14px | Dialog, Modal |
| **Float** | Max-width: 320px (작은 팝오버) | 14/13/12px | Tooltip, Popover |

### 2.3 Type Scale System 핵심 통찰

**문제**: 기존 디자인 시스템에서 `prominence="Hero"`는 절대값(48px)을 의미했습니다.

**해결**: Type에 따라 **같은 prominence가 다른 크기**로 렌더링됩니다:
- **Stage Hero**: 48px (넓은 공간에서 극적인 차이)
- **Panel Hero**: 18px (좁은 공간에서 작은 차이)
- **Float Hero**: 14px (매우 좁아서 거의 차이 없음)

**Prominence Ratio 비교**:
| Type | Hero/Standard Ratio | 제약 |
|------|---------------------|------|
| Stage | 48/16 = **3.0** | 자유 공간 |
| Layer | 24/16 = **1.5** | 중간 |
| Bar | 20/14 = **1.43** | 높이 제약 |
| Panel | 18/14 = **1.29** | 너비 제약 |
| Rail | 16/14 = **1.14** | 너비 제약 |
| Float | 14/13 = **1.08** | 최대 제약 |

**결론**: 제약이 심한 Type일수록 prominence 간 시각적 차이가 작아집니다.

### 2.4 Adaptive Scale Formula

```
finalValue = baseValue × typeScaleFactor × prominenceScaleFactor × densityFactor → snap
```

**예시**: Stage × Standard × Standard → gap 16px
1. Base value: 16px (기준값)
2. Type factor: 1.0 (Stage)
3. Prominence factor: 1.0 (Standard)
4. Density factor: 1.0 (Standard)
5. Raw: 16px → Snap: 16px

**예시**: Rail × Hero × Compact → gap 8px
1. Base value: 16px
2. Type factor: 0.875 (Rail - Standard 14px 기준)
3. Prominence factor: 1.14 (Rail의 Hero/Standard 비율)
4. Density factor: 0.75 (Compact)
5. Raw: 10.5px → Snap: 12px (allowed values: 4, 8, 12, 16, 24, 32, 48, 64, 96)

---

## 🧩 3. Block (Logical Grouping - spec: "Group")

Block은 **논리적 그룹핑**을 담당합니다:

### 3.1 Block Role 카테고리

| Category | Roles | Description |
|----------|-------|-------------|
| **Container** | Container, Section, Box | 기본 컨테이너 |
| **Form** | Form, FormSection, Fieldset | 폼 그룹 |
| **Navigation** | Tabs, TabPanel, Breadcrumbs, Pagination, Stepper | 네비게이션 |
| **Layout** | Stack, Grid, Toolbar, ButtonGroup, ChipGroup | 레이아웃 |
| **Data** | List, Tree, Table, DataGrid, Card | 데이터 표시 |
| **Feedback** | Alert, Banner, Toast, Progress, Skeleton | 피드백 |
| **Disclosure** | Accordion, Collapsible, Drawer | 확장/축소 |

### 3.2 autoPadding 시스템

Block role에 따라 **자동 padding 적용** 여부가 결정됩니다:

```typescript
const BLOCK_ROLE_CONFIG = {
  Card: { autoPadding: true },      // 컨테이너 역할 → padding O
  Form: { autoPadding: true },
  Alert: { autoPadding: true },
  Stack: { autoPadding: false },    // 레이아웃 역할 → padding X
  Grid: { autoPadding: false },
  List: { autoPadding: false },
};
```

**자동 계산**: `prominence × density → padding`

---

## 🔠 4. Element (Primitives - spec: "Item")

### 4.1 Text (Static Content)

**Role 카테고리**:
- **Heading**: Title, Subtitle, Heading
- **Body**: Body, Paragraph, Caption
- **Inline**: Label, Code, Badge, Kbd (Keyboard key)
- **Status**: Alert, Status, Tag
- **Media**: Avatar, Icon, Emoji

**핵심 원칙**: Text는 **상속 기반**
```tsx
// App/Page root에 설정
<div className="text-base text-text-primary">
  <Text role="Title">Welcome</Text>  // 자동 상속
  <Text role="Body">Description</Text>  // 자동 상속
</div>
```

### 4.2 Field (Data Binding)

**IDDL Field의 혁신**: 21개 dataType을 **단일 인터페이스**로 통일

#### 4.2.1 Field 카테고리 (MECE)

| Category | Roles | Description |
|----------|-------|-------------|
| **Input** | Textbox, Searchbox, Spinbutton (number) | 텍스트 입력 |
| **Choice** | Checkbox, Switch, Radio, Combobox, Listbox | 선택 입력 |
| **Control** | Slider | 범위 조정 |
| **Picker** | Datepicker, Timepicker, Colorpicker, Filepicker | 특수 선택 |
| **Meta** | Hidden, Otp, Signature | 특수 목적 |

#### 4.2.2 ARIA Role Mapping

| ARIA role | IDDL role | 차이점 |
|-----------|-----------|--------|
| textbox | Textbox | PascalCase |
| combobox | Combobox | PascalCase |
| (없음) | Datepicker | IDDL 확장 |
| (없음) | Colorpicker | IDDL 확장 |

**원칙**:
- IDDL은 PascalCase 사용
- Renderer는 소문자로 변환하여 ARIA 매핑
- ARIA에 없는 role도 IDDL에서 정의 가능

#### 4.2.3 Headless + Renderer 패턴

```
Field.tsx (Main component)
  ├─ headless/           # Logic hooks (NO UI)
  │   ├─ useTextField.ts      # Text input logic
  │   ├─ useNumberField.ts    # Number input logic
  │   └─ useSelectField.ts    # Select dropdown logic
  ├─ renderers/          # UI components (NO logic)
  │   ├─ TextField.tsx        # Text input UI with CVA
  │   ├─ NumberField.tsx      # Number input UI with CVA
  │   └─ SelectField.tsx      # Select dropdown UI with CVA
  └─ role/               # Primitive field variants
      ├─ Input.tsx
      ├─ Select.tsx
      └─ Checkbox.tsx
```

**장점**:
- Logic은 테스트 가능 (UI 렌더 불필요)
- UI는 교체 가능 (Material, Ant Design 등)
- CVA variants로 스타일 일관성

### 4.3 Action (Interactions)

**Role 카테고리**:
- **Button**: Button, IconButton, ToggleButton
- **Link**: Link (내부/외부 링크)
- **MenuItem**: MenuItem, Tab, BreadcrumbItem, NavItem
- **ListItem**: ListItem, TreeItem, TableRow

**핵심 원칙**:
- Action은 **단일 클릭 타겟** (leaf node)
- Accent 사용 제한 (화면당 최대 1-2개)

### 4.4 Separator

**Role**:
- Horizontal: 수평 구분선
- Vertical: 수직 구분선

---

## 🎭 5. Overlay (Floating UI)

**Role 카테고리**:
- **Modal**: Dialog (backdrop O, focus trap)
- **Non-modal**: Popover, Tooltip, Drawer
- **Feedback**: Toast, AlertDialog
- **Menu**: ContextMenu, Dropdown

**물리적 특성**:
- z-index 관리
- Backdrop 처리
- Focus trap
- Dismissable (ESC, outside click)

---

## 🎨 6. Behavior Primitives (v3 - Flat Declaration)

### 6.1 문제: 깊은 중첩 (v2)

```tsx
// ❌ v2: 깊은 중첩
<History>
  <Clipboard>
    <Draggable>
      <Selectable mode="extended">
        <Navigable orientation="vertical">
          <List>{children}</List>
        </Navigable>
      </Selectable>
    </Draggable>
  </Clipboard>
</History>
```

### 6.2 해결: 평탄한 선언 (v3)

```tsx
// ✅ v3: 평탄한 선언
<Behavior>
  <History />
  <Clipboard />
  <Draggable />
  <Selectable mode="extended" />
  <Navigable orientation="vertical" />

  <List>{children}</List>
</Behavior>
```

### 6.3 Behavior 카테고리

| Category | Behaviors | Description |
|----------|-----------|-------------|
| **Edit** | History, Clipboard, Selectable, Draggable | 편집 기능 |
| **Navigation** | Navigable, Expandable, Searchable | 탐색 기능 |
| **View** | Zoomable, Sortable, Groupable | 뷰 조작 |
| **Command** | Shortcut, ContextMenu, CommandPalette | 명령 실행 |
| **Feedback** | Toast, Confirm, Progress | 피드백 |
| **Window** | FocusScope, Dismissable | 윈도우 관리 |

**내부 처리 순서** (선언 순서 무관):
```
1. Window (FocusScope, Dismissable)
2. Command (Shortcut, ContextMenu, CommandPalette)
3. Edit (History → Clipboard → Selectable → Draggable)
4. Navigation (Navigable → Expandable → Searchable)
5. View (Zoomable, Sortable, Groupable)
6. Feedback (Toast, Confirm, Progress)
```

---

## 📋 7. Canonical Props (IDDL Key Pool)

### 7.1 핵심 Props

| Prop | 정의 | 규칙 |
|------|------|------|
| **role** | 기능적 정체성 | 표현(CSS/색/크기) 금지, 구조/의미만 |
| **intent** | 의미론적 톤 | Neutral/Brand/Positive/Caution/Critical/Info |
| **prominence** | 중요도/위계 | Hero/Standard/Subtle/Hidden |
| **density** | 물리적 밀도 | Comfortable/Standard/Compact (픽셀값 금지) |
| **spec** | role-dependent 파라미터 | 직렬화 가능 데이터만, 표현 금지 |

### 7.2 Naming / Describing

| Prop | 용도 | 사용 대상 |
|------|------|-----------|
| **name** | Accessible Name (스크린리더/랜드마크 식별) | Section, Block, Modal, Dialog |
| **description** | Accessible Description (도움말/힌트) | Field helperText, Action 경고, Tooltip |
| **label** | 화면에 보이는 라벨 | Field, Action (UI에 표시) |
| **content** | Text 노드의 실제 문자열 | Text |

**중요**: `aria-label`, `aria-labelledby` 같은 구현 디테일 prop 금지. IDDL은 통일된 키 사용.

---

## 🔄 8. Interactive State Token System (v3.1)

### 8.1 공식

```
prominence × intent × state → className (자동 생성)
```

### 8.2 State 종류

| State | Trigger | Example |
|-------|---------|---------|
| **hover** | Mouse hover | `hover:bg-accent-hover` |
| **active** | Mouse/touch press | `active:bg-accent-active` |
| **focus** | Keyboard focus | `focus:ring-2 focus:ring-accent` |
| **selected** | Selection state | `bg-accent text-white` |
| **disabled** | Disabled state | `opacity-50 cursor-not-allowed` |

### 8.3 Minimal IDDL 원칙

```tsx
// ✅ Minimal IDDL
<Action role="Tab" selected={isActive}>
  Profile
</Action>

// ❌ Manual className
<Action role="Tab" className="bg-blue-500 text-white">
  Profile
</Action>
```

---

## 📊 9. 구현 현황 (Phase 1 ~80%)

### 9.1 스펙 문서 완료 여부

| Component | 스펙 완료 | 코드 위치 |
|-----------|----------|-----------|
| **Core** | ✅ | - |
| **Page** | ✅ | `src/components/types/Page/` |
| **Section** | ✅ | `src/components/types/Section/` |
| **Block** | ⚠️ 필요 | `src/components/types/Block/` |
| **Element - Text** | ⚠️ 필요 | `src/components/types/Element/Text/` |
| **Element - Field** | ✅ | `src/components/types/Element/Field/` |
| **Element - Action** | ⚠️ 필요 | `src/components/types/Element/Action/` |
| **Element - Separator** | ⚠️ 필요 | `src/components/types/Element/Separator/` |
| **Overlay** | ⚠️ 필요 | `src/components/types/Overlay/` |
| **Behavior** | 🚧 Draft | `src/shared/lib/behavior/` |

### 9.2 3단계 전략

**Phase 1** (~80% 완료): 선언적 UI 렌더링
- "의도를 선언하면 패턴대로 화면이 나온다"

**Phase 2** (다음): 데이터 바인딩 & 상태
- "입력과 상태가 자동으로 연결된다"

**Phase 3** (최종 목표): 인터랙션 행동 시스템
- "포커스, 선택, 리사이징이 자연스럽게 동작한다"

---

## 🎯 10. 핵심 원칙 요약

1. **Why-based, not How-based**: 의도를 선언하면 시스템이 구현
2. **5 Axes 시스템**: Type, Role, Prominence, Intent, Density
3. **ARIA Superset**: 접근성이 기본 내장
4. **Role ≠ Type**: 의미(Role)와 형태(Type) 분리
5. **Adaptive Scale**: 같은 prominence가 Type에 따라 다르게 렌더링
6. **Headless + Renderer**: Logic과 UI 분리로 확장성 확보
7. **Flat Declaration**: 중첩 대신 평탄한 Behavior 선언
8. **Canonical Keys**: 통일된 prop 이름으로 팀 협업 향상
9. **Text Inheritance**: root에서 설정 → 모든 하위 Text 자동 상속
10. **Minimal IDDL**: `selected` prop 사용, 수동 className 최소화

---

## 🔗 주요 문서 위치

```
docs/2-areas/spec/
├─ 0-core/                  # 핵심 IDDL 스펙
│  ├─ iddl-1.0-spec-ko.md        (한글 스펙)
│  └─ iddl-key-pool.md           (Canonical Props)
├─ 1-page/                  # Page 스펙
│  └─ page.spec.md
├─ 2-section/               # Section 스펙
│  └─ section-type-spec.md       (Type Scale System)
├─ 3-block/                 # Block 스펙 (작성 필요)
├─ 4-element/               # Element 스펙
│  ├─ field/field.spec.md        ✅
│  ├─ action/action.spec.md      (컴포넌트 분류표)
│  ├─ text/text.spec.md          (작성 필요)
│  └─ separator/                 (작성 필요)
├─ 5-overlay/               # Overlay 스펙 (작성 필요)
├─ behavior/                # Behavior Primitives
│  └─ behavior-primitives-spec-v3.md
└─ 9-meta/                  # 메타 문서
   ├─ iddl-coverage-analysis.md
   └─ renderer-improvement-roadmap.md
```

---

## 🚀 다음 단계

1. **Block 스펙 작성**: role 카테고리, autoPadding 규칙 문서화
2. **Text 스펙 작성**: role 카테고리, 상속 규칙 명시
3. **Action 스펙 정리**: 현재 컴포넌트 분류표를 공식 스펙으로
4. **Overlay 스펙 작성**: Floating UI 패턴 정의
5. **Behavior 구현**: Phase 3 준비

---

**최종 업데이트**: 2026-01-11
**IDDL 버전**: 1.0
**Phase**: Phase 1 (~80% 완료)
**목표**: 엔터프라이즈 애플리케이션 플랫폼
