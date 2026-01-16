import {useCallback, useState} from "react"

/**
 * Utility hook to handle both controlled and uncontrolled state patterns
 * Follows the pattern used by Downshift and React Aria
 *
 * @param controlledValue - Value from props (controlled mode)
 * @param defaultValue - Initial value (uncontrolled mode)
 * @param onChange - Callback when value changes
 * @returns [value, setValue] tuple
 *
 * @example
 * ```tsx
 * function MyComponent({ value, defaultValue, onChange }) {
 *   const [internalValue, setValue] = useControlledState(
 *     value,
 *     defaultValue ?? false,
 *     onChange
 *   );
 *   // Component is controlled if 'value' prop is provided
 *   // Otherwise uses internal state with defaultValue
 * }
 * ```
 */
export function useControlledState<T>(
  controlledValue: T | undefined,
  defaultValue: T,
  onChange?: (value: T) => void,
): readonly [T, (value: T) => void] {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const setValue = useCallback(
    (newValue: T) => {
      // Update internal state only if uncontrolled
      if (!isControlled) {
        setUncontrolledValue(newValue);
      }
      // Always call onChange callback if provided
      onChange?.(newValue);
    },
    [isControlled, onChange],
  );

  return [value, setValue] as const;
}
