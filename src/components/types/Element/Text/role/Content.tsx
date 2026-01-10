/**
 * Content - 주목도 시스템 컴포넌트
 *
 * 핵심 원칙:
 * - 개발자는 prominence만 지정
 * - 부모 Layout의 depth와 자동 조합되어 스타일 결정
 * - 디자인 고민 없이 일관된 UI 구현 가능
 *
 * @example
 * ```tsx
 * <Layout depth={2}>
 *   <Content prominence="primary">가장 중요한 내용</Content>
 *   <Content prominence="secondary">보조 내용</Content>
 *   <Content prominence="tertiary">덜 중요한 내용</Content>
 * </Layout>
 * ```
 */

import { type CSSProperties, forwardRef, type HTMLAttributes } from 'react';
import { useProminence } from '@/components/context/ProminenceContext.tsx';
import {
  calculateProminenceStyles,
  type ProminenceLevel,
} from '@/shared/config/prominence-tokens';
import { cn } from '@/shared/lib/utils';

export interface ContentProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * 주목도 레벨
   * - primary: 가장 중요한 내용 (제목, 핵심 정보)
   * - secondary: 보조 내용 (설명, 부가 정보)
   * - tertiary: 덜 중요한 내용 (메타 정보, 추가 설명)
   */
  prominence?: ProminenceLevel;

  /**
   * HTML 요소 타입 (기본: div)
   */
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'aside' | 'main';
}

export const Content = forwardRef<HTMLDivElement, ContentProps>(
  (
    { className, prominence = 'secondary', as: Component = 'div', style, children, ...props },
    ref
  ) => {
    // 부모 Layout의 depth 가져오기
    const { depth } = useProminence();

    // depth × prominence 조합으로 스타일 자동 계산
    const styles = calculateProminenceStyles(depth, prominence);

    // CSS 변수로 적용 (Tailwind에서 사용 가능)
    const customStyle: CSSProperties = {
      ...style,
      // 텍스트 색상 투명도
      color: `rgb(var(--text-primary) / ${styles.textOpacity})`,
      // 폰트 weight
      fontWeight: styles.fontWeight,
      // 폰트 크기 배율
      fontSize: `calc(1em * ${styles.fontSizeScale})`,
      // 라인 높이
      lineHeight: styles.lineHeightScale,
      // 배경 강도 (depth에 따라 달라짐)
      ...(styles.backgroundIntensity > 0
        ? {
            backgroundColor: `rgba(0, 0, 0, ${styles.backgroundIntensity})`,
          }
        : {}),
      // 여백 배율 (CSS 변수로 제공, 자식이 참조 가능)
      ['--prominence-spacing-scale' as any]: styles.spacingScale,
    };

    return (
      <Component
        ref={ref as any}
        className={cn(
          // 기본 스타일
          'transition-all duration-200',
          className
        )}
        style={customStyle}
        data-prominence={prominence}
        data-prominence-depth={depth}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Content.displayName = 'Content';

/**
 * ContentGroup - 주목도별 컨텐츠를 그룹화하는 유틸리티 컴포넌트
 *
 * 같은 레벨의 Content들을 간격을 두고 배치
 *
 * @example
 * ```tsx
 * <Layout depth={2}>
 *   <ContentGroup>
 *     <Content prominence="primary">제목</Content>
 *     <Content prominence="secondary">설명</Content>
 *   </ContentGroup>
 * </Layout>
 * ```
 */
export interface ContentGroupProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * 내부 Content 간 간격 (px)
   */
  gap?: 4 | 8 | 12 | 16 | 24 | 32;

  /**
   * 방향
   */
  direction?: 'vertical' | 'horizontal';
}

export const ContentGroup = forwardRef<HTMLDivElement, ContentGroupProps>(
  ({ className, gap = 8, direction = 'vertical', children, ...props }, ref) => {
    const gapClass = `gap-${gap / 4}`; // Tailwind: gap-1 = 4px, gap-2 = 8px, ...
    const directionClass = direction === 'horizontal' ? 'flex-row' : 'flex-col';

    return (
      <div
        ref={ref}
        className={cn('flex', directionClass, gapClass, className)}
        data-content-group
        {...props}
      >
        {children}
      </div>
    );
  }
);

ContentGroup.displayName = 'ContentGroup';
