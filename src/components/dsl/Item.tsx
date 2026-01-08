/**
 * Item - 렌더링 가능한 최종 요소
 *
 * as prop으로 실제 HTML 요소를 결정
 * prominence는 부모에서 상속하거나 직접 지정 가능
 * purpose와 prominence 조합으로 스타일 자동 결정
 */

import { useLayoutContext } from './LayoutContext';
import { getStyleFromProminence } from './styles';
import type { ItemProps, ItemAs } from './types';

export function Item<T extends ItemAs = 'div'>({
  as,
  prominence,
  children,
  className,
  ...props
}: ItemProps<T>) {
  // 부모 Context에서 prominence와 purpose 가져오기
  const ctx = useLayoutContext();
  const computedProminence = prominence ?? ctx.prominence;

  // prominence + purpose + as 조합으로 스타일 자동 생성
  const computedClassName = getStyleFromProminence(
    computedProminence,
    ctx.purpose,
    as,
    className
  );

  // as에 따라 동적으로 컴포넌트 생성
  const Component = as as any;

  return (
    <Component
      className={computedClassName}
      data-dsl-component="item"
      data-prominence={computedProminence}
      data-purpose={ctx.purpose}
      {...props}
    >
      {children}
    </Component>
  );
}
