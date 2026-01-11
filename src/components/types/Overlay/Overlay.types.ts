/**
 * Overlay Type Definitions
 */

import type { ReactNode } from 'react';
import type { AsProp, Density, Intent, Prominence } from '../Shared.types';

/**
 * Overlay Role - 오버레이 유형
 * v1.0.1: Popover, Sheet, Lightbox 추가
 * v1.0.2: Floating 추가 (persistent interactive overlays)
 */
export type OverlayRole =
  | 'Dialog'
  | 'Drawer'
  | 'Popover'
  | 'Toast'
  | 'Tooltip'
  | 'Sheet'
  | 'Lightbox'
  | 'Floating';

/**
 * Placement - 오버레이 위치
 * v1.0.1: 더 많은 위치 추가
 */
export type Placement =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

/**
 * Overlay Props
 * v1.0.1: role 타입 변경, placement 확장, isOpen, dismissable, condition 추가
 */
export interface OverlayProps extends AsProp {
  id?: string; // v1.0.1: 필수로 변경 -> v5.0: 다시 선택사항으로 (컴포넌트 내부 생성 허용 예정)
  role: OverlayRole; // v1.0.1: role 확장
  prominence?: Prominence;
  density?: Density;
  intent?: Intent;
  placement?: Placement; // v1.0.1: Placement 타입으로 변경
  children: ReactNode;
  /**
   * EXCEPTION: className은 데이터 시각화를 위한 동적 스타일링에만 허용
   * 예: 색상 인디케이터, 차트 색상, 데이터 기반 배경색
   * 정적 스타일은 반드시 role을 통해 정의해야 함
   */
  className?: string;
  isOpen?: boolean; // v1.0.1: open → isOpen으로 rename
  dismissable?: boolean; // v1.0.1: 외부 클릭으로 닫기 가능 여부
  onClose?: () => void;
  condition?: string; // v1.0.1: 조건부 렌더링
}
