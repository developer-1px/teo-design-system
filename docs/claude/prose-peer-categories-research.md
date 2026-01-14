# Prose 대등 위계 컴포넌트 카테고리 리서치

**목적**: Prose와 같은 수준의 최상위 컴포넌트 카테고리 식별
**기준**: Material Design 3, shadcn/ui, Carbon DS, Ant Design, US Web Design System 분석
**작성일**: 2026-01-14

---

## 🎯 Executive Summary

주요 디자인 시스템 분석 결과, **Prose와 대등한 최상위 카테고리**로 다음 **8개 핵심 그룹**을 식별:

1. **Layout** - 레이아웃 구조 컴포넌트
2. **Form** - 입력 및 폼 컴포넌트
3. **Data** - 데이터 표시 및 시각화
4. **Feedback** - 피드백 및 상태 표시
5. **Overlay** - 오버레이 및 플로팅 UI
6. **Navigation** - 네비게이션 및 탐색
7. **Action** - 버튼 및 액션 요소
8. **Prose** - 장문 콘텐츠 및 타이포그래피

---

## 📊 주요 디자인 시스템 컴포넌트 분류

### Material Design 3
출처: https://m3.material.io/components

#### 카테고리 구조 (30+ 컴포넌트)
```
Actions
├── Buttons (Common, Extended FAB, FAB, Icon, Segmented, Toggle)
├── Cards
├── Chips (Assist, Filter, Input, Suggestion)
└── Menus

Communication
├── Badges
├── Progress indicators
└── Snackbar

Containment
├── Bottom sheets
├── Dialogs
├── Side sheets
└── Tooltips

Navigation
├── Bottom app bar
├── Navigation bar
├── Navigation drawer
├── Navigation rail
├── Search
├── Tabs
└── Top app bar

Selection
├── Checkboxes
├── Date pickers
├── Radio buttons
├── Sliders
├── Switches
└── Time pickers

Text inputs
└── Text fields
```

### shadcn/ui
출처: https://ui.shadcn.com/docs/components

#### 카테고리 구조 (60+ 컴포넌트)
```
Layout & Structure
├── Accordion
├── Aspect Ratio
├── Card
├── Sidebar
├── Resizable
└── Separator

Navigation
├── Breadcrumb
├── Navigation Menu
├── Pagination
└── Menubar

Forms & Input
├── Button
├── Checkbox
├── Combobox
├── Command
├── Date Picker
├── Dropdown Menu
├── Input
├── Input Group
├── Input OTP
├── Label
├── Native Select
├── Radio Group
├── Select
├── Switch
├── Textarea
├── Toggle
├── Toggle Group
└── Form (React Hook Form, TanStack Form)

Feedback & Display
├── Alert
├── Alert Dialog
├── Badge
├── Empty
├── Progress
├── Skeleton
├── Spinner
├── Toast
└── Tooltip

Data & Tables
├── Data Table
└── Table

Content Display
├── Avatar
├── Calendar
├── Carousel
├── Chart
├── Hover Card
├── Item
├── Kbd
├── Popover
├── Scroll Area
└── Typography

Dialogs & Overlays
├── Context Menu
├── Dialog
├── Drawer
└── Sheet
```

### Carbon Design System
출처: https://carbondesignsystem.com/

#### 주요 패턴
```
Data Visualization
├── Chart Anatomy
├── Chart Types (Bar, Line, Area, Scatter, Pie, Gauge, etc.)
├── Dashboards
└── Data Visualization Components

Dialog Patterns
├── Modal Dialog
├── Toast Notification
├── Inline Notification
└── System Alerts

Form Patterns
├── Text Input
├── Select
├── Checkbox
├── Radio Button
├── Toggle
└── Date Picker
```

### Ant Design
출처: https://ant.design/docs/spec/data-display

#### 데이터 표시 카테고리
```
Data Display
├── Avatar
├── Badge
├── Calendar
├── Card
├── Carousel
├── Collapse
├── Descriptions
├── Empty
├── Image
├── List
├── Popover
├── QR Code
├── Segmented
├── Statistic
├── Table
├── Tabs
├── Tag
├── Timeline
├── Tooltip
└── Tree
```

