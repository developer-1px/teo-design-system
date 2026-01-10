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
        const layoutName = layout ? layout.charAt(0).toUpperCase() + layout.slice(1).toLowerCase() : undefined;

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
function generateGridTemplate(
  usedAreas: Set<string>,
  sizes: GridSizes
): DynamicGridTemplate {
  const has = (area: string) => usedAreas.has(area);

  // Default sizes for all possible areas
  const defaultSizes: Record<string, string> = {
    // Presentation template
    header: '64px',
    footer: '48px',
    left: '200px',
    right: '300px',
    'top-left': '200px',
    'top-right': '200px',
    'bottom-left': '200px',
    'bottom-right': '200px',
    main: '1fr',
    // Studio template (IDE)
    toolbar: '48px',
    activitybar: '48px',
    primarysidebar: '250px',
    editor: '1fr',
    panel: '300px',
    secondarysidebar: '300px',
    utilitybar: 'auto',
    // Sidebar template
    nav: '250px',
    content: '1fr',
    // 3-col template
    center: '1fr',
    // Master-Detail template
    master: '300px',
    detail: '1fr',
    // Dialog template
    'dialog-header': 'auto',
    'dialog-content': '1fr',
    'dialog-footer': 'auto',
  };

  const getSize = (area: string) => sizes[area as keyof GridSizes] || defaultSizes[area] || 'auto';

  // Row structure
  const rows: string[] = [];
  const rowSizes: string[] = [];
  const columns: string[] = [];
  const columnSizes: string[] = [];

  // Special case: Studio template (IDE 레이아웃 with optional toolbar, header, footer)
  if (
    has('toolbar') ||
    has('header') ||
    has('footer') ||
    has('activitybar') ||
    has('primarysidebar') ||
    has('editor') ||
    has('panel') ||
    has('secondarysidebar') ||
    has('utilitybar')
  ) {
    const studioRows: string[] = [];
    const studioRowSizes: string[] = [];
    const leftColumns: string[] = [];
    const leftColumnSizes: string[] = [];
    const rightColumns: string[] = [];
    const rightColumnSizes: string[] = [];

    // Define side columns
    if (has('activitybar')) {
      leftColumns.push('activitybar');
      leftColumnSizes.push(getSize('activitybar'));
    }
    if (has('primarysidebar')) {
      leftColumns.push('primarysidebar');
      leftColumnSizes.push(getSize('primarysidebar'));
    }

    if (has('secondarysidebar')) {
      rightColumns.push('secondarysidebar');
      rightColumnSizes.push(getSize('secondarysidebar'));
    }
    if (has('utilitybar')) {
      rightColumns.push('utilitybar');
      rightColumnSizes.push(getSize('utilitybar'));
    }

    // Determine center area structure
    const centerCols = has('editor') || has('panel') ? ['editor'] : ['.']; // Center is always 1 column wide effectively
    const centerColSize = '1fr';

    // Construct full column list for Header/Footer/Toolbar spanning
    // Note: Grid Line alignment requires consistent column counts.
    // We will have: [Left Cols] [Center Col] [Right Cols]
    const allColSizes = [...leftColumnSizes, centerColSize, ...rightColumnSizes];
    const numCols = allColSizes.length;

    // Header row (Full width)
    if (has('header')) {
      studioRows.push(`"${new Array(numCols).fill('header').join(' ')}"`);
      studioRowSizes.push(getSize('header'));
    }

    // Toolbar row (Full width)
    if (has('toolbar')) {
      studioRows.push(`"${new Array(numCols).fill('toolbar').join(' ')}"`);
      studioRowSizes.push(getSize('toolbar'));
    }

    // Center Section (Editor + Panel)
    // Row 1: Editor
    // Sidebars span down, so we use their names again in the next row if needed.
    // Actually, simply repeating the name in consecutive rows makes them span.

    const row1Areas = [
      ...leftColumns,
      has('editor') ? 'editor' : '.',
      ...rightColumns
    ];
    studioRows.push(`"${row1Areas.join(' ')}"`);
    studioRowSizes.push('1fr');

    // Row 2: Panel (if exists)
    if (has('panel')) {
      const row2Areas = [
        ...leftColumns, // Sidebars span this row too
        'panel',
        ...rightColumns // Sidebars span this row too
      ];
      studioRows.push(`"${row2Areas.join(' ')}"`);
      studioRowSizes.push(getSize('panel'));
    }

    // Footer row (Full width)
    if (has('footer')) {
      studioRows.push(`"${new Array(numCols).fill('footer').join(' ')}"`);
      studioRowSizes.push(getSize('footer'));
    }

    return {
      gridTemplateAreas: studioRows.join('\n    '),
      gridTemplateColumns: allColSizes.join(' '),
      gridTemplateRows: studioRowSizes.join(' '),
    };
  }

  // Special case: Master-Detail template
  if (has('master') && has('detail')) {
    return {
      gridTemplateAreas: '"master detail"',
      gridTemplateColumns: `${getSize('master')} ${getSize('detail')}`,
      gridTemplateRows: '1fr',
    };
  }

  // Special case: Dialog template
  if (has('dialog-header') || has('dialog-content') || has('dialog-footer')) {
    const dialogRows: string[] = [];
    const dialogRowSizes: string[] = [];

    if (has('dialog-header')) {
      dialogRows.push('"dialog-header"');
      dialogRowSizes.push('auto');
    }
    if (has('dialog-content')) {
      dialogRows.push('"dialog-content"');
      dialogRowSizes.push('1fr');
    }
    if (has('dialog-footer')) {
      dialogRows.push('"dialog-footer"');
      dialogRowSizes.push('auto');
    }

    return {
      gridTemplateAreas: dialogRows.join('\n    '),
      gridTemplateColumns: '1fr',
      gridTemplateRows: dialogRowSizes.join(' '),
    };
  }

  // Special case: Sidebar template (nav + content)
  if (has('nav') && has('content')) {
    return {
      gridTemplateAreas: '"nav content"',
      gridTemplateColumns: `${getSize('nav')} ${getSize('content')}`,
      gridTemplateRows: '1fr',
    };
  }

  // Special case: 3-col + header template (PPT layout)
  if (has('header') && has('center')) {
    const cols: string[] = [];
    const colSizes: string[] = [];

    if (has('left')) {
      cols.push('left');
      colSizes.push(getSize('left'));
    }
    cols.push('center');
    colSizes.push(getSize('center'));
    if (has('right')) {
      cols.push('right');
      colSizes.push(getSize('right'));
    }

    // Header spans all columns
    const headerRow = cols.map(() => 'header').join(' ');

    return {
      gridTemplateAreas: `"${headerRow}"\n    "${cols.join(' ')}"`,
      gridTemplateColumns: colSizes.join(' '),
      gridTemplateRows: `${getSize('header')} 1fr`,
    };
  }

  // Special case: 3-col template (left + center + right)
  if (has('center')) {
    const cols: string[] = [];
    const colSizes: string[] = [];

    if (has('left')) {
      cols.push('left');
      colSizes.push(getSize('left'));
    }
    cols.push('center');
    colSizes.push(getSize('center'));
    if (has('right')) {
      cols.push('right');
      colSizes.push(getSize('right'));
    }

    return {
      gridTemplateAreas: `"${cols.join(' ')}"`,
      gridTemplateColumns: colSizes.join(' '),
      gridTemplateRows: '1fr',
    };
  }

  // Presentation template (Holy Grail + corners)
  // Top row (header or top corners)
  if (has('header') || has('top-left') || has('top-right')) {
    const topRow: string[] = [];

    if (has('top-left')) {
      topRow.push('top-left');
      if (columns.length === 0) columns.push('top-left');
    } else if (has('left')) {
      topRow.push('.');
      if (columns.length === 0) columns.push('.');
    }

    if (has('header')) {
      topRow.push('header');
      if (columns.length <= 1) columns.push('header');
    } else {
      topRow.push('.');
      if (columns.length <= 1) columns.push('.');
    }

    if (has('top-right')) {
      topRow.push('top-right');
      if (columns.length <= 2) columns.push('top-right');
    } else if (has('right')) {
      topRow.push('.');
      if (columns.length <= 2) columns.push('.');
    }

    rows.push(topRow.join(' '));
    rowSizes.push(has('header') ? getSize('header') : 'auto');
  }

  // Middle row (left, main, right)
  if (has('left') || has('main') || has('right')) {
    const midRow: string[] = [];

    if (has('left')) {
      midRow.push('left');
      if (columns.length === 0) columns.push('left');
    } else {
      midRow.push('.');
      if (columns.length === 0) columns.push('.');
    }

    if (has('main')) {
      midRow.push('main');
      if (columns.length <= 1) columns.push('main');
    } else {
      midRow.push('.');
      if (columns.length <= 1) columns.push('.');
    }

    if (has('right')) {
      midRow.push('right');
      if (columns.length <= 2) columns.push('right');
    } else {
      midRow.push('.');
      if (columns.length <= 2) columns.push('.');
    }

    rows.push(midRow.join(' '));
    rowSizes.push('1fr');
  }

  // Bottom row (footer or bottom corners)
  if (has('footer') || has('bottom-left') || has('bottom-right')) {
    const bottomRow: string[] = [];

    if (has('bottom-left')) {
      bottomRow.push('bottom-left');
    } else if (has('left')) {
      bottomRow.push('.');
    }

    if (has('footer')) {
      bottomRow.push('footer');
    } else {
      bottomRow.push('.');
    }

    if (has('bottom-right')) {
      bottomRow.push('bottom-right');
    } else if (has('right')) {
      bottomRow.push('.');
    }

    rows.push(bottomRow.join(' '));
    rowSizes.push(has('footer') ? getSize('footer') : 'auto');
  }

  // Column sizes
  if (has('left') || has('top-left') || has('bottom-left')) {
    columnSizes.push(getSize('left'));
  }
  columnSizes.push('1fr'); // main always gets 1fr
  if (has('right') || has('top-right') || has('bottom-right')) {
    columnSizes.push(getSize('right'));
  }

  // Generate grid-template-areas string
  const gridTemplateAreas = rows.map((row) => `"${row}"`).join('\n    ');

  return {
    gridTemplateAreas,
    gridTemplateColumns: columnSizes.join(' '),
    gridTemplateRows: rowSizes.join(' '),
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

    return generateGridTemplate(usedAreas, sizes);
  }, [children, layout, sizes]);
}
