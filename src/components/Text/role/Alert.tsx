import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

/**
 * Alert - 알림 메시지
 */
export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * variant - 알림 타입
   */
  variant?: 'info' | 'success' | 'warning' | 'error';

  /**
   * title - 알림 제목
   */
  title?: string;

  /**
   * onClose - 닫기 버튼 핸들러
   */
  onClose?: () => void;
}

const icons = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'info', title, onClose, children, ...props }, ref) => {
    const Icon = icons[variant];

    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'relative rounded-lg p-4 border',

          // Variants
          {
            // Info - blue
            'bg-blue-50 border-blue-200 text-blue-900':
              variant === 'info',

            // Success - green
            'bg-green-50 border-green-200 text-green-900':
              variant === 'success',

            // Warning - yellow
            'bg-yellow-50 border-yellow-200 text-yellow-900':
              variant === 'warning',

            // Error - red
            'bg-red-50 border-red-200 text-red-900':
              variant === 'error',
          },

          className
        )}
        {...props}
      >
        <div className="flex gap-3">
          {/* Icon */}
          <Icon size={20} className="flex-shrink-0 mt-0.5" />

          {/* Content */}
          <div className="flex-1">
            {title && (
              <div className="font-semibold text-sm mb-1">{title}</div>
            )}
            <div className="text-sm font-normal">{children}</div>
          </div>

          {/* Close Button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';
