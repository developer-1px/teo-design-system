import { ImgHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

/**
 * Avatar - 사용자 아바타
 */
export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  /**
   * size - 아바타 크기
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * fallback - 이미지 로드 실패 시 표시할 텍스트
   */
  fallback?: string;
}

export const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, size = 'md', fallback, alt, ...props }, ref) => {
    return (
      <div
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-surface border border-default',

          // Sizes
          {
            'h-6 w-6 text-xs': size === 'sm',
            'h-8 w-8 text-sm': size === 'md',
            'h-10 w-10 text-base': size === 'lg',
            'h-12 w-12 text-lg': size === 'xl',
          },

          className
        )}
      >
        {props.src ? (
          <img
            ref={ref}
            alt={alt || 'Avatar'}
            className="h-full w-full object-cover"
            {...props}
          />
        ) : fallback ? (
          <span className="font-medium text-muted">
            {fallback.charAt(0).toUpperCase()}
          </span>
        ) : (
          <User
            size={size === 'sm' ? 12 : size === 'md' ? 16 : size === 'lg' ? 20 : 24}
            className="text-subtle"
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
