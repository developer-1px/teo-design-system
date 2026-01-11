/**
 * Listbox - 항상 보이는 선택 목록 primitive
 *
 * IDDL Field Spec: Choice Category - Listbox
 * ARIA role: listbox
 *
 * @see docs/2-areas/spec/4-element/field/field.spec.md#625-listbox
 */

import { cn } from '@/shared/lib/utils';
import type { FieldOption } from '../Field.types';

export interface ListboxProps {
  /**
   * Listbox options
   */
  options: FieldOption[];

  /**
   * Selected value(s)
   */
  value?: string | number | (string | number)[];

  /**
   * Multiple selection
   */
  multiple?: boolean;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * onChange callback
   */
  onChange?: (value: string | number | (string | number)[]) => void;

  /**
   * className
   */
  className?: string;

  /**
   * Listbox props (from hook)
   */
  listboxProps?: any;

  /**
   * Option props getter (from hook)
   */
  optionProps?: (option: FieldOption, index: number) => any;

  /**
   * isSelected checker (from hook)
   */
  isSelected?: (value: string | number) => boolean;

  /**
   * Focused index (from hook)
   */
  focusedIndex?: number;
}

/**
 * Listbox Component
 */
export function ListboxRole({
  options,
  listboxProps,
  optionProps,
  isSelected,
  focusedIndex,
  disabled,
  className,
}: ListboxProps) {
  return (
    <div
      {...(listboxProps ? listboxProps() : { role: 'listbox', tabIndex: 0 })}
      className={cn(
        'border border-border rounded-lg overflow-hidden',
        'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="divide-y divide-border max-h-60 overflow-y-auto">
        {options.map((option, index) => {
          const selected = isSelected ? isSelected(option.value) : false;
          const focused = focusedIndex === index;

          return (
            <div
              key={option.value}
              {...(optionProps ? optionProps(option, index) : {})}
              className={cn(
                'px-3 py-2 cursor-pointer transition-colors',
                'hover:bg-layer-2',
                selected && 'bg-accent/10 text-accent font-medium',
                focused && 'bg-layer-3',
                option.disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm">{option.label}</span>
                {selected && (
                  <svg
                    className="w-4 h-4 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
