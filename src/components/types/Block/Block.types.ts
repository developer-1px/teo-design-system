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
  // 레이아웃 컨테이너 (Layout Containers)
  | 'Container' // 일반 컨테이너 (기본값)
  | 'Stack' // 수직 쌓기 (Flex Column)
  | 'Row' // 수평 배치 (Flex Row)
  | 'Group' // 그룹 (Alias for Stack)
  | 'Split' // 분할 레이아웃 (Resizable)
  | 'Inline' // 인라인 그룹 (가로 정렬)
  // 데이터 표시 (Data Display)
  | 'List' // 항목 리스트 (<ul>, <ol>)
  | 'ListItem' // 리스트 아이템 (<li>)
  | 'SortableList' // 정렬 가능한 리스트 (Drag & Drop)
  | 'Grid' // 그리드 레이아웃 (CSS Grid)
  | 'Table' // 테이블 (<table>)
  | 'Card' // 카드 UI (시각적 요소 있음)
  | 'Divider' // 구분선 (수직/수평)
  | 'ColorIndicator' // 색상 표시 박스 (작은 사각형)
  | 'PreviewContainer' // 미리보기 컨테이너 (sunken 배경)
  | 'PreviewCard' // 미리보기 카드 (Section 시각화용)
  // 입력 폼 (Forms)
  | 'Form' // 폼 컨테이너 (<form>)
  | 'Fieldset' // 필드 그룹 (<fieldset>)
  // 액션 그룹 (Action Blocks)
  | 'Toolbar' // 툴바/액션 모음 (가로 정렬)
  | 'FloatingToolbar' // 플로팅 툴바 (화면 위에 떠있는 액션 모음, 강조된 스타일)
  | 'ToolbarDivider' // 툴바 구분선
  // 네비게이션 (Navigation)
  | 'Tabs' // 탭 컨테이너
  | 'Steps' // 단계별 진행
  | 'Accordion' // 아코디언 (펼침/접힘)
  | 'Breadcrumbs' // 경로 탐색 (v2.1)
  | 'ScrollMenu' // 스크롤 메뉴 (ScrollSpy)
  | 'Navigator' // 네비게이션바 (v2.1)
  | 'Spacer' // 여백 (flex-1)
  | 'Dropdown' // 드롭다운 메뉴
  | 'Menu' // 메뉴
  | 'MenuItem' // 메뉴 아이템
  | 'MenuSection' // 메뉴 섹션
  | 'MenuTrigger' // 메뉴 트리거
  | 'Mock' // 테스트/Showcase용
  | 'DeviceFrame' // 기기/프레임 시각화
  | 'SectionHighlight'; // 영역 하이라이트

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
   * @deprecated direction은 deprecated되었습니다. layout을 사용하세요.
   */
  direction?: 'horizontal' | 'vertical';
  /**
   * @deprecated layout은 deprecated되었습니다. Role과 spec을 사용하세요.
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
  gap?: number; // v3.1: gap 오버라이드 (spacing token override)

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
}

export * from '../Element/Action/Action.types'; // For ActionBehavior etc if needed
export * from '../Element/Field/Field.types'; // For Field types if needed
export * from '../Element/Text/Text.types'; // For TextRole if needed
export * from '../Section/Section.types'; // For SectionRole if needed
export * from '../Shared.types';
