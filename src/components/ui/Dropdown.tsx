import { ReactNode, createContext, useContext, HTMLAttributes, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

/**
 * Dropdown Context
 */
interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownContext = createContext<DropdownContextValue | undefined>(undefined);

const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('Dropdown compound components must be used within Dropdown');
  }
  return context;
};

/**
 * Dropdown Root
 */
export interface DropdownProps {
  children: ReactNode;
}

export function Dropdown({ children }: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
}

/**
 * DropdownTrigger - 드롭다운 트리거
 */
export interface DropdownTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function DropdownTrigger({ className, children, onClick, ...props }: DropdownTriggerProps) {
  const { open, setOpen } = useDropdownContext();

  return (
    <button
      type="button"
      onClick={(e) => {
        setOpen(!open);
        onClick?.(e);
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * DropdownContent - 드롭다운 콘텐츠
 */
export interface DropdownContentProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end';
}

export function DropdownContent({
  className,
  align = 'start',
  children,
  ...props
}: DropdownContentProps) {
  const { open, setOpen } = useDropdownContext();
  const contentRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      className={cn(
        // Base styles - Layer 5 (floating)
        'absolute z-50 mt-2 min-w-[200px] bg-surface-floating rounded-lg shadow-5 border border-default',
        'py-1',

        // Alignment
        {
          'left-0': align === 'start',
          'left-1/2 -translate-x-1/2': align === 'center',
          'right-0': align === 'end',
        },

        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * DropdownItem - 드롭다운 아이템
 */
export interface DropdownItemProps extends HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
}

export function DropdownItem({ className, disabled, onClick, children, ...props }: DropdownItemProps) {
  const { setOpen } = useDropdownContext();

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        onClick?.(e);
        setOpen(false);
      }}
      className={cn(
        'w-full px-3 py-2 text-left text-sm font-normal',
        'hover:bg-black/5 active:bg-black/10 transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:bg-black/5',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * DropdownSeparator - 드롭다운 구분선
 */
export function DropdownSeparator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('my-1 h-px bg-border', className)}
      {...props}
    />
  );
}
