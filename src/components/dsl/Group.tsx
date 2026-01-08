/**
 * Group - 그룹 컨테이너
 *
 * purpose를 지정하여 "왜 이 그룹이 존재하는지" 정의
 * prominence를 재정의할 수도 있고, 부모에서 상속받을 수도 있음
 */

import { cn } from '@/lib/utils';
import { LayoutProvider, useLayoutContext } from './LayoutContext';
import { getGroupDirectionStyle } from './styles';
import type { GroupProps } from './types';

export function Group({
  purpose,
  prominence,
  children,
  className,
  direction,
}: GroupProps) {
  // 부모 Context에서 prominence 상속
  const parentCtx = useLayoutContext();
  const computedProminence = prominence ?? parentCtx.prominence;

  // direction 스타일
  const directionStyle = getGroupDirectionStyle(direction);

  // purpose별 추가 스타일
  const purposeGroupStyles = {
    navigation: 'items-center',
    action: 'items-center',
    form: 'flex-col space-y-2',
    content: 'flex-col space-y-2',
    list: 'flex-col space-y-1',
    media: 'items-start',
    status: 'items-center flex-wrap',
    info: 'flex-col space-y-2',
  };

  return (
    <LayoutProvider
      value={{
        prominence: computedProminence,
        purpose,
        depth: parentCtx.depth + 1,
      }}
    >
      <div
        className={cn(
          directionStyle,
          purposeGroupStyles[purpose],
          className
        )}
        data-dsl-component="group"
        data-purpose={purpose}
        data-prominence={computedProminence}
      >
        {children}
      </div>
    </LayoutProvider>
  );
}
