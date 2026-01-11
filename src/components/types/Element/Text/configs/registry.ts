/**
 * Text Role Registry
 *
 * 모든 Text role의 중앙 관리 시스템
 * - Simple roles: HTML 태그 + CSS 클래스
 * - Complex roles: Custom renderer component
 */

import type { RoleConfig } from './types';

// Import configurations
import * as Typography from './simple/typography';
import * as Inline from './simple/inline';
import * as Indicator from './complex/indicator';
import * as Data from './complex/data';

/**
 * Role Registry
 * Role 이름 → Configuration 매핑
 */
export const ROLE_REGISTRY: Record<string, RoleConfig> = {
  // === Typography (가장 많이 사용) ===
  Title: Typography.Title,
  Heading: Typography.Heading,
  Body: Typography.Body,
  Label: Typography.Label,
  Caption: Typography.Caption,

  // === Inline Semantics (자주 사용) ===
  Strong: Inline.Strong,
  Emphasis: Inline.Emphasis,
  Mark: Inline.Mark,
  Link: Inline.Link,
  Code: Inline.Code,

  // === Indicators (자주 사용) ===
  Badge: Indicator.Badge,
  Alert: Indicator.Alert,
  Avatar: Indicator.Avatar,
  Kbd: Indicator.Kbd,
  Tag: Indicator.Tag,

  // === Data (데이터 표시) ===
  Time: Data.Time,
};

/**
 * Get role configuration
 *
 * @param role - IDDL role name
 * @returns RoleConfig or default fallback
 */
export function getRoleConfig(role: string): RoleConfig {
  const config = ROLE_REGISTRY[role];

  if (!config) {
    // Dev mode warning
    if (import.meta.env.DEV) {
      console.warn(`[Text] Unknown role "${role}". Using fallback config. Available roles:`, Object.keys(ROLE_REGISTRY));
    }

    // Fallback: simple span
    return {
      type: 'simple',
      htmlTag: 'span',
      baseStyles: '',
      description: `Unknown role "${role}" (fallback)`,
    };
  }

  return config;
}

/**
 * Check if role has custom renderer
 *
 * @param role - IDDL role name
 * @returns true if role uses complex renderer
 */
export function hasRenderer(role: string): boolean {
  const config = ROLE_REGISTRY[role];
  return config?.type === 'complex';
}

/**
 * Get all registered roles
 *
 * @returns Array of role names
 */
export function getRegisteredRoles(): string[] {
  return Object.keys(ROLE_REGISTRY);
}

/**
 * Register custom role (for extensibility)
 *
 * @param role - Role name
 * @param config - Role configuration
 */
export function registerTextRole(role: string, config: RoleConfig): void {
  if (ROLE_REGISTRY[role] && import.meta.env.DEV) {
    console.warn(`[Text] Overwriting existing role "${role}"`);
  }
  ROLE_REGISTRY[role] = config;
}
