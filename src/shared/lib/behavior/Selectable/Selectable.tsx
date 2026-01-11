/**
 * Selectable - 선택 관리 Wrapper
 *
 * IDDL Behavior Primitives의 Selectable 구현
 * 하위 컴포넌트에서 useSelectableContext()로 접근 가능
 *
 * @example
 * <Selectable mode="extended" followFocus={false}>
 *   <List>
 *     <ListItem id="1">Item 1</ListItem>
 *     <ListItem id="2">Item 2</ListItem>
 *   </List>
 * </Selectable>
 *
 * @see docs/2-areas/spec/interaction/interaction.spec.draft.md#4-selectable
 */

import { SelectableProvider } from './SelectableContext';
import type { SelectableProps } from './types';
import { useSelectable } from './useSelectable';

/**
 * Selectable Wrapper Component
 */
export function Selectable({
  mode,
  followFocus = false,
  required = false,
  defaultSelected,
  selected,
  onSelectionChange,
  children,
}: SelectableProps) {
  const selectable = useSelectable({
    mode,
    followFocus,
    required,
    defaultSelected,
    selected,
    onSelectionChange,
  });

  return <SelectableProvider value={selectable}>{children}</SelectableProvider>;
}
