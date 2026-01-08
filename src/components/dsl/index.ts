/**
 * DSL Components - TSX 기반 Why-First 디자인 시스템
 *
 * AI가 생성하기 좋은 명확한 구조
 * - Page: 최상위 페이지 컨테이너
 * - Region: 시맨틱 영역 (header, main, sidebar, footer)
 * - Section: prominence 설정 및 전파
 * - Group: purpose 지정 (why it exists)
 * - Item: as prop으로 실제 요소 렌더링
 */

export { Page } from './Page';
export { Region } from './Region';
export { Section } from './Section';
export { Group } from './Group';
export { Item } from './Item';

export { useLayoutContext, LayoutProvider, LayoutContext } from './LayoutContext';

export type {
  Prominence,
  RegionRole,
  Purpose,
  ItemAs,
  PageProps,
  RegionProps,
  SectionProps,
  GroupProps,
  ItemProps,
  LayoutContextValue,
} from './types';
