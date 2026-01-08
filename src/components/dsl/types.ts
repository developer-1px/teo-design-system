/**
 * DSL Type Definitions
 *
 * TSX 기반 DSL의 모든 타입 정의
 * AI가 생성하기 좋은 명확한 구조
 */

import { ReactNode, ComponentPropsWithoutRef } from 'react';

/**
 * Prominence - 주목도 레벨 (1: 가장 중요, 3: 덜 중요)
 */
export type Prominence = 1 | 2 | 3;

/**
 * RegionRole - 페이지 영역의 역할
 */
export type RegionRole = 'header' | 'main' | 'sidebar' | 'footer' | 'aside';

/**
 * Purpose - 그룹의 목적 (Why it exists)
 */
export type Purpose =
  | 'navigation'  // 네비게이션 링크
  | 'action'      // 액션 버튼
  | 'form'        // 폼 입력
  | 'content'     // 콘텐츠 텍스트
  | 'list'        // 리스트 아이템
  | 'media'       // 이미지/비디오
  | 'status'      // 상태 표시
  | 'info';       // 정보 표시

/**
 * ItemAs - Item이 렌더링할 수 있는 HTML 요소
 */
export type ItemAs =
  // Headings
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  // Text
  | 'p' | 'span' | 'small' | 'strong' | 'em'
  // Interactive
  | 'button' | 'a' | 'label'
  // Form
  | 'input' | 'textarea' | 'select'
  // Media
  | 'img' | 'figure' | 'video'
  // List
  | 'ul' | 'ol' | 'li'
  // Generic
  | 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'nav';

/**
 * Page Props
 */
export interface PageProps {
  children: ReactNode;
  className?: string;
}

/**
 * Region Props
 */
export interface RegionProps {
  role: RegionRole;
  children: ReactNode;
  className?: string;
}

/**
 * Section Props
 */
export interface SectionProps {
  prominence?: Prominence;
  children: ReactNode;
  className?: string;
  id?: string;
}

/**
 * Group Props
 */
export interface GroupProps {
  purpose: Purpose;
  prominence?: Prominence;
  children: ReactNode;
  className?: string;
  /**
   * Group 방향 (purpose가 list나 navigation일 때 유용)
   */
  direction?: 'horizontal' | 'vertical';
}

/**
 * Item Props - as에 따라 동적 props
 */
export type ItemProps<T extends ItemAs = 'div'> = {
  as: T;
  prominence?: Prominence;
  children?: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'className'>;

/**
 * Layout Context Value
 */
export interface LayoutContextValue {
  prominence: Prominence;
  purpose?: Purpose;
  depth: number;
}
