/**
 * IDDL Inspector - Filter State Management
 *
 * 필터 레벨 상태 관리:
 * Page → Section → Group → Atom → All → Page (순환)
 */

export enum FilterLevel {
  Page = 'Page',
  Section = 'Section',
  Group = 'Group',
  Atom = 'Atom',
  All = 'All',
}

interface FilterConfig {
  level: FilterLevel;
  color: string;
  label: string;
  description: string;
}

const FILTER_CONFIGS: Record<FilterLevel, FilterConfig> = {
  [FilterLevel.Page]: {
    level: FilterLevel.Page,
    color: '#a855f7',
    label: 'Page',
    description: '최상위 Page 컴포넌트',
  },
  [FilterLevel.Section]: {
    level: FilterLevel.Section,
    color: '#3b82f6',
    label: 'Section',
    description: 'Section 레이아웃 영역',
  },
  [FilterLevel.Group]: {
    level: FilterLevel.Group,
    color: '#10b981',
    label: 'Group',
    description: 'Group 논리적 그룹',
  },
  [FilterLevel.Atom]: {
    level: FilterLevel.Atom,
    color: '#f59e0b',
    label: 'Atom',
    description: 'Atom (Field, Action, Text)',
  },
  [FilterLevel.All]: {
    level: FilterLevel.All,
    color: '#6b7280',
    label: 'All',
    description: '모든 IDDL 컴포넌트',
  },
};

const FILTER_CYCLE: FilterLevel[] = [
  FilterLevel.Page,
  FilterLevel.Section,
  FilterLevel.Group,
  FilterLevel.Atom,
  FilterLevel.All,
];

let currentFilterLevel: FilterLevel = FilterLevel.All;

/**
 * 다음 필터 레벨로 순환
 */
export function cycleFilterLevel(): FilterLevel {
  const currentIndex = FILTER_CYCLE.indexOf(currentFilterLevel);
  const nextIndex = (currentIndex + 1) % FILTER_CYCLE.length;
  currentFilterLevel = FILTER_CYCLE[nextIndex];
  return currentFilterLevel;
}

/**
 * 현재 필터 레벨 반환
 */
export function getCurrentFilterLevel(): FilterLevel {
  return currentFilterLevel;
}

/**
 * 필터 레벨 설정
 */
export function setFilterLevel(level: FilterLevel): void {
  currentFilterLevel = level;
}

/**
 * 필터 레벨의 색상 반환
 */
export function getFilterColor(level?: FilterLevel): string {
  return FILTER_CONFIGS[level || currentFilterLevel].color;
}

/**
 * 필터 레벨의 라벨 반환
 */
export function getFilterLabel(level?: FilterLevel): string {
  return FILTER_CONFIGS[level || currentFilterLevel].label;
}

/**
 * 필터 레벨의 설명 반환
 */
export function getFilterDescription(level?: FilterLevel): string {
  return FILTER_CONFIGS[level || currentFilterLevel].description;
}

/**
 * 필터 설정 반환
 */
export function getFilterConfig(level?: FilterLevel): FilterConfig {
  return FILTER_CONFIGS[level || currentFilterLevel];
}

/**
 * 모든 필터 레벨 반환
 */
export function getAllFilterLevels(): FilterLevel[] {
  return [...FILTER_CYCLE];
}
