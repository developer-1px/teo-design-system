/**
 * Shared Type Definitions
 * IDDL (Intent-Driven UI DSL) Core Types
 */

import type { ComponentType, ElementType } from 'react';

/**
 * As Prop - 커스텀 컴포넌트 주입
 * 모든 IDDL 컴포넌트에서 사용 가능
 */
export type AsProp<T = any> = {
  as?: ElementType<T> | ComponentType<T>;
};

/**
 * Prominence - 주목도 레벨 (Visual Hierarchy)
 */
export type Prominence =
  | 'Hero' // (L1) 최상위: 화면 전체를 압도 (Full-width, Huge typography)
  | 'Strong' // (L2) 강조: 시선을 끄는 솔리드 컬러 (Filled Button, Primary CTA)
  | 'Standard' // (L3) 표준: 일반적인 UI 요소 (대부분의 버튼, 텍스트, 카드)
  | 'Subtle' // (L4) 미세: 배경에 녹아드는 요소 (Caption, Placeholder, Disabled)
  | 'Secondary' // Legacy alias
  | 'Tertiary' // Legacy alias
  | 'Elevated' // Legacy alias
  | 'None'; // Legacy alias (Full transparent/No prominence)

/**
 * Density - 정보 밀도 (Spatial Hierarchy)
 */
export type Density =
  | 'Comfortable' // 넓은 여백 (마케팅, 대시보드)
  | 'Standard' // 표준 여백 (문서, 일반 뷰)
  | 'Compact'; // 좁은 여백 (데이터 그리드, 전문가용)

/**
 * Intent - 의도/맥락 (Semantic Color)
 * v1.0.1: Success→Positive, Warning→Caution, Danger→Critical, Info 추가
 */
export type Intent =
  | 'Neutral' // 기본 (Gray/Black)
  | 'Brand' // 브랜드 강조 (Primary Color)
  | 'Accent' // Legacy alias (Brand/Highlight)
  | 'Positive' // 긍정/성공 (Green) - v1.0.0의 Success
  | 'Caution' // 주의/경고 (Yellow/Orange) - v1.0.0의 Warning
  | 'Critical' // 위험/파괴 (Red) - v1.0.0의 Danger
  | 'Info'; // 참고 정보 (Blue)

export interface LayoutContextValue {
  prominence?: Prominence;
  role?: string; // Generic role (Section or Block)
  density?: Density;
  intent?: Intent;
  depth: number;
  layout?: string; // v5.1: Page Layout name (e.g. "ide", "docs")
  pageRole?: string; // v6.3: Page Context (e.g. "Application", "Focus")
  mode?: 'view' | 'edit';
  type?: string; // v5.2: Section Type (Bar, Panel, etc.)
  scale?: any; // v5.2: Type Scale Tokens

  // v5.1 Section Design Context (Optional propagated properties)
  preferIconOnly?: boolean;
  truncateText?: boolean;
  tooltipRequired?: boolean;
  direction?: 'horizontal' | 'vertical' | 'none';
  sizeMode?: 'fixed' | 'narrow' | 'medium' | 'wide' | 'flexible' | 'readable' | 'auto';
}

/**
 * Role - UI 요소의 정체성 (What is it?)
 */
export type Role =
  // For Structure (Section/Block)
  | 'Container' // 일반 컨테이너
  | 'Navigator' // 네비게이션
  | 'Collection' // 리스트/그리드
  | 'Form' // 폼
  | 'Toolbar' // 툴바/액션 그룹
  // For Atom (Item)
  | 'Identity' // 제목/이름
  | 'Content' // 본문/설명
  | 'Control' // 버튼/입력
  | 'Status' // 상태 표시
  | 'Facet' // 메타정보/라벨
  | 'Separator' // 구분선
  // For Overlay
  | 'Dialog' // 모달
  | 'Drawer' // 사이드 패널
  | 'Toast' // 토스트 알림
  | 'Tooltip'; // 툴팁
