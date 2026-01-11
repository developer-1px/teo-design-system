/**
 * Indicator Role Configurations
 *
 * 상태 표시, 메타데이터를 위한 role:
 * - Badge: 상태 표시 배지 (가장 자주 사용)
 * - Alert: 알림 메시지
 * - Avatar: 사용자 아바타
 * - Kbd: 키보드 단축키
 * - Tag: 제거 가능한 태그
 */

import { AlertRenderer } from '../../renderers/AlertRenderer';
import { AvatarRenderer } from '../../renderers/AvatarRenderer';
import { BadgeRenderer } from '../../renderers/BadgeRenderer';
import { KbdRenderer } from '../../renderers/KbdRenderer';
import { TagRenderer } from '../../renderers/TagRenderer';
import type { ComplexRoleConfig } from '../types';

/**
 * Badge - 상태 표시 배지
 *
 * intent로 색상 결정:
 * - Neutral/Brand: 기본 (accent)
 * - Positive: 녹색 (성공)
 * - Caution: 노란색 (경고)
 * - Critical: 빨간색 (오류)
 * - Info: 파란색 (정보)
 *
 * spec 옵션:
 * - dot: Dot indicator만 표시
 * - pulse: 펄스 애니메이션
 */
export const Badge: ComplexRoleConfig = {
  type: 'complex',
  renderer: BadgeRenderer,
  fallback: {
    type: 'simple',
    htmlTag: 'span',
    baseStyles:
      'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-accent/10 text-accent border border-accent/20',
  },
  description: 'Status indicator or tag',
};

/**
 * Alert - 알림 메시지
 *
 * intent로 변형 결정:
 * - Info/Brand/Neutral: info (파란색)
 * - Positive: success (녹색)
 * - Caution: warning (노란색)
 * - Critical: error (빨간색)
 *
 * spec 옵션:
 * - title: 알림 제목
 * - onClose: 닫기 핸들러
 */
export const Alert: ComplexRoleConfig = {
  type: 'complex',
  renderer: AlertRenderer,
  description: 'Alert message with icon and optional close button',
};

/**
 * Avatar - 사용자 아바타
 *
 * prominence로 크기 결정:
 * - Hero: xl (48px)
 * - Strong: lg (40px)
 * - Standard: md (32px)
 * - Subtle: sm (24px)
 *
 * spec 옵션:
 * - src: 이미지 URL
 * - fallback: 이미지 없을 때 표시할 텍스트 (첫 글자만 표시)
 * - alt: 대체 텍스트
 */
export const Avatar: ComplexRoleConfig = {
  type: 'complex',
  renderer: AvatarRenderer,
  description: 'User avatar with image or fallback initial',
};

/**
 * Kbd - 키보드 단축키
 *
 * prominence로 크기 결정:
 * - Hero/Strong: lg
 * - Standard: md
 * - Subtle: sm
 */
export const Kbd: ComplexRoleConfig = {
  type: 'complex',
  renderer: KbdRenderer,
  description: 'Keyboard shortcut indicator',
};

/**
 * Tag - 제거 가능한 태그
 *
 * prominence로 크기 결정:
 * - Subtle: sm
 * - 나머지: md
 *
 * spec 옵션:
 * - onRemove: 제거 핸들러 (없으면 제거 버튼 숨김)
 */
export const Tag: ComplexRoleConfig = {
  type: 'complex',
  renderer: TagRenderer,
  description: 'Removable tag with optional close button',
};

import { ProgressRenderer } from '../../renderers/ProgressRenderer';
import { SkeletonRenderer } from '../../renderers/SkeletonRenderer';
import { SpinnerRenderer } from '../../renderers/SpinnerRenderer';

/**
 * Progress - 진행률 표시
 */
export const Progress: ComplexRoleConfig = {
  type: 'complex',
  renderer: ProgressRenderer,
  description: 'Progress bar',
};

/**
 * Spinner - 로딩 스피너
 */
export const Spinner: ComplexRoleConfig = {
  type: 'complex',
  renderer: SpinnerRenderer,
  description: 'Loading spinner',
};

/**
 * Skeleton - 스켈레톤 로딩
 */
export const Skeleton: ComplexRoleConfig = {
  type: 'complex',
  renderer: SkeletonRenderer,
  description: 'Skeleton loading state',
};
