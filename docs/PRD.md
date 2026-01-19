# Product Requirements Document: Headless Table Hook

## 1. 개요 (Overview)
**목표**: 마우스 없이 키보드만으로 데이터 테이블을 완벽하게 제어할 수 있는 "Headless Hook"을 개발한다. Google Sheets 수준의 사용자 경험(커서 이동, 범위 선택, 셀 편집, 복사/붙여넣기, 실행 취소)을 제공하며, UI 렌더링과 비즈니스 로직을 분리하여 디자인 시스템의 독립성을 유지한다.

**대상 컴포넌트**: `DataTable`, `DataGrid`, `Spreadsheet` 류의 컴포넌트

## 2. 배경 및 필요성 (Context)
현재 MDK(Minimal Design Kit)에는 `useSelection`, `useHotKeys`, `useHistory` 등의 개별적인 훅이 존재하지만, 2차원 그리드 상에서의 복합적인 상호작용(커서 이동 + 범위 선택 + 편집 모드 전환)을 통합적으로 관리하는 훅은 부재하다.
복잡한 데이터 테이블 구현 시, 개발자가 매번 키보드 이벤트 핸들링과 포커스 관리를 재구현해야 하는 비효율이 발생하므로, 이를 통합된 Headless Hook으로 추상화할 필요가 있다.

## 3. 핵심 요구사항 (Core Requirements)

### 3.1. 커서 네비게이션 (Cursor Navigation)
- **기본 이동**: 방향키(↑, ↓, ←, →)를 사용하여 단일 셀 단위로 커서를 이동한다.
- **점프 이동**: `Cmd/Ctrl` + 방향키를 사용하여 데이터 영역의 끝(Edge)으로 커서를 이동한다.
- **순환 이동 (Optional)**: 마지막 컬럼에서 우측 이동 시 다음 행의 첫 컬럼으로 이동(설정 가능).
- **Tab 네비게이션**: `Tab`으로 우측 이동, `Shift + Tab`으로 좌측 이동.

### 3.2. 범위 선택 (Range Selection)
- **범위 확장**: `Shift` + 방향키를 사용하여 선택 영역(Selection Range)을 확장한다.
- **전체 선택**: `Cmd/Ctrl + A`를 눌러 전체 데이터 영역을 선택한다.
- **마우스 연동**: 마우스 드래그와 `Shift + Click`을 통한 범위 선택 상태도 동기화되어야 한다(훅 내부 상태로 관리).
- **다중 선택 (Advanced)**: `Cmd/Ctrl + Click`으로 떨어진 다중 영역 선택 (1차 MVP에서는 제외 가능하나 고려 필요).

### 3.3. 셀 편집 (Cell Editing)
- **편집 모드 진입**:
    - `Enter`: 현재 셀을 편집 모드로 전환.
    - `F2`: 현재 셀을 편집 모드로 전환(커서를 내용 끝으로).
    - **Typing**: 셀 선택 상태에서 글자 입력 시 즉시 편집 모드로 전환되며 내용이 덮어써짐.
- **편집 완료 (Commit)**:
    - `Enter`: 변경 사항 저장 후 커서를 아래쪽 셀로 이동(설정 가능).
    - `Tab`: 변경 사항 저장 후 커서를 오른쪽 셀로 이동.
    - `Click Outside`: 다른 영역 클릭 시 저장 후 편집 모드 종료.
- **편집 취소 (Cancel)**:
    - `Esc`: 변경 사항을 취소하고 편집 모드를 종료.

### 3.4. 클립보드 (Clipboard)
- **복사 (`Cmd/Ctrl + C`)**: 선택된 영역의 데이터를 TSV(Tab Separated Values) 포맷으로 시스템 클립보드에 복사.
- **붙여넣기 (`Cmd/Ctrl + V`)**: 시스템 클립보드의 내용을 파싱하여 현재 커서 위치를 기준으로 데이터 덮어쓰기. 선택 영역보다 데이터가 크면 자동으로 확장.
- **잘라내기 (`Cmd/Ctrl + X`)**: 데이터 복사 후 선택 영역의 값을 지움.

### 3.5. 히스토리 (History - Undo/Redo)
- **실행 취소 (`Cmd/Ctrl + Z`)**: 셀 값 변경, 붙여넣기 등의 작업을 이전 상태로 되돌림.
- **다시 실행 (`Cmd/Ctrl + Shift + Z`)**: 되돌린 작업을 다시 수행.
- **Batch 처리**: 한 번의 붙여넣기로 여러 셀이 변경된 경우, 한 번의 Undo로 전체 복구되어야 함.

### 3.6. 성능 및 가상화 (Performance & Virtualization)
- **Virtualization Support**: 훅은 렌더링에 관여하지 않으므로, `react-window`나 `tanstack-virtual`과 같은 가상화 라이브러리와 호환되어야 함.
- **대용량 데이터**: 수만 행의 데이터에서도 커서 이동과 선택이 지연 없이 동작해야 함.

## 4. API 설계 (Draft API Design)

### 4.1. Hook Signature
```typescript
const {
  gridProps,    // 그리드 컨테이너에 spread (`role="grid"`, `tabIndex`, `onKeyDown` 등)
  rowProps,     // 각 행(Row) 생성 함수
  cellProps,    // 각 셀(Cell) 생성 함수
  state,        // 현재 상태 (cursor, selection, editingCell, data)
  actions       // 프로그래매틱 제어 함수 (moveCursor, setSelection, updateData 등)
} = useHeadlessTable({
  data,
  columns,
  onChange,     // 데이터 변경 시 콜백
  getRowId,     // 행 고유 ID 추출 함수
  options: {
    loop: boolean,
    editOnType: boolean,
    moveOnEnter: 'down' | 'right' | 'none',
  }
});
```

### 4.2. State Structure
```typescript
interface TableState {
  cursor: { row: number; col: number }; // 현재 포커스된 셀 좌표
  selection: {
    start: { row: number; col: number };
    end: { row: number; col: number };
  } | null;
  editing: {
    active: boolean;
    row: number;
    col: number;
    value: any;
  } | null;
  history: {
    canUndo: boolean;
    canRedo: boolean;
  };
}
```

## 5. 구현 단계 (Implementation Plan)

### Phase 1: 기본 네비게이션 및 커서
- `useCursor` 훅 구현
- 방향키 이동 로직
- 그리드 좌표 시스템 정의

### Phase 2: 선택 시스템
- `useRangeSelection` 훅 구현
- Shift + 방향키 로직
- 선택 영역 시각화를 위한 좌표 계산 유틸리티

### Phase 3: 편집 및 데이터 흐름
- `useInlineEdit` 훅 구현
- Input 오버레이 또는 In-place 편집 로직 연결
- Enter/Esc/Tab 핸들링

### Phase 4: 고급 기능 (클립보드 & 히스토리)
- `useClipboard` 연동 (기존 훅 활용 및 확장)
- `useHistory` 연동 (데이터 스냅샷 관리)

## 6. 레퍼런스 및 고려사항
- **Google Sheets / Excel**: UX의 골드 스탠다드. 가능한 유사한 단축키 동작을 따른다.
- **AG Grid / Handsontable**: 기능적 벤치마킹 대상.
- **Accessibility (a11y)**: `grid`, `row`, `gridcell` 등의 ARIA role을 적절히 관리하여 스크린 리더 호환성 확보.
