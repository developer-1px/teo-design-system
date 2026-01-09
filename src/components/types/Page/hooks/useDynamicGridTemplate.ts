/**
 * useDynamicGridTemplate - 동적 Grid Template 계산 Hook (v4.1)
 *
 * Children에서 role prop을 분석하여 자동으로 grid-template-areas를 생성합니다.
 * Holy Grail + IntelliJ 스타일 하이브리드 레이아웃 지원
 *
 * v4.1: role-config.ts 중앙 설정 사용 (role → gridArea 매핑 제거)
 *
 * @example
 * const { gridTemplateAreas, gridTemplateColumns, gridTemplateRows } =
 *   useDynamicGridTemplate(children, template, sizes);
 */

import { type ReactNode, useMemo } from 'react';
import type { PresentationGridArea } from '@/components/types/Atom/types';
import { getRoleConfig } from '@/components/types/Section/role-config';

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
  activitybar?: string;
  sidebar?: string;
  editor?: string;
  panel?: string;
  rightbar?: string;
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
 * Children에서 사용된 role 추출 및 gridArea 변환 (v4.1)
 */
function extractUsedAreas(children: ReactNode, template?: string): Set<string> {
  const areas = new Set<string>();

  const traverse = (node: ReactNode) => {
    if (!node) return;

    if (Array.isArray(node)) {
      node.forEach(traverse);
      return;
    }

    if (typeof node === 'object' && 'props' in node) {
      const props = (node as any).props;

      // v4.1: role 기반 gridArea 자동 계산 (role-config 사용)
      if (props?.role) {
        const config = getRoleConfig(props.role, template);
        areas.add(config.gridArea);
      }
      // Backward compatibility: 명시적 gridArea prop도 지원
      else if (props?.gridArea) {
        areas.add(props.gridArea);
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
    activitybar: '48px',
    sidebar: '250px',
    editor: '1fr',
    panel: '300px',
    rightbar: '48px',
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

  // Special case: Studio template (단일 행 IDE 레이아웃)
  if (has('activitybar') || has('sidebar') || has('editor') || has('panel') || has('rightbar')) {
    const studioRow: string[] = [];
    const studioColumns: string[] = [];

    if (has('activitybar')) {
      studioRow.push('activitybar');
      studioColumns.push(getSize('activitybar'));
    }
    if (has('sidebar')) {
      studioRow.push('sidebar');
      studioColumns.push(getSize('sidebar'));
    }
    if (has('editor')) {
      studioRow.push('editor');
      studioColumns.push(getSize('editor'));
    }
    if (has('panel')) {
      studioRow.push('panel');
      studioColumns.push(getSize('panel'));
    }
    if (has('rightbar')) {
      studioRow.push('rightbar');
      studioColumns.push(getSize('rightbar'));
    }

    rows.push(studioRow.join(' '));
    rowSizes.push('1fr');

    return {
      gridTemplateAreas: `"${studioRow.join(' ')}"`,
      gridTemplateColumns: studioColumns.join(' '),
      gridTemplateRows: '1fr',
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
 * Main hook (v4.1: template-aware)
 */
export function useDynamicGridTemplate(
  children: ReactNode,
  template?: string,
  sizes: GridSizes = {}
): DynamicGridTemplate {
  return useMemo(() => {
    const usedAreas = extractUsedAreas(children, template);

    // If no areas specified, use default 3-column layout
    if (usedAreas.size === 0) {
      return {
        gridTemplateAreas: '"main"',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr',
      };
    }

    return generateGridTemplate(usedAreas, sizes);
  }, [children, template, sizes]);
}
