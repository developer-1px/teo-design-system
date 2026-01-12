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
import type { TextProps } from '@/components/dsl/Element/Text/Text.types';
import { useIDDLToken } from '@/shared/iddl/token-engine';
import { cn } from '@/shared/lib/utils';
import { getRoleConfig } from './configs/registry';
import { isComplexConfig } from './configs/types';

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
 */
function getHtmlTag(
  role: string,
  prominence: string,
  defaultTag: keyof React.JSX.IntrinsicElements,
  spec?: any
): keyof React.JSX.IntrinsicElements {
  if (role === 'Title') {
    if (prominence === 'Hero') return 'h1';
    if (prominence === 'Strong') return 'h2';
    if (prominence === 'Standard') return 'h3';
    return 'h4';
  }

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
  const blockCtx = useBlockLayoutContext();

  // Computed values
  const computedProminence = prominence ?? ctx.prominence ?? 'Standard';
  const computedIntent = intent ?? ctx.intent ?? 'Neutral';

  // ⚡️ Token Engine
  const tokens = useIDDLToken({
    role,
    sectionRole: blockCtx.sectionRole,
    prominence: computedProminence,
    intent: computedIntent,
    density: ctx.density,
    context: {
      ancestry: {
        space: blockCtx.space || ctx.space || 'surface',
      },
    },
  });

  if (hidden) return null;

  // 1. Get role configuration
  const config = getRoleConfig(role);

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
  const { htmlTag, baseStyles, ariaRole } = config;

  // Determine HTML tag
  const Element: any = as || getHtmlTag(role, computedProminence, htmlTag, spec);

  // Render content with highlighting
  const renderContent = () => {
    if (children) return children;
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
        // Token Engine Classes
        tokens.typography.size,
        tokens.typography.weight,
        tokens.typography.color,
        tokens.typography.fontFamily,
        tokens.typography.lineHeight,

        align && alignVariants({ align }),
        className
      )}
      data-dsl-component="text"
      data-role={role}
      data-prominence={computedProminence}
      data-intent={computedIntent}
      // Link role support
      href={role === 'Link' ? spec?.href : undefined}
      target={role === 'Link' ? spec?.target : undefined}
      rel={role === 'Link' && spec?.external ? 'noopener noreferrer' : spec?.rel}
      // Label role support
      htmlFor={role === 'Label' ? spec?.for : undefined}
      style={{
        ...rest.style,
      }}
      {...rest}
    >
      {renderContent()}
    </Element>
  );
}

export { getRegisteredRoles, getRoleConfig, registerTextRole } from './configs/registry';
export type { ComplexRoleConfig, RoleConfig, SimpleRoleConfig } from './configs/types';
