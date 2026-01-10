/**
 * Field Styles - CVA 기반 Field 컴포넌트 스타일
 *
 * 모든 Field 렌더러에서 공통으로 사용하는 스타일 정의.
 * Prominence, Intent, Density에 따라 자동으로 스타일이 적용됩니다.
 *
 * **토큰 기반 디자인**: src/shared/config/tokens.ts의 값만 사용
 *
 * @see docs/2-areas/spec/minimal-renderer-guide.md Section 5.3
 * @see src/shared/config/tokens.ts
 */

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Field Wrapper - 전체 필드 래퍼
 * Label + Input + Error를 감싸는 컨테이너
 *
 * 토큰: spacing.1, spacing.2 (4px, 8px)
 */
export const fieldWrapperStyles = cva('flex flex-col', {
  variants: {
    density: {
      Comfortable: 'gap-2', // 8px
      Standard: 'gap-1.5', // 6px
      Compact: 'gap-1', // 4px
    },
  },
  defaultVariants: {
    density: 'Standard',
  },
});

export type FieldWrapperVariants = VariantProps<typeof fieldWrapperStyles>;

/**
 * Label - 필드 라벨
 *
 * 토큰: fontSize.xs (12px), fontWeight.medium/semibold
 */
export const labelStyles = cva('font-medium text-text peer-disabled:cursor-not-allowed peer-disabled:opacity-70', {
  variants: {
    prominence: {
      Hero: 'text-base font-semibold', // 16px, 600
      Standard: 'text-sm font-medium', // 13px, 500
      Strong: 'text-sm font-semibold', // 13px, 600
      Subtle: 'text-xs text-muted', // 12px
    },
    required: {
      true: 'after:content-["*"] after:ml-0.5 after:text-red-500',
      false: '',
    },
  },
  defaultVariants: {
    prominence: 'Standard',
    required: false,
  },
});

export type LabelVariants = VariantProps<typeof labelStyles>;

/**
 * Input - 텍스트/숫자/이메일/URL/전화번호/비밀번호 입력 필드
 *
 * 토큰:
 * - spacing: px-2 (8px), px-2.5 (10px), px-3 (12px)
 * - fontSize: text-xs (12px), text-sm (13px), text-lg (16px)
 * - borderRadius: rounded (6px)
 * - colors: bg-surface, text-text, border-default, ring-accent
 * - semantic: border-green-500, border-yellow-500, border-red-500, border-blue-500
 */
export const inputStyles = cva(
  [
    'flex w-full rounded-md border border-input shadow-sm transition-colors',
    'bg-surface file:border-0 file:bg-transparent file:text-sm file:font-medium',
    'placeholder:text-subtle text-text',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent',
    'disabled:cursor-not-allowed disabled:opacity-50',
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
        Comfortable: 'py-2 px-3', // 8px 12px
        Standard: 'py-1 px-3', // 4px 12px
        Compact: 'py-1 px-2', // 4px 8px
      },
      intent: {
        Neutral: 'border-default',
        Brand: 'border-accent',
        Positive: 'border-green-500', // semantic.success
        Caution: 'border-yellow-500', // semantic.warning
        Critical: 'border-red-500', // semantic.error
        Info: 'border-blue-500', // semantic.info
      },
      error: {
        true: 'border-red-500 focus-visible:ring-red-500',
        false: '',
      },
      dataType: {
        text: '',
        email: '',
        url: 'font-mono text-xs', // URL은 monospace
        phone: 'font-mono',
        password: 'font-mono',
        number: 'font-mono text-right', // 숫자는 오른쪽 정렬
        currency: 'font-mono text-right',
        date: 'font-mono',
        datetime: 'font-mono',
        time: 'font-mono',
        color: 'w-20 h-9 p-1 cursor-pointer', // 색상 선택기는 특수
      },
    },
    compoundVariants: [
      // Hero + Density
      { prominence: 'Hero', density: 'Comfortable', class: 'px-4' },
      { prominence: 'Hero', density: 'Standard', class: 'px-3.5' },
      { prominence: 'Hero', density: 'Compact', class: 'px-3' },
    ],
    defaultVariants: {
      prominence: 'Standard',
      density: 'Standard',
      intent: 'Neutral',
      error: false,
      dataType: 'text',
    },
  }
);

export type InputVariants = VariantProps<typeof inputStyles>;

