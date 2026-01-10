/**
 * DSL Builder Types
 *
 * 비주얼 DSL 빌더를 위한 타입 정의
 * v1.0.1: IDDL v1.0.1 스펙 반영
 */

import type {
  ActionBehavior,
  Breadcrumb,
  Density,
  FieldConstraints,
  FieldType,
  FieldOption,
  GroupRole,
  Intent,
  Layout,
  LoadState,
  OverlayRole,
  Placement,
  Prominence,
  SectionRole,
  TextRole,
} from '@/components/types/Atom/types';

// Region is deprecated but still used in builder for backward compatibility
type RegionRole = 'main' | 'aside' | 'header' | 'footer' | 'nav';

/**
 * DSL Node Type
 * v1.0.1: overlay 추가
 */
export type DSLNodeType =
  | 'page'
  | 'region'
  | 'section'
  | 'overlay' // v1.0.1
  | 'group'
  // IDDL v1.0 - New Leaf Nodes
  | 'text'
  | 'field'
  | 'action';

/**
 * Base DSL Node
 * v1.0.1: condition 추가
 */
export interface DSLNode {
  id: string;
  type: DSLNodeType;
  children?: AnyDSLNode[];
  condition?: string; // v1.0.1: 조건부 렌더링
}

/**
 * Page Node
 * v1.0.1: title, description, layout, breadcrumbs 추가
 * v5.0: layout type changed to PageLayout
 */
export interface PageNode extends DSLNode {
  type: 'page';
  title?: string;
  description?: string;
  layout?: import('@/components/types/Atom/types').PageLayout;
  breadcrumbs?: Breadcrumb[];
  className?: string;
}

/**
 * Region Node
 * @deprecated Region is deprecated. Use Section instead.
 */
export interface RegionNode extends DSLNode {
  type: 'region';
  role: RegionRole;
  className?: string;
}

/**
 * Section Node
 * v1.0.1: role, density, mode 추가
 */
export interface SectionNode extends DSLNode {
  type: 'section';
  role?: SectionRole; // v1.0.1
  prominence?: Prominence;
  density?: Density; // v1.0.1
  mode?: 'view' | 'edit'; // v1.0.1
  className?: string;
}

/**
 * Overlay Node
 * v1.0.1 신규 추가
 */
export interface OverlayNode extends DSLNode {
  type: 'overlay';
  role: OverlayRole;
  prominence?: Prominence;
  density?: Density;
  placement?: Placement;
  isOpen?: boolean;
  dismissable?: boolean;
  className?: string;
}

/**
 * Block Node
 * v1.0.1: role 타입 변경, layout, state, emptyContent, errorContent 추가
 */
export interface GroupNode extends DSLNode {
  type: 'group';
  role: GroupRole; // v1.0.1: Purpose → GroupRole
  prominence?: Prominence;
  direction?: 'horizontal' | 'vertical'; // @deprecated
  layout?: Layout; // v1.0.1
  state?: LoadState; // v1.0.1
  emptyContent?: string; // v1.0.1: Simple string content
  errorContent?: string; // v1.0.1: Simple string content
  className?: string;
}

/**
 * Text Node (IDDL v1.0.1)
 * Static content without data binding
 */
export interface TextNode extends Omit<DSLNode, 'children'> {
  type: 'text';
  role: TextRole;
  content: string;
  prominence?: Prominence;
  intent?: Intent;
  align?: 'left' | 'center' | 'right';
  className?: string;
  hidden?: boolean;
}

/**
 * Field Node (IDDL v1.0.1)
 * Data binding with view/edit modes
 */
export interface FieldNode extends Omit<DSLNode, 'children'> {
  type: 'field';
  label: string;
  model: string;
  fieldType: FieldType;
  prominence?: Prominence;
  intent?: Intent;
  required?: boolean;
  options?: FieldOption[]; // v1.0.1
  constraints?: FieldConstraints; // v1.0.1
  dependsOn?: string; // v1.0.1
  placeholder?: string;
  modeOverride?: 'view' | 'edit'; // v1.0.1
  className?: string;
  hidden?: boolean;
}

/**
 * Action Node (IDDL v1.0.1)
 * Interaction trigger (button/link)
 */
export interface ActionNode extends Omit<DSLNode, 'children'> {
  type: 'action';
  label?: string;
  icon?: string;
  prominence?: Prominence;
  intent?: Intent;
  behavior: ActionBehavior; // v1.0.1: command/to/args → behavior
  disabled?: boolean | string; // v1.0.1: 표현식 지원
  confirm?: string;
  loading?: boolean; // v1.0.1
  className?: string;
  hidden?: boolean;
}

// Forward declaration for circular reference
export type AnyDSLNode =
  | PageNode
  | RegionNode
  | SectionNode
  | OverlayNode // v1.0.1
  | GroupNode
  // IDDL v1.0 - New Leaf Nodes
  | TextNode
  | FieldNode
  | ActionNode;

// Container nodes that can have children
export type ContainerDSLNode = PageNode | RegionNode | SectionNode | OverlayNode | GroupNode;

// Leaf nodes that cannot have children
export type LeafDSLNode = TextNode | FieldNode | ActionNode;

// Type guard to check if a node is a container
export function isContainerNode(node: AnyDSLNode): node is ContainerDSLNode {
  return 'children' in node;
}

/**
 * Builder State
 */
export interface BuilderState {
  tree: AnyDSLNode;
  selectedNodeId: string | null;
  clipboard: AnyDSLNode | null;
  clipboardAction: 'copy' | 'cut' | null;
}
