좋습니다! 대표적인 FE 컴포넌트들을 전부 나열하고 분류해보겠습니다.

## 분류 기준

| 분류 | 기준 | 예시 |
|------|------|------|
| **Action** | 단일 클릭 타겟, leaf | Button, MenuItem |
| **Block** | 컨테이너, 자식을 담음 | Menu, List |
| **Field** | 사용자 입력 | Input, Select |
| **Text/Image** | 정보 표시 leaf | Label, Avatar |
| **Section** | 페이지 영역 구획 | Modal, Drawer |

---

## 전체 컴포넌트 분류표

### Buttons & Triggers

| 컴포넌트 | 분류 | 이유 |
|----------|------|------|
| Button | **Action** | 단일 클릭 타겟 |
| IconButton | **Action** | 단일 클릭 타겟 |
| Link | **Action** | 단일 클릭 타겟 |
| ToggleButton | **Action** | 단일 클릭 타겟 (pressed 상태) |
| SplitButton | **Block** | Button + Dropdown 조합 |
| ButtonGroup | **Block** | 여러 Button 컨테이너 |

### Chips & Tags

| 컴포넌트 | 분류 | 이유 |
|----------|------|------|
| Chip | **Action** | 클릭/제거 가능한 단일 단위 |
| Tag | **Text** 또는 **Action** | 클릭 불가면 Text, 가능하면 Action |
| ChipGroup | **Block** | 여러 Chip 컨테이너 |

### Navigation

| 컴포넌트 | 분류 | 이유 |
|----------|------|------|
| Tabs | **Block** | Tab들의 컨테이너 |
| Tab | **Action** | 단일 선택 타겟 |
| TabPanel | **Block** | 탭 콘텐츠 컨테이너 |
| Breadcrumbs | **Block** | BreadcrumbItem들의 컨테이너 |
| BreadcrumbItem | **Action** | 단일 클릭 타겟 |
| Pagination | **Block** | 페이지 버튼들의 컨테이너 |
| PageButton | **Action** | 단일 페이지 선택 |
| Stepper | **Block** | Step들의 컨테이너 |
| StepItem | **Action** | 단일 스텝 (클릭 가능 시) |
| NavBar/AppBar | **Block** | 상단 네비게이션 컨테이너 |
| Sidebar | **Section** | 페이지 영역 |
| NavItem | **Action** | 사이드바 메뉴 아이템 |
| NavGroup | **Block** | NavItem 그룹 (섹션 라벨 포함) |

### Menu & Dropdown

| 컴포넌트 | 분류 | 이유 |
|----------|------|------|
| Menu | **Block** | MenuItem들의 컨테이너 |
| MenuItem | **Action** | 단일 선택 타겟 |
| MenuGroup | **Block** | MenuItem 그룹 |
| SubMenu | **Block** | 중첩 메뉴 컨테이너 |
| ContextMenu | **Block** | 우클릭 메뉴 컨테이너 |
| Dropdown | **Block** | 트리거 + 메뉴 조합 |
| DropdownTrigger | **Action** | 드롭다운 열기 버튼 |

### List & Items

| 컴포넌트 | 분류 | 이유 |
|----------|------|------|
| List | **Block** | ListItem들의 컨테이너 |
| ListItem | **Action** | 클릭 가능한 단일 아이템 |
| ListItemText | **Text** | 클릭 불가 정보만 표시 |
| VirtualList | **Block** | 가상화된 리스트 컨테이너 |

### Tree

| 컴포넌트 | 분류 | 이유 |
|----------|------|------|
| TreeView | **Block** | TreeItem들의 컨테이너 |
| TreeItem | **Action** | 클릭/확장 가능한 단일 노드 |

### Table & DataGrid

| 컴포넌트 | 분류 | 이유 |
|----------|------|------|
| Table | **Block** | 테이블 컨테이너 |
| TableHeader | **Block** | 헤더 행 컨테이너 |
| TableBody | **Block** | 바디 컨테이너 |
| TableRow | **Action** | 클릭/선택 가능한 행 |
| TableCell | **Text** 또는 **Action** | 내용에 따라 |
| ColumnHeader | **Action** | 정렬 클릭 가능 |
| DataGrid | **Block** | 고급 테이블 컨테이너 |

### Card

| 컴포넌트 | 분류 | 이유 |
|----------|------|------|
| Card (컨테이너) | **Block** | 내부에 여러 요소 포함 |
| Card (클릭형) | **Action** | 전체가 단일 클릭 타겟 |
| CardHeader | **Block** | 카드 헤더 영역 |
| CardContent | **Block** | 카드 콘텐츠 영역 |
| CardActions | **Block** | 카드 액션 버튼 영역 |
| CardItem (그리드용) | **Action** | 그리드에서 선택 가능한 카드 |

### Accordion

| 컴포넌트 | 분류 | 이유 |
|----------|------|------|
| Accordion | **Block** | AccordionItem들의 컨테이너 |
| AccordionItem | **Block** | trigger + panel 조합 |
| AccordionTrigger | **Action** | 펼치기/접기 클릭 타겟 |
| AccordionPanel | **Block** | 펼쳐지는 콘텐츠 컨테이너 |

### Overlay & Modal

| 컴포넌트 | 분류 | 이유 |
|----------|------|------|
| Modal/Dialog | **Section** | 페이지 위 독립 영역 |
| DialogContent | **Block** | 모달 내부 컨테이너 |
| DialogHeader | **Block** | 모달 헤더 |
| DialogFooter | **Block** | 모달 푸터 (액션 버튼) |
| Drawer | **Section** | 슬라이드 패널 영역 |
| Sheet | **Section** | 바텀 시트 영역 |
| Popover | **Block** | 작은 오버레이 컨테이너 |
| Tooltip | **Block** | 툴팁 컨테이너 |
| TooltipTrigger | **Action** | 툴팁 트리거 |

