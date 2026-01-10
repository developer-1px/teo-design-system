/**
 * IDDL (Intent-Driven Design Language) 1.0 Part 1
 * Core Type Definitions
 * 
 * Status: Core Freeze Candidate
 * Version: 1.0.1
 * Date: 2026-01-10
 */

export namespace IDDL {
    // =========================================================================
    // 1. The 5 Axes of Definition
    // =========================================================================

    /**
     * **Role**: The functional identity of the node.
     * Determines the default implementation pattern, layout structure, and required spec.
     * Examples: 'Header', 'Card', 'Toolbar', 'Form'
     */
    export type Role = string;

    /**
     * **Intent**: The semantic context or meaning of the node.
     * Renderers MUST preserve the semantic effect of the intent.
     */
    export type Intent =
        | 'Neutral'   // Default, informational
        | 'Brand'     // Primary, identity-focused
        | 'Positive'  // Success, completion
        | 'Caution'   // Warning, attention needed
        | 'Critical'  // Danger, error, destructive
        | 'Info';     // Auxiliary information

    /**
     * **Prominence**: The visual weight or hierarchy of the node.
     */
    export type Prominence =
        | 'Hero'      // Maximum emphasis (Page Title, Primary CTA)
        | 'Standard'  // Default weight
        | 'Subtle'    // Secondary, de-emphasized
        | 'Hidden';   // MUST NOT be displayed to the user

    /**
     * **Density**: The physical density scale of the UI.
     * Renderers should adjust spacing/sizing tokens based on this.
     */
    export type Density =
        | 'Standard'    // Default
        | 'Comfortable' // Spacious, touch-friendly
        | 'Compact';    // Dense, data-intensive

    /**
     * **Spec**: Role-dependent parameters.
     * - MUST be serializable plain data (JSON safe).
     * - MUST NOT describe presentation (CSS/colors) directly.
     * - MUST be defined by the Role's schema.
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
    }

    // =========================================================================
    // 3. Node Levels & Interfaces
    // =========================================================================

    // --- Level 0: Page ---

    export interface PageProps {
        title?: string;
        description?: string;
        template?: string;
    }

    // --- Level 1: Section ---

    export type SectionRole =
        | 'Header' | 'Footer' | 'Main' | 'Sidebar' | 'Drawer' | 'Modal';

    export interface SectionProps extends BaseProps {
        role: SectionRole;
    }

    // --- Level 2: Block ---

    export type BlockRole =
        | 'Form' | 'Card' | 'List' | 'Toolbar' | 'Menu' | 'Grid'
        // Utility Roles
        | 'Group' | 'Row' | 'Spacer'
        | string; // Extensible

    export interface BlockProps extends BaseProps {
        role?: BlockRole; // Optional: defaults to 'Group' (generic container)

        /** 
         * Explicit gap spacing.
         * While layout helps are removed, gap represents logical separation.
         */
        gap?: 'none' | 'small' | 'medium' | 'large';
    }

    // =========================================================================
    // 4. Element Taxonomy (Level 3)
    // =========================================================================

    // --- Text ---
    export type TextRole = 'Title' | 'Heading' | 'Body' | 'Label' | 'Caption';

    export interface TextProps extends BaseProps {
        role: TextRole;
        content?: string;
        align?: 'left' | 'center' | 'right';
        icon?: string;
    }

    // --- Image ---
    export interface ImageProps extends BaseProps {
        src: string;
        alt: string;
        aspectRatio?: 'auto' | '1:1' | '16:9' | '4:3';
        fit?: 'cover' | 'contain';
    }

    // --- Video ---
    export interface VideoProps extends BaseProps {
        src: string;
        poster?: string;
        autoplay?: boolean;
        loop?: boolean;
        controls?: boolean;
    }

    // --- Field ---
    export type FieldType =
        | 'text' | 'number' | 'email' | 'password'
        | 'select' | 'date' | 'checkbox' | 'radio'
        | 'textarea' | 'file' | 'color';

    export interface FieldProps extends BaseProps {
        label: string;
        /** Binding path (e.g. 'user.name') */
        model: string;
        type: FieldType;
        required?: boolean;
        disabled?: boolean;
        placeholder?: string;
        /** Options for select/radio */
        options?: Array<{ label: string; value: string | number | boolean }>;
    }

    // --- Action ---
    export type ActionBehavior =
        | { type: 'submit' }
        | { type: 'navigate'; to: string; target?: string }
        | { type: 'command'; id: string; params?: Record<string, unknown> }
        | { type: 'open'; target: string }; // e.g. open modal/drawer id

    export interface ActionProps extends BaseProps {
        label: string;
        icon?: string;
        /** 
         * Defines what happens when triggered.
         * Execution logic is defined in IDDL Part 2.
         */
        behavior?: ActionBehavior;
        disabled?: boolean;
    }

    // --- Separator ---
    export interface SeparatorProps extends BaseProps {
        type?: 'line' | 'space';
        size?: 'small' | 'medium' | 'large';
        orientation?: 'horizontal' | 'vertical';
        content?: string; // Optional text in middle of separator line
    }

    // =========================================================================
    // 5. AST Node Definition (JSON Schema)
    // =========================================================================

    /**
     * Represents the serialized JSON tree structure of an IDDL document.
     */
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
        | (VideoProps & { type: 'Element'; elementType: 'Video' })
        | (FieldProps & { type: 'Element'; elementType: 'Field' })
        | (ActionProps & { type: 'Element'; elementType: 'Action' })
        | (SeparatorProps & { type: 'Element'; elementType: 'Separator' });

}
