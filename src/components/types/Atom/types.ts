/**
 * DSL Type Definitions
 *
 * TSX 기반 DSL의 모든 타입 정의
 * IDDL (Intent-Driven UI DSL) 스펙 기반
 *
 * @see apps/docs/IDDL.spec.md
 */

import {
  ComponentPropsWithoutRef,
  type ComponentType,
  type ElementType,
  type ReactNode,
} from 'react';

/**
 * As Prop - 커스텀 컴포넌트 주입
 * 모든 IDDL 컴포넌트에서 사용 가능
 */
export type AsProp<T = any> = {
  as?: ElementType<T> | ComponentType<T>;
};

/**
 * Prominence - 주목도 레벨 (Visual Hierarchy)
 */
export type Prominence =
  | 'Hero' // (L1) 최상위: 화면 전체를 압도 (Full-width, Huge typography)
  | 'Strong' // (L2) 강조: 시선을 끄는 솔리드 컬러 (Filled Button, Primary CTA)
  | 'Standard' // (L3) 표준: 일반적인 UI 요소 (대부분의 버튼, 텍스트, 카드)
  | 'Subtle'; // (L4) 미세: 배경에 녹아드는 요소 (Caption, Placeholder, Disabled) // 미약 (숨김/최소화)

/**
 * Role - UI 요소의 정체성 (What is it?)
 */
export type Role =
  // For Structure (Section/Group)
  | 'Container' // 일반 컨테이너
  | 'Navigator' // 네비게이션
  | 'Collection' // 리스트/그리드
  | 'Form' // 폼
  | 'Toolbar' // 툴바/액션 그룹
  // For Atom (Item)
  | 'Identity' // 제목/이름
  | 'Content' // 본문/설명
  | 'Control' // 버튼/입력
  | 'Status' // 상태 표시
  | 'Facet' // 메타정보/라벨
  | 'Separator' // 구분선
  // For Overlay
  | 'Dialog' // 모달
  | 'Drawer' // 사이드 패널
  | 'Toast' // 토스트 알림
  | 'Tooltip'; // 툴팁

/**
 * Density - 정보 밀도 (Spatial Hierarchy)
 */
export type Density =
  | 'Comfortable' // 넓은 여백 (마케팅, 대시보드)
  | 'Standard' // 표준 여백 (문서, 일반 뷰)
  | 'Compact'; // 좁은 여백 (데이터 그리드, 전문가용)

/**
 * Intent - 의도/맥락 (Semantic Color)
 * v1.0.1: Success→Positive, Warning→Caution, Danger→Critical, Info 추가
 */
export type Intent =
  | 'Neutral' // 기본 (Gray/Black)
  | 'Brand' // 브랜드 강조 (Primary Color)
  | 'Positive' // 긍정/성공 (Green) - v1.0.0의 Success
  | 'Caution' // 주의/경고 (Yellow/Orange) - v1.0.0의 Warning
  | 'Critical' // 위험/파괴 (Red) - v1.0.0의 Danger
  | 'Info'; // 참고 정보 (Blue)

/**
 * Page Role - 페이지 물리법칙 (스크롤과 뷰포트의 행동 법칙)
 * v5.0: "이 페이지는 어떻게 움직이는가?"
 * - 'Application': 전체 화면, 스크롤 없음 (w-screen h-screen overflow-hidden)
 * - 'Document': 스크롤 가능한 문서 페이지 (min-height: 100vh, 브라우저 스크롤)
 * - 'Focus': 중앙 집중형 (로그인, 결제 등, 화면 정중앙에 배치)
 * - 'Fullscreen': 전체화면 고정 (프레젠테이션, 키오스크, 스크롤 불가)
 */
export type PageRole = 'Application' | 'Document' | 'Focus' | 'Fullscreen';

/**
 * Page Layout - 공간 분할 패턴 (Section들의 지정석)
 * v5.0: GridTemplate을 대체, "공간을 어떻게 나누었는가?"
 * - 'Single': Header + Container + Footer (1단 기본형)
 * - 'Sidebar': Navigator(좌) + Container(우) (2단 좌측 메뉴형)
 * - 'Aside': Container(좌) + Aside(우) (2단 우측 정보형)
 * - 'HolyGrail': Header + Navigator + Container + Aside + Footer (3단 완전체)
 * - 'Split': PanelLeft + PanelRight (5:5 분할형, master-detail)
 * - 'Studio': ActivityBar + PrimarySidebar + Editor + Panel + SecondarySidebar (IDE 전용)
 * - 'Blank': 빈 캔버스 (dialog, custom)
 */
