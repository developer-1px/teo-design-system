# FE Component → IDDL Role Mapping

보편적인 프론트엔드 컴포넌트와 IDDL v1.0.1 role 매핑 가이드

---

## 1. Layout Components (레이아웃)

| Component | 설명 | IDDL Role | ARIA Role | 비고 |
|-----------|------|-----------|-----------|------|
| **Container** | 콘텐츠를 감싸는 기본 컨테이너 | `Section` role="Container" | `region` or none | 기본 wrapper |
| **Box** | 범용 박스 컴포넌트 | `Group` role="Container" | `group` or none | 유연한 컨테이너 |
| **Stack** | 수직/수평 스택 레이아웃 | `Group` role="Container" + gap | `group` or none | direction, gap 조절 |
| **Grid** | 그리드 레이아웃 | `Section` role="Container" + CSS Grid | `region` or none | className 활용 |
| **Flex** | Flexbox 레이아웃 | `Group` role="Container" | `group` or none | 기본이 flex |
| **Divider** | 구분선 | `<hr>` or `Group` role="Separator" | `separator` | **NEW ROLE 필요** |
| **Spacer** | 공간 확보 | CSS (margin/padding) | none | 컴포넌트 불필요 |
| **Center** | 중앙 정렬 컨테이너 | `Group` role="Container" + CSS | none | className="flex items-center justify-center" |
| **AspectRatio** | 비율 유지 컨테이너 | `Group` + CSS aspect-ratio | none | style 활용 |
| **SplitPane** | 분할 패널 (리사이즈 가능) | `Section` role="SplitContainer" | `group` + `aria-orientation` | 이미 구현됨 |

---

## 2. Navigation Components (네비게이션)

| Component | 설명 | IDDL Role | ARIA Role | 비고 |
|-----------|------|-----------|-----------|------|
| **Navbar** | 상단 네비게이션 바 | `Section` role="Header" | `banner` or `navigation` | sticky header |
| **Sidebar** | 사이드바 네비게이션 | `Section` role="Navigator" | `navigation` + `aria-label` | 왼쪽 고정 패널 |
| **Menu** | 메뉴 목록 | `Group` role="Menu" | `menu` | **NEW ROLE 필요** |
| **MenuItem** | 메뉴 항목 | `Action` variant="menu-item" | `menuitem` | **NEW VARIANT 필요** |
| **Breadcrumb** | 경로 표시 | `Page` breadcrumbs prop | `navigation` + `aria-label="Breadcrumb"` | 이미 지원 |
| **Tabs** | 탭 네비게이션 | `Group` role="TabList" + `Action` role="Tab" | `tablist` + `tab` | **NEW ROLE 필요** |
| **TabPanel** | 탭 콘텐츠 영역 | `Section` role="TabPanel" | `tabpanel` | **NEW ROLE 필요** |
| **Pagination** | 페이지네이션 | `Group` role="Pagination" | `navigation` + `aria-label="Pagination"` | **NEW ROLE 필요** |
| **Steps** | 단계 표시 (Wizard) | `Group` role="Stepper" | `list` + `aria-label="Progress"` | **NEW ROLE 필요** |
| **Anchor** | 페이지 내 앵커 링크 | `Action` behavior="navigate" | `link` | to="#anchor" |
| **Link** | 일반 링크 | `Action` variant="link" | `link` | 이미 지원 |
| **Drawer** | 슬라이드 패널 | `Overlay` role="Sheet" | `dialog` + `aria-modal` | 이미 지원 |

---

## 3. Data Display Components (데이터 표시)

