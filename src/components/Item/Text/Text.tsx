/**
 * Text - 정적 콘텐츠 (IDDL v1.0.1)
 *
 * 데이터 바인딩이 없는 순수한 정적 텍스트를 렌더링합니다.
 * role에 따라 제목, 본문, 라벨, 캡션, 코드로 구분됩니다.
 *
 * v1.0.1: CVA 적용
 * @see spec/iddl-spec-1.0.1.md#411-text-node
 */

import { cva } from 'class-variance-authority';
import { useLayoutContext } from '@/components/Unknown/context/IDDLContext.tsx';
import type { Intent, Prominence, TextProps, TextRole } from '@/components/Unknown/utils/types.ts';
import { cn } from '@/shared/lib/utils';

/**
 * Role에 따른 HTML 태그 매핑
 */
const getRoleElement = (role: TextRole, prominence?: string): keyof JSX.IntrinsicElements => {
  switch (role) {
    case 'Title':
      // Prominence에 따라 heading 레벨 결정
      if (prominence === 'Hero') return 'h1';
      if (prominence === 'Primary') return 'h2';
      if (prominence === 'Secondary') return 'h3';
      return 'h4';
    case 'Body':
      return 'p';
    case 'Label':
      return 'span';
    case 'Caption': // v1.0.1
      return 'small';
    case 'Code':
      return 'code';
    default:
      return 'span';
  }
};

/**
 * Text variants (CVA)
 * IDDL semantic properties를 variants로 정의
 * Per minimal-renderer-guide.md Section 1.3
 * v1.1.1: Density-aware typography 추가
 */
const textVariants = cva('', {
  variants: {
    // Role (semantic meaning)
    role: {
      Title: 'font-semibold',
      Body: 'font-normal',
      Label: 'text-sm font-medium',
      Caption: 'text-xs text-muted',
      Code: 'font-mono text-sm bg-surface-sunken px-1 py-0.5 rounded',
    },
    // Prominence (size/hierarchy) - per minimal-renderer-guide.md Section 1.3
    prominence: {
      Hero: 'text-3xl font-semibold', // text-3xl + font-semibold (30px) - 문서 제목
      Primary: 'text-sm font-medium', // text-sm + font-medium (14px) - Notion 스타일 헤더
      Secondary: 'text-sm font-normal', // text-sm + font-normal (14px)
      Tertiary: 'text-xs opacity-60', // text-xs + opacity 0.6 (12px)
    },
    // Intent (semantic color)
    intent: {
      Neutral: 'text-text',
      Brand: 'text-accent',
      Positive: 'text-success',
      Caution: 'text-warning',
      Critical: 'text-error',
      Info: 'text-info',
    },
    // Alignment
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    // Density (v1.1.1)
    density: {
      Compact: '',
      Standard: '',
      Comfortable: '',
    },
  },
  compoundVariants: [
    // Title role + density (v1.1.1)
    { role: 'Title', prominence: 'Hero', density: 'Compact', class: '!text-xl' },
    { role: 'Title', prominence: 'Hero', density: 'Comfortable', class: '!text-4xl' },
    { role: 'Title', prominence: 'Primary', density: 'Compact', class: '!text-sm' },
    { role: 'Title', prominence: 'Primary', density: 'Comfortable', class: '!text-base' },
    { role: 'Title', prominence: 'Secondary', density: 'Compact', class: '!text-xs' },
    { role: 'Title', prominence: 'Secondary', density: 'Comfortable', class: '!text-sm' },

    // Body role + density (v1.1.1)
    { role: 'Body', density: 'Compact', class: '!text-xs' },
    { role: 'Body', density: 'Comfortable', class: '!text-base' },

    // Label role + density (v1.1.1)
    { role: 'Label', density: 'Compact', class: '!text-xs' },
    { role: 'Label', density: 'Comfortable', class: '!text-sm' },

    // Caption role + density (v1.1.1)
    { role: 'Caption', density: 'Compact', class: '!text-[10px]' },
    { role: 'Caption', density: 'Comfortable', class: '!text-xs' },

    // Code role + density (v1.1.1)
    { role: 'Code', density: 'Compact', class: '!text-xs !px-0.5 !py-0' },
    { role: 'Code', density: 'Comfortable', class: '!text-sm !px-1.5 !py-1' },
  ],
  defaultVariants: {
    prominence: 'Primary',
    intent: 'Neutral',
    density: 'Standard',
  },
});

export function Text({ role, content, prominence, intent, align, className, hidden }: TextProps) {
  const ctx = useLayoutContext();

  // 부모 컨텍스트에서 상속
  const computedProminence = prominence ?? ctx.prominence ?? 'Primary';
  const computedIntent = intent ?? ctx.intent ?? 'Neutral';
  const computedDensity = ctx.density ?? 'Standard'; // v1.1.1

  if (hidden) return null;

  // HTML 요소 결정
  const Element = getRoleElement(role, computedProminence);

  return (
    <Element
      className={textVariants({
        role,
        prominence: computedProminence as Prominence,
        intent: computedIntent as Intent,
        align,
        density: computedDensity as 'Compact' | 'Standard' | 'Comfortable', // v1.1.1
        className,
      })}
      data-dsl-component="text"
      data-role={role}
      data-prominence={computedProminence}
      data-density={computedDensity}
    >
      {content}
    </Element>
  );
}