export type PageLayout = 'Single' | 'Sidebar' | 'Aside' | 'HolyGrail' | 'Split' | 'Studio' | 'Blank';

/**
 * Page Props (v5.0) - Application Root Container
 * v1.0.1: title, description, layout, breadcrumbs, condition 추가
 * v2.0: role, prominence, density, intent, maxWidth, centered, navigation, scrollable, loading, error 추가
 * v3.0: main 태그 제거, layout 단순화 (flex/grid만 지원)
 * v3.1: as prop 추가 (커스텀 컴포넌트 주입)
 * v4.0: role 추가 (Content vs App)
 * v5.0: role 값 확장 (Application/Document/Focus/Fullscreen), template→layout 통합, direction 제거
 */
export interface PageProps extends AsProp {
  // Role (v5.0) - "이 페이지는 어떻게 움직이는가?" (스크롤 물리법칙)
  role?: PageRole; // 'Application' | 'Document' (default) | 'Focus' | 'Fullscreen'

  // Layout (v5.0) - "공간을 어떻게 나누었는가?" (Section 배치)
  layout?: PageLayout; // 'Single' | 'Sidebar' | 'Aside' | 'HolyGrail' | 'Split' | 'Studio' | 'Blank'
  gap?: number; // v3.0: spacing between sections

  // Constraints (v3.0)
  maxWidth?: MaxWidth; // v2.0: 컨텐츠 최대 너비 (Document role만 적용)
  centered?: boolean; // v2.0: 컨텐츠 중앙 정렬 여부 (Document/Focus role만 적용)

  // Meta (optional)
  title?: string; // v1.0.1
  description?: string; // v1.0.1
  breadcrumbs?: Breadcrumb[]; // v1.0.1

  // Design Tokens (v2.0: IDDL 일관성)
  prominence?: Prominence; // v2.0: Hero/Standard/Strong/Subtle
  density?: Density; // v2.0: Comfortable/Standard/Compact (자식에게 전파)
  intent?: Intent; // v2.0: Neutral/Brand/Positive/Caution/Critical/Info

  // State & Behavior (v2.0)
  loading?: boolean; // v2.0: 로딩 상태
  error?: string; // v2.0: 에러 메시지

  // React Integration
  children: ReactNode;
  /**
   * EXCEPTION: className은 데이터 시각화를 위한 동적 스타일링에만 허용
   * 예: 색상 인디케이터, 차트 색상, 데이터 기반 배경색
   * 정적 스타일은 반드시 role을 통해 정의해야 함
   */
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  condition?: string; // v1.0.1: 조건부 렌더링

  // Deprecated props (v5.0) - 하위 호환성을 위해 유지
  /** @deprecated Use `layout` instead of `template` */
  // Deprecated props (v5.0) - 하위 호환성을 위해 유지
  /** @deprecated direction is now determined by `role` and `layout` props */
  direction?: 'row' | 'column';
}

/**
 * Section Props
 * v1.0.1: role 타입 변경, condition 추가
 * v3.0: gridArea 추가 (App/Page의 layout="grid"일 때 사용)
 */
export interface SectionProps extends AsProp {
  role?: SectionRole; // v1.0.1: Role → SectionRole
  prominence?: Prominence;
  density?: Density; // v1.0.1: 명시적으로 추가됨 (자식에 전파)
  intent?: Intent;
  children: ReactNode;
  /**
   * EXCEPTION: className은 데이터 시각화를 위한 동적 스타일링에만 허용
   * 예: 색상 인디케이터, 차트 색상, 데이터 기반 배경색
   * 정적 스타일은 반드시 role을 통해 정의해야 함
   */
  className?: string;
  id?: string;
  onClick?: (e: React.MouseEvent) => void;
  /**
   * Field 렌더링 모드 (IDDL v1.0)
   * - view: 데이터를 텍스트로 표시
   * - edit: 데이터를 입력 폼으로 표시
   */
  mode?: 'view' | 'edit';
  condition?: string; // v1.0.1: 조건부 렌더링
  gridArea?: string; // v3.0: CSS grid-area 이름 (grid layout일 때)
  /**
   * Resize 가능 여부 (v4.0)
   * - true: 기본 방향으로 resize 가능
   * - { direction, minSize, maxSize }: 상세 설정
   */
  resizable?:
  | boolean
  | {
    direction?: 'horizontal' | 'vertical' | 'both';
    minSize?: number;
    maxSize?: number;
  };
  /**
   * Collapse 가능 여부 (v4.0)
   */
  collapsible?: boolean;
}

