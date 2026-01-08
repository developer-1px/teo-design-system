/**
 * DSL Style Mapping System
 *
 * prominence + purpose 조합으로 자동 스타일 결정
 * AI가 how를 고민하지 않고 why만 지정하면 됨
 */

import type { Prominence, Purpose, ItemAs } from './types';
import { cn } from '@/lib/utils';

/**
 * prominence별 기본 텍스트 스타일
 */
const prominenceTextStyles: Record<Prominence, string> = {
  1: 'text-base font-semibold text-text',        // Primary: 크고 굵게
  2: 'text-sm font-medium text-text-secondary',  // Secondary: 중간 크기
  3: 'text-xs font-normal text-text-tertiary',   // Tertiary: 작고 흐리게
};

/**
 * purpose별 스타일 (prominence와 조합)
 */
const purposeStyles: Record<Purpose, Record<Prominence, string>> = {
  // Navigation - 링크 스타일
  navigation: {
    1: 'text-base font-medium text-text hover:text-accent transition-colors',
    2: 'text-sm font-normal text-text-secondary hover:text-text transition-colors',
    3: 'text-xs font-normal text-text-tertiary hover:text-text-secondary transition-colors',
  },

  // Action - 버튼 스타일
  action: {
    1: 'px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 font-medium transition-colors',
    2: 'px-3 py-1.5 bg-transparent text-accent border border-accent rounded-md hover:bg-accent/5 font-normal transition-colors',
    3: 'px-2 py-1 bg-transparent text-text-secondary hover:bg-black/5 rounded-md font-normal transition-colors',
  },

  // Form - 입력 필드 스타일
  form: {
    1: 'px-3 py-2 bg-layer-1 text-text rounded-md border-0 focus:ring-2 focus:ring-accent',
    2: 'px-2 py-1.5 bg-layer-1 text-text-secondary rounded-md border-0 focus:ring-1 focus:ring-accent',
    3: 'px-2 py-1 bg-layer-1 text-text-tertiary rounded-sm border-0 focus:ring-1 focus:ring-accent',
  },

  // Content - 콘텐츠 텍스트 (기본 prominence 스타일 사용)
  content: {
    1: prominenceTextStyles[1],
    2: prominenceTextStyles[2],
    3: prominenceTextStyles[3],
  },

  // List - 리스트 아이템
  list: {
    1: 'py-2 text-sm font-medium text-text hover:bg-black/5 transition-colors rounded-md',
    2: 'py-1.5 text-sm font-normal text-text-secondary hover:bg-black/5 transition-colors rounded-md',
    3: 'py-1 text-xs font-normal text-text-tertiary hover:bg-black/5 transition-colors rounded-sm',
  },

  // Media - 이미지/비디오
  media: {
    1: 'rounded-lg w-full',
    2: 'rounded-md w-full',
    3: 'rounded-sm w-full',
  },

  // Status - 상태 표시 (badge 스타일)
  status: {
    1: 'px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium',
    2: 'px-2 py-0.5 bg-accent/10 text-accent rounded-full text-xs font-normal',
    3: 'px-1.5 py-0.5 bg-accent/5 text-accent rounded-full text-xs font-normal',
  },

  // Info - 정보 표시
  info: {
    1: 'px-4 py-3 bg-layer-2 rounded-lg text-sm text-text',
    2: 'px-3 py-2 bg-layer-2 rounded-md text-xs text-text-secondary',
    3: 'px-2 py-1 bg-layer-2 rounded-sm text-xs text-text-tertiary',
  },
};

/**
 * as(HTML 요소)에 따른 추가 스타일
 */
const asStyles: Partial<Record<ItemAs, string>> = {
  // Headings
  h1: 'text-3xl font-bold',
  h2: 'text-2xl font-bold',
  h3: 'text-xl font-semibold',
  h4: 'text-lg font-semibold',
  h5: 'text-base font-semibold',
  h6: 'text-sm font-semibold',

  // Interactive
  button: 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
  a: 'cursor-pointer no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',

  // Form
  input: 'w-full',
  textarea: 'w-full',
  select: 'w-full',

  // Media
  img: 'object-cover',
  video: 'object-cover',
};

/**
 * prominence + purpose + as 조합으로 스타일 자동 생성
 *
 * @param prominence - 주목도 레벨 (1-3)
 * @param purpose - 그룹의 목적
 * @param as - HTML 요소 타입
 * @param customClassName - 사용자 커스텀 클래스
 * @returns Tailwind CSS 클래스 문자열
 */
export function getStyleFromProminence(
  prominence: Prominence,
  purpose?: Purpose,
  as?: ItemAs,
  customClassName?: string
): string {
  // purpose가 있으면 purpose별 스타일 사용
  const baseStyle = purpose
    ? purposeStyles[purpose][prominence]
    : prominenceTextStyles[prominence];

  // as에 따른 추가 스타일
  const asStyle = as ? asStyles[as] : '';

  // 모든 스타일 결합
  return cn(baseStyle, asStyle, customClassName);
}

/**
 * Group 방향에 따른 스타일
 */
export function getGroupDirectionStyle(direction?: 'horizontal' | 'vertical'): string {
  if (!direction) return '';

  return direction === 'horizontal'
    ? 'flex flex-row items-center gap-2'
    : 'flex flex-col gap-2';
}
