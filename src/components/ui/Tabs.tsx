import { ReactNode, createContext, useContext, HTMLAttributes, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Tabs Context
 */
interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within Tabs');
  }
  return context;
};

/**
 * Tabs Root
 */
export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
}

export function Tabs({ value, onValueChange, children, className, ...props }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={cn('flex flex-col', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

/**
 * TabsList - 탭 버튼 컨테이너
 */
export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {}

export function TabsList({ className, children, ...props }: TabsListProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 bg-surface p-1 rounded-lg border border-default',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * TabsTrigger - 탭 버튼
 */
export interface TabsTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function TabsTrigger({ value, className, children, ...props }: TabsTriggerProps) {
  const { value: selectedValue, onValueChange } = useTabsContext();
  const isActive = selectedValue === value;

  return (
    <button
      type="button"
      onClick={() => onValueChange(value)}
      className={cn(
        'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        isActive
          ? 'bg-surface-elevated text-text shadow-4'
          : 'text-muted hover:text-text hover:bg-surface-raised',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * TabsContent - 탭 콘텐츠
 */
export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({ value, className, children, ...props }: TabsContentProps) {
  const { value: selectedValue } = useTabsContext();

  if (selectedValue !== value) {
    return null;
  }

  return (
    <div className={cn('mt-4', className)} {...props}>
      {children}
    </div>
  );
}