/**
 * Textarea - 여러 줄 텍스트 입력
 *
 * 토큰: fontSize, spacing, borderRadius
 */
export const textareaStyles = cva(
  [
    'flex w-full rounded-md border border-input shadow-sm transition-colors',
    'bg-surface text-text placeholder:text-subtle',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'resize-y',
  ],
  {
    variants: {
      prominence: {
        Hero: 'text-lg py-3 px-4 min-h-32', // 16px
        Standard: 'text-sm py-2 px-3 min-h-[80px]', // 13px
        Strong: 'text-sm py-2 px-3 min-h-20 font-medium',
        Subtle: 'text-xs py-1.5 px-2.5 min-h-16', // 12px
      },
      density: {
        Comfortable: 'py-3 px-4',
        Standard: 'py-2 px-3',
        Compact: 'py-1.5 px-2.5',
      },
      intent: {
        Neutral: 'border-default',
        Brand: 'border-accent',
        Positive: 'border-green-500',
        Caution: 'border-yellow-500',
        Critical: 'border-red-500',
        Info: 'border-blue-500',
      },
      error: {
        true: 'border-red-500 focus-visible:ring-red-500',
        false: '',
      },
      dataType: {
        textarea: '',
        richtext: 'font-sans', // richtext는 sans-serif
        code: 'font-mono text-xs', // 코드는 monospace
      },
    },
    defaultVariants: {
      prominence: 'Standard',
      density: 'Standard',
      intent: 'Neutral',
      error: false,
      dataType: 'textarea',
    },
  }
);

export type TextareaVariants = VariantProps<typeof textareaStyles>;

/**
 * Select - 드롭다운 선택
 *
 * 토큰: fontSize, spacing, borderRadius, colors
 */
