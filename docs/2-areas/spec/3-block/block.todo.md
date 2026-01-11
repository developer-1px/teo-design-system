## IDDL Block이 제공해야 할 컨트롤 목록

### 1. 레이아웃/컨테이너

| Role | 용도 | 자동 제공 행동 | spec 옵션 |
|------|------|---------------|-----------|
| `Card` | 콘텐츠 그룹 컨테이너 | 시각적 경계, 그림자 | `interactive`, `clickable` |
| `Stack` | 수직/수평 스택 | 자식 정렬 | `direction`, `gap`, `align` |
| `Grid` | 그리드 레이아웃 | 반응형 배치 | `columns`, `gap`, `minItemWidth` |
| `ScrollArea` | 스크롤 영역 | 스크롤바, 가상화 | `direction`, `virtualize` |
| `Collapsible` | 접을 수 있는 영역 | 펼침/접힘 애니메이션 | `defaultOpen`, `disabled` |
| `Splitter` | 크기 조절 패널 | 드래그 리사이즈 | `direction`, `defaultSizes`, `min`, `max` |
| `AspectRatio` | 비율 유지 컨테이너 | 비율 계산 | `ratio` |

### 2. 리스트/컬렉션

| Role | 용도 | 자동 제공 행동 | spec 옵션 |
|------|------|---------------|-----------|
| `List` | 단순 목록 | ↑↓ 탐색, 선택, Typeahead | `selection`, `virtualize` |
| `Menu` | 메뉴 목록 | ↑↓ 탐색, Enter 실행, Esc 닫기 | `trigger`, `placement` |
| `ContextMenu` | 우클릭 메뉴 | 위치 계산, 외부 클릭 닫기 | `trigger` |
| `CommandPalette` | 검색 가능 명령 목록 | 필터링, ↑↓ 탐색, Enter 실행 | `placeholder`, `emptyMessage` |
| `Combobox` | 검색 드롭다운 | 필터링, 선택, 생성 | `searchable`, `creatable`, `multiple` |
| `TreeView` | 계층 목록 | ↑↓←→ 탐색, 펼침/접힘, 선택 | `selection`, `defaultExpanded` |
| `DataTable` | 데이터 테이블 | 정렬, 필터, 행 선택, 열 리사이즈 | `selection`, `sortable`, `resizable` |
| `VirtualList` | 대용량 목록 | 가상 스크롤, 동적 높이 | `estimatedItemHeight`, `overscan` |
| `Carousel` | 슬라이드 목록 | 스와이프, 자동 재생, 인디케이터 | `autoPlay`, `loop`, `showIndicators` |
| `Timeline` | 시간순 목록 | 시각적 연결선 | `orientation`, `alternating` |

### 3. 내비게이션

| Role | 용도 | 자동 제공 행동 | spec 옵션 |
|------|------|---------------|-----------|
| `Tabs` | 탭 전환 | ←→ 탐색, 포커스=선택, ARIA | `orientation`, `activationMode` |
| `TabPanel` | 탭 콘텐츠 | 연결된 탭과 동기화 | `value` |
| `Toolbar` | 도구 모음 | ←→ 탐색, 그룹핑 | `orientation`, `loop` |
| `Breadcrumbs` | 경로 표시 | 클릭 내비게이션 | `separator`, `maxItems` |
| `Pagination` | 페이지 전환 | 이전/다음, 페이지 점프 | `total`, `pageSize`, `siblingCount` |
| `Stepper` | 단계 표시 | 단계 상태, 클릭 이동 | `orientation`, `allowClickNavigation` |
| `NavigationMenu` | 내비게이션 메뉴 | 호버/클릭 확장, 서브메뉴 | `trigger`, `delayDuration` |
| `Sidebar` | 사이드 내비게이션 | 접기/펼치기, 반응형 | `collapsible`, `defaultCollapsed` |
| `AppBar` | 상단 앱 바 | 고정, 스크롤 반응 | `position`, `elevated` |

### 4. 폼/입력 그룹

| Role | 용도 | 자동 제공 행동 | spec 옵션 |
|------|------|---------------|-----------|
| `Form` | 폼 컨테이너 | 유효성 검사, Submit 처리 | `onSubmit`, `onError` |
| `FieldGroup` | 필드 그룹 | 그룹 라벨, 에러 집계 | `legend`, `layout` |
| `RadioGroup` | 라디오 그룹 | 단일 선택, ↑↓ 탐색 | `orientation`, `defaultValue` |
| `CheckboxGroup` | 체크박스 그룹 | 다중 선택 | `orientation`, `min`, `max` |
| `ToggleGroup` | 토글 버튼 그룹 | 단일/다중 선택 | `type`, `orientation` |
| `InputGroup` | 입력 + 애드온 | prefix/suffix 배치 | `size` |
| `FormActions` | 폼 버튼 그룹 | Submit/Reset 버튼 배치 | `alignment` |

### 5. 오버레이/모달

