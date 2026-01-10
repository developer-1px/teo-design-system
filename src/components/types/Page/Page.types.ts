/**
 * Page Type Definitions
 */

import { ReactNode } from 'react';
import type { AsProp, Density, Intent, Prominence } from '../Shared.types';

/**
 * Page Role - 페이지 물리법칙 (스크롤과 뷰포트의 행동 법칙)
 * v5.0: "이 페이지는 어떻게 움직이는가?"
 * - 'Application': 전체 화면, 스크롤 없음 (w-screen h-screen overflow-hidden)
 * - 'Document': 스크롤 가능한 문서 페이지 (min-height: 100vh, 브라우저 스크롤)
 * - 'Focus': 중앙 집중형 (로그인, 결제 등, 화면 정중앙에 배치)
 * - 'Fullscreen': 전체화면 고정 (프레젠테이션, 키오스크, 스크롤 불가)
 */
export type PageRole = 'Application' | 'Document' | 'Focus' | 'Fullscreen';

/**
 * Page Layout - 공간 분할 패턴 (Section들의 지정석)
 * v5.0: GridTemplate을 대체, "공간을 어떻게 나누었는가?"
 * - 'Single': Header + Container + Footer (1단 기본형)
 * - 'Sidebar': Navigator(좌) + Container(우) (2단 좌측 메뉴형)
 * - 'Aside': Container(좌) + Aside(우) (2단 우측 정보형)
 * - 'HolyGrail': Header + Navigator + Container + Aside + Footer (3단 완전체)
 * - 'Split': PanelLeft + PanelRight (5:5 분할형, master-detail)
 * - 'Studio': ActivityBar + PrimarySidebar + Editor + Panel + SecondarySidebar (IDE 전용)
 * - 'Blank': 빈 캔버스 (dialog, custom)
 */
export type PageLayout = 'Single' | 'Sidebar' | 'Aside' | 'HolyGrail' | 'Split' | 'Studio' | 'Blank';

/**
 * Max Width - 페이지 최대 너비
 * v2.0 추가
 */
export type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'none' | number;

/**
 * Navigation Config - 네비게이션 구성
 * v2.0 추가
 */
export interface NavigationConfig {
    header?: {
        show: boolean;
    };
}

/**
 * Breadcrumb
 * v1.0.1 추가
 */
export interface Breadcrumb {
    label: string;
    to?: string;
    icon?: string;
}

/**
 * Page Props (v5.0) - Application Root Container
 * v1.0.1: title, description, layout, breadcrumbs, condition 추가
 * v2.0: role, prominence, density, intent, maxWidth, centered, navigation, scrollable, loading, error 추가
 * v3.0: main 태그 제거, layout 단순화 (flex/grid만 지원)
 * v3.1: as prop 추가 (커스텀 컴포넌트 주입)
 * v4.0: role 추가 (Content vs App)
 * v5.0: role 값 확장 (Application/Document/Focus/Fullscreen), template→layout 통합, direction 제거
 */
export interface PageProps extends AsProp {
    // Role (v5.0) - "이 페이지는 어떻게 움직이는가?" (스크롤 물리법칙)
    role?: PageRole; // 'Application' | 'Document' (default) | 'Focus' | 'Fullscreen'

    // Layout (v5.0) - "공간을 어떻게 나누었는가?" (Section 배치)
    layout?: PageLayout; // 'Single' | 'Sidebar' | 'Aside' | 'HolyGrail' | 'Split' | 'Studio' | 'Blank'
    gap?: number; // v3.0: spacing between sections
    sizes?: Record<string, string>; // v5.0: grid area sizes for resizing

    // Constraints (v3.0)
    maxWidth?: MaxWidth; // v2.0: 컨텐츠 최대 너비 (Document role만 적용)
    centered?: boolean; // v2.0: 컨텐츠 중앙 정렬 여부 (Document/Focus role만 적용)

    // Meta (optional)
    title?: string; // v1.0.1
    description?: string; // v1.0.1
    breadcrumbs?: Breadcrumb[]; // v1.0.1

    // Design Tokens (v2.0: IDDL 일관성)
    prominence?: Prominence; // v2.0: Hero/Standard/Strong/Subtle
    density?: Density; // v2.0: Comfortable/Standard/Compact (자식에게 전파)
    intent?: Intent; // v2.0: Neutral/Brand/Positive/Caution/Critical/Info

    // State & Behavior (v2.0)
    loading?: boolean; // v2.0: 로딩 상태
    error?: string; // v2.0: 에러 메시지

    // React Integration
    children: ReactNode;
    /**
     * EXCEPTION: className은 데이터 시각화를 위한 동적 스타일링에만 허용
     * 예: 색상 인디케이터, 차트 색상, 데이터 기반 배경색
     * 정적 스타일은 반드시 role을 통해 정의해야 함
     */
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
    condition?: string; // v1.0.1: 조건부 렌더링

    // Deprecated props (v5.0) - 하위 호환성을 위해 유지
    /** @deprecated Use `layout` instead of `template` */
    // Deprecated props (v5.0) - 하위 호환성을 위해 유지
    /** @deprecated direction is now determined by `role` and `layout` props */
    direction?: 'row' | 'column';
}
