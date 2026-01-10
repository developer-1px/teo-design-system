/**
 * Block Role Configuration (v4.1)
 *
 * Block role → 모든 특성 자동 결정
 * - htmlTag: 시맨틱 HTML 태그
 * - ariaProps: 접근성 속성
 * - baseStyles: 기본 Tailwind 클래스 (CVA에서 이동)
 * - renderer: 전용 렌더러 컴포넌트 (optional)
 *
 * **책임 분리**:
 * - Block.tsx: role-config 조회 → 설정 적용 → 렌더링
 * - role-config.ts: role → 모든 설정 중앙 관리
 * - role/*.tsx: 복잡한 렌더링 로직 (Toolbar, Accordion, SortableList 등)
 *
 * **Renderer vs Config-only**:
 * - Config-only: 단순 스타일/태그만 다른 role (Container, Form, Card 등)
 * - Renderer: 복잡한 상호작용 로직이 필요한 role (Toolbar, Accordion, Tabs 등)
 */

import type { ComponentType } from 'react';
import type { BlockRole, BlockProps } from '@/components/types/Atom/types';

// Renderers (현재 사용 중인 것들)
import { Toolbar } from './role/Toolbar';
import { Accordion } from './role/Accordion';
import { SortableList } from './role/SortableList';

/**
 * Block Renderer Props
 * 모든 Block renderer가 공통으로 받는 props
 */
export interface BlockRendererProps extends Omit<BlockProps, 'role'> {
  role: BlockRole;
  computedDensity: 'Compact' | 'Standard' | 'Comfortable';
  computedProminence: BlockProps['prominence'];
  computedIntent: BlockProps['intent'];
  Element: any; // HTML 태그 또는 커스텀 컴포넌트
}

/**
 * Role Configuration Interface
 */
export interface BlockRoleConfig {
  /** HTML 시맨틱 태그 */
  htmlTag: string;
  /** ARIA 접근성 속성 */
  ariaProps?: Record<string, string>;
  /** 기본 Tailwind 클래스 (CVA에서 이동) */
  baseStyles: string;
  /** 전용 렌더러 컴포넌트 (복잡한 로직이 필요한 경우) */
  renderer?: ComponentType<BlockRendererProps>;
  /** 설명 (개발자 참고용) */
  description?: string;
}

/**
 * Block Role Configuration (전역 - 모든 layout에서 동일)
 *
 * **조직 구조** (v4.1):
 * - Layout Containers: 레이아웃 컨테이너
 * - Data Display: 데이터 표시
 * - Forms: 입력 폼
 * - Action Blocks: 액션 그룹
 * - Navigation: 네비게이션
 */
