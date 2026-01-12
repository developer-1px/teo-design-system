import type { VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';
import type { Density, Intent, Prominence } from '../Shared.types';
import type { pageVariants } from './Page';

export type PageRole = 'Document' | 'Application' | 'Focus' | 'Immersive' | 'Overlay' | 'Paper';

export type PageLayout =
  | 'Single' // Standard 1-Col
  | 'Sidebar' // Standard with Left Nav
  | 'Aside' // Standard with Right Meta
  | 'ThreeColumn' // Header + Sidebar + Main + Aside + Footer
  | 'Split' // 50:50 or Master-Detail
  | 'Workbench' // IDE / Pro Tool (Multi-panel)
  | 'Mobile'; // Stacked + Bottom Dock

/**
 * Page Props (IDDL Part 1 Strict)
 */
export interface PageProps extends VariantProps<typeof pageVariants> {
  /** [Identity] Page title */
  title?: string;

  /** [Physics] Physics of the page */
  role?: PageRole;

  /** [Zoning] Layout strategy */
  layout?: PageLayout;

  // --- Core Axes ---
  prominence?: Prominence;
  density?: Density;
  intent?: Intent;

  /** [Slots] Header, Sidebar, Main, etc. (Must be Sections) */
  children: ReactNode;

  /** Custom Styles */
  className?: string;
}