| Component | 설명 | IDDL Role | ARIA Role | 비고 |
|-----------|------|-----------|-----------|------|
| **Table** | 테이블 | `Group` role="Table" + `Text` | `table`, `row`, `cell`, `columnheader` | **NEW ROLE 필요** |
| **DataGrid** | 고급 데이터 그리드 | `Group` role="DataGrid" | `grid`, `row`, `gridcell` | **NEW ROLE 필요** |
| **List** | 목록 | `Group` role="List" | `list` | 이미 지원 |
| **ListItem** | 목록 항목 | `Action` variant="list-item" | `listitem` | 이미 지원 |
| **Tree** | 트리 구조 | `Group` role="Tree" | `tree` | **NEW ROLE 필요** |
| **TreeNode** | 트리 노드 | `Group` role="TreeNode" | `treeitem` + `aria-expanded` | **NEW ROLE 필요** |
| **Card** | 카드 | `Group` role="Card" | `article` or `region` | 이미 지원 |
| **Timeline** | 타임라인 | `Group` role="Timeline" | `list` + custom labels | **NEW ROLE 필요** |
| **Calendar** | 달력 | `Group` role="Calendar" | `grid` + `aria-label` | **NEW ROLE 필요** |
| **Avatar** | 아바타 (프로필 이미지) | `Group` role="Avatar" | `img` + `alt` | **NEW ROLE 필요** |
| **Badge** | 배지 (숫자/상태 표시) | `Text` role="Badge" | `status` or `img` | **NEW ROLE 필요** |
| **Tag** | 태그 | `Text` role="Tag" | none or `mark` | **NEW ROLE 필요** |
| **Chip** | 칩 (선택 가능한 태그) | `Action` role="Chip" | `button` + `aria-pressed` | **NEW ROLE 필요** |
| **Statistic** | 통계 숫자 표시 | `Group` role="Statistic" | `group` + `aria-label` | **NEW ROLE 필요** |
| **Empty** | 빈 상태 표시 | `Group` role="EmptyState" | `status` + `aria-live="polite"` | **NEW ROLE 필요** |
| **Skeleton** | 로딩 스켈레톤 | `Group` role="Skeleton" | `status` + `aria-busy="true"` | **NEW ROLE 필요** |
| **Image** | 이미지 | `<img>` or `Group` role="Image" | `img` + `alt` | **NEW ROLE 필요** |
| **Carousel** | 이미지 슬라이더 | `Group` role="Carousel" | `region` + `aria-roledescription="carousel"` | **NEW ROLE 필요** |
| **Accordion** | 아코디언 | `Group` role="Accordion" | `button` + `aria-expanded`, `region` | **NEW ROLE 필요** |
| **Collapse** | 접기/펼치기 | `Group` role="Collapsible" | `button` + `aria-expanded`, `region` | **NEW ROLE 필요** |
| **Description** | 설명 목록 (key-value) | `Group` role="DescriptionList" | `dl`, `dt`, `dd` | **NEW ROLE 필요** |

---

## 4. Input Components (입력)

| Component | 설명 | IDDL Role | ARIA Role | 비고 |
|-----------|------|-----------|-----------|------|
| **Button** | 버튼 | `Action` variant="primary/secondary/..." | `button` | 이미 지원 |
| **IconButton** | 아이콘 버튼 | `Action` + icon only | `button` + `aria-label` | 이미 지원 |
| **ButtonGroup** | 버튼 그룹 | `Group` role="ButtonGroup" | `group` or `toolbar` | **NEW ROLE 필요** |
| **Input** | 텍스트 입력 | `Field` dataType="text" | `textbox` | 이미 지원 |
| **Textarea** | 여러 줄 입력 | `Field` dataType="text" multiline | `textbox` + `aria-multiline` | 이미 지원 |
| **Select** | 드롭다운 선택 | `Field` dataType="select" | `combobox` or `listbox` | 이미 지원 |
| **Checkbox** | 체크박스 | `Field` dataType="boolean" | `checkbox` | 이미 지원 |
| **Radio** | 라디오 버튼 | `Field` dataType="select" variant="radio" | `radio` + `radiogroup` | **NEW VARIANT 필요** |
| **Switch** | 토글 스위치 | `Field` dataType="boolean" variant="switch" | `switch` | **NEW VARIANT 필요** |
| **Slider** | 슬라이더 | `Field` dataType="number" variant="slider" | `slider` | **NEW VARIANT 필요** |
| **DatePicker** | 날짜 선택 | `Field` dataType="date" | `textbox` + `dialog` (calendar) | 이미 지원 |
| **TimePicker** | 시간 선택 | `Field` dataType="time" | `textbox` + `dialog` (clock) | 이미 지원 |
| **ColorPicker** | 색상 선택 | `Field` dataType="color" | `button` + `dialog` | **NEW DATATYPE 필요** |
| **Upload** | 파일 업로드 | `Field` dataType="file" | `button` + `input[type="file"]` | **NEW DATATYPE 필요** |
| **Rating** | 평점 입력 | `Field` dataType="number" variant="rating" | `radiogroup` + custom labels | **NEW VARIANT 필요** |
| **SearchInput** | 검색 입력 | `Field` dataType="text" variant="search" | `searchbox` | **NEW VARIANT 필요** |
| **OTPInput** | OTP 입력 | `Field` dataType="text" variant="otp" | `group` + multiple `textbox` | **NEW VARIANT 필요** |
| **Autocomplete** | 자동완성 입력 | `Field` dataType="text" + suggestions | `combobox` + `listbox` | **NEW FEATURE 필요** |

---

## 5. Feedback Components (피드백)