/**
 * Overlay Props
 * v1.0.1: role 타입 변경, placement 확장, isOpen, dismissable, condition 추가
 */
export interface OverlayProps extends AsProp {
  id: string; // v1.0.1: 필수로 변경
  role: OverlayRole; // v1.0.1: role 확장
  prominence?: Prominence;
  density?: Density;
  intent?: Intent;
  placement?: Placement; // v1.0.1: Placement 타입으로 변경
  children: ReactNode;
  /**
   * EXCEPTION: className은 데이터 시각화를 위한 동적 스타일링에만 허용
   * 예: 색상 인디케이터, 차트 색상, 데이터 기반 배경색
   * 정적 스타일은 반드시 role을 통해 정의해야 함
   */
  className?: string;
  isOpen?: boolean; // v1.0.1: open → isOpen으로 rename
  dismissable?: boolean; // v1.0.1: 외부 클릭으로 닫기 가능 여부
  onClose?: () => void;
  condition?: string; // v1.0.1: 조건부 렌더링
}

/**
 * Selection Model Interface (v1.0.2)
 * Group이 선택 가능한 항목들을 관리할 때 사용하는 모델
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
 * Group Props
 * v1.0.1: role 타입 변경, layout, state, emptyContent, errorContent 추가
 * v4.0: Accordion props 추가 (mode, defaultValue, value, onValueChange)
 * v1.0.2: value, selectionModel 추가 (Selection 통합)
 */
export interface GroupProps extends AsProp {
  role: GroupRole; // v1.0.1: Role → GroupRole
  prominence?: Prominence;
  density?: Density;
  intent?: Intent;
  children: ReactNode;
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
  layout?: Layout; // v1.0.1
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
   * value가 있으면 Group은 Selectable Item이 됩니다.
   * 멘탈 모델: HTML의 <option value="1">과 동일
   */
  value?: string | number;

  /**
   * v1.0.2: Selection 관리 모델
   * value를 가진 자식 Group들의 선택 상태를 관리합니다.
   */
  selectionModel?: SelectionModel;

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
}

// ============================================
// IDDL v1.0.1 - New Node Types (Leaf Nodes)
// ============================================

/**
 * Text Role - 정적 텍스트의 역할
 * v1.0.1: Caption 추가
 * v1.1: highlight prop으로 텍스트 매칭 강조 지원
 */
export type TextRole = 'Title' | 'Body' | 'Label' | 'Caption' | 'Code';

/**
 * Field Role - 필드의 UI 렌더링 방식
 * v2.0: role + type + value 일관성 체계 도입
 */
export type FieldRole =
  | 'Input' // 텍스트 입력 (text, email, password, url, tel)
  | 'Textarea' // 여러 줄 텍스트
  | 'Select' // 드롭다운 선택
  | 'Radio' // 라디오 버튼 그룹
  | 'Checkbox' // 체크박스 그룹
  | 'Switch' // 토글 스위치
  | 'Slider' // 슬라이더 (range)
  | 'ColorPicker' // 색상 선택기
  | 'DatePicker' // 날짜 선택기
  | 'Rating' // 별점
  | 'FilePicker'; // 파일 업로드

/**
 * Field Type - 필드의 데이터 타입/검증 규칙
 * v1.0.1: 14개 타입 추가
 * v2.0: FieldDataType → FieldType으로 rename (role + type + value 일관성)
 */
export type FieldType =
  | 'text'
  | 'number'
  | 'currency' // v1.0.1
  | 'date'
  | 'datetime' // v1.0.1
  | 'boolean'
  | 'select'
  | 'multiselect' // v1.0.1
  | 'radio' // v1.0.1
  | 'checkbox' // v1.0.1
  | 'textarea' // v1.0.1
  | 'richtext' // v1.0.1
  | 'image'
  | 'file' // v1.0.1
  | 'password'
  | 'email' // v1.0.1
  | 'url' // v1.0.1
  | 'phone' // v1.0.1
  | 'color' // v1.0.1
  | 'rating' // v1.0.1
  | 'range'; // v1.0.1

