/**
 * Text Type Definitions
 */

import type React from 'react';
import type { AsProp, Intent, Prominence } from '../../Shared.types';

/**
 * Text Role - 정적 텍스트의 역할
 *
 * Registry-based system으로 확장 가능한 role 관리
 *
 * Current roles (16):
 * - Typography (5): Title, Heading, Body, Label, Caption
 * - Inline (5): Strong, Emphasis, Mark, Link, Code
 * - Indicator (5): Badge, Alert, Avatar, Kbd, Tag
 * - Data (1): Time
 *
 * Extensible: Use registerTextRole() to add custom roles
 */
export type TextRole =
  // Typography (5 roles)
  | 'Title'
  | 'Heading'
  | 'Body'
  | 'Label'
  | 'Caption'
  | 'Micro' // ✨ New (v4.2): 10px dense text
  // Inline (5 roles)
  | 'Strong'
  | 'Emphasis'
  | 'Mark'
  | 'Link'
  | 'Code'
  // Status & Indicators (Moved from Block)
  | 'Badge'
  | 'Tag'
  | 'Progress'
  | 'Spinner'
  | 'Skeleton'
  | 'Avatar' // Non-clickable display
  | 'Kbd'
  | 'Alert' // Text-only alert or status text
  // Data (1 role)
  | 'Time';

/**
 * Text Props - 정적 콘텐츠 (Data Binding 없음)
 */
export interface TextProps extends AsProp {
  role?: TextRole;
  content?: React.ReactNode;
  prominence?: Prominence;
  density?: any; // Added for Block/Section inheritance
  intent?: Intent;
  align?: 'left' | 'center' | 'right';
  className?: string;
  style?: React.CSSProperties;
  hidden?: boolean;
  condition?: string;
  highlight?: string;

  // Content & Styling
  size?: string;
  children?: React.ReactNode;
  /** Role-specific configuration (e.g. level for Heading, pulse for Badge) */
  spec?: Record<string, unknown>;

  // @deprecated Legacy props
  weight?: string;
}