### US Web Design System (USWDS)
출처: https://designsystem.digital.gov/

#### 주요 카테고리
```
Components
├── Table
├── Data Visualizations
├── Card
├── Prose
└── Form Controls
```

---

## 🏗️ 통합 분석: 8대 최상위 카테고리

### 1. **Layout** (레이아웃 구조)
**역할**: 페이지 및 섹션 구조, 공간 분할

**하위 컴포넌트 예시**:
- Grid, Stack, Flex
- Container, Section, Aside
- Divider, Separator, Spacer
- Sidebar, Drawer (레이아웃 용도)
- Card (컨테이너 역할)
- Accordion, Collapse
- Resizable Panel

**현재 MDK**: Layout.Stack, Layout.Row, Layout.Grid 등으로 구현됨

---

### 2. **Form** (폼 입력)
**역할**: 사용자 입력 수집, 데이터 제출

**하위 컴포넌트 예시**:
- Input, Textarea
- Select, Combobox, Dropdown
- Checkbox, Radio, Switch, Toggle
- Date Picker, Time Picker, Calendar
- Slider, Range
- File Upload
- Input OTP, Input Group
- Label, Field Group
- Form Validation, Error Message

**현재 MDK**: Field 컴포넌트로 부분 구현됨

---

### 3. **Data** (데이터 표시/시각화)
**역할**: 정보 표시, 데이터 분석 및 시각화

**하위 컴포넌트 예시**:
- Table, Data Table
- List, Tree, Timeline
- Chart (Bar, Line, Area, Pie, Scatter, Gauge)
- Dashboard
- Stats, Statistic, KPI
- Tag, Badge (데이터 레이블)
- Avatar (사용자 데이터 표시)
- QR Code, Barcode
- Empty State

**현재 MDK**: Text.Table, Layout.Grid.Dashboard로 일부 구현됨

---

### 4. **Feedback** (피드백/상태)
**역할**: 시스템 상태 전달, 사용자 피드백

**하위 컴포넌트 예시**:
- Alert, Banner
- Badge (상태 표시)
- Progress, Spinner, Skeleton
- Toast, Snackbar (일시적 알림)
- Notification (지속적 알림)
- Status Indicator, Loading State
- Empty State (데이터 부재 피드백)

**현재 MDK**: 미구현 (우선순위 높음)

---

### 5. **Overlay** (오버레이/플로팅)
**역할**: 메인 콘텐츠 위에 표시되는 레이어

**하위 컴포넌트 예시**:
- Modal, Dialog
- Drawer, Sheet, Bottom Sheet, Side Sheet
- Popover, Tooltip, Hover Card
- Context Menu, Dropdown Menu
- Alert Dialog, Confirmation Dialog
- Lightbox, Fullscreen Overlay

**현재 MDK**: Overlay 컴포넌트로 프리미티브 구현됨

---

### 6. **Navigation** (네비게이션)
**역할**: 페이지/섹션 간 이동

**하위 컴포넌트 예시**:
- Top App Bar, Header, Navigation Bar
- Bottom App Bar, Bottom Navigation
- Navigation Drawer, Navigation Rail
- Sidebar (네비게이션 용도)
- Tabs, Segmented Control
- Breadcrumb
- Pagination
- Menu, Menubar, Navigation Menu
- Search, Command Palette
- Anchor Navigation, Table of Contents

**현재 MDK**: 일부 구현됨 (Tabs, Breadcrumb 등)

---

### 7. **Action** (액션 요소)
**역할**: 사용자 인터랙션 트리거

**하위 컴포넌트 예시**:
- Button (Primary, Secondary, Tertiary, Ghost, etc.)
- Icon Button
- FAB (Floating Action Button)
- Toggle Button, Segmented Button
- Button Group
- Link
- Chip (액션 가능한 경우)
- Menu Item

**현재 MDK**: Action 컴포넌트로 구현됨

---

### 8. **Prose** (장문 콘텐츠)
**역할**: 읽기 최적화된 장문 콘텐츠

