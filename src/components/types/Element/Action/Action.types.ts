/**
 * Action Type Definitions
 */

import type React from 'react';
import type { ReactNode } from 'react';
import type { AsProp, Density, Intent, Prominence } from '../../Shared.types';

/**
 * Action Role - 액션의 렌더링 유형 (v4.0)
 */
export type ActionRole =
  | 'Button' // 기본 버튼
  | 'IconButton' // 아이콘 전용 버튼
  | 'Link' // 링크 스타일
  | 'MenuItem' // 메뉴 아이템
  | 'ListItem' // 리스트 아이템 (선택 가능)
  | 'Tab' // 탭 버튼
  | 'Chip'; // 칩/태그 (토글 가능)

/**
 * Action Behavior - discriminated union
 * v1.0.1: command/to/args → behavior로 통합
 */
export type ActionBehavior =
  | { action: 'command'; command: string; args?: Record<string, unknown> }
  | { action: 'navigate'; to: string; target?: '_blank' | '_self' }
  | { action: 'submit'; form?: string }
  | { action: 'reset'; form?: string }
  | { action: 'open'; overlay: string }
  | { action: 'close'; overlay?: string }
  | { action: 'toggle'; target: string };

/**
 * Action Props - 상호작용 트리거
 * v1.0.1: behavior, loading 추가
 * v3.1: selected, interactive config 추가 (Interactive State Token System)
 * v4.0: role 추가 (renderer 패턴)
 */
export interface ActionProps extends AsProp {
  // Renderer (v4.0)
  role?: ActionRole; // Button (default) | IconButton | Link | MenuItem | ListItem | Tab | Chip
  label?: string;
  icon?: string;
  // Styling
  prominence?: Prominence;
  intent?: Intent;
  density?: Density;
  /**
   * EXCEPTION: className은 데이터 시각화를 위한 동적 스타일링에만 허용
   * 예: 색상 인디케이터, 차트 색상, 데이터 기반 배경색
   * 정적 스타일은 반드시 role을 통해 정의해야 함
   */
  className?: string;
  // Behavior (v1.0.1: discriminated union)
  behavior?: ActionBehavior;
  // State
  disabled?: boolean | string; // v1.0.1: 표현식도 가능
  confirm?: string;
  loading?: boolean; // v1.0.1
  selected?: boolean; // v3.1: 선택 상태 (리스트 아이템, 탭 등)
  href?: string; // For Link role
  title?: string; // Tooltip/Accessibility
  onBlur?: (e: React.FocusEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  target?: string; // For Link role
  hidden?: boolean;
  condition?: string; // v1.0.1: 조건부 렌더링
  // Event handlers (practical addition for React usage)
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  // Children (practical addition for complex content)
  children?: ReactNode; // v1.0.2: children이 있으면 label/icon 대신 렌더링
}
