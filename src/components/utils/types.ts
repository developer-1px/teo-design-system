/**
 * DSL Type Definitions
 *
 * TSX 기반 DSL의 모든 타입 정의
 * IDDL (Intent-Driven UI DSL) 스펙 기반
 *
 * @see apps/docs/IDDL.spec.md
 */

import { ReactNode, ComponentPropsWithoutRef } from 'react';

/**
 * Prominence - 주목도 레벨 (Visual Hierarchy)
 */
export type Prominence =
  | 'Hero'      // 최상위 강조 (거대함)
  | 'Primary'   // 주요 (표준)
  | 'Secondary' // 보조 (흐림)
  | 'Tertiary'; // 미약 (숨김/최소화)

/**
 * Role - UI 요소의 정체성 (What is it?)
 */
export type Role =
  // For Structure (Section/Group)
  | 'Container'  // 일반 컨테이너
  | 'Navigator'  // 네비게이션
  | 'Collection' // 리스트/그리드
  | 'Form'       // 폼
  | 'Toolbar'    // 툴바/액션 그룹
  // For Atom (Item)
  | 'Identity'   // 제목/이름
  | 'Content'    // 본문/설명
  | 'Control'    // 버튼/입력
  | 'Status'     // 상태 표시
  | 'Facet'      // 메타정보/라벨
  | 'Separator'  // 구분선
  // For Overlay
  | 'Dialog'     // 모달
  | 'Drawer'     // 사이드 패널
  | 'Toast'      // 토스트 알림
  | 'Tooltip';   // 툴팁

/**
 * Density - 정보 밀도 (Spatial Hierarchy)
 */
export type Density =
  | 'Comfortable' // 넓은 여백 (마케팅, 대시보드)
  | 'Standard'    // 표준 여백 (문서, 일반 뷰)
  | 'Compact';    // 좁은 여백 (데이터 그리드, 전문가용)

/**
 * Intent - 의도/맥락 (Semantic Color)
 * v1.0.1: Success→Positive, Warning→Caution, Danger→Critical, Info 추가
 */
export type Intent =
  | 'Neutral'   // 기본 (Gray/Black)
  | 'Brand'     // 브랜드 강조 (Primary Color)
  | 'Positive'  // 긍정/성공 (Green) - v1.0.0의 Success
  | 'Caution'   // 주의/경고 (Yellow/Orange) - v1.0.0의 Warning
  | 'Critical'  // 위험/파괴 (Red) - v1.0.0의 Danger
  | 'Info';     // 참고 정보 (Blue)


/**
 * Page Props
 * v1.0.1: title, description, layout, breadcrumbs, condition 추가
 * v2.0: role, prominence, density, intent, maxWidth, centered, navigation, scrollable, loading, error 추가
 */
export interface PageProps {
  // Identity & Structure (v2.0)
  role?: PageRole;            // v2.0: 페이지 정체성 (기본값: role에 따라 layout 자동 결정)
  title?: string;             // v1.0.1
  description?: string;       // v1.0.1

  // Design Tokens (v2.0: IDDL 일관성)
  prominence?: Prominence;    // v2.0: Hero/Primary/Secondary/Tertiary
  density?: Density;          // v2.0: Comfortable/Standard/Compact (자식에게 전파)
  intent?: Intent;            // v2.0: Neutral/Brand/Positive/Caution/Critical/Info

  // Layout Control
  layout?: PageLayout;        // v1.0.1 (role의 기본값 override 가능)
  maxWidth?: MaxWidth;        // v2.0: 컨텐츠 최대 너비
  centered?: boolean;         // v2.0: 컨텐츠 중앙 정렬 여부

  // Navigation (v2.0)
  breadcrumbs?: Breadcrumb[]; // v1.0.1
  navigation?: NavigationConfig; // v2.0: 네비게이션 구성

  // State & Behavior (v2.0)
  scrollable?: boolean;       // v2.0: 스크롤 가능 여부 (기본값: role에 따라 결정)
  loading?: boolean;          // v2.0: 로딩 상태
  error?: string;             // v2.0: 에러 메시지

  // React Integration
  children: ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  condition?: string;         // v1.0.1: 조건부 렌더링
}

/**
 * Section Props
 * v1.0.1: role 타입 변경, condition 추가
 */
export interface SectionProps {
  role?: SectionRole;         // v1.0.1: Role → SectionRole
  prominence?: Prominence;
  density?: Density;          // v1.0.1: 명시적으로 추가됨 (자식에 전파)
  intent?: Intent;
  children: ReactNode;
  className?: string;
  id?: string;
  onClick?: (e: React.MouseEvent) => void;
  /**
   * Field 렌더링 모드 (IDDL v1.0)
   * - view: 데이터를 텍스트로 표시
   * - edit: 데이터를 입력 폼으로 표시
   */
  mode?: 'view' | 'edit';
  condition?: string;         // v1.0.1: 조건부 렌더링
}

