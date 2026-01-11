/**
 * Block Type Definitions
 */

import type { ReactNode } from 'react';
import type { AsProp, Density, Intent, Prominence } from '../Shared.types';

/**
 * Selection Model Interface (v1.0.2)
 * Block이 선택 가능한 항목들을 관리할 때 사용하는 모델
 * v1.0.4: Focus management 추가 (registerItemRef)
 */
export interface SelectionModel {
  /** 현재 선택된 값들의 집합 */
  selectedValues: Set<string | number>;
  /** 특정 값이 선택되었는지 확인 */
  isSelected: (value: string | number) => boolean;
  /** 선택 조작 (optional) */
  select?: (value: string | number) => void;
  deselect?: (value: string | number) => void;
  toggle?: (value: string | number) => void;
  /** 아이템 클릭 핸들러 (modifier keys 자동 처리) */
  handleItemClick?: (value: string | number, event: React.MouseEvent) => void;
  /** 아이템 DOM 요소 등록 (focus management, v1.0.4) */
  registerItemRef?: (value: string | number, element: HTMLElement | null) => void;
}

/**
 * Block Role - 블록의 기능적 역할 (v4.0: 기능 중심 분류)
 * v1.0.1: 많은 role 추가
 * v4.0: 기능적 목적에 따른 분류, 시각적 요소 허용
 *
 * Block = 기능적 컴포넌트 (Functional Component)
 * - 시각적 요소를 가질 수 있음 (배경, 보더, 패딩, 그림자)
 * - Template 무관하게 독립적으로 동작
 * - 재사용 가능한 UI 조합
 */
