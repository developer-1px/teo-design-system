/**
 * Field Styles - IDDL Integrated
 *
 * This file delegates style resolution to the central IDDL utility.
 * It maintains the existing API (inputStyles, labelStyles, etc.) but
 * uses `iddl({...})` internally to generate classes.
 *
 * @see src/shared/iddl/resolve.ts
 */

import { iddl } from '@/shared/iddl';
import type {
  Intent,
  Prominence,
  Density,
  InputSpec,
  TextSpec
} from '@/shared/iddl/types';
import { cva } from 'class-variance-authority';

// Re-export VariantProps mostly for compatibility, but mapped to IDDL types
export interface FieldWrapperProps {
  density?: Density;
}

export function fieldWrapperStyles({ density = 'Standard' }: FieldWrapperProps = {}) {
  const gaps = {
    Comfortable: 'gap-2',
    Standard: 'gap-1.5',
    Compact: 'gap-1',
  };
  return `flex flex-col ${gaps[density] || gaps.Standard}`;
}

export interface LabelProps {
  prominence?: Prominence;
  required?: boolean;
}

export function labelStyles({ prominence = 'Standard', required }: LabelProps) {
  return iddl({
    role: 'Label',
    prominence,
    spec: { role: 'Label', required } as TextSpec
  });
}

// Input Variants Interface matching existing usage
export interface InputProps {
  prominence?: Prominence;
  density?: Density;
  intent?: Intent;
  error?: boolean;
  dataType?: any;
  className?: string;
  multiple?: boolean; // Added for Select
}

export function inputStyles({
  prominence,
  density,
  intent,
  error,
  dataType
}: InputProps) {
  return iddl({
    role: 'Input',
    intent,
    prominence,
    density,
    spec: {
      type: dataType,
      error
    } as InputSpec
  });
}

export interface TextareaProps extends InputProps {
  rows?: number;
}

export function textareaStyles({
  prominence,
  density,
  intent,
  error,
  dataType,
  rows
}: TextareaProps) {
  return iddl({
    role: 'Input',
    intent,
    prominence,
    density,
    spec: {
      type: dataType,
      error,
      multiline: true,
      rows
    } as InputSpec
  });
}

export function errorStyles() {
  // using semantic tokens
  return 'text-xs font-medium text-error mt-1.5';
}

export function helperTextStyles() {
  return 'text-xs text-muted mt-1.5';
}

export const clearButtonStyles = cva([
  'absolute right-2.5 top-1/2 -translate-y-1/2',
  'p-0.5 rounded-sm',
  'text-subtle hover:text-text hover:bg-surface-elevated',
  'transition-colors',
  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary',
]);

// --- Restored Styles (Legacy CVA -> Pending IDDL Migration) ---

// Select (Delegates to Input for base styles but adds arrow)
export const selectStyles = cva(
  [
    'flex w-full items-center justify-between rounded-md border border-input shadow-sm transition-colors',
    'bg-surface text-text placeholder:text-muted',
    'focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'appearance-none',
    "bg-[url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")]",
    'bg-no-repeat bg-right bg-[length:1.25rem]',
    'pr-8',
  ],
  {
    variants: {
      prominence: {
        Hero: 'text-lg h-12',
        Standard: 'text-sm h-9',
        Strong: 'text-sm font-medium h-10',
        Subtle: 'text-xs h-8',
      },
      density: {
        Comfortable: 'py-2 px-3',
        Standard: 'py-1 px-3',
        Compact: 'py-1 px-2',
      },
      intent: {
        Neutral: 'border-default',
        Brand: 'border-primary',
        Positive: 'border-green-500',
        Caution: 'border-yellow-500',
        Critical: 'border-error',
        Info: 'border-blue-500',
      },
      error: {
        true: 'border-error focus:ring-error',
        false: '',
      },
      multiple: {
        true: 'min-h-[120px] p-1 pr-1 bg-none h-auto',
        false: '',
      },
    },
    defaultVariants: {
      prominence: 'Standard',
      density: 'Standard',
      intent: 'Neutral',
      error: false,
      multiple: false,
    },
  }
);

