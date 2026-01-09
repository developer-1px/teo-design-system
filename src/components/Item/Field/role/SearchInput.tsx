import { Search, X } from 'lucide-react';
import { forwardRef } from 'react';
import { Input, type InputProps } from '@/components/Item/Field/role/Input.tsx';
import { cn } from '@/shared/lib/utils.ts';

/**
 * SearchInput - 검색 입력 필드
 *
 * 검색 아이콘 + 입력 필드 + 클리어 버튼
 */
export interface SearchInputProps extends Omit<InputProps, 'type'> {
  /**
   * onClear - 클리어 버튼 클릭 핸들러
   */
  onClear?: () => void;

  /**
   * showClearButton - 클리어 버튼 표시 여부 (기본: value가 있을 때만)
   */
  showClearButton?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, showClearButton, value, ...props }, ref) => {
    const hasClearButton = showClearButton ?? (value && String(value).length > 0);

    return (
      <div className="relative">
        {/* Search Icon */}
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
          <Search size={16} className="text-subtle" />
        </div>

        {/* Input */}
        <Input
          ref={ref}
          type="text"
          value={value}
          className={cn('pl-9', hasClearButton && 'pr-9', className)}
          {...props}
        />

        {/* Clear Button */}
        {hasClearButton && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-subtle hover:text-text transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