/**
 * Overlay Props
 * v1.0.1: role 타입 변경, placement 확장, isOpen, dismissable, condition 추가
 */
export interface OverlayProps {
  id: string;                 // v1.0.1: 필수로 변경
  role: OverlayRole;          // v1.0.1: role 확장
  prominence?: Prominence;
  density?: Density;
  intent?: Intent;
  placement?: Placement;      // v1.0.1: Placement 타입으로 변경
  children: ReactNode;
  className?: string;
  isOpen?: boolean;           // v1.0.1: open → isOpen으로 rename
  dismissable?: boolean;      // v1.0.1: 외부 클릭으로 닫기 가능 여부
  onClose?: () => void;
  condition?: string;         // v1.0.1: 조건부 렌더링
}

/**
 * Group Props
 * v1.0.1: role 타입 변경, layout, state, emptyContent, errorContent 추가
 */
export interface GroupProps {
  role: GroupRole;            // v1.0.1: Role → GroupRole
  prominence?: Prominence;
  density?: Density;
  intent?: Intent;
  children: ReactNode;
  className?: string;
  /**
   * @deprecated direction은 deprecated되었습니다. layout을 사용하세요.
   */
  direction?: 'horizontal' | 'vertical';
  layout?: Layout;            // v1.0.1
  state?: LoadState;          // v1.0.1
  emptyContent?: ReactNode;   // v1.0.1
  errorContent?: ReactNode;   // v1.0.1
  onClick?: (e: React.MouseEvent) => void;
  condition?: string;         // v1.0.1: 조건부 렌더링
}

// ============================================
// IDDL v1.0.1 - New Node Types (Leaf Nodes)
// ============================================

/**
 * Text Role - 정적 텍스트의 역할
 * v1.0.1: Caption 추가
 */
export type TextRole = 'Title' | 'Body' | 'Label' | 'Caption' | 'Code';

/**
 * Field Data Type - 필드의 데이터 타입
 * v1.0.1: 14개 타입 추가
 */
export type FieldDataType =
  | 'text'
  | 'number'
  | 'currency'      // v1.0.1
  | 'date'
  | 'datetime'      // v1.0.1
  | 'boolean'
  | 'select'
  | 'multiselect'   // v1.0.1
  | 'radio'         // v1.0.1
  | 'checkbox'      // v1.0.1
  | 'textarea'      // v1.0.1
  | 'richtext'      // v1.0.1
  | 'image'
  | 'file'          // v1.0.1
  | 'password'
  | 'email'         // v1.0.1
  | 'url'           // v1.0.1
  | 'phone'         // v1.0.1
  | 'color'         // v1.0.1
  | 'rating'        // v1.0.1
  | 'range';        // v1.0.1

/**
 * Field Constraints - 유효성 검사 규칙
 * v1.0.1 추가
 */