export type BlockRole =
  // 1. 레이아웃/컨테이너 (Layout/Container)
  | 'Card' // 콘텐츠 그룹 컨테이너
  | 'Stack' // 수직/수평 스택
  | 'Grid' // 그리드 레이아웃
  | 'Center' // 중앙 정렬 컨테이너
  | 'ScrollArea' // 스크롤 영역
  | 'Collapsible' // 접을 수 있는 영역
  | 'Splitter' // 크기 조절 패널
  | 'AspectRatio' // 비율 유지 컨테이너
  | 'Tree' // 계층형 트리 탐색 (v4.1)
  | 'Container' // Legacy: 일반 컨테이너
  | 'Group' // Legacy: Stack Alias
  | 'Row' // Legacy: Stack horizontal
  | 'Split' // Legacy: Splitter Alias
  | 'Inline' // Legacy: Inline Stack
  | 'Spacer' // Legacy: 여백
  | 'Divider' // 구분선
  | 'DividerVertical' // 수직 구분선

  // 2. 리스트/컬렉션 (List/Collection)
  | 'List' // 단순 목록
  | 'Menu' // 메뉴 목록
  | 'ContextMenu' // 우클릭 메뉴
  | 'CommandPalette' // 검색 가능 명령 목록
  | 'Combobox' // 검색 드롭다운
  | 'TreeView' // 계층 목록
  | 'DataTable' // 데이터 테이블
  | 'VirtualList' // 대용량 목록
  | 'Carousel' // 슬라이드 목록
  | 'Timeline' // 시간순 목록
  | 'ListItem' // Legacy: 리스트 아이템
  | 'SortableList' // Legacy: 정렬 가능한 리스트
  | 'MenuItem' // Legacy: 메뉴 아이템
  | 'MenuSection' // Legacy: 메뉴 섹션
  | 'MenuTrigger' // Legacy: 메뉴 트리거
  | 'Dropdown' // Legacy: 드롭다운

  // 3. 내비게이션 (Navigation)
  | 'Tabs' // 탭 전환
  | 'TabPanel' // 탭 콘텐츠
  | 'Toolbar' // 도구 모음
  | 'Breadcrumbs' // 경로 표시
  | 'Pagination' // 페이지 전환
  | 'Stepper' // 단계 표시
  | 'NavigationMenu' // 내비게이션 메뉴
  | 'Sidebar' // 사이드 내비게이션
  | 'AppBar' // 상단 앱 바
  | 'Steps' // Legacy: Stepper Alias
  | 'ScrollMenu' // Legacy: 스크롤 메뉴
  | 'Navigator' // Legacy: 네비게이션바
  | 'FloatingToolbar' // Legacy: 플로팅 툴바
  | 'ToolbarDivider' // Legacy: 툴바 구분선

  // 4. 폼/입력 그룹 (Form/Input Group)
  | 'Form' // 폼 컨테이너
  | 'FieldGroup' // 필드 그룹
  | 'RadioGroup' // 라디오 그룹
  | 'CheckboxGroup' // 체크박스 그룹
  | 'ToggleGroup' // 토글 버튼 그룹
  | 'InputGroup' // 입력 + 애드온
  | 'FormActions' // 폼 버튼 그룹
  | 'Fieldset' // Legacy: FieldGroup Alias

  // 5. 오버레이/모달 (Overlay/Modal)
  | 'Dialog' // 모달 대화상자
  | 'AlertDialog' // 확인 대화상자
  | 'Sheet' // 시트 (바텀/사이드)
  | 'Drawer' // 서랍 패널
  | 'Popover' // 팝오버
  | 'Tooltip' // 툴팁
  | 'HoverCard' // 호버 카드
  | 'DropdownMenu' // 드롭다운 메뉴
  | 'Toast' // 토스트 알림
  | 'Notification' // 알림

  // 6. 데이터 표시 (Data Display)
  | 'Accordion' // 아코디언
  | 'DescriptionList' // 키-값 목록
  | 'Stats' // 통계 카드
  | 'Avatar' // 아바타
  | 'AvatarGroup' // 아바타 그룹
  | 'Badge' // 뱃지
  | 'Tag' // 태그
  | 'EmptyState' // 빈 상태
  | 'Skeleton' // 스켈레톤
  | 'Calendar' // 캘린더
  | 'Chart' // 차트
  | 'ColorIndicator' // Legacy: 색상 표시
  | 'PreviewContainer' // Legacy: 미리보기 컨테이너
  | 'PreviewCard' // Legacy: 미리보기 카드
  | 'SectionHighlight' // Legacy: 영역 하이라이트

  // 7. 피드백/상태 (Feedback/Status)
  | 'Alert' // 인라인 알림
  | 'Progress' // 진행률 표시
  | 'Spinner' // 로딩 스피너
  | 'Banner' // 배너 알림
  | 'Callout' // 강조 블록

  // 8. 상호작용 컨트롤 (Interaction)
  | 'DragDropZone' // 드래그 앤 드롭 영역
  | 'Sortable' // 정렬 가능 목록
  | 'Resizable' // 크기 조절 영역
  | 'SelectionArea' // 범위 선택 영역

  // Testing
  | 'Mock' // 테스트용
  | 'DeviceFrame'; // 기기 프레임

/**
 * Layout - 레이아웃 방향
 * v1.0.1 추가
 *
 * * **Section vs Block**:
 * - Section: 시각적 영역 (배경, 보더, 패딩 있음) - Figma Section과 동일
 * - Block: 투명 레이아웃 컨테이너 (시각적 요소 없음) - Figma Block과 동일
 */
export type Layout = 'stack' | 'inline' | 'grid' | 'table' | 'split' | 'tabs' | 'steps';

/**
 * Load State - 데이터 로딩 상태
 * v1.0.1 추가
 */
export type LoadState = 'idle' | 'loading' | 'error' | 'empty';

/**
 * Block Props
 * v1.0.1: role 타입 변경, layout, state, emptyContent, errorContent 추가
 * v4.0: Accordion props 추가 (mode, defaultValue, value, onValueChange)
 * v1.0.2: value, selectionModel 추가 (Selection 통합)
 */
