/**
 * Text Type Definitions
 */

import type React from 'react';
import type { AsProp, Intent, Prominence } from '../../Shared.types';

/**
 * Text Role - 정적 텍스트의 역할
 *
 * Registry-based system으로 확장 가능한 role 관리
 *
 * Current roles (16):
 * - Typography (5): Title, Heading, Body, Label, Caption
 * - Inline (5): Strong, Emphasis, Mark, Link, Code
 * - Indicator (5): Badge, Alert, Avatar, Kbd, Tag
 * - Data (1): Time
 *
 * Extensible: Use registerTextRole() to add custom roles
 */
export type TextRole =
  // Typography (5 roles)
  | 'Title'
  | 'Heading'
  | 'Body'
  | 'Label'
  | 'Caption'
  // Inline (5 roles)
  | 'Strong'
  | 'Emphasis'
  | 'Mark'
  | 'Link'
  | 'Code'
  // Indicator (5 roles)
  | 'Badge'
  | 'Alert'
  | 'Avatar'
  | 'Kbd'
  | 'Tag'
  // Data (1 role)
  | 'Time';

/**
 * Text Props - 정적 콘텐츠 (Data Binding 없음)
 */
export interface TextProps extends AsProp {
  role: TextRole;
  content?: string;
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
  /** 조건부 렌더링 */
  condition?: string;
  /** 매칭할 텍스트 하이라이트 (대소문자 구분 안 함) */
  highlight?: string;

  // Content & Styling
  size?: string;
  children?: React.ReactNode;
}
