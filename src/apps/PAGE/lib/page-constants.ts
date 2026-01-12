/**
 * Page Showcase Constants
 *
 * Centralized constants for Page showcase functionality
 */

import type { PageLayout, PageRole } from '@/components/dsl/Page/Page.types';
import type { Density, Intent, Prominence } from '@/components/dsl/Shared.types';

/**
 * Available PageRoles
 */
export const PAGE_ROLES: readonly PageRole[] = [
  'Document',
  'Application',
  'Focus',
  'Immersive',
  'Overlay',
  'Paper',
] as const;

/**
 * Available Prominences
 */
export const PROMINENCES: readonly Prominence[] = ['Hero', 'Strong', 'Standard', 'Subtle'] as const;

/**
 * Available Densities
 */
export const DENSITIES: readonly Density[] = ['Comfortable', 'Standard', 'Compact'] as const;

/**
 * Available Intents
 */
export const INTENTS: readonly Intent[] = [
  'Neutral',
  'Brand',
  'Positive',
  'Caution',
  'Critical',
  'Info',
] as const;

/**
 * Available layouts per PageRole
 */
export const ROLE_LAYOUT_MAP: Record<PageRole, readonly PageLayout[]> = {
  Document: ['Single', 'Sidebar', 'ThreeColumn', 'Aside'],
  Application: ['Workbench', 'Sidebar', 'Split'],
  Focus: ['Single'],
  Immersive: ['Single', 'Mobile'],
  Overlay: ['Single'],
  Paper: ['Single'],
} as const;

/**
 * FloatingControlPanel UI Constants
 */
export const FLOATING_PANEL = {
  WIDTH: 260,
  INITIAL_OFFSET_X: 300,
  INITIAL_OFFSET_Y: 80,
  MAX_HEIGHT: 600,
} as const;

/**
 * Map Intent value to Intent prop
 */
export function getIntentForButton(intentValue: Intent): Intent {
  // Intent buttons should display their own intent
  const intentMap: Record<Intent, Intent> = {
    Neutral: 'Neutral',
    Brand: 'Brand',
    Accent: 'Brand', // Legacy alias
    Positive: 'Positive',
    Caution: 'Caution',
    Critical: 'Critical',
    Info: 'Info',
  };

  return intentMap[intentValue] || 'Neutral';
}
