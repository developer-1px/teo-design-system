/**
 * Rating Styles - 별점 전용 스타일
 *
 * 별점 입력 필드에 사용되는 스타일 정의
 */

import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Rating Container - 별점 컨테이너
 */
export const ratingContainerStyles = cva('flex items-center gap-1');

export type RatingContainerVariants = VariantProps<typeof ratingContainerStyles>;

/**
 * Star Button - 별 버튼
 */
export const starButtonStyles = cva(
  [
    'transition-colors cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:rounded',
  ],
  {
    variants: {
      prominence: {
        Hero: 'w-8 h-8',
        Standard: 'w-6 h-6',
        Strong: 'w-5 h-5',
        Subtle: 'w-4 h-4',
      },
      state: {
        empty: 'text-subtle hover:text-yellow-500',
        filled: 'text-yellow-500',
        hover: 'text-yellow-400',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      prominence: 'Standard',
      state: 'empty',
      disabled: false,
    },
  }
);

export type StarButtonVariants = VariantProps<typeof starButtonStyles>;