### Feedback & Status

| 컴포넌트 | 분류 | 이유 |
|----------|------|------|
| Alert | **Block** | 메시지 + 액션 컨테이너 |
| AlertTitle | **Text** | 정보 표시 |
| AlertDescription | **Text** | 정보 표시 |
| Toast | **Block** | 알림 컨테이너 |
| ToastAction | **Action** | 토스트 내 액션 버튼 |
| Notification | **Action** | 클릭하면 이동/닫기 |
| Banner | **Block** | 배너 컨테이너 |
| Progress | **Text** | 정보 표시 (인터랙션 없음) |
| Skeleton | **Text** | 로딩 표시 |
| Spinner | **Text** | 로딩 표시 |
| Badge | **Text** | 정보 표시 |
| Avatar | **Text** 또는 **Action** | 클릭 가능 여부에 따라 |

### Form (Field)

| 컴포넌트 | 분류 | 이유 |
|----------|------|------|
| Input/TextField | **Field** | 입력 |
| TextArea | **Field** | 입력 |
| Select | **Field** | 입력 |
| Combobox | **Field** | 입력 |
| Checkbox | **Field** | 입력 |
| Radio | **Field** | 입력 |
| RadioGroup | **Block** | Radio들의 컨테이너 |
| Switch | **Field** | 입력 |
| Slider | **Field** | 입력 |
| DatePicker | **Field** | 입력 |
| TimePicker | **Field** | 입력 |
| ColorPicker | **Field** | 입력 |
| FilePicker | **Field** | 입력 |
| Form | **Block** | Field들의 컨테이너 |
| FormField | **Block** | Label + Input + Error 묶음 |
| FieldGroup | **Block** | 관련 Field 그룹 |

### Layout

| 컴포넌트 | 분류 | 이유 |
|----------|------|------|
| Container | **Block** | 레이아웃 컨테이너 |
| Stack/Flex | **Block** | 레이아웃 컨테이너 |
| Grid | **Block** | 레이아웃 컨테이너 |
| Divider/Separator | **Separator** | Element (구분선) |
| Spacer | **Separator** | Element (공백) |

### Composite / Complex

| 컴포넌트 | 분류 | 이유 |
|----------|------|------|
| SearchBar | **Block** | Input + Button 조합 |
| CommandPalette | **Block** | 검색 + 리스트 조합 |
| CommandItem | **Action** | 커맨드 아이템 |
| Autocomplete | **Field** | 입력 |
| Calendar | **Block** | 날짜 그리드 컨테이너 |
| CalendarDay | **Action** | 날짜 선택 타겟 |
| Carousel | **Block** | 슬라이드 컨테이너 |
| CarouselSlide | **Block** 또는 **Action** | 클릭 가능 여부 |
| Timeline | **Block** | TimelineItem 컨테이너 |
| TimelineItem | **Block** 또는 **Action** | 클릭 가능 여부 |

---

## 요약: 분류 결과

### Section (페이지 영역)
```
Modal, Drawer, Sheet, Sidebar, Header, Footer, Main
```

### Block (컨테이너)
```
Structural:     Container, Stack, Grid, Card, Form
Navigation:     Tabs, Breadcrumbs, Pagination, Stepper, NavGroup
Menu:           Menu, MenuGroup, SubMenu, ContextMenu, Dropdown
List:           List, TreeView, Table, DataGrid, Accordion
Overlay:        Popover, Tooltip, Alert, Toast, Banner
Composite:      SearchBar, CommandPalette, Calendar, Carousel
Grouping:       ButtonGroup, ChipGroup, RadioGroup, FieldGroup
```

### Action (인터랙티브 leaf)
```
Basic:          Button, IconButton, Link, ToggleButton
Selection:      Tab, MenuItem, Option, Chip
Items:          ListItem, TreeItem, NavItem, CommandItem
                CardItem, FileItem, UserItem, NotificationItem
                BreadcrumbItem, StepItem, PageButton
Table:          TableRow, ColumnHeader
Calendar:       CalendarDay
Triggers:       AccordionTrigger, DropdownTrigger, TooltipTrigger
```

### Field (입력)
```
Text:           TextInput, TextArea, SearchInput, PasswordInput
Choice:         Select, Combobox, Checkbox, Switch, Radio
Numeric:        NumberInput, Slider
DateTime:       DatePicker, TimePicker
Special:        ColorPicker, FilePicker, Signature, OTP
```

### Element - Text (정보 표시 leaf)
```
Typography:     Title, Heading, Body, Label, Caption
Status:         Badge, Progress, Spinner, Skeleton
Media:          Avatar (non-clickable)
```

### Element - Separator
```
Divider, Spacer
```

---

## 핵심 인사이트

| 패턴 | Block | Action |
|------|-------|--------|
| Tabs | ✓ 컨테이너 | Tab |
| Menu | ✓ 컨테이너 | MenuItem |
| List | ✓ 컨테이너 | ListItem |
| Tree | ✓ 컨테이너 | TreeItem |
| Table | ✓ 컨테이너 | TableRow |
| Accordion | ✓ 컨테이너 | AccordionTrigger |
| Breadcrumbs | ✓ 컨테이너 | BreadcrumbItem |
| Pagination | ✓ 컨테이너 | PageButton |
| CommandPalette | ✓ 컨테이너 | CommandItem |
| Calendar | ✓ 컨테이너 | CalendarDay |

**Block은 "틀", Action은 "클릭 가능한 알맹이"**

이 분류대로면 Block Role은 약 20~25개, Action Role은 약 15~20개 정도로 정리될 것 같습니다. 이 방향이 맞을까요?