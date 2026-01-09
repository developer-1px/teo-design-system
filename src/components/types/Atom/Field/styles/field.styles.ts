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
      Standard: 'gap-1', // 4px
      Compact: 'gap-0.5', // 2px
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
export const labelStyles = cva('font-medium text-text', {
  variants: {
    prominence: {
      Hero: 'text-base font-semibold', // 16px, 600
      Standard: 'text-xs font-medium', // 12px, 500
      Strong: 'text-xs font-semibold', // 12px, 600
      Subtle: 'text-[10px] text-muted', // 10px
    },
    required: {
      true: 'after:content-["*"] after:ml-0.5 after:text-red-600',
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
 * - colors: bg-surface-sunken, text-text, border-default, ring-accent
 * - semantic: border-green-500, border-yellow-500, border-red-500, border-blue-500
 */
export const inputStyles = cva(
  [
    'w-full rounded border transition-colors',
    'bg-surface-sunken text-text placeholder:text-subtle',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-0',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      prominence: {
        Hero: 'text-lg', // 16px
        Standard: 'text-sm', // 13px
        Strong: 'text-sm font-medium', // 13px, 500
        Subtle: 'text-xs', // 12px
      },
      density: {
        Comfortable: 'py-2 px-3', // 8px 12px
        Standard: 'py-1.5 px-2.5', // 6px 10px
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
        color: 'w-20 h-10 p-1 cursor-pointer', // 색상 선택기는 특수
      },
    },
    compoundVariants: [
      // Hero + Density
      { prominence: 'Hero', density: 'Comfortable', class: 'py-3 px-4' },
      { prominence: 'Hero', density: 'Standard', class: 'py-2.5 px-3.5' },
      { prominence: 'Hero', density: 'Compact', class: 'py-2 px-3' },
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
    'w-full rounded border transition-colors resize-y',
    'bg-surface-sunken text-text placeholder:text-subtle',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      prominence: {
        Hero: 'text-lg py-3 px-4 min-h-32', // 16px
        Standard: 'text-sm py-2 px-3 min-h-24', // 13px
        Strong: 'text-sm py-2 px-3 min-h-20 font-medium',
        Subtle: 'text-xs py-1.5 px-2.5 min-h-16', // 12px
      },
      density: {
        Comfortable: 'py-3 px-4 min-h-32',
        Standard: 'py-2 px-3 min-h-24',
        Compact: 'py-1.5 px-2.5 min-h-16',
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
    'w-full rounded border transition-colors appearance-none',
    'bg-surface-sunken text-text',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    // Arrow icon via background
    'bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")]',
    'bg-no-repeat bg-right bg-[length:1.25rem]',
    'pr-8',
  ],
  {
    variants: {
      prominence: {
        Hero: 'text-lg',
        Standard: 'text-sm',
        Strong: 'text-sm font-medium',
        Subtle: 'text-xs',
      },
      density: {
        Comfortable: 'py-2 px-3',
        Standard: 'py-1.5 px-2.5',
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
        true: 'border-red-500 focus-visible:ring-red-500',
        false: '',
      },
      multiple: {
        true: 'min-h-[120px]', // multiselect는 높이 확보
        false: '',
      },
    },
    compoundVariants: [
      // Hero + Density
      { prominence: 'Hero', density: 'Comfortable', class: 'py-3 px-4' },
      { prominence: 'Hero', density: 'Standard', class: 'py-2.5 px-3.5' },
      { prominence: 'Hero', density: 'Compact', class: 'py-2 px-3' },
    ],
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
    'w-4 h-4 border-default text-accent rounded',
    'focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-0',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'cursor-pointer',
  ],
  {
    variants: {
      type: {
        checkbox: 'rounded', // 4px
        radio: 'rounded-full',
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
      Standard: 'text-sm',
      Strong: 'text-sm font-medium',
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
export const errorStyles = cva('text-xs text-red-600 font-medium');

export type ErrorVariants = VariantProps<typeof errorStyles>;

/**
 * Helper Text - 도움말 텍스트
 *
 * 토큰: fontSize.xs (12px), text.tertiary
 */
export const helperTextStyles = cva('text-xs text-muted');

export type HelperTextVariants = VariantProps<typeof helperTextStyles>;

/**
 * Clear Button - 입력 내용 지우기 버튼
 *
 * 토큰: spacing.2 (8px), borderRadius (6px)
 */
export const clearButtonStyles = cva([
  'absolute right-2 top-1/2 -translate-y-1/2',
  'p-1 rounded',
  'text-subtle hover:text-text hover:bg-surface-elevated',
  'transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
]);

export type ClearButtonVariants = VariantProps<typeof clearButtonStyles>;

/**
 * Range Input - 슬라이더
 *
 * 토큰: borderRadius.lg (10px), accent, bg-surface-sunken
 */
export const rangeStyles = cva([
  'w-full h-2 rounded-lg appearance-none cursor-pointer',
  'bg-surface-sunken accent-accent',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
  'disabled:opacity-50 disabled:cursor-not-allowed',
]);

export type RangeVariants = VariantProps<typeof rangeStyles>;

/**
 * Range Labels - 슬라이더 최소/최대 라벨
 *
 * 토큰: fontSize.xs (12px), spacing.1 (4px)
 */
export const rangeLabelsStyles = cva('flex justify-between text-xs text-subtle mt-1');

export type RangeLabelsVariants = VariantProps<typeof rangeLabelsStyles>;

/**
 * Range Value Display - 슬라이더 현재 값 표시
 *
 * 토큰: fontSize.sm (13px), fontWeight.medium
 */
export const rangeValueStyles = cva('text-sm font-medium text-text text-center mb-1');

export type RangeValueVariants = VariantProps<typeof rangeValueStyles>;

/**
 * Color Input - 색상 선택기
 *
 * 토큰: borderRadius.md (8px), border-default
 */
export const colorInputStyles = cva([
  'rounded-md border border-default cursor-pointer',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
  'disabled:opacity-50 disabled:cursor-not-allowed',
]);

export type ColorInputVariants = VariantProps<typeof colorInputStyles>;

/**
 * Color Preview - 선택된 색상 미리보기
 *
 * 토큰: spacing, borderRadius
 */
export const colorPreviewStyles = cva([
  'w-full h-10 rounded-md border border-default',
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
  'w-full py-2 px-3 rounded border border-default',
  'bg-surface-sunken text-text text-sm',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
  'file:mr-4 file:py-1.5 file:px-3',
  'file:rounded file:border-0',
  'file:bg-accent file:text-white file:font-medium file:text-xs',
  'file:cursor-pointer',
  'hover:file:bg-accent/90',
  'disabled:opacity-50 disabled:cursor-not-allowed',
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
    'relative inline-flex items-center cursor-pointer',
    'rounded-full transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      checked: {
        true: 'bg-accent',
        false: 'bg-gray-300',
      },
      size: {
        sm: 'w-8 h-4', // 32px x 16px
        md: 'w-11 h-6', // 44px x 24px (default)
        lg: 'w-14 h-7', // 56px x 28px
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
  ['absolute rounded-full bg-white transition-transform shadow-sm'],
  {
    variants: {
      checked: {
        true: '',
        false: '',
      },
      size: {
        sm: 'w-3 h-3 left-0.5', // 12px
        md: 'w-5 h-5 left-0.5', // 20px
        lg: 'w-6 h-6 left-0.5', // 24px
      },
    },
    compoundVariants: [
      { checked: true, size: 'sm', class: 'translate-x-4' },
      { checked: true, size: 'md', class: 'translate-x-5' },
      { checked: true, size: 'lg', class: 'translate-x-7' },
    ],
    defaultVariants: {
      checked: false,
      size: 'md',
    },
  }
);

export type ToggleThumbVariants = VariantProps<typeof toggleThumbStyles>;
