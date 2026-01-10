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
import { useLayoutContext } from '@/components/context/IDDLContext.tsx';
import type { TextProps, TextRole } from '@/components/types/Element/Text/Text.types';
import type { Intent, Prominence } from '@/components/types/Shared.types';
import { cn } from '@/shared/lib/utils';

/**
 * Role에 따른 HTML 태그 매핑
 */
const getRoleElement = (role: TextRole, prominence?: string): keyof JSX.IntrinsicElements => {
  switch (role) {
    case 'Title':
      // Hierarchy based on Prominence
      if (prominence === 'Hero') return 'h1';
      if (prominence === 'Strong') return 'h2';
      if (prominence === 'Standard') return 'h3';
      return 'h4';
    case 'Body':
      return 'p';
    case 'Label':
      return 'span';
    case 'Caption':
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
 */
const textVariants = cva('', {
  variants: {
    role: {
      Title: 'font-semibold tracking-tight text-text scroll-m-20',
      Body: 'leading-7 text-text',
      Label: 'text-sm font-medium leading-none text-text',
      Caption: 'text-sm text-subtle',
      Code: 'relative rounded bg-surface-sunken px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-text',
    },
    // Prominence behaves differently based on Role
    prominence: {
      Hero: '',
      Strong: '',
      Standard: '',
      Subtle: '',
    },
    intent: {
      Neutral: '',
      Brand: 'text-accent',
      Positive: 'text-green-600',
      Caution: 'text-yellow-600',
      Critical: 'text-red-600',
      Info: 'text-blue-600',
    },
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    },
    density: {
      Compact: '',
      Standard: '',
      Comfortable: '',
    },
  },
  compoundVariants: [
    // --- Title Hierarchy ---
    { role: 'Title', prominence: 'Hero', class: 'text-4xl lg:text-5xl font-extrabold tracking-tight' },
    { role: 'Title', prominence: 'Strong', class: 'text-3xl font-semibold tracking-tight first:mt-0' }, // Section Header
    { role: 'Title', prominence: 'Standard', class: 'text-2xl font-semibold tracking-tight' }, // Card Header
    { role: 'Title', prominence: 'Subtle', class: 'text-xl font-semibold tracking-tight' }, // Subsection

    // --- Body Hierarchy ---
    { role: 'Body', prominence: 'Hero', class: 'text-xl text-text-muted' }, // Lead text
    { role: 'Body', prominence: 'Strong', class: 'text-lg font-medium' },
    { role: 'Body', prominence: 'Standard', class: 'text-base' },
    { role: 'Body', prominence: 'Subtle', class: 'text-sm text-subtle' }, // Muted body text
  ],
  defaultVariants: {
    prominence: 'Standard',
    intent: 'Neutral',
    density: 'Standard',
  },
});

export function Text({
  as,
  role,
  content,
  prominence,
  intent,
  align,
  className,
  hidden,
  highlight,
  ...rest
}: TextProps) {
  const ctx = useLayoutContext();

  const computedProminence = prominence ?? ctx.prominence ?? 'Standard';
  const computedIntent = intent ?? ctx.intent ?? 'Neutral';
  const computedDensity = ctx.density ?? 'Standard';

  if (hidden) return null;

  const defaultElement = getRoleElement(role, computedProminence);
  const Element: any = as || defaultElement;

  const renderContent = () => {
    if (!highlight || !content) return content;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = content.split(regex);
    if (parts.length === 1) return content;
    return parts.map((part, index) => {
      if (part.toLowerCase() === highlight.toLowerCase()) {
        return (
          <mark key={index} className="bg-accent/20 px-0.5 rounded text-accent">
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <Element
      className={cn(
        textVariants({
          role,
          prominence: computedProminence as any,
          intent: computedIntent as any,
          align,
          density: computedDensity as any,
        }),
        className
      )}
      data-dsl-component="text"
      data-role={role}
      {...rest}
    >
      {renderContent()}
    </Element>
  );
}
