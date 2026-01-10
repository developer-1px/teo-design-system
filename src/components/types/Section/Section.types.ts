/**
 * Section Type Definitions
 */

import type { ReactNode } from 'react';
import type { PageLayout } from '../Page/Page.types';
import type { AsProp, Density, Intent, Prominence } from '../Shared.types';

/**
 * Section Role - 섹션의 배치 역할 (Template-aware v4.0)
 * v1.0.1: Aside 추가
 * v1.1.0: IDE/Studio 레이아웃 전용 role 추가
 * v4.0: Template별로 그룹화, Page template의 named slot 역할
 *
 * **Section vs Block**:
 * - Section: 시각적 영역 (배경, 보더, 패딩 있음) - Figma Section과 동일
 * - Block: 투명 레이아웃 컨테이너 (시각적 요소 없음) - Figma Block과 동일
 *
 * **Template-aware**:
 * - Section role은 Page template에 종속됨
 * - 각 template은 특정 Section role 세트를 정의
 * - 잘못된 조합 시 경고 (예: template="studio"인데 role="Master" 사용)
 */
/**
 * Section Role - IDDL v5.0 Core + Alias + Extensions
 *
 * **Core Roles** (The Magnificent 5 + 3):
 * - Header, Nav, Main, Aside, Footer
 * - Dock (App), Status (Studio), Panel (Split/Studio)
 *
 * **Extended Roles** (IDE Domain):
 * - ActivityBar, UtilityBar, Editor, PrimarySidebar, SecondarySidebar
 */
export type SectionRole =
  // 1. Core Roles (Standard Semantics)
  | 'Header'
  | 'Nav'
  | 'Main'
  | 'Aside'
  | 'Footer'
  | 'Dock'
  | 'Status'
  | 'Panel'
  // 2. Aliases (Normalized to Core)
  | 'Navigator' // -> Nav
  | 'Container' // -> Main
  | 'Sidebar' // -> Nav
  | 'Region' // -> Main/Section
  // 3. Extended Roles (IDE / Studio Specific)
  | 'ActivityBar'
  | 'UtilityBar'
  | 'PrimarySidebar'
  | 'SecondarySidebar'
  | 'Editor'
  | 'Toolbar'
  | 'Master'
  | 'Detail'
  | 'DialogHeader'
  | 'DialogContent'
  | 'DialogFooter';

export interface SectionProps extends AsProp {
  // 1. Zoning & Semantics
  role?: SectionRole;

  // 2. Identity
  title?: string;
  actions?: ReactNode;

  // 3. Behavior
  scrollable?: boolean;

  // 4. Styling
  variant?: 'Plain' | 'Card' | 'Hero';
  prominence?: Prominence; // Deprecated? Kept for backward compat for now.
  density?: Density;
  intent?: Intent;

  // Base
  children?: ReactNode;
  className?: string; // Only for dynamic styling
  id?: string;
  onClick?: (e: React.MouseEvent) => void;

  // Legacy/Internal
  gridArea?: string;
  mode?: 'view' | 'edit';
  condition?: string;
  resizable?:
    | boolean
    | { direction?: 'horizontal' | 'vertical' | 'both'; minSize?: number; maxSize?: number };
  collapsible?: boolean;

  // Formatting (Compatibility)
  style?: React.CSSProperties;
  layout?: string; // e.g. "flex", "grid" (often used in IDE)
  padding?: string; // e.g. "md"
  border?: string; // e.g. "top"
  position?: string; // e.g. "absolute"
  width?: string | number;
  height?: string | number;
  top?: string | number;
  left?: string | number;
  gap?: string | number;
  elevation?: string;
  direction?: 'horizontal' | 'vertical';
  align?: string;
  justify?: string;
  split?: string; // for SplitContainer
}
