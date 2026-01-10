/**
 * Toolbar - Toolbar role renderer (v4.0)
 *
 * **Toolbar의 특징**:
 * - 가로 배치 (flex items-center)
 * - 밀도에 따른 gap 조절
 * - Divider 지원 (도구 그룹 구분)
 * - Sticky 옵션 지원
 * - 배경색과 border 옵션
 *
 * **사용 예시**:
 * ```tsx
 * <Block role="Toolbar" density="Compact" sticky>
 *   <Action role="IconButton" title="Save"><Save size={20} /></Action>
 *   <Action role="IconButton" title="Undo"><Undo size={20} /></Action>
 *   <ToolbarDivider />
 *   <Action role="IconButton" title="Bold"><Bold size={20} /></Action>
 * </Block>
 * ```
 */

import { cn } from '@/shared/lib/utils';
import type { BlockRendererProps } from '../role-config';

export interface ToolbarProps extends BlockRendererProps {
  role: 'Toolbar';
  sticky?: boolean; // Sticky positioning
  border?: 'top' | 'bottom' | 'both' | 'none'; // Border options
}

export function Toolbar({
  children,
  computedDensity,
  computedProminence,
  computedIntent,
  sticky = false,
  border = 'none',
  Element,
  // Ignore props not relevant to Toolbar but passed by Block generic renderer
  mode,
  defaultValue,
  accordionValue,
  onValueChange,
  items,
  onReorder,
  renderItem,
  ...rest
}: ToolbarProps & Record<string, any>) {
  // Density에 따른 gap 조절
  const densityGap = {
    Compact: 'gap-1',
    Standard: 'gap-2',
    Comfortable: 'gap-3',
  }[computedDensity];

  // Density에 따른 padding 조절
  const densityPadding = {
    Compact: 'px-2 py-1',
    Standard: 'px-3 py-2',
    Comfortable: 'px-4 py-3',
  }[computedDensity];

  // Border 스타일
  const borderStyles = {
    top: 'border-t border-border-default',
    bottom: 'border-b border-border-default',
    both: 'border-y border-border-default',
    none: '',
  }[border];

  return (
    <Element
      className={cn(
        // Base Toolbar styles
        'flex items-center bg-surface',
        densityGap,
        densityPadding,
        borderStyles,
        // Sticky positioning
        sticky && 'sticky top-0 z-10'
        // Custom className
      )}
      aria-label="Toolbar"
      data-dsl-component="block"
      data-role="Toolbar"
      data-density={computedDensity}
      {...rest}
    >
      {children}
    </Element>
  );
}

/**
 * ToolbarDivider - Toolbar 내부 구분선
 *
 * **사용 예시**:
 * ```tsx
 * <Block role="Toolbar">
 *   <Action>Save</Action>
 *   <ToolbarDivider />
 *   <Action>Bold</Action>
 * </Block>
 * ```
 */
export function ToolbarDivider({ className }: { className?: string }) {
  return (
    <div className={cn('w-px h-6 bg-border-muted')} role="separator" aria-orientation="vertical" />
  );
}

/**
 * ToolbarBlock - Toolbar 내부 그룹 (Divider 자동 추가)
 *
 * **사용 예시**:
 * ```tsx
 * <Block role="Toolbar">
 *   <ToolbarBlock>
 *     <Action>Save</Action>
 *     <Action>Undo</Action>
 *   </ToolbarBlock>
 *   <ToolbarBlock>
 *     <Action>Bold</Action>
 *     <Action>Italic</Action>
 *   </ToolbarBlock>
 * </Block>
 * ```
 */
export function ToolbarBlock({ children }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center gap-1')} role="group">
      {children}
    </div>
  );
}