/**
 * Field Constraints - 유효성 검사 규칙
 * v1.0.1 추가
 */
export interface FieldConstraints {
  min?: number; // number, date, range
  max?: number; // number, date, range
  minLength?: number; // text, textarea
  maxLength?: number; // text, textarea
  pattern?: string; // regex pattern
  patternMessage?: string; // pattern 실패 시 메시지
  custom?: string; // 커스텀 validator 함수명
}

/**
 * Field Option - select/radio/checkbox용 선택지
 * v1.0.1: disabled, icon 추가
 */
export interface FieldOption {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
  icon?: string;
}

/**
 * Text Props - 정적 콘텐츠 (Data Binding 없음)
 * v1.0.1: condition 추가
 * v1.1: highlight 추가
 */
export interface TextProps extends AsProp {
  role: TextRole;
  content: string;
  prominence?: Prominence;
  intent?: Intent;
  align?: 'left' | 'center' | 'right';
  /**
   * EXCEPTION: className은 데이터 시각화를 위한 동적 스타일링에만 허용
   * 예: 색상 인디케이터, 차트 색상, 데이터 기반 배경색
   * 정적 스타일은 반드시 role을 통해 정의해야 함
   */
  className?: string;
  hidden?: boolean;
  condition?: string; // v1.0.1: 조건부 렌더링
  highlight?: string; // v1.1: 매칭할 텍스트 (대소문자 구분 안 함)
}

/**
 * Field Props - 데이터 바인딩 (View/Edit 모드)
 * v1.0.1: constraints, dependsOn, modeOverride 추가
 * v2.0: role + type + value 일관성 체계 (dataType → type, role 추가)
 */
export interface FieldProps extends AsProp {
  // IDDL Core (v2.0)
  role?: FieldRole; // UI 렌더링 방식 (optional, type에서 추론 가능)
  type: FieldType; // 데이터 타입/검증 규칙 (v2.0: dataType → type)

  // Data Definition
  label: string;
  model: string;

  // Styling
  prominence?: Prominence;
  intent?: Intent;
  density?: Density; // v2.0: 추가 (일관성)
  /**
   * EXCEPTION: className은 데이터 시각화를 위한 동적 스타일링에만 허용
   * 예: 색상 인디케이터, 차트 색상, 데이터 기반 배경색
   * 정적 스타일은 반드시 role을 통해 정의해야 함
   */
  className?: string;

  // Constraints
  required?: boolean;
  options?: FieldOption[]; // For select/radio/checkbox type
  constraints?: FieldConstraints; // v1.0.1

  // Dependencies
  dependsOn?: string; // v1.0.1

  // View/Edit Config
  placeholder?: string;
  modeOverride?: 'view' | 'edit'; // v1.0.1
  clearable?: boolean; // v1.0.2: 입력 내용 지우기 버튼 표시
  hidden?: boolean;
  condition?: string; // v1.0.1: 조건부 렌더링
  disabled?: boolean; // v1.0.2: 비활성화 상태

  // Controlled Component (React)
  value?: any; // v1.0.2: controlled value
  onChange?: (e: any) => void; // v1.0.2: onChange handler
}

/**
 * Action Role - 액션의 렌더링 유형 (v4.0)
 */
export type ActionRole =
  | 'Button' // 기본 버튼
  | 'IconButton' // 아이콘 전용 버튼
  | 'Link' // 링크 스타일
  | 'MenuItem' // 메뉴 아이템
  | 'ListItem' // 리스트 아이템 (선택 가능)
  | 'Tab' // 탭 버튼
  | 'Chip'; // 칩/태그 (토글 가능)

/**
 * Action Behavior - discriminated union
 * v1.0.1: command/to/args → behavior로 통합
 */
export type ActionBehavior =
  | { action: 'command'; command: string; args?: Record<string, unknown> }
  | { action: 'navigate'; to: string; target?: '_blank' | '_self' }
  | { action: 'submit'; form?: string }
  | { action: 'reset'; form?: string }
  | { action: 'open'; overlay: string }
  | { action: 'close'; overlay?: string }
  | { action: 'toggle'; target: string };