**하위 컴포넌트 예시**:
- Title (h1-h6)
- Body, Lead, Caption
- Blockquote, Pullquote
- Code, CodeBlock
- List (Ordered, Unordered, Task)
- Link, Emphasis (Strong, Em, Mark)
- Image, Figure, Gallery
- Table (콘텐츠 맥락)
- Divider (콘텐츠 구분)
- Footnote, Sidenote

**현재 MDK**: Text.Prose로 부분 구현됨

---

## 📋 카테고리별 우선순위 매트릭스

| 카테고리 | 현재 MDK 구현 | 산업 표준 중요도 | 구현 우선순위 | 비고 |
|---------|-------------|--------------|------------|-----|
| **Layout** | ✅ 완성 (Layout.*) | ⭐⭐⭐⭐⭐ | - | 이미 완성도 높음 |
| **Action** | ✅ 완성 (Action) | ⭐⭐⭐⭐⭐ | - | 이미 완성도 높음 |
| **Prose** | 🟡 부분 (Text.Prose) | ⭐⭐⭐⭐⭐ | P1 | 확장 필요 (comprehensive tree 참고) |
| **Form** | 🟡 부분 (Field) | ⭐⭐⭐⭐⭐ | P0 | 핵심 누락, 시급 |
| **Overlay** | 🟡 프리미티브만 | ⭐⭐⭐⭐ | P1 | Modal, Dialog, Tooltip 필요 |
| **Feedback** | ❌ 없음 | ⭐⭐⭐⭐ | P1 | Alert, Toast, Progress 시급 |
| **Navigation** | 🟡 부분 | ⭐⭐⭐⭐ | P2 | Tabs, Breadcrumb 등 필요 |
| **Data** | 🟡 부분 (Text.Table) | ⭐⭐⭐⭐ | P2 | Chart, Stats 확장 필요 |

---

## 🎨 제안: MDK 최상위 구조

```
MDK (Minimal Design Kit)
├── Layout.*          ✅ (기존)
├── Action.*          ✅ (기존)
├── Prose.*           🟡 (확장 필요)
├── Form.*            🆕 (신규 카테고리 제안)
├── Overlay.*         🆕 (신규 카테고리 제안)
├── Feedback.*        🆕 (신규 카테고리 제안)
├── Navigation.*      🆕 (신규 카테고리 제안)
└── Data.*            🆕 (신규 카테고리 제안)
```

### 기존 컴포넌트 재배치 제안

#### Text.* → 분산 재배치
```
현재: Text.Prose.*, Text.Card.*, Text.Field.*, Text.Menu.*, Text.Table.*

제안:
- Text.Prose.* → Prose.*
- Text.Card.* → Data.Card (또는 Layout.Card)
- Text.Field.* → Form.Field
- Text.Menu.* → Navigation.Menu
- Text.Table.* → Data.Table
```

#### 신규 카테고리 제안

**Form.* (최우선)**
```
Form
├── Input
├── Textarea
├── Select
├── Checkbox
├── Radio
├── Switch
├── DatePicker
├── Slider
├── Field (기존 Field 컴포넌트 통합)
└── Label
```

**Feedback.* (높은 우선순위)**
```
Feedback
├── Alert
├── Toast
├── Badge
├── Progress
├── Spinner
├── Skeleton
└── Empty
```

**Overlay.* (높은 우선순위)**
```
Overlay (기존 프리미티브 확장)
├── Modal
├── Dialog
├── Drawer
├── Popover
├── Tooltip
└── Sheet
```

---

## 🔍 주요 발견 사항

### 1. 모든 주요 디자인 시스템은 8개 핵심 카테고리로 수렴
- **Layout, Form, Data, Feedback, Overlay, Navigation, Action, Content(Prose)**
- Material Design 3: Actions, Communication, Containment, Navigation, Selection, Text inputs
- shadcn/ui: Layout, Forms, Feedback, Overlays, Navigation, Data, Content
- Carbon DS: Visualization, Dialog, Form, Navigation 중심
- Ant Design: Data Display, Navigation, Feedback, Data Entry 중심

