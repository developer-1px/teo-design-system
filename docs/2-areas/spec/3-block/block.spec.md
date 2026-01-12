# Block Specification

Block은 Element들을 논리적으로 그룹화하거나 레이아웃을 구성하는 컨테이너입니다. IDDL의 핵심 인터랙션 단위입니다.

## BlockRole

### Layout (공간 배치)
- `Stack`: 수직/수평 배치
- `GridLayout`: 규칙적인 그리드 배치
- `Card`: 독립적인 콘텐츠 묶음
- `ScrollArea`: 스크롤 가능 영역
- `Divider`: 구분선 (separator)

### Navigation (탐색)
- `Tabs`: 탭 네비게이션
- `Toolbar`: 도구 모음
- `Breadcrumbs`: 경로 탐색
- `Pagination`: 페이지네이션

### Data Display (데이터 목록)
- `List`: 일반 목록
- `DataTable`: 표 형식 데이터
- `TreeView`: 계층 구조 데이터
- `EmptyState`: 데이터 없음 화면

### Forms (입력 그룹)
- `Form`: 입력 폼 컨테이너
- `FieldGroup`: 필드 논리 그룹
- `FilterBar`: 검색/필터 그룹

### Overlays (부유 UI)
- `Menu`: 드롭다운 메뉴
- `Popover`: 부유 팝업
- `Tooltip`: 툴팁
- `Toast`: 알림

## Props

```typescript
interface BlockProps extends BaseProps {
  role?: BlockRole;
}
```

## 규칙 (Rules)

1. Block의 자식은 **Block** 또는 **Element**만 허용됩니다.
2. **Layout 독립성**: Gap, Padding 등은 직접 prop으로 넘기지 않고, `prominence`와 `density` 조합을 통해 Renderer가 자동 테마 값을 적용합니다.
3. **Behavior 중립성**: Selection, Orientation 등의 상세 동작은 `spec` 객체 내에 정의하거나, Renderer가 `role`에 기반하여 기본 동작을 수행합니다.
