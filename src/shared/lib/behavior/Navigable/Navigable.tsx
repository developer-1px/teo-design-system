/**
 * Navigable - 키보드 네비게이션 Wrapper
 *
 * IDDL Behavior Primitives의 Navigable 구현
 * 하위 컴포넌트에서 useNavigableContext()로 접근 가능
 *
 * @example
 * <Navigable orientation="vertical" loop={false}>
 *   <List>
 *     <ListItem id="1">Item 1</ListItem>
 *     <ListItem id="2">Item 2</ListItem>
 *   </List>
 * </Navigable>
 *
 * @see docs/2-areas/spec/interaction/interaction.spec.draft.md#3-navigable
 */

import { NavigableProvider } from './NavigableContext';
import type { NavigableProps } from './types';
import { useNavigable } from './useNavigable';

/**
 * Navigable Wrapper Component
 */
export function Navigable({
  orientation,
  loop = false,
  typeahead = true,
  skipDisabled = true,
  defaultFocusedId,
  onFocusChange,
  children,
}: NavigableProps) {
  const navigable = useNavigable({
    orientation,
    loop,
    typeahead,
    skipDisabled,
    defaultFocusedId,
    onFocusChange,
  });

  return <NavigableProvider value={navigable}>{children}</NavigableProvider>;
}