| Component | 설명 | IDDL Role | ARIA Role | 비고 |
|-----------|------|-----------|-----------|------|
| **Alert** | 알림 메시지 | `Group` role="Alert" + intent | `alert` or `status` | **NEW ROLE 필요** |
| **Toast** | 토스트 알림 | `Overlay` role="Toast" | `status` + `aria-live="polite"` | 이미 지원 |
| **Notification** | 알림 (우측 상단) | `Overlay` role="Toast" position="top-right" | `status` + `aria-live="polite"` | 이미 지원 |
| **Message** | 메시지 박스 | `Group` role="Message" | `status` or `alert` | **NEW ROLE 필요** |
| **Progress** | 진행률 표시 | `Group` role="Progress" | `progressbar` + `aria-valuenow` | **NEW ROLE 필요** |
| **Spinner** | 로딩 스피너 | `Group` role="Spinner" | `status` + `aria-label="Loading"` | **NEW ROLE 필요** |
| **LoadingBar** | 상단 로딩 바 | `Group` role="LoadingBar" | `progressbar` + `aria-label` | **NEW ROLE 필요** |
| **Result** | 결과 페이지 (성공/실패) | `Section` role="Result" | `status` + `aria-live="polite"` | **NEW ROLE 필요** |

---

## 6. Overlay Components (오버레이)

| Component | 설명 | IDDL Role | ARIA Role | 비고 |
|-----------|------|-----------|-----------|------|
| **Modal** | 모달 다이얼로그 | `Overlay` role="Modal" | `dialog` + `aria-modal="true"` | 이미 지원 |
| **Dialog** | 다이얼로그 | `Overlay` role="Dialog" | `dialog` + `aria-labelledby` | 이미 지원 |
| **Drawer** | 슬라이드 패널 | `Overlay` role="Sheet" | `dialog` + `aria-modal` | 이미 지원 |
| **Popover** | 팝오버 | `Overlay` role="Popover" | `dialog` or `region` | 이미 지원 |
| **Tooltip** | 툴팁 | `Overlay` role="Tooltip" | `tooltip` + `aria-describedby` | **NEW ROLE 필요** |
| **ContextMenu** | 우클릭 메뉴 | `Overlay` role="ContextMenu" | `menu` | **NEW ROLE 필요** |
| **Dropdown** | 드롭다운 메뉴 | `Overlay` role="Dropdown" | `menu` + `menuitem` | **NEW ROLE 필요** |
| **Sheet** | 하단 시트 | `Overlay` role="Sheet" | `dialog` + `aria-modal` | 이미 지원 |
| **Lightbox** | 이미지 뷰어 | `Overlay` role="Lightbox" | `dialog` + `img` | 이미 지원 |

---

## 7. Typography Components (타이포그래피)

| Component | 설명 | IDDL Role | ARIA Role | 비고 |
|-----------|------|-----------|-----------|------|
| **Heading** | 제목 (h1-h6) | `Text` role="Title" | `heading` + `aria-level` | 이미 지원 |
| **Text** | 일반 텍스트 | `Text` role="Body" | none | 이미 지원 |
| **Paragraph** | 문단 | `Text` role="Body" as="p" | none | 이미 지원 |
| **Label** | 레이블 | `Text` role="Label" | none (semantic `<label>`) | 이미 지원 |
| **Caption** | 캡션 (작은 텍스트) | `Text` role="Caption" | none | 이미 지원 |
| **Code** | 인라인 코드 | `Text` role="Code" | none (semantic `<code>`) | **NEW ROLE 필요** |
| **CodeBlock** | 코드 블록 | `Group` role="CodeBlock" | none (semantic `<pre><code>`) | **NEW ROLE 필요** |
| **Blockquote** | 인용구 | `Group` role="Blockquote" | none (semantic `<blockquote>`) | **NEW ROLE 필요** |
| **Mark** | 하이라이트 텍스트 | `Text` role="Highlight" | none (semantic `<mark>`) | **NEW ROLE 필요** |

---

## 8. Utility Components (유틸리티)

| Component | 설명 | IDDL Role | ARIA Role | 비고 |
|-----------|------|-----------|-----------|------|
| **Portal** | DOM 트리 외부 렌더링 | React Portal | none | 컴포넌트 불필요 |
| **Transition** | 애니메이션 전환 | CSS transitions | none | 컴포넌트 불필요 |
| **VisuallyHidden** | 스크린리더 전용 텍스트 | `<span className="sr-only">` | none | 컴포넌트 불필요 |
| **FocusTrap** | 포커스 잠금 | Hook/Util | none | 컴포넌트 불필요 |
| **ScrollArea** | 커스텀 스크롤 영역 | `Section` role="ScrollArea" | `region` + custom scrollbar | **NEW ROLE 필요** |

