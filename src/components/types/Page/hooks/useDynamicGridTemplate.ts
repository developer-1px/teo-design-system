/**
 * useDynamicGridTemplate - 동적 Grid Template 계산 Hook (v5.0)
 *
 * Children에서 role prop을 분석하여 자동으로 grid-template-areas를 생성합니다.
 * Holy Grail + IntelliJ 스타일 하이브리드 레이아웃 지원
 *
 * v4.1: role-config.ts 중앙 설정 사용 (role → gridArea 매핑 제거)
 * v5.0: PageLayout 기반으로 변경 (template → layout)
 *
 * @example
 * const { gridTemplateAreas, gridTemplateColumns, gridTemplateRows } =
 *   useDynamicGridTemplate(children, layout, sizes);
 */

import { type ReactNode, useMemo } from 'react';
import type { PageLayout } from '@/components/types/Page/Page.types';
import { getRoleConfig, ROLE_CONFIGS } from '@/components/types/Section/role-config';

export interface GridSizes {
  header?: string;
  footer?: string;
  left?: string;
  right?: string;
  'top-left'?: string;
  'top-right'?: string;
  'bottom-left'?: string;
  'bottom-right'?: string;
  // Studio template specific
  toolbar?: string;
  activitybar?: string;
  primarysidebar?: string;
  editor?: string;
  panel?: string;
  secondarysidebar?: string;
  utilitybar?: string;
  // Sidebar template specific
  nav?: string;
  content?: string;
  // 3-col template specific
  center?: string;
  // Master-Detail template specific
  master?: string;
  detail?: string;
  // Dialog template specific
  'dialog-header'?: string;
  'dialog-content'?: string;
  'dialog-footer'?: string;
}

export interface DynamicGridTemplate {
  gridTemplateAreas: string;
  gridTemplateColumns: string;
  gridTemplateRows: string;
}

/**
 * Children에서 사용된 role 추출 및 gridArea 변환 (v5.0)
 */
function extractUsedAreas(children: ReactNode, layout?: PageLayout): Set<string> {
  const areas = new Set<string>();

  const traverse = (node: ReactNode) => {
    if (!node) return;

    if (Array.isArray(node)) {
      node.forEach(traverse);
      return;
    }

    if (typeof node === 'object' && 'props' in node) {
      const props = (node as any).props;

      // v5.0: role 기반 gridArea 자동 계산 (role-config 사용)
      if (props?.role) {
        if (props.role === 'separator') return;

        // v5.0: layout 이름을 Capitalized로 변환하여 ROLE_CONFIGS 키와 일치시킴
        const layoutName = layout
          ? layout.charAt(0).toUpperCase() + layout.slice(1).toLowerCase()
          : undefined;

        // 1. Layout 특정 role인 경우 (가장 중요)
        if (layoutName && (ROLE_CONFIGS as any)[layoutName]?.[props.role]) {
          const config = (ROLE_CONFIGS as any)[layoutName][props.role];
          areas.add(config.gridArea);
          return; // 핵심: 직접적인 레이아웃 영역을 찾으면 더 이상 자식으로 들어가지 않음 (nested Section 보호)
        }

        // 2. Fallback: universal role인 경우
        if (ROLE_CONFIGS.universal[props.role]) {
          const config = ROLE_CONFIGS.universal[props.role];
          areas.add(config.gridArea);
          return;
        }

        // 3. Unknown role fallback
        const config = getRoleConfig(props.role, layoutName as any);
        areas.add(config.gridArea);
        // Fallback인 경우에도 일단 찾았으므로 더 깊이 들어가지 않음 (IDDL은 계층적 Section을 기본적으로 한 단계만 Grid로 봄)
        return;
      }

      if (props?.children) {
        traverse(props.children);
      }
    }
  };

  traverse(children);
  return areas;
}

/**
 * 사용된 영역 기반으로 grid-template-areas 생성
 */
/**
 * 사용된 영역 기반으로 grid-template-areas 생성 (Strict Spec Implementation)
 */
function generateGridTemplate(
  usedAreas: Set<string>,
  sizes: GridSizes,
  layout?: PageLayout
): DynamicGridTemplate {
  const has = (area: string) => usedAreas.has(area);
  const getSize = (area: string, fallback: string = 'auto') =>
    sizes[area as keyof GridSizes] || fallback;

  // 1. Studio Layout
  if (layout === 'Studio') {
    return {
      gridTemplateAreas: `
        "header header header header header"
        "act    side   main   aux    utility"
        "act    side   panel  aux    utility"
        "stat   stat   stat   stat   stat"
        "footer footer footer footer footer"
      `,
      gridTemplateColumns: '48px 250px 1fr 250px 48px',
      gridTemplateRows: 'auto 1fr 200px 24px auto',
    };
  }

  // 2. HolyGrail Layout
  if (layout === 'HolyGrail') {
    return {
      gridTemplateAreas: `
        "header header header"
        "nav    main   aside"
        "footer footer footer"
      `,
      gridTemplateColumns: '240px 1fr 300px',
      gridTemplateRows: 'auto 1fr auto',
    };
  }

  // 3. Sidebar Layout
  if (layout === 'Sidebar') {
    return {
      gridTemplateAreas: `
        "header header"
        "nav    main"
        "footer footer"
      `,
      gridTemplateColumns: '288px 1fr',
      gridTemplateRows: 'auto 1fr auto',
    };
  }

  // 4. Aside Layout
  if (layout === 'Aside') {
    return {
      gridTemplateAreas: `
        "header header"
        "main   aside"
        "footer footer"
      `,
      gridTemplateColumns: '1fr 256px',
      gridTemplateRows: 'auto 1fr auto',
    };
  }

  // 5. Split Layout
  if (layout === 'Split') {
    return {
      gridTemplateAreas: `
        "header header"
        "panel-a panel-b"
        "footer footer"
      `,
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: 'auto 1fr auto',
    };
  }

  // 6. Single Layout (Strict: "header" / "main" / "footer")
  if (layout === 'Single') {
    return {
      gridTemplateAreas: '"header"\n    "main"\n    "footer"',
      gridTemplateColumns: '1fr',
      gridTemplateRows: 'auto 1fr auto',
    };
  }

  // 7. Mobile Layout (Strict: "header" / "main" / "footer" / "dock")
  if (layout === 'Mobile') {
    return {
      gridTemplateAreas: '"header"\n    "main"\n    "footer"\n    "dock"',
      gridTemplateColumns: '1fr',
      gridTemplateRows: 'auto 1fr auto auto',
    };
  }

  // Default / Fallback Strategy
  return {
    gridTemplateAreas: '"main"',
    gridTemplateColumns: '1fr',
    gridTemplateRows: '1fr',
  };
}

/**
 * Main hook (v5.0: layout-aware)
 */
export function useDynamicGridTemplate(
  children: ReactNode,
  layout?: PageLayout,
  sizes: GridSizes = {}
): DynamicGridTemplate {
  return useMemo(() => {
    const usedAreas = extractUsedAreas(children, layout);

    // If no areas specified, use default 3-column layout
    if (usedAreas.size === 0) {
      return {
        gridTemplateAreas: '"main"',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr',
      };
    }

    return generateGridTemplate(usedAreas, sizes, layout); // Pass layout here
  }, [children, layout, sizes]);
}
