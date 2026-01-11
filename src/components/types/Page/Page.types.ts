/**
 * Page Type Definitions (IDDL v5.0 Final)
 */

import type { ReactNode } from 'react';
import type { AsProp, Density, Intent, Prominence } from '../Shared.types';

/**
 * Page Role (Physics)
 * 페이지가 브라우저 뷰포트와 상호작용하는 물리적 방식을 정의합니다.
 */
export type PageRole =
  | 'Document' // [Default] 반응형 문서. Window Scroll. (Blog, News)
  | 'Application' // 웹 애플리케이션. 100vh 고정. Container Scroll. (Admin, Dashboard)
  | 'Focus' // 단일 행동 집중. Center 정렬. No Scroll/Nav. (Login, Payment)
  | 'Immersive' // 몰입형 경험. Scroll Snap. (Landing, Presentation)
  | 'Overlay' // 모달형 페이지. Dimmed Background. (Quick View)
  | 'Paper' // 인쇄/고정 규격. Fixed Aspect Ratio. (Invoice, Resume)
  | 'Fullscreen'; // Legacy alias for Application or Immersive

/**
 * Page Layout (Zoning)
 * Role 내부에서 콘텐츠를 배치할 Grid Template 전략입니다.
 */
export type PageLayout =
  | 'Single' // [Default] 1단 구조 (Header-Main-Footer)
  | 'Sidebar' // 2단: 좌측 네비게이션 주도 (Nav-Main)
  | 'Aside' // 2단: 우측 정보 보조 (Main-Aside)
  | 'HolyGrail' // 3단: 좌우 패널 (Nav-Main-Aside)
  | 'Mobile' // 앱형: 상단 헤더 + 하단 탭바 (Header-Main-Dock)
  | 'Split' // 분할: 50:50 또는 Master-Detail (Panel-Panel)
  | 'Studio'; // 복합: IDE 스타일 다중 패널

/**
 * Max Width (Constraint)
 */
export type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | 'none' | number;

/**
 * Page Props (IDDL v5.0)
 * Application Root Container
 */
export interface PageProps extends AsProp {
  /**
   * [Identity] 페이지의 유일한 식별자 (Browser Title, H1)
   * @required
   */
  title?: string;

  /**
   * [Meta] 페이지 설명 (Optional)
   * Document role 등에서 부제로 사용
   */
  description?: string;

  /**
   * [Physics] 페이지의 물리적 동작 방식
   * @default 'Document'
   */
  role?: PageRole;

  /**
   * [Zoning] 공간 분할 템플릿
   * @default 'Single'
   */
  layout?: PageLayout;

  /**
   * [Constraint] 콘텐츠 최대 너비
   * Valid only for 'Document' role
   */
  maxWidth?: MaxWidth;

  /**
   * [Constraint] 콘텐츠 중앙 정렬 여부
   * Valid only for 'Document' or 'Focus' role
   * @default false
   */
  centered?: boolean;

  // --- Design Tokens ---
  prominence?: Prominence;
  density?: Density;
  intent?: Intent;

  // --- State ---
  loading?: boolean;
  error?: string;

  /**
   * [Slot] Main Content Slot
   * <Section> 컴포넌트들만 허용됩니다.
   */
  children: ReactNode;

  // --- Events & Styling ---
  className?: string; // For data-driven visualization only
  onClick?: (e: React.MouseEvent) => void;
  condition?: string;

  // Deprecated props are typically removed in major versions (v5.0).
  // If strict migration, we assume backward compatibility is NOT maintained.
}
