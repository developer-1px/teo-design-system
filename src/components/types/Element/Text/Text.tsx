/**
 * Text - 정적 콘텐츠
 *
 * 데이터 바인딩이 없는 순수한 정적 텍스트를 렌더링합니다.
 * Registry pattern으로 확장 가능한 role 시스템 지원
 *
 * @see docs/2-areas/spec/4-element/text/text.spec.md
 */

import { cva } from 'class-variance-authority';
import type React from 'react';
import { useBlockLayoutContext, useLayoutContext } from '@/components/context/IDDLContext.tsx';
import type { TextProps } from '@/components/types/Element/Text/Text.types';
import { cn } from '@/shared/lib/utils';
import { getRoleConfig } from './configs/registry';
import { isComplexConfig } from './configs/types';

/**
 * Intent-based color variants
 */
const intentVariants = cva('', {
  variants: {
    intent: {
      Neutral: '',
      Brand: 'text-accent',
      Positive: 'text-green-600',
      Caution: 'text-yellow-600',
      Critical: 'text-red-600',
      Info: 'text-blue-600',
    },
  },
  defaultVariants: {
    intent: 'Neutral',
  },
});

/**
 * Alignment variants
 */
const alignVariants = cva('', {
  variants: {
    align: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
  },
});

/**
 * Get HTML tag based on role and prominence
 * (특별 처리가 필요한 경우만)
 */
function getHtmlTag(
  role: string,
  prominence: string,
  defaultTag: keyof React.JSX.IntrinsicElements,
  spec?: any
): keyof React.JSX.IntrinsicElements {
  // Title: prominence에 따라 h1-h4
  if (role === 'Title') {
    if (prominence === 'Hero') return 'h1';
    if (prominence === 'Strong') return 'h2';
    if (prominence === 'Standard') return 'h3';
    return 'h4';
  }

  // Heading: spec.level로 h1-h6 선택
  if (role === 'Heading' && spec?.level) {
    return `h${spec.level}` as any;
  }

  return defaultTag;
}

/**
 * Text Component
 */
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
  spec,
  children,
  ...rest
}: TextProps) {
  const ctx = useLayoutContext();
  const blockCtx = useBlockLayoutContext(); // v5.1: sectionRole 참조

  // Computed values (context 상속)
  const computedProminence = prominence ?? ctx.prominence ?? 'Standard';
  const computedIntent = intent ?? ctx.intent ?? 'Neutral';

  if (hidden) return null;

  // 1. Get role configuration
  const config = getRoleConfig(role);

  // v5.1: Panel/Sidebar 스타일링 (Label role에만 적용)
  const isPanelContext =
    blockCtx.sectionRole &&
    ['PrimarySidebar', 'SecondarySidebar', 'Panel', 'Aside'].includes(blockCtx.sectionRole);
  const isPanelLabel = role === 'Label' && isPanelContext;

  // 2. Complex role → Use custom renderer
  if (isComplexConfig(config)) {
    const Renderer = config.renderer;
    return (
      <Renderer
        role={role}
        content={content}
        prominence={computedProminence}
        intent={computedIntent}
        align={align}
        spec={spec}
        className={className}
        {...rest}
      >
        {children}
      </Renderer>
    );
  }

  // 3. Simple role → Direct rendering
  const { htmlTag, baseStyles, prominence: prominenceStyles, ariaRole } = config;

  // Determine HTML tag
  const Element: any = as || getHtmlTag(role, computedProminence, htmlTag, spec);

  // v5.2: Adaptive Scaling
  // If scale context exists, we override the class-based sizing with precise pixels from tokens
  const enableAdaptiveScaling =
    ctx.scale && ['Hero', 'Standard', 'Subtle'].includes(computedProminence);

  const adaptiveStyle: React.CSSProperties = enableAdaptiveScaling
    ? {
        fontSize: ctx.scale?.text[computedProminence as 'Hero' | 'Standard' | 'Subtle'],
        lineHeight: '1.5', // consistent line height
      }
    : {};

  // Get prominence-specific styles
  // If adaptive scaling is on, we might want to disable some class-based sizing to avoid conflict,
  // but usually inline style wins. However, let's keep the classes for weight/color.
  const prominenceClass =
    prominenceStyles?.[computedProminence as keyof typeof prominenceStyles] || '';

  // Render content with highlighting
  const renderContent = () => {
    // Prefer children if present
    if (children) return children;

    // Highlight support
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
      role={ariaRole}
      className={cn(
        baseStyles,
        prominenceClass,
        intentVariants({ intent: computedIntent as any }),
        align && alignVariants({ align }),
        // v5.1: Panel Label 자동 스타일링
        isPanelLabel && 'text-xs font-semibold uppercase tracking-wide text-text-subtle mb-3 block',
        className
      )}
      data-dsl-component="text"
      data-role={role}
      data-prominence={computedProminence}
      data-intent={computedIntent}
      // Link role: href from spec
      href={role === 'Link' ? spec?.href : undefined}
      target={role === 'Link' ? spec?.target : undefined}
      rel={role === 'Link' && spec?.external ? 'noopener noreferrer' : spec?.rel}
      // Label role: for attribute
      htmlFor={role === 'Label' ? spec?.for : undefined}
      style={{
        ...adaptiveStyle,
        ...rest.style,
      }}
      {...rest}
    >
      {renderContent()}
    </Element>
  );
}

/**
 * Re-export registry utilities for custom role registration
 */
export { getRegisteredRoles, getRoleConfig, registerTextRole } from './configs/registry';
export type { ComplexRoleConfig, RoleConfig, SimpleRoleConfig } from './configs/types';
