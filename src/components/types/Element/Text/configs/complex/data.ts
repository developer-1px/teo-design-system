/**
 * Data-related complex role configurations
 *
 * 데이터 표시를 위한 Complex role:
 * - Time: 상대/절대 시간 표시
 * - Number: 숫자 포맷팅 (통화, 퍼센트 등) - TODO
 * - Json: JSON 트리 뷰어 - TODO
 */

import { TimeRenderer } from '../../renderers/TimeRenderer';
import type { ComplexRoleConfig } from '../types';

/**
 * Time - 시간 표시
 *
 * 상대 시간("3 minutes ago") 또는 절대 시간 표시
 * 실시간 업데이트 지원
 */
export const Time: ComplexRoleConfig = {
  type: 'complex',
  renderer: TimeRenderer,
  description: 'Time formatting with relative/absolute display and live updates',
};
