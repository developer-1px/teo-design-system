/**
 * DSL Components - IDDL v1.0.1 TSX 기반 디자인 시스템
 *
 * AI가 생성하기 좋은 명확한 구조
 *
 * IDDL v1.0.1 Container Nodes:
 * - Page: 최상위 페이지 컨테이너 (title, breadcrumbs, layout)
 * - Section: 콘텐츠 섹션 (role, prominence, density, mode)
 * - Group: 요소 그룹화 (role, layout, state)
 * - Overlay: 모달, 드로어, 팝오버, 토스트, 툴팁, 시트, 라이트박스
 *
 * IDDL v1.0.1 Leaf Nodes:
 * - Text: 정적 콘텐츠 (Title, Body, Label, Caption, Code)
 * - Field: 데이터 바인딩 (view/edit 모드, 21개 dataType)
 * - Action: 상호작용 트리거 (behavior discriminated union)
 */

export { Page } from './Page';
export { Section } from './Section';
export { Group } from './Group';

// IDDL v1.0.1 - Leaf Nodes
export { Text } from './Text';
export { Field } from './Field';
export { Action } from './Action';

// IDDL v1.0.1 - Container Nodes
export { Overlay } from './Overlay';

export { useLayoutContext, LayoutProvider, LayoutContext } from './IDDLContext';

export type {
  // Base Types
  Prominence,
  Role,
  Density,
  Intent,
  // Component Props
  PageProps,
  SectionProps,
  OverlayProps,
  GroupProps,
  // IDDL v1.0.1 Leaf Node Types
  TextRole,
  FieldDataType,
  FieldConstraints,
  FieldOption,
  TextProps,
  FieldProps,
  ActionProps,
  ActionBehavior,
  // IDDL v1.0.1 Container Types
  GroupRole,
  Layout,
  LoadState,
  SectionRole,
  OverlayRole,
  Placement,
  PageLayout,
  Breadcrumb,
  // Context
  LayoutContextValue,
} from './types';
