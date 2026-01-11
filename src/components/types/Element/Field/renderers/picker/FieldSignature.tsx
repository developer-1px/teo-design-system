/**
 * SignatureField - 서명 캡처 필드 렌더러
 *
 * Headless useSignatureField + SignatureCanvas 조합
 * Canvas 기반 서명 캡처
 *
 * IDDL Field Spec: Picker Category - Signature
 *
 * @example
 * <SignatureField
 *   label="Your Signature"
 *   model="signature"
 *   penColor="#000000"
 *   penWidth={2}
 *   outputFormat="png"
 *   prominence="Standard"
 * />
 */

import { Trash2, Undo } from 'lucide-react';
import type { Intent, Prominence } from '@/components/types/Shared.types';
import { cn } from '@/shared/lib/utils';
import { type SignatureOutputFormat, useFieldSignature } from '../../headless/useFieldSignature';
import { errorStyles, fieldWrapperStyles, labelStyles } from '../../styles/field.styles';
import { SignatureCanvasRole } from './SignatureCanvasRole';

export interface FieldSignatureProps {
  /**
   * Field label
   */
  label: string;

  /**
   * Field model name (data binding key)
   */
  model: string;

  /**
   * Pen color
   */
  penColor?: string;

  /**
   * Pen width
   */
  penWidth?: number;

  /**
   * Canvas background color
   */
  backgroundColor?: string;

  /**
   * Output format
   */
  outputFormat?: SignatureOutputFormat;

  /**
   * Trim whitespace on export
   */
  trimWhitespace?: boolean;

  /**
   * Canvas width
   */
  width?: number;

  /**
   * Canvas height
   */
  height?: number;

  /**
   * Prominence level
   */
  prominence?: Prominence;

  /**
   * Intent (semantic color)
   */
  intent?: Intent;

  /**
   * Density (spacing)
   */
  density?: 'Comfortable' | 'Standard' | 'Compact';

  /**
   * Required field
   */
  required?: boolean;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Error message
   */
  error?: string;

  /**
   * className
   */
  className?: string;

  /**
   * Controlled value (data URL)
   */
  value?: string;

  /**
   * onChange callback
   */
  onChange?: (value: string) => void;

  /**
   * Placeholder (무의미하지만 일관성을 위해 유지)
   */
  placeholder?: string;
}

/**
 * FieldSignature Component
 */
export function FieldSignature({
  label,
  model,
  penColor = '#000000',
  penWidth = 2,
  backgroundColor = '#FFFFFF',
  outputFormat = 'png',
  trimWhitespace = true,
  width = 500,
  height = 200,
  prominence,
  intent,
  density,
  required,
  disabled,
  error,
  className,
  value,
  onChange,
}: FieldSignatureProps) {
  // Headless logic
  const field = useFieldSignature({
    penColor,
    penWidth,
    backgroundColor,
    outputFormat,
    trimWhitespace,
    value,
    onChange,
    disabled,
  });

  return (
    <div
      className={cn(
        fieldWrapperStyles({
          prominence: prominence as 'Hero' | 'Standard' | 'Strong' | 'Subtle',
          intent: intent as 'Neutral' | 'Brand' | 'Positive' | 'Caution' | 'Critical',
          density: density as 'Comfortable' | 'Standard' | 'Compact',
        }),
        className
      )}
      data-model={model}
    >
      {/* Label */}
      <label
        className={labelStyles({
          prominence: prominence as 'Hero' | 'Standard' | 'Strong' | 'Subtle',
        })}
      >
        {label}
        {required && <span className="text-critical ml-1">*</span>}
      </label>

      {/* Canvas */}
      <div className="space-y-2">
        <SignatureCanvasRole
          canvasRef={field.canvasRef}
          width={width}
          height={height}
          backgroundColor={backgroundColor}
          disabled={disabled}
          onMouseDown={field.startDrawing}
          onMouseMove={field.draw}
          onMouseUp={field.stopDrawing}
          onMouseLeave={field.stopDrawing}
          onTouchStart={field.startDrawing}
          onTouchMove={field.draw}
          onTouchEnd={field.stopDrawing}
        />

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={field.undo}
            disabled={disabled || field.isEmpty}
            className={cn(
              'px-3 py-1.5 text-sm border border-border rounded-md',
              'flex items-center gap-1.5',
              'hover:bg-layer-2 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            aria-label="Undo last stroke"
          >
            <Undo size={16} />
            Undo
          </button>

          <button
            type="button"
            onClick={field.clear}
            disabled={disabled || field.isEmpty}
            className={cn(
              'px-3 py-1.5 text-sm border border-border rounded-md',
              'flex items-center gap-1.5',
              'hover:bg-layer-2 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            aria-label="Clear signature"
          >
            <Trash2 size={16} />
            Clear
          </button>

          {field.isEmpty && !disabled && (
            <span className="text-xs text-subtle ml-auto">Sign in the box above</span>
          )}
        </div>
      </div>

      {/* Error */}
      {error && <p className={errorStyles()}>{error}</p>}
    </div>
  );
}
