/**
 * IDDL (Intent-Driven Design Language) 1.0 Part 1
 * Core Type Definitions
 *
 * Status: Core Freeze Candidate
 * Version: 1.0.2 (Aligned with Role Spec v0.1)
 * Date: 2026-01-10
 */

export namespace IDDL {
  // =========================================================================
  // 1. The 5 Axes of Definition
  // =========================================================================

  export type Role = string;

  export type Intent = 'Neutral' | 'Brand' | 'Positive' | 'Caution' | 'Critical' | 'Info';

  export type Prominence = 'Hero' | 'Standard' | 'Subtle' | 'Hidden';

  export type Density = 'Standard' | 'Comfortable' | 'Compact';

  /**
   * **Spec**: Role-dependent parameters.
   * MUST be serializable plain data (JSON safe).
   */
  export type Spec = Record<string, unknown>;

  // =========================================================================
  // 2. Base Properties
  // =========================================================================

  export interface BaseProps {
    /** Functional identity */
    role?: Role;
    /** Semantic context */
    intent?: Intent;
    /** Visual hierarchy */
    prominence?: Prominence;
    /** Layout density */
    density?: Density;
    /** Role-specific configuration parameters */
    spec?: Spec;

    /** Accessible Name */
    name?: string;
    /** Accessible Description (help/hint/tooltip/error text) */
    description?: string;
    /** Unique identifier */
    id?: string;
    /** Grid Column Span */
    colSpan?: number;
  }

  // =========================================================================
  // 3. Node Levels & Interfaces
  // =========================================================================

  // --- Level 0: Page ---

  export type PageRole =
    | 'Document'
    | 'Application'
    | 'Focus'
    | 'Immersive'
    | 'Overlay'
    | 'Paper'
    | 'Fullscreen';

  export type PageLayout =
    | 'Single'
    | 'Sidebar'
    | 'Aside'
    | 'HolyGrail'
    | 'Mobile'
    | 'Split'
    | 'Studio';

  export interface PageProps {
    role?: PageRole;
    layout?: PageLayout;
    title?: string;
    description?: string;
  }

  // --- Level 1: Section ---

  export type SectionRole =
    | 'Header'
    | 'Footer'
    | 'Main'
    | 'Navigation'
    | 'Sidebar'
    | 'Search'
    | 'Region'
    | 'Modal'
    | 'Drawer';

  export interface SectionProps extends BaseProps {
    role: SectionRole;
  }

  // --- Level 2: Block ---

  export type BlockRole =
    // Layout
    | 'Card'
    | 'Stack'
    | 'GridLayout'
    | 'ScrollArea'
    // Navigation
    | 'AppBar'
    | 'Toolbar'
    | 'Breadcrumbs'
    | 'Tabs'
    | 'Pagination'
    // Data Display
    | 'List'
    | 'DataTable'
    | 'TreeView'
    | 'EmptyState'
    // Forms
    | 'Form'
    | 'FieldGroup'
    | 'Combobox'
    | 'FilterBar'
    // Overlays
    | 'Menu'
    | 'Popover'
    | 'Tooltip'
    | 'Toast'
    // Utility
    | 'Group'
    | 'Row'
    | 'Spacer'
    | string;

  export interface BlockProps extends BaseProps {
    role?: BlockRole;
    // gap is calculated automatically from density
  }

  // =========================================================================
  // 4. Element Taxonomy (Level 3)
  // =========================================================================

  // --- Text ---
  export type TextRole = 'Title' | 'Heading' | 'Body' | 'Label' | 'Caption';

  export interface TextProps extends BaseProps {
    role: TextRole;
    content?: string;
    icon?: string;
    // align is determined by role, not a direct prop
  }

  // --- Image ---
  export interface ImageProps extends BaseProps {
    src: string;
    alt: string;
    // aspectRatio and fit should be in spec object
    // spec?: { aspectRatio?: 'auto' | '1:1' | '16:9' | '4:3'; fit?: 'cover' | 'contain' }
  }

  // --- Field ---
  export type FieldRole =
    | 'TextInput'
    | 'TextArea'
    | 'NumberInput'
    | 'PasswordInput'
    | 'EmailInput'
    | 'SearchInput'
    | 'Select'
    | 'Combobox'
    | 'Checkbox'
    | 'Switch'
    | 'RadioGroup'
    | 'DateInput'
    | 'TimeInput'
    | 'DateTimeInput'
    | 'FileInput'
    | 'Slider'
    | 'OTPInput'
    | 'TagInput'
    | 'Rating';

  export type FieldOption = { label: string; value: string | number; disabled?: boolean };

  export type FieldSpec =
    | {
        role: 'TextInput';
        inputMode?: 'text' | 'numeric' | 'email' | 'tel' | 'url';
        maxLength?: number;
        pattern?: string;
      }
    | { role: 'TextArea'; rows?: number; maxLength?: number }
    | { role: 'NumberInput'; min?: number; max?: number; step?: number }
    | { role: 'PasswordInput'; revealable?: boolean }
    | { role: 'EmailInput'; autoComplete?: string }
    | { role: 'SearchInput'; clearable?: boolean }
    | { role: 'Select'; options: FieldOption[]; multiple?: boolean }
    | {
        role: 'Combobox';
        options: FieldOption[];
        freeSolo?: boolean;
        filter?: 'contains' | 'startsWith' | 'none';
      }
    | { role: 'Checkbox'; indeterminate?: boolean }
    | { role: 'Switch' }
    | { role: 'RadioGroup'; options: FieldOption[]; legend?: string }
    | { role: 'DateInput'; min?: string; max?: string }
    | { role: 'TimeInput'; min?: string; max?: string; step?: number }
    | { role: 'DateTimeInput'; min?: string; max?: string }
    | { role: 'FileInput'; accept?: string; multiple?: boolean }
    | { role: 'Slider'; min: number; max: number; step?: number; range?: boolean }
    | { role: 'OTPInput'; length: number; numeric?: boolean }
    | { role: 'TagInput'; suggestions?: FieldOption[]; maxItems?: number }
    | { role: 'Rating'; max: number; step?: number };

  export interface FieldProps extends BaseProps {
    label: string;
    model: string;
    role: FieldRole;
    spec?: Omit<Extract<FieldSpec, { role: FieldRole }>, 'role'>;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
  }

  // --- Action ---
  export type ActionBehavior =
    | { type: 'submit' }
    | { type: 'navigate'; to: string; target?: string }
    | { type: 'command'; id: string; params?: Record<string, unknown> }
    | { type: 'open'; target: string };

  export interface ActionProps extends BaseProps {
    label: string;
    icon?: string;
    behavior?: ActionBehavior;
    disabled?: boolean;
  }

  // =========================================================================
  // 5. AST Node Definition
  // =========================================================================

  export type IDDLNode = PageNode | SectionNode | BlockNode | ElementNode;

  export interface PageNode extends PageProps {
    type: 'Page';
    children: SectionNode[];
  }

  export interface SectionNode extends SectionProps {
    type: 'Section';
    children: BlockNode[];
  }

  export interface BlockNode extends BlockProps {
    type: 'Block';
    children: (BlockNode | ElementNode)[];
  }

  export type ElementNode =
    | (TextProps & { type: 'Element'; elementType: 'Text' })
    | (ImageProps & { type: 'Element'; elementType: 'Image' })
    | (FieldProps & { type: 'Element'; elementType: 'Field' })
    | (ActionProps & { type: 'Element'; elementType: 'Action' });
}
