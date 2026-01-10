/**
 * Accordion - Accordion role renderer (v4.0)
 *
 * **Accordion의 특징**:
 * - 펼침/접힘 기능 (Collapsible sections)
 * - 키보드 네비게이션 (Enter, ArrowUp, ArrowDown)
 * - Single vs Multiple mode (한 번에 하나만 펼침 vs 여러 개 펼침)
 * - ARIA 속성 자동 적용 (역할, 상태, 관계)
 *
 * **사용 예시**:
 * ```tsx
 * <Group role="Accordion" mode="single" defaultValue="item-1">
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>Section 1</AccordionTrigger>
 *     <AccordionContent>Content 1</AccordionContent>
 *   </AccordionItem>
 *   <AccordionItem value="item-2">
 *     <AccordionTrigger>Section 2</AccordionTrigger>
 *     <AccordionContent>Content 2</AccordionContent>
 *   </AccordionItem>
 * </Group>
 * ```
 */

import { createContext, useContext, useState, useRef, useEffect, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import type { GroupProps } from '@/components/types/Atom/types';
import { cn } from '@/shared/lib/utils';

// ============================================
// Accordion Context
// ============================================

interface AccordionContextValue {
  value: string | string[]; // 현재 열린 아이템(들)
  onValueChange: (value: string) => void; // 아이템 토글
  mode: 'single' | 'multiple'; // 단일 선택 vs 다중 선택
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('AccordionItem must be used within Accordion');
  }
  return context;
}

// ============================================
// Accordion Item Context
// ============================================

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionItem() {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionTrigger/AccordionContent must be used within AccordionItem');
  }
  return context;
}

// ============================================
// Accordion (Root)
// ============================================

export interface AccordionProps extends Omit<GroupProps, 'role'> {
  role: 'Accordion';
  computedDensity: 'Compact' | 'Standard' | 'Comfortable';
  computedProminence: GroupProps['prominence'];
  computedIntent: GroupProps['intent'];
  Element: any;
  mode?: 'single' | 'multiple'; // 단일 선택 vs 다중 선택
  defaultValue?: string | string[]; // 초기 열린 아이템
  value?: string | string[]; // Controlled mode
  onValueChange?: (value: string | string[]) => void; // Controlled mode callback
}