### 2. **Form**은 필수 최상위 카테고리
- 모든 시스템에서 독립 카테고리로 존재
- Input, Select, Checkbox, Radio, DatePicker 등 10+ 컴포넌트 포함
- **MDK에서 가장 시급한 누락 영역**

### 3. **Feedback**은 현대 UI의 핵심
- Toast, Alert, Progress, Skeleton 등 사용자 경험에 필수
- Material Design: "Communication"
- Carbon DS: "Notification Patterns"
- **MDK에 완전히 없음** → P0 우선순위

### 4. **Overlay**는 프리미티브를 넘어 확장 필요
- 현재 MDK는 저수준 Overlay만 제공
- Modal, Dialog, Tooltip 등 고수준 패턴 필요
- 3-tier 토큰 시스템 이미 설계됨 (overlay-token-decision-tree.md)

### 5. **Data**는 단순 Table을 넘어섬
- Chart, Stats, Dashboard 등 시각화 포함
- Carbon DS, Ant Design은 Data Visualization을 별도 강조
- MDK는 Text.Table만 존재 → 확장 필요

### 6. **Navigation**은 독립 카테고리 가치 있음
- Tabs, Breadcrumb, Pagination, Menu 등
- Material Design 3은 7개 네비게이션 컴포넌트 제공
- MDK는 산재되어 있음 → 통합 가치 있음

### 7. **Prose**는 고유하지만 보편적
- US Web Design System, Agriculture Design System에서 독립 카테고리
- Tailwind Typography는 별도 플러그인
- **MDK의 차별화 포인트이자 강점**
- comprehensive-prose-component-tree.md에서 200+ 변형 식별됨

---

## ✅ 액션 아이템

### P0: 즉시 필요 (1-2주)
1. **Form.* 카테고리 생성**
   - Form.Input, Form.Select, Form.Checkbox, Form.Radio, Form.Switch
   - 기존 Field 컴포넌트 통합 (Form.Field)

2. **Feedback.* 카테고리 생성**
   - Feedback.Alert (Info, Success, Warning, Error)
   - Feedback.Toast
   - Feedback.Progress, Feedback.Spinner

### P1: 단기 확장 (2-4주)
3. **Overlay.* 카테고리 확장**
   - Overlay.Modal, Overlay.Dialog, Overlay.Tooltip, Overlay.Popover
   - 3-tier 토큰 시스템 적용 (overlay-token-decision-tree.md)

4. **Prose.* 카테고리 확장**
   - comprehensive-prose-component-tree.md 기반으로 P1 요소 구현
   - Prose.Blockquote, Prose.CodeBlock, Prose.Image

### P2: 중기 계획 (1-2개월)
5. **Data.* 카테고리 생성**
   - Data.Table (기존 Text.Table 이동)
   - Data.Stats, Data.Chart (선택적)

6. **Navigation.* 카테고리 정리**
   - Navigation.Tabs, Navigation.Breadcrumb, Navigation.Menu

### P3: 장기 검토 (2-3개월)
7. **Text.* → 분산 재배치**
   - Text.Card → Data.Card or Layout.Card
   - Text.Field → Form.Field
   - Text.Menu → Navigation.Menu
   - Text.Table → Data.Table

---

## 📚 참고 자료

### 디자인 시스템
- Material Design 3: https://m3.material.io/components
- shadcn/ui: https://ui.shadcn.com/docs/components
- Carbon Design System: https://carbondesignsystem.com/
- Ant Design: https://ant.design/docs/spec/data-display
- US Web Design System: https://designsystem.digital.gov/
- Agriculture Design System (Prose): https://design-system.agriculture.gov.au/components/prose

### MDK 내부 문서
- `comprehensive-prose-component-tree.md` - Prose 상세 트리
- `overlay-token-decision-tree.md` - Overlay 3-tier 토큰 시스템
- `text-system-tree.md` - Text 시스템 현황
- `layout-system-tree.md` - Layout 시스템 현황
- `legacy-transition-report.md` - 레거시 현황 분석

---

**작성자**: Claude Code
**리서치 날짜**: 2026-01-14
**문서 버전**: 1.0