---

## 9. Form Components (폼 관련)

| Component | 설명 | IDDL Role | ARIA Role | 비고 |
|-----------|------|-----------|-----------|------|
| **Form** | 폼 컨테이너 | `Group` role="Form" | `form` | 이미 지원 |
| **FormField** | 폼 필드 (label + input + error) | `Field` | `group` + proper labels | 이미 지원 |
| **FormControl** | 폼 컨트롤 wrapper | `Group` role="FormControl" | `group` | **NEW ROLE 필요** |
| **FormLabel** | 폼 레이블 | `Text` role="Label" | none (semantic `<label>`) | 이미 지원 |
| **FormHelperText** | 도움말 텍스트 | `Text` role="Caption" | none + `aria-describedby` | 이미 지원 |
| **FormErrorMessage** | 에러 메시지 | `Text` role="Caption" intent="Critical" | `alert` + `aria-live="polite"` | 이미 지원 |
| **FieldSet** | 필드셋 | `Group` role="FieldSet" | `group` (semantic `<fieldset>`) | **NEW ROLE 필요** |

---

## 10. Specialized Components (특수 목적)

| Component | 설명 | IDDL Role | ARIA Role | 비고 |
|-----------|------|-----------|-----------|------|
| **Dashboard** | 대시보드 레이아웃 | `Page` role="Dashboard" | `main` + regions | 이미 지원 |
| **Kanban** | 칸반 보드 | `Group` role="Kanban" | `region` + `aria-label` | **NEW ROLE 필요** |
| **Chat** | 채팅 UI | `Group` role="Chat" | `log` + `aria-live="polite"` | **NEW ROLE 필요** |
| **Comments** | 댓글 목록 | `Group` role="Comments" | `list` + `article` | **NEW ROLE 필요** |
| **Feed** | 피드 (SNS 스타일) | `Page` role="Feed" | `feed` + `article` | 이미 지원 |
| **Invoice** | 인보이스/영수증 | `Section` role="Invoice" | `article` + `table` | **NEW ROLE 필요** |
| **Pricing** | 가격 표시 카드 | `Group` role="PricingCard" | `article` or `region` | **NEW ROLE 필요** |
| **FAQ** | FAQ 아코디언 | `Group` role="Accordion" | `button` + `region` | Accordion과 동일 |
| **Hero** | 히어로 섹션 | `Section` prominence="Hero" | `region` + `aria-label` | 이미 지원 |

---

## 새로 추가해야 할 Role 목록

### Section Roles
```typescript
export type SectionRole =
  | 'Container'
  | 'SplitContainer'
  | 'Header'
  | 'Footer'
  | 'Navigator'
  | 'Aside'
  | 'TabPanel'      // NEW: 탭 콘텐츠 영역
  | 'Result'        // NEW: 결과 페이지
  | 'ScrollArea';   // NEW: 커스텀 스크롤 영역
```

### Group Roles
```typescript
export type GroupRole =
  | 'Container'
  | 'Card'
  | 'Form'
  | 'List'
  | 'Toolbar'
  | 'Menu'           // NEW: 메뉴
  | 'TabList'        // NEW: 탭 목록
  | 'Pagination'     // NEW: 페이지네이션
  | 'Stepper'        // NEW: 단계 표시
  | 'Table'          // NEW: 테이블
  | 'DataGrid'       // NEW: 데이터 그리드
  | 'Tree'           // NEW: 트리 구조
  | 'TreeNode'       // NEW: 트리 노드
  | 'Timeline'       // NEW: 타임라인
  | 'Calendar'       // NEW: 달력
  | 'Avatar'         // NEW: 아바타
  | 'ButtonGroup'    // NEW: 버튼 그룹
  | 'Alert'          // NEW: 알림
  | 'Message'        // NEW: 메시지
  | 'Progress'       // NEW: 진행률
  | 'Spinner'        // NEW: 로딩
  | 'LoadingBar'     // NEW: 로딩 바
  | 'Skeleton'       // NEW: 스켈레톤
  | 'Image'          // NEW: 이미지
  | 'Carousel'       // NEW: 캐러셀
  | 'Accordion'      // NEW: 아코디언
  | 'Collapsible'    // NEW: 접기/펼치기
  | 'DescriptionList' // NEW: 설명 목록
  | 'FormControl'    // NEW: 폼 컨트롤
  | 'FieldSet'       // NEW: 필드셋
  | 'CodeBlock'      // NEW: 코드 블록
  | 'Blockquote'     // NEW: 인용구
  | 'Kanban'         // NEW: 칸반
  | 'Chat'           // NEW: 채팅
  | 'Comments'       // NEW: 댓글
  | 'PricingCard'    // NEW: 가격 카드
  | 'Statistic'      // NEW: 통계
  | 'EmptyState'     // NEW: 빈 상태
  | 'Separator';     // NEW: 구분선
```