export interface BlockProps extends AsProp {
  role?: BlockRole; // v1.0.1: Role → BlockRole
  prominence?: Prominence;
  density?: Density;
  intent?: Intent;
  children?: ReactNode;
  /**
   * EXCEPTION: className은 데이터 시각화를 위한 동적 스타일링에만 허용
   * 예: 색상 인디케이터, 차트 색상, 데이터 기반 배경색
   * 정적 스타일은 반드시 role을 통해 정의해야 함
   */
  className?: string;
  /**
   * EXCEPTION: style은 동적 레이아웃(grid-area 등)을 위한 인라인 스타일에만 허용
   * 예: CSS Grid 배치, 동적 너비/높이
   * 정적 스타일은 반드시 role을 통해 정의해야 함
   */
  style?: React.CSSProperties;
  /**
   * Layout - 자식 요소 배치 방식
   * Role이 layout을 자동으로 결정하지만, 필요시 override 가능
   */
  layout?: Layout; // v1.0.1
  /**
   * Role-specific parameters (v1.0 Core)
   * e.g. Grid: { columns: 3 }, Stack: { align: 'center' }
   */
  spec?: Record<string, unknown>;
  state?: LoadState; // v1.0.1
  emptyContent?: ReactNode; // v1.0.1
  errorContent?: ReactNode; // v1.0.1
  onClick?: (e: React.MouseEvent) => void;
  selected?: boolean; // v3.1: 선택 상태 (리스트 아이템 등)
  clickable?: boolean; // v3.1: 클릭 가능 여부 (Interactive State Token System)
  condition?: string; // v1.0.1: 조건부 렌더링
  gap?: number | 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'; // v3.1: gap 오버라이드

  /**
   * v1.0.2: 선택 가능한 아이템의 고유 식별자
   * value가 있으면 Block은 Selectable Item이 됩니다.
   * 멘탈 모델: HTML의 <option value="1">과 동일
   */
  value?: string | number;

  /**
   * v1.0.2: Selection 관리 모델
   * value를 가진 자식 Block들의 선택 상태를 관리합니다.
   */
  selectionModel?: SelectionModel;

  // Toolbar-specific props (v4.1)
  sticky?: boolean; // Toolbar: Sticky positioning
  border?: 'top' | 'bottom' | 'both' | 'none'; // Toolbar: Border options

  // Accordion-specific props (v4.0)
  mode?: 'single' | 'multiple'; // Accordion: 단일/다중 선택
  defaultValue?: string | string[]; // Accordion: 초기 열린 아이템
  /** Accordion controlled value (NOT for selection) */
  accordionValue?: string | string[]; // Accordion: Controlled value
  onValueChange?: (value: string | string[]) => void; // Accordion: Controlled callback

  // SortableList-specific props (v4.0)
  items?: any[]; // SortableList: 정렬 가능한 아이템 배열
  onReorder?: (items: any[]) => void; // SortableList: 재정렬 콜백
  renderItem?: (item: any, index: number) => ReactNode; // SortableList: 아이템 렌더 함수

  // Layout Helpers (Practical)
  padding?: string; // e.g. "md", "4"
  justify?: string; // e.g. "between", "center"
  align?: string; // e.g. "center"
  flex?: string | number; // e.g. "1"
  divider?: string; // e.g. "y"
  width?: string | number;
  height?: string | number;
  orientation?: 'horizontal' | 'vertical'; // for Divider/Spacer

  // Tree-specific props (v4.1)
  data?: any[]; // Tree nodes
  icons?: Record<string, string>; // Tree icon mapping
  onNodeClick?: (node: any) => void;
  expandable?: boolean;
  selectable?: boolean;
  defaultExpandedIds?: string[];
}

export * from '../Element/Action/Action.types'; // For ActionBehavior etc if needed
export * from '../Element/Field/Field.types'; // For Field types if needed
export * from '../Element/Text/Text.types'; // For TextRole if needed
export * from '../Section/Section.types'; // For SectionRole if needed
export * from '../Shared.types';

/**
 * Block Renderer Props
 * 모든 Block renderer가 공통으로 받는 props
 */
export interface BlockRendererProps extends Omit<BlockProps, 'role'> {
  role: BlockRole;
  computedDensity: 'Compact' | 'Standard' | 'Comfortable';
  computedProminence: BlockProps['prominence'];
  computedIntent: BlockProps['intent'];
  Element: any; // HTML 태그 또는 커스텀 컴포넌트
}