/**
 * Action Props - 상호작용 트리거
 * v1.0.1: behavior, loading 추가
 * v3.1: selected, interactive config 추가 (Interactive State Token System)
 * v4.0: role 추가 (renderer 패턴)
 */
export interface ActionProps extends AsProp {
  // Renderer (v4.0)
  role?: ActionRole; // Button (default) | IconButton | Link | MenuItem | ListItem | Tab | Chip
  label?: string;
  icon?: string;
  // Styling
  prominence?: Prominence;
  intent?: Intent;
  /**
   * EXCEPTION: className은 데이터 시각화를 위한 동적 스타일링에만 허용
   * 예: 색상 인디케이터, 차트 색상, 데이터 기반 배경색
   * 정적 스타일은 반드시 role을 통해 정의해야 함
   */
  className?: string;
  // Behavior (v1.0.1: discriminated union)
  behavior?: ActionBehavior;
  // State
  disabled?: boolean | string; // v1.0.1: 표현식도 가능
  confirm?: string;
  loading?: boolean; // v1.0.1
  selected?: boolean; // v3.1: 선택 상태 (리스트 아이템, 탭 등)
  hidden?: boolean;
  condition?: string; // v1.0.1: 조건부 렌더링
  // Event handlers (practical addition for React usage)
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  // Children (practical addition for complex content)
  children?: ReactNode; // v1.0.2: children이 있으면 label/icon 대신 렌더링
}

// ============================================
// IDDL v1.0.1 - Container Node Types
// ============================================

/**
 * Group Role - 그룹의 기능적 역할 (v4.0: 기능 중심 분류)
 * v1.0.1: 많은 role 추가
 * v4.0: 기능적 목적에 따른 분류, 시각적 요소 허용
 *
 * Group = 기능적 컴포넌트 (Functional Component)
 * - 시각적 요소를 가질 수 있음 (배경, 보더, 패딩, 그림자)
 * - Template 무관하게 독립적으로 동작
 * - 재사용 가능한 UI 조합
 */
export type GroupRole =
  // 레이아웃 컨테이너 (Layout Containers)
  | 'Container' // 일반 컨테이너 (기본값)
  | 'Split' // 분할 레이아웃 (Resizable)
  | 'Inline' // 인라인 그룹 (가로 정렬)
  // 데이터 표시 (Data Display)
  | 'List' // 항목 리스트 (<ul>, <ol>)
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
  // 액션 그룹 (Action Groups)
  | 'Toolbar' // 툴바/액션 모음 (가로 정렬)
  | 'FloatingToolbar' // 플로팅 툴바 (화면 위에 떠있는 액션 모음, 강조된 스타일)
  // 네비게이션 (Navigation)
  | 'Tabs' // 탭 컨테이너
  | 'Steps' // 단계별 진행
  | 'Accordion' // 아코디언 (펼침/접힘)
  | 'Breadcrumbs' // 경로 탐색 (v2.1)
  | 'ScrollMenu' // 스크롤 메뉴 (ScrollSpy)
  | 'Navigator'; // 네비게이션바 (v2.1)

/**
 * Layout - 레이아웃 방향
 * v1.0.1 추가
 */
export type Layout = 'stack' | 'inline' | 'grid' | 'table' | 'split' | 'tabs' | 'steps';

/**
 * Load State - 데이터 로딩 상태
 * v1.0.1 추가
 */
export type LoadState = 'idle' | 'loading' | 'error' | 'empty';

/**
 * Section Role - 섹션의 배치 역할 (Template-aware v4.0)
 * v1.0.1: Aside 추가
 * v1.1.0: IDE/Studio 레이아웃 전용 role 추가
 * v4.0: Template별로 그룹화, Page template의 named slot 역할
 *
 * **Section vs Group**:
 * - Section: 시각적 영역 (배경, 보더, 패딩 있음) - Figma Section과 동일
 * - Group: 투명 레이아웃 컨테이너 (시각적 요소 없음) - Figma Group과 동일
 *
 * **Template-aware**:
 * - Section role은 Page template에 종속됨
 * - 각 template은 특정 Section role 세트를 정의
 * - 잘못된 조합 시 경고 (예: template="studio"인데 role="Master" 사용)
 */
