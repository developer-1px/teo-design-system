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
  // Bar (수평, 고정 높이)
  | 'Header'
  | 'Footer'
  | 'Toolbar'
  | 'Statusbar'
  | 'Tabbar'
  // Panel (분할 영역)
  | 'Sidebar'
  | 'Aside'
  | 'Panel'
  | 'Rail'
  // Main (주요 콘텐츠)
  | 'Main'
  | 'Canvas'
  | 'Content'
  // Overlay (부유 레이어)
  | 'Modal'
  | 'Drawer'
  | 'Sheet'
  | 'Popover'
  | 'Toast'
  // Landmark (ARIA 호환)
  | 'Navigation'
  | 'Search'
  | 'Region'
  // 2. Aliases (Normalized to Core)
  | 'Navigator' // -> Nav
  | 'Container' // -> Main
  | 'Region' // -> Main/Section
  // 3. Extended Roles (IDE / Studio Specific)
  | 'ActivityBar'
  | 'UtilityBar'
  | 'PrimarySidebar'
  | 'SecondarySidebar'
  | 'Editor'
  | 'Master'
  | 'Detail'
  | 'Nav'
  | 'Status'
  | 'Dock'
  | 'DialogHeader'
  | 'DialogContent'
  | 'DialogFooter';

/**
 * Section Role 카테고리
 */
export type SectionCategory = 'bar' | 'panel' | 'main' | 'overlay' | 'landmark';

/**
 * Section이 제공하는 Design Context
 */
export interface SectionDesignContext {
  /** Section Role */
  role: SectionRole;

  // === 레이아웃 ===
  /** 주 방향 */
  direction: 'horizontal' | 'vertical' | 'none';

  /** 크기 모드 */
  sizeMode: 'fixed' | 'narrow' | 'medium' | 'wide' | 'flexible' | 'readable' | 'auto';

  /** 스크롤 축 */
  scrollAxis: 'x' | 'y' | 'both' | 'none';

  // === 밀도 ===
  /** 기본 밀도 */
  defaultDensity: Density;

  // === 제약 조건 ===
  /** Hero prominence 허용 여부 */
  allowHero: boolean;

  /** Block 중첩 최대 깊이 (0 = unlimited) */
  maxDepth: number;

  // === 콘텐츠 힌트 ===
  /** 아이콘 우선 모드 */
  preferIconOnly: boolean;

  /** 텍스트 축약 권장 */
  truncateText: boolean;

  /** 아이콘에 툴팁 필수 */
  tooltipRequired: boolean;

  // === 레이어 ===
  /** 레이어 레벨 */
  layer: 'base' | 'overlay' | 'modal' | 'popover' | 'toast';

  // === 동작 ===
  /** 접기 가능 */
  collapsible: boolean;

  /** 리사이즈 가능 */
  resizable: boolean;

  /** 포커스 트랩 */
  focusTrap: boolean;
}

export type BlockCategory = 'navigation' | 'layout' | 'data' | 'form' | 'content' | 'feedback';

/**
 * Section Types (Physical Form)
 */
export type SectionType = 'Bar' | 'Rail' | 'Panel' | 'Stage' | 'Layer' | 'Float';

/**
 * Type Scale Tokens
 */
export interface TypeScaleTokens {
  dimensions: {
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number | string;
    fixedWidth?: number;
    fixedHeight?: number;
  };
  text: {
    Hero: number;
    Standard: number;
    Subtle: number;
  };
  space: {
    base: number;
    tight: number;
    loose: number;
  };
  action: {
    height: number;
    minWidth?: number;
    iconOnly?: boolean;
    variant?: 'icon' | 'menuItem' | 'button' | 'default';
  };
  field?: {
    height: number;
    labelPosition: 'top' | 'left' | 'hidden';
  };
  defaultDensity: Density;
}

/**
 * Section이 제공하는 Design Context
 */
export interface SectionDesignContext {
  /** Section Role */
  role: SectionRole;

  /** Physical Type (v5.2) */
  type?: SectionType;

  /** Scale Tokens (v5.2) */
  scale?: TypeScaleTokens;

  // === 레이아웃 ===
  /** 주 방향 */
  direction: 'horizontal' | 'vertical' | 'none';

  /** 크기 모드 */
  sizeMode: 'fixed' | 'narrow' | 'medium' | 'wide' | 'flexible' | 'readable' | 'auto';
}

/**
 * Element 패턴 (Element 또는 Element:Role 형태)
 */
export type ElementPattern =
  | 'Text'
  | `Text:${string}`
  | 'Action'
  | 'Action:IconOnly'
  | 'Field'
  | `Field:${string}`
  | 'Image'
  | `Image:${string}`
  | 'Separator'
  | 'Video'
  | '*';

/**
 * Section 호환성 규칙
 */
export interface SectionRules {
  /** 허용되는 콘텐츠 */
  allowed: {
    blocks: string[] | '*'; // Avoiding circular dependency with BlockRole
    elements: ElementPattern[] | '*';
  };

  /** 금지되는 콘텐츠 */
  forbidden: {
    blocks?: string[];
    elements?: ElementPattern[] | '*';
    prominences?: Prominence[];
  };

  /** 제한적으로 허용되는 콘텐츠 (카테고리별) */
  restricted?: Partial<Record<BlockCategory, string[]>>;

  /** 필수 요소 */
  required?: {
    closeAction?: boolean;
    name?: boolean;
  };

  /** 제약 조건 */
  constraints: {
    maxDepth: number;
    maxActions?: number;
    maxItems?: number;
    maxTextLength?: number;
    direction?: 'horizontal' | 'vertical';
    iconOnly?: boolean;
    tooltipRequired?: boolean;
    autoDismiss?: boolean;
    focusTrap?: boolean;
    maxWidth?: number;
    fixedWidth?: number;
  };
}

/**
 * Collapsible Configuration (v4.1)
 */
export interface CollapsibleConfig {
  collapsed: boolean;
  collapsedSize?: string | number; // e.g. "48px", 48
  expandedSize?: string | number; // e.g. "250px", 250
  transition?: boolean; // Enable CSS transition (default: true)
  transitionDuration?: number; // ms (default: 200)
}

export interface SectionProps extends AsProp {
  // 1. Zoning & Semantics
  role?: SectionRole;
  type?: SectionType; // Override default type mapping

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
  collapsible?: boolean | CollapsibleConfig;

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