export interface FieldConstraints {
  min?: number;           // number, date, range
  max?: number;           // number, date, range
  minLength?: number;     // text, textarea
  maxLength?: number;     // text, textarea
  pattern?: string;       // regex pattern
  patternMessage?: string; // pattern 실패 시 메시지
  custom?: string;        // 커스텀 validator 함수명
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
 */
export interface TextProps {
  role: TextRole;
  content: string;
  prominence?: Prominence;
  intent?: Intent;
  align?: 'left' | 'center' | 'right';
  className?: string;
  hidden?: boolean;
  condition?: string;         // v1.0.1: 조건부 렌더링
}

/**
 * Field Props - 데이터 바인딩 (View/Edit 모드)
 * v1.0.1: constraints, dependsOn, modeOverride 추가
 */
export interface FieldProps {
  // Data Definition
  label: string;
  model: string;
  dataType: FieldDataType;
  // Styling
  prominence?: Prominence;
  intent?: Intent;
  className?: string;
  // Constraints
  required?: boolean;
  options?: FieldOption[]; // For select/radio/checkbox type
  constraints?: FieldConstraints;  // v1.0.1
  // Dependencies
  dependsOn?: string;              // v1.0.1
  // View/Edit Config
  placeholder?: string;
  modeOverride?: 'view' | 'edit';  // v1.0.1
  clearable?: boolean;             // v1.0.2: 입력 내용 지우기 버튼 표시
  hidden?: boolean;
  condition?: string;              // v1.0.1: 조건부 렌더링
  // Controlled Component (React)
  value?: any;                     // v1.0.2: controlled value
  onChange?: (e: any) => void;     // v1.0.2: onChange handler
}

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
 */
export interface ActionProps {
  label?: string;
  icon?: string;
  // Styling
  prominence?: Prominence;
  intent?: Intent;
  className?: string;
  // Behavior (v1.0.1: discriminated union)
  behavior?: ActionBehavior;
  // State
  disabled?: boolean | string;  // v1.0.1: 표현식도 가능
  confirm?: string;
  loading?: boolean;            // v1.0.1
  hidden?: boolean;
  condition?: string;           // v1.0.1: 조건부 렌더링
  // Event handlers (practical addition for React usage)
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  // Children (practical addition for complex content)
  children?: ReactNode;         // v1.0.2: children이 있으면 label/icon 대신 렌더링
}

// ============================================
// IDDL v1.0.1 - Container Node Types
// ============================================

/**
 * Group Role - 그룹의 기능적 역할
 * v1.0.1: 많은 role 추가
 */
export type GroupRole =
  | 'Container'
  | 'Form'
  | 'Fieldset'    // v1.0.1
  | 'Toolbar'
  | 'List'        // v1.0.1
  | 'Grid'        // v1.0.1
  | 'Table'       // v1.0.1
  | 'Tabs'        // v1.0.1
  | 'Steps'       // v1.0.1
  | 'Split'       // v1.0.1
  | 'Card'        // v1.0.1
  | 'Inline';     // v1.0.1

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
 * Section Role - 섹션의 배치 역할
 * v1.0.1: Aside 추가
 * v1.1.0: IDE/Studio 레이아웃 전용 role 추가
 */
export type SectionRole =
  // General Layout
  | 'Container'
  | 'SplitContainer'
  | 'Main'             // Main content area (<main> tag)
  | 'Header'
  | 'Footer'
  | 'Navigator'       // @deprecated Use PrimarySidebar for modern layouts
  | 'Aside'
  // Dialog/Modal Specific (v1.1.1)
  | 'DialogHeader'     // Modal header (density-aware padding)
  | 'DialogFooter'     // Modal footer (density-aware padding)
  | 'DialogContent'    // Modal main content (density-aware padding)
  // IDE/Studio Specific (v1.1.0)
  | 'ActivityBar'      // Narrow icon bar (48-64px, vertical)
  | 'PrimarySidebar'   // Main sidebar (200-400px, file tree, etc)
  | 'SecondarySidebar' // Secondary sidebar (200-400px, outline, etc)
  | 'Editor'           // Main content/editor area (flex-grow)
  | 'Panel'            // Bottom panel (terminal, console, debug)
  | 'Auxiliary';       // Auxiliary panel (properties, AI, etc)

/**
 * Overlay Role - 오버레이 유형
 * v1.0.1: Popover, Sheet, Lightbox 추가
 * v1.0.2: Floating 추가 (persistent interactive overlays)
 */
export type OverlayRole = 'Dialog' | 'Drawer' | 'Popover' | 'Toast' | 'Tooltip' | 'Sheet' | 'Lightbox' | 'Floating';

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
 * Page Layout - 페이지 전체 레이아웃 템플릿
 * v1.0.1 추가
 * v2.0: studio, three-column, masonry, timeline 추가
 */
export type PageLayout =
  | 'single'
  | 'sidebar'
  | 'dashboard'
  | 'split'
  | 'wizard'
  | 'full'
  | 'studio'        // v2.0: IDE/Studio (multi-panel)
  | 'three-column'  // v2.0: 3컬럼 (nav-main-aside)
  | 'masonry'       // v2.0: Pinterest 스타일
  | 'timeline';     // v2.0: 타임라인 (세로 흐름)

/**
 * Page Role - 페이지의 의도적 정체성
 * v2.0 추가
 */
export type PageRole =
  | 'App'         // 애플리케이션 루트 (IDE, Studio, SaaS)
  | 'Document'    // 문서형 컨텐츠 (Article, Blog, Docs)
  | 'Dashboard'   // 데이터 대시보드 (Analytics, Admin)
  | 'Wizard'      // 단계별 프로세스 (Onboarding, Setup)
  | 'Settings'    // 설정/환경설정 (Preferences, Config)
  | 'Canvas'      // 작업 캔버스 (Design, Editor)
  | 'Gallery'     // 미디어 갤러리 (Photos, Portfolio)
  | 'Feed';       // 무한 스크롤 피드 (Social, News)

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
    sticky?: boolean;
    transparent?: boolean;
  };
  sidebar?: {
    show: boolean;
    position?: 'left' | 'right';
    collapsible?: boolean;
    width?: number;
  };
  footer?: {
    show: boolean;
    sticky?: boolean;
  };
}

/**
 * Breadcrumb - 경로 네비게이션
 * v1.0.1 추가
 */
export interface Breadcrumb {
  label: string;
  to?: string;
}

/**
 * Layout Context Value
 */
export interface LayoutContextValue {
  prominence: Prominence;
  role?: Role;
  density?: Density;
  intent?: Intent;
  depth: number;
  mode?: 'view' | 'edit'; // Field 렌더링 모드
}