### Text Roles
```typescript
export type TextRole =
  | 'Title'
  | 'Body'
  | 'Label'
  | 'Caption'
  | 'Badge'         // NEW: 배지
  | 'Tag'           // NEW: 태그
  | 'Code'          // NEW: 인라인 코드
  | 'Highlight';    // NEW: 하이라이트
```

### Action Roles
```typescript
export type ActionRole =
  | 'Tab'           // NEW: 탭 버튼
  | 'Chip';         // NEW: 칩 (선택 가능한 태그)
```

### Action Variants
```typescript
export type ActionVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'link'
  | 'list-item'
  | 'menu-item';    // NEW: 메뉴 항목
```

### Overlay Roles
```typescript
export type OverlayRole =
  | 'Modal'
  | 'Dialog'
  | 'Popover'
  | 'Toast'
  | 'Sheet'
  | 'Lightbox'
  | 'Floating'
  | 'Tooltip'       // NEW: 툴팁
  | 'ContextMenu'   // NEW: 컨텍스트 메뉴
  | 'Dropdown';     // NEW: 드롭다운
```

### Field DataTypes
```typescript
export type FieldDataType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'time'
  | 'datetime'
  | 'select'
  | 'color'         // NEW: 색상
  | 'file';         // NEW: 파일
```

### Field Variants
```typescript
export type FieldVariant =
  | 'radio'         // NEW: 라디오
  | 'switch'        // NEW: 스위치
  | 'slider'        // NEW: 슬라이더
  | 'rating'        // NEW: 평점
  | 'search'        // NEW: 검색
  | 'otp';          // NEW: OTP
```

---

## 구현 우선순위

### 🔴 High Priority (즉시 구현)
1. **Menu / MenuItem** - 네비게이션 필수
2. **Tabs / TabPanel** - 일반적 UI 패턴
3. **Table / DataGrid** - 데이터 표시 핵심
4. **Alert / Message** - 사용자 피드백 필수
5. **Tooltip** - UX 개선 필수
6. **Badge / Tag** - 상태/라벨 표시 필수
7. **Progress / Spinner** - 로딩 상태 필수

### 🟡 Medium Priority (다음 단계)
8. **Tree / TreeNode** - 파일 탐색기 등
9. **Accordion / Collapsible** - 콘텐츠 구성
10. **Pagination** - 데이터 탐색
11. **Avatar** - 사용자 프로필
12. **Dropdown / ContextMenu** - 메뉴 시스템
13. **Radio / Switch / Slider** - 폼 입력 확장
14. **SearchInput** - 검색 기능

### 🟢 Low Priority (향후 고려)
15. **Calendar / Timeline** - 특수 목적
16. **Carousel** - 이미지 갤러리
17. **Kanban / Chat** - 특수 애플리케이션
18. **Rating / ColorPicker** - 특수 입력
19. **Stepper** - Wizard 확장

---

## 참고 자료

### 주요 디자인 시스템
- **Material UI** (Google): https://mui.com/material-ui/all-components/
- **Ant Design** (Alibaba): https://ant.design/components/overview
- **Chakra UI**: https://chakra-ui.com/docs/components
- **shadcn/ui**: https://ui.shadcn.com/docs/components
- **Radix UI**: https://www.radix-ui.com/primitives/docs/overview/introduction
- **Mantine**: https://mantine.dev/core/getting-started/
- **Headless UI** (Tailwind): https://headlessui.com/
- **Fluent UI** (Microsoft): https://react.fluentui.dev/?path=/docs/concepts-introduction--page
- **Carbon Design** (IBM): https://carbondesignsystem.com/components/overview/
- **Lightning Design** (Salesforce): https://www.lightningdesignsystem.com/components/overview/

### 웹 표준
- **ARIA Authoring Practices**: https://www.w3.org/WAI/ARIA/apg/patterns/
- **HTML Living Standard**: https://html.spec.whatwg.org/multipage/

---

## 다음 단계

1. **types.ts 업데이트**: 새로운 role들 추가
2. **우선순위 컴포넌트 구현**: High Priority 컴포넌트부터 구현
3. **Storybook 문서화**: 각 컴포넌트 사용 예제 작성
4. **Accessibility 검증**: ARIA 패턴 준수 확인
5. **테마 시스템 통합**: 모든 컴포넌트가 디자인 토큰 사용
