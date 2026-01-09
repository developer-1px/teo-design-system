/**
 * Text - IDDL Primitive
 *
 * 데이터 바인딩이 없는 순수한 정적 콘텐츠
 * role에 따라 HTML 태그와 스타일이 자동 결정됨
 *
 * @see apps/docs/IDDL.spec.md Section 3.1.1
 */

import { cn } from '@/lib/utils';

export type TextRole = 'Title' | 'Body' | 'Label' | 'Caption' | 'Code';
export type Prominence = 'Hero' | 'Primary' | 'Secondary' | 'Tertiary';
export type Intent = 'Neutral' | 'Brand' | 'Positive' | 'Caution' | 'Critical' | 'Info';

export interface TextProps {
  role: TextRole;
  content: string;
  prominence?: Prominence;
  intent?: Intent;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

// role → HTML 태그 매핑
const roleToTag: Record<TextRole, string> = {
  Title: 'h2',  // 기본 h2, prominence에 따라 h1-h6 결정
  Body: 'p',
  Label: 'span',
  Caption: 'small',
  Code: 'code',
};

// prominence → Title heading level 매핑
const prominenceToHeadingLevel: Record<Prominence, string> = {
  Hero: 'h1',
  Primary: 'h2',
  Secondary: 'h3',
  Tertiary: 'h4',
};

// prominence → 폰트 크기/굵기 매핑
const prominenceStyles: Record<Prominence, string> = {
  Hero: 'text-4xl font-bold',
  Primary: 'text-xl font-semibold',
  Secondary: 'text-base font-medium',
  Tertiary: 'text-sm font-normal',
};

// intent → 색상 매핑
const intentStyles: Record<Intent, string> = {
  Neutral: 'text-text',
  Brand: 'text-accent',
  Positive: 'text-green-600',
  Caution: 'text-yellow-600',
  Critical: 'text-red-600',
  Info: 'text-blue-600',
};

export function Text({
  role,
  content,
  prominence = 'Primary',
  intent = 'Neutral',
  align = 'left',
  className,
}: TextProps) {
  // role과 prominence에 따라 HTML 태그 결정
  let tag = roleToTag[role];
  if (role === 'Title') {
    tag = prominenceToHeadingLevel[prominence];
  }

  const Component = tag as keyof JSX.IntrinsicElements;

  // 스타일 조합
  const computedClassName = cn(
    prominenceStyles[prominence],
    intentStyles[intent],
    align === 'center' && 'text-center',
    align === 'right' && 'text-right',
    role === 'Code' && 'bg-surface-sunken px-1.5 py-0.5 rounded font-mono',
    role === 'Label' && 'inline-block',
    role === 'Caption' && 'text-xs text-subtle',
    className
  );

  return (
    <Component
      className={computedClassName}
      data-iddl-node="text"
      data-role={role}
      data-prominence={prominence}
      data-intent={intent}
    >
      {content}
    </Component>
  );
}
