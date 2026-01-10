/**
 * Section Type Definitions
 */

import { ReactNode } from 'react';
import type { AsProp, Density, Intent, Prominence } from '../Shared.types';
import type { PageLayout } from '../Page/Page.types';

/**
 * Section Role - 섹션의 배치 역할 (Template-aware v4.0)
 * v1.0.1: Aside 추가
 * v1.1.0: IDE/Studio 레이아웃 전용 role 추가
 * v4.0: Template별로 그룹화, Page template의 named slot 역할
 *
 * **Section vs Block**:
 * - Section: 시각적 영역 (배경, 보더, 패딩 있음) - Figma Section과 동일
 * - Block: 투명 레이아웃 컨테이너 (시각적 요소 없음) - Figma Block과 동일
 *
 * **Template-aware**:
 * - Section role은 Page template에 종속됨
 * - 각 template은 특정 Section role 세트를 정의
 * - 잘못된 조합 시 경고 (예: template="studio"인데 role="Master" 사용)
 */
export type SectionRole =
    // Universal (모든 template에서 사용 가능)
    | 'Header' // 페이지 상단 (<header>)
    | 'Footer' // 페이지 하단 (<footer>)
    | 'Main' // 메인 콘텐츠 영역 (<main>)
    | 'Container' // 일반 컨테이너 (<section>)
    // Web Standard (Content Page - template="sidebar-content")
    | 'Navigator' // 네비게이션 (<nav>)
    | 'Aside' // 보조 사이드바 (<aside>)
    | 'Search' // 검색 영역
    | 'Region' // 명명된 영역
    // IDE/Studio (template="studio")
    | 'Toolbar' // 툴바 (<div>)
    | 'ActivityBar' // 액티비티 바 (아이콘 세로 바)
    | 'PrimarySidebar' // 주 사이드바 (파일 트리 등)
    | 'SecondarySidebar' // 보조 사이드바 (아웃라인 등)
    | 'Editor' // 에디터 영역
    | 'Panel' // 하단 패널 (터미널, 콘솔 등)
    | 'UtilityBar' // 보조 패널 (속성, AI 등)
    // Master-Detail (template="master-detail")
    | 'Master' // 마스터 리스트
    | 'Detail' // 디테일 뷰
    // Dialog (template="dialog")
    | 'DialogHeader' // 다이얼로그 헤더
    | 'DialogContent' // 다이얼로그 콘텐츠
    | 'DialogFooter' // 다이얼로그 푸터
    // Deprecated
    | 'SplitContainer'; // @deprecated Use Main with layout="flex"

/**
 * Layout별 유효한 Section Role 매핑 (v5.0)
 * Page layout에 따라 사용 가능한 Section role이 결정됨
 */
// LAYOUT_SECTION_ROLES moved to role-config.ts

/**
 * Section Props
 * v1.0.1: role 타입 변경, condition 추가
 * v3.0: gridArea 추가 (App/Page의 layout="grid"일 때 사용)
 */
export interface SectionProps extends AsProp {
    role?: SectionRole; // v1.0.1: Role → SectionRole
    prominence?: Prominence;
    density?: Density; // v1.0.1: 명시적으로 추가됨 (자식에 전파)
    intent?: Intent;
    children: ReactNode;
    /**
     * EXCEPTION: className은 데이터 시각화를 위한 동적 스타일링에만 허용
     * 예: 색상 인디케이터, 차트 색상, 데이터 기반 배경색
     * 정적 스타일은 반드시 role을 통해 정의해야 함
     */
    className?: string;
    id?: string;
    onClick?: (e: React.MouseEvent) => void;
    /**
     * Field 렌더링 모드 (IDDL v1.0)
     * - view: 데이터를 텍스트로 표시
     * - edit: 데이터를 입력 폼으로 표시
     */
    mode?: 'view' | 'edit';
    condition?: string; // v1.0.1: 조건부 렌더링
    gridArea?: string; // v3.0: CSS grid-area 이름 (grid layout일 때)
    /**
     * Resize 가능 여부 (v4.0)
     * - true: 기본 방향으로 resize 가능
     * - { direction, minSize, maxSize }: 상세 설정
     */
    resizable?:
    | boolean
    | {
        direction?: 'horizontal' | 'vertical' | 'both';
        minSize?: number;
        maxSize?: number;
    };
    /**
     * Collapse 가능 여부 (v4.0)
     */
    collapsible?: boolean;
}