export const selectStyles = cva(
  [
    'flex w-full items-center justify-between rounded-md border border-input shadow-sm transition-colors',
    'bg-surface text-text placeholder:text-muted',
    'focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'appearance-none',
    // Custom Arrow
    'bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")]',
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
        Brand: 'border-accent',
        Positive: 'border-green-500',
        Caution: 'border-yellow-500',
        Critical: 'border-red-500',
        Info: 'border-blue-500',
      },
      error: {
        true: 'border-red-500 focus:ring-red-500',
        false: '',
      },
      multiple: {
        true: 'min-h-[120px] p-1 pr-1 bg-none h-auto', // multiselect는 높이 확보 및 화살표 제거
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

export type SelectVariants = VariantProps<typeof selectStyles>;

/**
 * Checkbox/Radio - 체크박스 및 라디오 버튼
 *
 * 토큰: borderRadius.sm (4px), iconSize.sm (16px)
 */
export const checkboxStyles = cva(
  [
    'peer shrink-0 border border-primary text-primary shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
    'cursor-pointer appearance-none bg-surface',
    // Custom Check Icon for checked state
    'checked:bg-accent checked:border-accent checked:bg-[url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z\'/%3e%3c/svg%3e")]',
    'checked:bg-center checked:bg-no-repeat',
  ],
  {
    variants: {
      type: {
        checkbox: 'rounded-sm', // 4px
        radio: 'rounded-full checked:bg-[url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3ccircle cx=\'8\' cy=\'8\' r=\'3\'/%3e%3c/svg%3e")]',
      },
      size: {
        sm: 'w-3 h-3', // 12px
        md: 'w-4 h-4', // 16px (default)
        lg: 'w-5 h-5', // 20px
      },
    },
    defaultVariants: {
      type: 'checkbox',
      size: 'md',
    },
  }
);

export type CheckboxVariants = VariantProps<typeof checkboxStyles>;

/**
 * Radio/Checkbox Label - 라디오/체크박스 라벨
 *
 * 토큰: fontSize, spacing
 */
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

export type OptionLabelVariants = VariantProps<typeof optionLabelStyles>;

/**
 * Error Message - 에러 메시지
 *
 * 토큰: fontSize.xs (12px), semantic.error
 */
export const errorStyles = cva('text-[0.8rem] font-medium text-red-500 mt-1.5');

export type ErrorVariants = VariantProps<typeof errorStyles>;

/**
 * Helper Text - 도움말 텍스트
 *
 * 토큰: fontSize.xs (12px), text.tertiary
 */
export const helperTextStyles = cva('text-[0.8rem] text-muted mt-1.5');

export type HelperTextVariants = VariantProps<typeof helperTextStyles>;

/**
 * Clear Button - 입력 내용 지우기 버튼
 *
 * 토큰: spacing.2 (8px), borderRadius (6px)
 */
export const clearButtonStyles = cva([
  'absolute right-2.5 top-1/2 -translate-y-1/2',
  'p-0.5 rounded-sm',
  'text-subtle hover:text-text hover:bg-surface-elevated',
  'transition-colors',
  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
]);

export type ClearButtonVariants = VariantProps<typeof clearButtonStyles>;

/**
 * Range Input - 슬라이더
 *
 * 토큰: borderRadius.lg (10px), accent, bg-surface-sunken
 */
export const rangeStyles = cva([
  'w-full h-2 rounded-full appearance-none cursor-pointer',
  'bg-surface-sunken accent-accent',
  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
  'disabled:opacity-50 disabled:cursor-not-allowed',
]);

export type RangeVariants = VariantProps<typeof rangeStyles>;

/**
 * Range Labels - 슬라이더 최소/최대 라벨
 *
 * 토큰: fontSize.xs (12px), spacing.1 (4px)
 */
export const rangeLabelsStyles = cva('flex justify-between text-xs text-subtle mt-1.5');

export type RangeLabelsVariants = VariantProps<typeof rangeLabelsStyles>;

/**
 * Range Value Display - 슬라이더 현재 값 표시
 *
 * 토큰: fontSize.sm (13px), fontWeight.medium
 */
export const rangeValueStyles = cva('text-sm font-medium text-text text-center mb-1.5');

export type RangeValueVariants = VariantProps<typeof rangeValueStyles>;

/**
 * Color Input - 색상 선택기
 *
 * 토큰: borderRadius.md (8px), border-default
 */
export const colorInputStyles = cva([
  'rounded-md border border-input cursor-pointer',
  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
  'disabled:opacity-50 disabled:cursor-not-allowed',
]);

export type ColorInputVariants = VariantProps<typeof colorInputStyles>;

/**
 * Color Preview - 선택된 색상 미리보기
 *
 * 토큰: spacing, borderRadius
 */
export const colorPreviewStyles = cva([
  'w-full h-9 rounded-md border border-input shadow-sm',
  'flex items-center justify-center',
  'text-xs font-mono text-text-secondary',
]);

export type ColorPreviewVariants = VariantProps<typeof colorPreviewStyles>;

/**
 * File Input - 파일 업로드
 *
 * 토큰: spacing, fontSize, borderRadius, accent, fontWeight
 */
export const fileInputStyles = cva([
  'flex w-full rounded-md border border-input bg-surface px-3 py-1 text-sm shadow-sm transition-colors',
  'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-text',
  'placeholder:text-subtle',
  'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'h-9',
]);

export type FileInputVariants = VariantProps<typeof fileInputStyles>;

/**
 * Rating Star - 별점 입력
 *
 * 토큰: iconSize.md (20px), accent, text.tertiary
 */
export const ratingStarStyles = cva(
  ['cursor-pointer transition-colors'],
  {
    variants: {
      filled: {
        true: 'text-yellow-500',
        false: 'text-subtle hover:text-yellow-400',
      },
      size: {
        sm: 'w-4 h-4', // 16px
        md: 'w-5 h-5', // 20px (default)
        lg: 'w-6 h-6', // 24px
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
  }
);

export type RatingStarVariants = VariantProps<typeof ratingStarStyles>;

/**
 * Rating Container - 별점 컨테이너
 *
 * 토큰: spacing.1 (4px)
 */
export const ratingContainerStyles = cva('flex items-center gap-1');

export type RatingContainerVariants = VariantProps<typeof ratingContainerStyles>;

/**
 * Boolean Toggle - 토글 스위치 (boolean dataType)
 *
 * 토큰: borderRadius, accent, spacing
 */
export const toggleStyles = cva(
  [
    'peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'data-[state=checked]:bg-accent data-[state=unchecked]:bg-gray-200',
  ],
  {
    variants: {
      checked: {
        true: 'bg-accent',
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

export type ToggleVariants = VariantProps<typeof toggleStyles>;

/**
 * Toggle Thumb - 토글 스위치 thumb
 *
 * 토큰: borderRadius, spacing
 */
export const toggleThumbStyles = cva(
  ['pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'],
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

export type ToggleThumbVariants = VariantProps<typeof toggleThumbStyles>;