export const checkboxStyles = cva(
  [
    'peer shrink-0 border border-primary text-primary shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-white',
    'cursor-pointer appearance-none bg-surface',
    // Custom Check Icon for checked state
    "checked:bg-primary checked:border-primary checked:bg-[url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e\")]",
    'checked:bg-center checked:bg-no-repeat',
  ],
  {
    variants: {
      type: {
        checkbox: 'rounded-sm',
        radio:
          "rounded-full checked:bg-[url(\"data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e\")]",
      },
      size: {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5',
      },
    },
    defaultVariants: {
      type: 'checkbox',
      size: 'md',
    },
  }
);

export const optionLabelStyles = cva(['flex items-center gap-2 cursor-pointer text-text'], {
  variants: {
    prominence: {
      Hero: 'text-lg',
      Standard: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      Strong: 'text-sm font-medium leading-none',
      Subtle: 'text-xs text-muted',
    },
    disabled: {
      true: 'opacity-50 cursor-not-allowed',
      false: '',
    },
  },
  defaultVariants: {
    prominence: 'Standard',
    disabled: false,
  },
});

export const rangeStyles = cva([
  'w-full h-2 rounded-full appearance-none cursor-pointer',
  'bg-surface-sunken accent-primary',
  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary',
  'disabled:opacity-50 disabled:cursor-not-allowed',
]);

export const rangeLabelsStyles = cva('flex justify-between text-xs text-subtle mt-1.5');
export const rangeValueStyles = cva('text-sm font-medium text-text text-center mb-1.5');

export const colorInputStyles = cva([
  'rounded-md border border-input cursor-pointer',
  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary',
  'disabled:opacity-50 disabled:cursor-not-allowed',
]);

export const colorPreviewStyles = cva([
  'w-full h-9 rounded-md border border-input shadow-sm',
  'flex items-center justify-center',
  'text-xs font-mono text-muted',
]);

export const fileInputStyles = cva([
  'flex w-full rounded-md border border-input bg-surface px-3 py-1 text-sm shadow-sm transition-colors',
  'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-text',
  'placeholder:text-subtle',
  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'h-9',
]);

export const ratingStarStyles = cva(['cursor-pointer transition-colors'], {
  variants: {
    filled: {
      true: 'text-yellow-500',
      false: 'text-subtle hover:text-yellow-400',
    },
    size: {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    },
    disabled: {
      true: 'cursor-not-allowed opacity-50',
      false: '',
    },
  },
  defaultVariants: {
    filled: false,
    size: 'md',
    disabled: false,
  },
});

export const ratingContainerStyles = cva('flex items-center gap-1');

export const toggleStyles = cva(
  [
    'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-200',
  ],
  {
    variants: {
      checked: {
        true: 'bg-primary',
        false: 'bg-gray-200',
      },
      size: {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
        lg: 'h-7 w-14',
      },
    },
    defaultVariants: {
      checked: false,
      size: 'md',
    },
  }
);

export const toggleThumbStyles = cva(
  [
    'pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
  ],
  {
    variants: {
      checked: {
        true: '',
        false: '',
      },
      size: {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
      },
    },
    compoundVariants: [
      { checked: true, size: 'sm', class: 'translate-x-[16px]' },
      { checked: true, size: 'md', class: 'translate-x-5' },
      { checked: true, size: 'lg', class: 'translate-x-7' },
      { checked: false, size: 'sm', class: 'translate-x-0' },
      { checked: false, size: 'md', class: 'translate-x-0' },
      { checked: false, size: 'lg', class: 'translate-x-0' },
    ],
    defaultVariants: {
      checked: false,
      size: 'md',
    },
  }
);