export const ROLE_CONFIGS: Record<BlockRole, BlockRoleConfig> = {
  // ==================== Layout Containers ====================
  Container: {
    htmlTag: 'div',
    baseStyles: '',
    description: '일반 컨테이너 (기본값)',
  },

  Split: {
    htmlTag: 'div',
    baseStyles: 'grid grid-cols-2 gap-4',
    description: '분할 레이아웃 (Resizable)',
  },

  Inline: {
    htmlTag: 'div',
    baseStyles: 'flex items-center gap-2',
    description: '인라인 그룹 (가로 정렬)',
  },

  Spacer: {
    htmlTag: 'div',
    baseStyles: 'flex-1',
    description: '여백 (flex-1)',
  },

  // ==================== Data Display ====================
  List: {
    htmlTag: 'ul',
    ariaProps: { role: 'list' },
    baseStyles: 'flex flex-col gap-1 flex-1 overflow-y-auto',
    description: '항목 리스트',
  },

  SortableList: {
    htmlTag: 'div',
    ariaProps: { role: 'listbox', 'aria-label': 'Sortable list' },
    baseStyles: '',
    renderer: SortableList as ComponentType<BlockRendererProps>,
    description: '정렬 가능한 리스트 (Drag & Drop)',
  },

  Grid: {
    htmlTag: 'div',
    ariaProps: { role: 'grid' },
    baseStyles: 'grid gap-4',
    description: '그리드 레이아웃',
  },

  Table: {
    htmlTag: 'table',
    ariaProps: { role: 'table' },
    baseStyles: 'border border-default rounded-lg overflow-hidden',
    description: '테이블',
  },

  Card: {
    htmlTag: 'article',
    ariaProps: { role: 'article' },
    baseStyles: 'bg-surface-raised rounded-lg p-4',
    description: '카드 UI (시각적 요소 있음)',
  },

  Divider: {
    htmlTag: 'div',
    baseStyles: 'bg-border-default',
    description: '구분선 (수직/수평)',
  },

  ColorIndicator: {
    htmlTag: 'div',
    baseStyles: 'w-4 h-4 rounded',
    description: '색상 표시 박스',
  },

  PreviewContainer: {
    htmlTag: 'div',
    baseStyles: 'relative w-full h-full border-2 border-border-default rounded-lg p-4 bg-surface-sunken',
    description: '미리보기 컨테이너',
  },

  PreviewCard: {
    htmlTag: 'div',
    baseStyles: 'rounded-lg border-2 p-3 flex flex-col justify-center items-center',
    description: '미리보기 카드',
  },

  // ==================== Forms ====================
  Form: {
    htmlTag: 'form',
    ariaProps: { role: 'form' },
    baseStyles: 'space-y-4',
    description: '폼 컨테이너',
  },

  Fieldset: {
    htmlTag: 'fieldset',
    ariaProps: { role: 'group' },
    baseStyles: 'border border-default rounded-lg p-4 space-y-3',
    description: '필드 그룹',
  },

  // ==================== Action Blocks ====================
  Toolbar: {
    htmlTag: 'div',
    ariaProps: { role: 'toolbar' },
    baseStyles: 'flex items-center gap-2',
    renderer: Toolbar as ComponentType<BlockRendererProps>,
    description: '툴바/액션 모음',
  },

  FloatingToolbar: {
    htmlTag: 'div',
    ariaProps: { role: 'toolbar', 'aria-label': 'Floating toolbar' },
    baseStyles: 'flex items-center gap-1 bg-surface-overlay shadow-xl rounded-full px-2 py-1',
    description: '플로팅 툴바 (화면 위에 떠있는 액션 모음)',
  },

  // ==================== Navigation ====================
  Tabs: {
    htmlTag: 'div',
    ariaProps: { role: 'tablist' },
    baseStyles: 'flex flex-col',
    description: '탭 컨테이너',
  },

  Steps: {
    htmlTag: 'ol',
    ariaProps: { role: 'list', 'aria-label': 'Progress steps' },
    baseStyles: 'flex flex-col',
    description: '단계별 진행',
  },

  Accordion: {
    htmlTag: 'div',
    ariaProps: { role: 'region' },
    baseStyles: 'flex flex-col gap-2',
    renderer: Accordion as ComponentType<BlockRendererProps>,
    description: '아코디언 (펼침/접힘)',
  },

  Breadcrumbs: {
    htmlTag: 'nav',
    ariaProps: { 'aria-label': 'Breadcrumb' },
    baseStyles: 'flex items-center gap-1 text-sm text-text-subtle',
    description: '경로 탐색',
  },

  ScrollMenu: {
    htmlTag: 'nav',
    ariaProps: { role: 'navigation', 'aria-label': 'Scroll Menu' },
    baseStyles: 'flex flex-col overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border-default hover:scrollbar-thumb-border-strong',
    description: '스크롤 메뉴 (ScrollSpy)',
  },

  Navigator: {
    htmlTag: 'nav',
    ariaProps: { role: 'navigation', 'aria-label': 'Navigator' },
    baseStyles: 'flex flex-col items-center gap-2',
    description: '네비게이션바',
  },
};

/**
 * Get role configuration
 */
export function getRoleConfig(role: BlockRole): BlockRoleConfig {
  return ROLE_CONFIGS[role];
}

/**
 * Check if role has a dedicated renderer
 */
export function hasRenderer(role: BlockRole): boolean {
  return ROLE_CONFIGS[role]?.renderer !== undefined;
}