export type SectionRole =
  // Universal (모든 template에서 사용 가능)
  | 'Header' // 페이지 상단 (<header>)
  | 'Footer' // 페이지 하단 (<footer>)
  | 'Main' // 메인 콘텐츠 영역 (<main>)
  | 'Container' // 일반 컨테이너 (<section>)
  // Web Standard (Content Page - template="sidebar-content")
  | 'Navigator' // 네비게이션 (<nav>)
  | 'Aside' // 보조 사이드바 (<aside>)
  | 'Search' // 검색 영역
  | 'Region' // 명명된 영역
  // IDE/Studio (template="studio")
  | 'Toolbar' // 툴바 (<div>)
  | 'ActivityBar' // 액티비티 바 (아이콘 세로 바)
  | 'PrimarySidebar' // 주 사이드바 (파일 트리 등)
  | 'SecondarySidebar' // 보조 사이드바 (아웃라인 등)
  | 'Editor' // 에디터 영역
  | 'Panel' // 하단 패널 (터미널, 콘솔 등)
  | 'UtilityBar' // 보조 패널 (속성, AI 등)
  // Master-Detail (template="master-detail")
  | 'Master' // 마스터 리스트
  | 'Detail' // 디테일 뷰
  // Dialog (template="dialog")
  | 'DialogHeader' // 다이얼로그 헤더
  | 'DialogContent' // 다이얼로그 콘텐츠
  | 'DialogFooter' // 다이얼로그 푸터
  // Deprecated
  | 'SplitContainer'; // @deprecated Use Main with layout="flex"

/**
 * Layout별 유효한 Section Role 매핑 (v5.0)
 * Page layout에 따라 사용 가능한 Section role이 결정됨
 */
export const LAYOUT_SECTION_ROLES: Record<PageLayout, SectionRole[]> = {
  // Single: Header + Container + Footer (1단 기본형)
  Single: ['Header', 'Container', 'Footer', 'Main'],

  // Sidebar: Navigator(좌) + Container(우) (2단 좌측 메뉴형)
  Sidebar: ['Header', 'Footer', 'Navigator', 'Container', 'Main'],

  // Aside: Container(좌) + Aside(우) (2단 우측 정보형)
  Aside: ['Header', 'Footer', 'Container', 'Aside', 'Main'],

  // HolyGrail: Header + Navigator + Container + Aside + Footer (3단 완전체)
  HolyGrail: ['Header', 'Footer', 'Navigator', 'Container', 'Aside', 'Main', 'Region'],

  // Split: PanelLeft + PanelRight (5:5 분할형, master-detail)
  Split: ['Header', 'Footer', 'Master', 'Detail', 'Toolbar', 'Container', 'Main'],

  // Studio: ActivityBar + PrimarySidebar + Editor + Panel + SecondarySidebar (IDE 전용)
  Studio: [
    'Header',
    'Footer',
    'Toolbar',
    'ActivityBar',
    'PrimarySidebar',
    'SecondarySidebar',
    'Editor',
    'Panel',
    'UtilityBar',
    'Container',
    'Main',
  ],

  // Blank: 빈 캔버스 (dialog, custom)
  Blank: ['Container', 'Main', 'DialogHeader', 'DialogContent', 'DialogFooter'],
};

/**
 * Overlay Role - 오버레이 유형
 * v1.0.1: Popover, Sheet, Lightbox 추가
 * v1.0.2: Floating 추가 (persistent interactive overlays)
 */
export type OverlayRole =
  | 'Dialog'
  | 'Drawer'
  | 'Popover'
  | 'Toast'
  | 'Tooltip'
  | 'Sheet'
  | 'Lightbox'
  | 'Floating';

/**
 * Placement - 오버레이 위치
 * v1.0.1: 더 많은 위치 추가
 */
export type Placement =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';



/**
 * Max Width - 페이지 최대 너비
 * v2.0 추가
 */
export type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none' | number;

/**
 * Navigation Config - 네비게이션 구성
 * v2.0 추가
 */
export interface NavigationConfig {
  header?: {
    show: boolean;
  };
}

/**
 * Breadcrumb
 * v1.0.1 추가
 */
export interface Breadcrumb {
  label: string;
  to?: string;
  icon?: string;
}
