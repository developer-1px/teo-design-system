/**
 * Text Type Definitions
 */

import type { AsProp, Intent, Prominence } from '../../Shared.types';

/**
 * Text Role - 정적 텍스트의 역할
 * v1.0.1: Caption 추가
 * v1.1: highlight prop으로 텍스트 매칭 강조 지원
 */
export type TextRole = 'Title' | 'Body' | 'Label' | 'Caption' | 'Code';

/**
 * Text Props - 정적 콘텐츠 (Data Binding 없음)
 * v1.0.1: condition 추가
 * v1.1: highlight 추가
 */
export interface TextProps extends AsProp {
    role: TextRole;
    content: string;
    prominence?: Prominence;
    intent?: Intent;
    align?: 'left' | 'center' | 'right';
    /**
     * EXCEPTION: className은 데이터 시각화를 위한 동적 스타일링에만 허용
     * 예: 색상 인디케이터, 차트 색상, 데이터 기반 배경색
     * 정적 스타일은 반드시 role을 통해 정의해야 함
     */
    className?: string;
    hidden?: boolean;
    condition?: string; // v1.0.1: 조건부 렌더링
    highlight?: string; // v1.1: 매칭할 텍스트 (대소문자 구분 안 함)
}