export function Accordion({
  children,
  computedDensity,
  computedProminence,
  computedIntent,
  mode = 'single',
  defaultValue,
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  Element,
  ...rest
}: AccordionProps) {
  // Uncontrolled mode: 내부 state 사용
  const [internalValue, setInternalValue] = useState<string | string[]>(
    defaultValue ?? (mode === 'single' ? '' : [])
  );

  // Controlled vs Uncontrolled
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleValueChange = (itemValue: string) => {
    let newValue: string | string[];

    if (mode === 'single') {
      // Single mode: 같은 아이템 클릭 시 닫기
      newValue = value === itemValue ? '' : itemValue;
    } else {
      // Multiple mode: toggle
      const currentArray = Array.isArray(value) ? value : [];
      newValue = currentArray.includes(itemValue)
        ? currentArray.filter((v) => v !== itemValue)
        : [...currentArray, itemValue];
    }

    if (isControlled) {
      controlledOnValueChange?.(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  // Density에 따른 spacing
  const densitySpacing = {
    Compact: 'space-y-1',
    Standard: 'space-y-2',
    Comfortable: 'space-y-3',
  }[computedDensity];

  return (
    <AccordionContext.Provider value={{ value, onValueChange: handleValueChange, mode }}>
      <Element
        className={cn('flex flex-col', densitySpacing)}
        data-dsl-component="group"
        data-role="Accordion"
        data-density={computedDensity}
        {...rest}
      >
        {children}
      </Element>
    </AccordionContext.Provider>
  );
}

// ============================================
// AccordionItem
// ============================================

export interface AccordionItemProps {
  value: string; // 고유 식별자
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function AccordionItem({ value, children, disabled = false }: AccordionItemProps) {
  const { value: openValue } = useAccordion();
  const isOpen = Array.isArray(openValue) ? openValue.includes(value) : openValue === value;

  const triggerId = `accordion-trigger-${value}`;
  const contentId = `accordion-content-${value}`;

  return (
    <AccordionItemContext.Provider value={{ value, isOpen, triggerId, contentId }}>
      <div
        className={cn('border border-border-default rounded-lg overflow-hidden')}
        data-state={isOpen ? 'open' : 'closed'}
        data-disabled={disabled}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

// ============================================
// AccordionTrigger
// ============================================

export interface AccordionTriggerProps {
  children: ReactNode;
  className?: string;
  icon?: ReactNode; // 커스텀 아이콘
}

export function AccordionTrigger({ children, icon }: AccordionTriggerProps) {
  const { onValueChange } = useAccordion();
  const { value, isOpen, triggerId, contentId } = useAccordionItem();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = () => {
    onValueChange(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // ArrowUp/ArrowDown: 다음/이전 아코디언 아이템으로 이동
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const allTriggers = document.querySelectorAll('[data-accordion-trigger]');
      const currentIndex = Array.from(allTriggers).indexOf(buttonRef.current!);

      let nextIndex: number;
      if (e.key === 'ArrowDown') {
        nextIndex = currentIndex + 1 >= allTriggers.length ? 0 : currentIndex + 1;
      } else {
        nextIndex = currentIndex - 1 < 0 ? allTriggers.length - 1 : currentIndex - 1;
      }

      (allTriggers[nextIndex] as HTMLElement).focus();
    }

    // Home/End: 첫/마지막 아이템으로 이동
    if (e.key === 'Home') {
      e.preventDefault();
      const allTriggers = document.querySelectorAll('[data-accordion-trigger]');
      (allTriggers[0] as HTMLElement).focus();
    }

    if (e.key === 'End') {
      e.preventDefault();
      const allTriggers = document.querySelectorAll('[data-accordion-trigger]');
      (allTriggers[allTriggers.length - 1] as HTMLElement).focus();
    }
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      id={triggerId}
      aria-expanded={isOpen}
      aria-controls={contentId}
      data-accordion-trigger
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'flex items-center justify-between w-full px-4 py-3 text-left',
        'bg-surface hover:bg-surface-elevated transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        'text-text-primary font-medium',
      )}
    >
      <span>{children}</span>
      <span
        className={cn(
          'transition-transform duration-200',
          isOpen && 'rotate-180'
        )}
      >
        {icon ?? <ChevronDown size={20} />}
      </span>
    </button>
  );
}

// ============================================
// AccordionContent
// ============================================

export interface AccordionContentProps {
  children: ReactNode;
  className?: string;
}

export function AccordionContent({ children, className }: AccordionContentProps) {
  const { isOpen, triggerId, contentId } = useAccordionItem();
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(isOpen ? undefined : 0);

  // Auto-height animation
  useEffect(() => {
    if (!contentRef.current) return;

    if (isOpen) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(contentHeight);

      // 애니메이션 완료 후 height를 auto로 변경 (내부 콘텐츠 크기 변경 대응)
      const timer = setTimeout(() => {
        setHeight(undefined);
      }, 200); // transition duration과 동일

      return () => clearTimeout(timer);
    } else {
      setHeight(contentRef.current.scrollHeight);
      // Force reflow
      contentRef.current.offsetHeight;
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div
      ref={contentRef}
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      data-state={isOpen ? 'open' : 'closed'}
      style={{
        height: height !== undefined ? `${height}px` : 'auto',
        overflow: 'hidden',
        transition: 'height 200ms ease-out',
      }}
    >
      <div className={cn('px-4 py-3 text-text-secondary')}>
        {children}
      </div>
    </div>
  );
}