| Role | 용도 | 자동 제공 행동 | spec 옵션 |
|------|------|---------------|-----------|
| `Dialog` | 모달 대화상자 | 포커스 트랩, Esc 닫기, 복원 | `modal`, `closeOnEscape`, `closeOnOutside` |
| `AlertDialog` | 확인 대화상자 | 위험 액션 확인, 포커스 트랩 | `type` |
| `Sheet` | 시트 (바텀/사이드) | 슬라이드 애니메이션, 드래그 닫기 | `side`, `snapPoints` |
| `Drawer` | 서랍 패널 | 슬라이드, 오버레이 | `side`, `modal` |
| `Popover` | 팝오버 | 위치 계산, 외부 클릭 닫기 | `placement`, `offset`, `arrow` |
| `Tooltip` | 툴팁 | 호버/포커스 표시, 지연 | `delay`, `placement` |
| `HoverCard` | 호버 카드 | 호버 시 확장 정보 | `openDelay`, `closeDelay` |
| `DropdownMenu` | 드롭다운 메뉴 | 클릭 열기, 외부 닫기 | `placement`, `offset` |
| `Toast` | 토스트 알림 | 자동 사라짐, 스택 관리 | `duration`, `position` |
| `Notification` | 알림 | 닫기 버튼, 액션 | `closable`, `duration` |

### 6. 데이터 표시

| Role | 용도 | 자동 제공 행동 | spec 옵션 |
|------|------|---------------|-----------|
| `Accordion` | 아코디언 | 단일/다중 펼침, 애니메이션 | `type`, `collapsible`, `defaultValue` |
| `DescriptionList` | 키-값 목록 | 레이아웃 정렬 | `layout`, `columns` |
| `Stats` | 통계 카드 | 숫자 포맷팅, 트렌드 표시 | `trend`, `format` |
| `Avatar` | 아바타 | 이미지/이니셜 폴백 | `fallback`, `size` |
| `AvatarGroup` | 아바타 그룹 | 겹침 배치, +N 표시 | `max`, `spacing` |
| `Badge` | 뱃지 | 카운트, 점 표시 | `variant`, `max` |
| `Tag` | 태그 | 삭제 가능, 색상 | `removable`, `color` |
| `EmptyState` | 빈 상태 | 아이콘, 메시지, 액션 | `icon`, `action` |
| `Skeleton` | 스켈레톤 | 로딩 애니메이션 | `variant`, `count` |
| `Calendar` | 캘린더 | 날짜 탐색, 선택 | `mode`, `min`, `max`, `disabled` |
| `Chart` | 차트 | 데이터 시각화 | `type`, `data`, `options` |

### 7. 피드백/상태

| Role | 용도 | 자동 제공 행동 | spec 옵션 |
|------|------|---------------|-----------|
| `Alert` | 인라인 알림 | 아이콘, 닫기 | `variant`, `closable` |
| `Progress` | 진행률 표시 | 퍼센트 계산, 애니메이션 | `value`, `max`, `indeterminate` |
| `Spinner` | 로딩 스피너 | 회전 애니메이션 | `size`, `label` |
| `Banner` | 배너 알림 | 고정 위치, 닫기 | `variant`, `sticky` |
| `Callout` | 강조 블록 | 아이콘, 색상 | `variant`, `icon` |

### 8. 상호작용 컨트롤

| Role | 용도 | 자동 제공 행동 | spec 옵션 |
|------|------|---------------|-----------|
| `DragDropZone` | 드래그 앤 드롭 영역 | 드롭 피드백, 파일 처리 | `accept`, `multiple`, `maxFiles` |
| `Sortable` | 정렬 가능 목록 | 드래그 재정렬, 애니메이션 | `axis`, `handle`, `disabled` |
| `Resizable` | 크기 조절 영역 | 핸들 드래그, 제약 | `directions`, `min`, `max` |
| `SelectionArea` | 범위 선택 영역 | 마우스 드래그 선택 | `selectables`, `behaviour` |

---

## 요약: 카테고리별 개수

| 카테고리 | 개수 | 핵심 Role |
|---------|------|----------|
| 레이아웃/컨테이너 | 7 | Card, Stack, Grid, ScrollArea |
| 리스트/컬렉션 | 10 | List, Menu, TreeView, DataTable |
| 내비게이션 | 9 | Tabs, Toolbar, Breadcrumbs, Sidebar |
| 폼/입력 그룹 | 7 | Form, FieldGroup, RadioGroup |
| 오버레이/모달 | 10 | Dialog, Sheet, Popover, Toast |
| 데이터 표시 | 12 | Accordion, Avatar, Badge, Calendar |
| 피드백/상태 | 5 | Alert, Progress, Spinner |
| 상호작용 컨트롤 | 4 | DragDropZone, Sortable |

**총 64개 Block Role**

---

## 우선순위 (Tier)

### Tier 1: 필수 (MVP)
```
List, Menu, Tabs, Toolbar, Form, Dialog, Popover, 
Tooltip, Toast, Card, Stack, Accordion, Alert
```

### Tier 2: 핵심 확장
```
TreeView, DataTable, CommandPalette, Combobox,
Sheet, Drawer, ContextMenu, Breadcrumbs, Pagination,
RadioGroup, CheckboxGroup, Progress, EmptyState
```

### Tier 3: 고급
```
VirtualList, Carousel, Calendar, Chart, Splitter,
Sortable, DragDropZone, SelectionArea, NavigationMenu,
HoverCard, Timeline, Stepper
```