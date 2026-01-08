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
 * 실제 앱 수준의 타이포그래피 적용
 */
const prominenceTextStyles: Record<Prominence, string> = {
  1: 'text-sm font-semibold text-text leading-relaxed',           // Primary: 선명하고 강조
  2: 'text-sm font-medium text-text-secondary leading-normal',    // Secondary: 중간 강조
  3: 'text-xs font-normal text-text-tertiary leading-tight',      // Tertiary: 미묘한 정보
};

/**
 * purpose별 스타일 (prominence와 조합)
 */
const purposeStyles: Record<Purpose, Record<Prominence, string>> = {
  // Navigation - 세련된 네비게이션 링크
  navigation: {
    1: 'px-3 py-2 text-sm font-semibold text-text hover:text-accent hover:bg-black/5 active:bg-black/10 rounded-md transition-all cursor-pointer',
    2: 'px-2 py-1.5 text-sm font-medium text-text-secondary hover:text-text hover:bg-black/5 active:bg-black/10 rounded-md transition-all cursor-pointer',
    3: 'px-2 py-1 text-xs font-normal text-text-tertiary hover:text-text-secondary hover:bg-black/5 rounded-md transition-all cursor-pointer',
  },

  // Action - 프로덕션 수준 버튼
  action: {
    1: 'inline-flex items-center justify-center px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 active:bg-accent/80 font-semibold text-sm shadow-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
    2: 'inline-flex items-center justify-center px-3 py-1.5 bg-transparent text-text border border-border rounded-md hover:bg-black/5 active:bg-black/10 font-medium text-sm transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
    3: 'inline-flex items-center justify-center px-2 py-1 bg-transparent text-text-secondary hover:bg-black/5 active:bg-black/10 rounded-md font-normal text-xs transition-all cursor-pointer',
  },

  // Form - 모던한 입력 필드
  form: {
    1: 'w-full px-3 py-2 bg-layer-1 text-text text-sm rounded-md border-0 shadow-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent focus:bg-layer-2 transition-all',
    2: 'w-full px-3 py-1.5 bg-layer-1 text-text-secondary text-sm rounded-md border-0 placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent focus:bg-layer-2 transition-all',
    3: 'w-full px-2 py-1 bg-layer-1 text-text-tertiary text-xs rounded-sm border-0 placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent transition-all',
  },

  // Content - 명확한 콘텐츠 계층
  content: {
    1: 'text-sm font-semibold text-text leading-relaxed',
    2: 'text-sm font-medium text-text-secondary leading-normal',
    3: 'text-xs font-normal text-text-tertiary leading-tight',
  },

  // List - 인터랙티브 리스트 아이템
  list: {
    1: 'px-3 py-2 text-sm font-semibold text-text hover:bg-black/5 active:bg-black/10 rounded-md transition-colors cursor-pointer',
    2: 'px-2 py-1.5 text-sm font-medium text-text-secondary hover:bg-black/5 active:bg-black/10 rounded-md transition-colors cursor-pointer',
    3: 'px-2 py-1 text-xs font-normal text-text-tertiary hover:bg-black/5 rounded-sm transition-colors cursor-pointer',
  },

  // Media - 미디어 요소
  media: {
    1: 'rounded-lg w-full shadow-md object-cover',
    2: 'rounded-md w-full object-cover',
    3: 'rounded-sm w-full object-cover opacity-80',
  },

  // Status - 세련된 배지/상태 표시
  status: {
    1: 'inline-flex items-center px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-semibold border border-accent/20',
    2: 'inline-flex items-center px-2.5 py-0.5 bg-accent/8 text-accent rounded-full text-xs font-medium',
    3: 'inline-flex items-center px-2 py-0.5 bg-accent/5 text-accent/80 rounded-full text-xs font-normal',
  },

  // Info - 정보 박스/카드
  info: {
    1: 'px-4 py-3 bg-layer-2 rounded-lg text-sm text-text shadow-sm border border-border',
    2: 'px-3 py-2 bg-layer-2 rounded-md text-xs text-text-secondary',
    3: 'px-2 py-1 bg-layer-1 rounded-sm text-xs text-text-tertiary',
  },
};

/**
 * as(HTML 요소)에 따른 추가 스타일
 */
const asStyles: Partial<Record<ItemAs, string>> = {
  // Headings - 명확한 타이포그래피 계층
  h1: 'text-3xl font-bold text-text tracking-tight',
  h2: 'text-2xl font-bold text-text tracking-tight',
  h3: 'text-xl font-semibold text-text',
  h4: 'text-lg font-semibold text-text',
  h5: 'text-base font-semibold text-text',
  h6: 'text-sm font-semibold text-text',

  // Text elements
  p: 'leading-relaxed',
  span: 'inline-block',
  small: 'text-xs',
  strong: 'font-semibold',
  em: 'italic',

  // Interactive - 접근성 강화
  button: 'cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none',
  a: 'cursor-pointer no-underline hover:underline focus-visible:outline-none',
  label: 'cursor-pointer select-none',

  // Form - 일관된 폼 스타일
  input: 'w-full',
  textarea: 'w-full resize-vertical',
  select: 'w-full cursor-pointer',

  // Media - 반응형 미디어
  img: 'max-w-full h-auto object-cover',
  video: 'max-w-full h-auto object-cover',
  figure: 'inline-block',

  // List
  ul: 'list-none',
  ol: 'list-decimal list-inside',
  li: 'leading-relaxed',
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
 * 실제 앱처럼 보이도록 간격 조정
 */
export function getGroupDirectionStyle(direction?: 'horizontal' | 'vertical'): string {
  if (!direction) return 'flex flex-col gap-2';

  return direction === 'horizontal'
    ? 'flex flex-row items-center gap-3'
    : 'flex flex-col gap-2';
}
