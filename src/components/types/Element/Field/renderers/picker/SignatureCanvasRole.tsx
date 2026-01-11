/**
 * SignatureCanvas - 서명 캡처 Canvas primitive
 *
 * IDDL Field Spec: Picker Category - Signature
 * ARIA role: application
 *
 * @see docs/2-areas/spec/4-element/field/field.spec.md#644-signature
 */

import { cn } from '@/shared/lib/utils';

export interface SignatureCanvasProps {
  /**
   * Canvas ref (from hook)
   */
  canvasRef: React.RefObject<HTMLCanvasElement>;

  /**
   * Canvas width
   */
  width?: number;

  /**
   * Canvas height
   */
  height?: number;

  /**
   * Background color
   */
  backgroundColor?: string;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * onMouseDown handler (from hook)
   */
  onMouseDown?: (e: React.MouseEvent<HTMLCanvasElement>) => void;

  /**
   * onMouseMove handler (from hook)
   */
  onMouseMove?: (e: React.MouseEvent<HTMLCanvasElement>) => void;

  /**
   * onMouseUp handler (from hook)
   */
  onMouseUp?: () => void;

  /**
   * onMouseLeave handler (from hook)
   */
  onMouseLeave?: () => void;

  /**
   * onTouchStart handler (from hook)
   */
  onTouchStart?: (e: React.TouchEvent<HTMLCanvasElement>) => void;

  /**
   * onTouchMove handler (from hook)
   */
  onTouchMove?: (e: React.TouchEvent<HTMLCanvasElement>) => void;

  /**
   * onTouchEnd handler (from hook)
   */
  onTouchEnd?: () => void;

  /**
   * className
   */
  className?: string;
}

/**
 * SignatureCanvas Component
 */
export function SignatureCanvasRole({
  canvasRef,
  width = 500,
  height = 200,
  backgroundColor = '#FFFFFF',
  disabled,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  className,
}: SignatureCanvasProps) {
  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      aria-label="Signature canvas"
      className={cn(
        'border-2 border-border rounded-lg cursor-crosshair',
        'touch-none', // Prevent default touch scrolling
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
      style={{ backgroundColor }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    />
  );
}
