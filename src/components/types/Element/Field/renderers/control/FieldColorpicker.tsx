/**
 * ColorField - 색상 선택 필드 렌더러 (IDDL Spec 준수)
 *
 * Headless useColorpickerField + CVA styles 조합
 * format, alpha, presets 지원
 *
 * IDDL Field Spec: Control Category - Colorpicker
 *
 * @example
 * <ColorField
 *   label="Brand Color"
 *   model="theme.primaryColor"
 *   type="color"
 *   format="hex"
 *   alpha={true}
 *   presets={['#FF0000', '#00FF00', '#0000FF']}
 *   prominence="Standard"
 * />
 */

import type { Intent, Prominence } from '@/components/types/Shared.types';
import { cn } from '@/shared/lib/utils';
import { type ColorFormat, useFieldColorpicker } from '../../headless/useFieldColorpicker';
import { errorStyles, fieldWrapperStyles, labelStyles } from '../../styles/field.styles';

export interface FieldColorpickerProps {
  /**
   * Field label
   */
  label: string;

  /**
   * Field model name (data binding key)
   */
  model: string;

  /**
   * Data type (always 'color')
   */
  type: 'color';

  /**
   * Output format (hex, rgb, hsl, hsv)
   */
  format?: ColorFormat;

  /**
   * Enable alpha/transparency
   */
  alpha?: boolean;

  /**
   * Preset color swatches
   */
  presets?: string[];

  /**
   * Variant display style
   */
  variant?: 'default' | 'compact' | 'swatch-only';

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
   * Controlled value (color string)
   */
  value?: string;

  /**
   * Change handler
   */
  onChange?: (value: string) => void;

  /**
   * Error message
   */
  error?: string;

  /**
   * Additional CSS class
   */
  className?: string;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Placeholder text (무의미하지만 일관성을 위해 유지)
   */
  placeholder?: string;
}

/**
 * FieldColorpicker Component
 */
export function FieldColorpicker({
  label,
  model,
  format = 'hex',
  alpha = false,
  presets = [],
  variant = 'default',
  prominence,
  intent,
  density,
  required,
  value: controlledValue,
  onChange,
  error,
  className,
  disabled,
}: FieldColorpickerProps) {
  // Use headless hook
  const colorpicker = useFieldColorpicker({
    format,
    alpha,
    presets,
    value: controlledValue,
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
      {variant !== 'swatch-only' && (
        <label
          htmlFor={model}
          className={labelStyles({
            prominence: prominence as 'Hero' | 'Standard' | 'Strong' | 'Subtle',
          })}
        >
          {label}
          {required && <span className="text-critical ml-1">*</span>}
        </label>
      )}

      {/* Color Picker */}
      <div className="flex items-center gap-3">
        {/* Native color input */}
        {variant !== 'swatch-only' && (
          <div className="flex items-center gap-2">
            <input
              {...colorpicker.inputProps()}
              id={model}
              name={model}
              required={required}
              className={cn(
                'w-12 h-12 rounded-lg border-2 border-border cursor-pointer',
                'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              data-model={model}
            />

            {/* Current color value display */}
            {variant === 'default' && (
              <span className="text-sm text-muted font-mono">{colorpicker.value}</span>
            )}
          </div>
        )}

        {/* Preset swatches */}
        {presets.length > 0 && (
          <div className="flex items-center gap-2">
            {variant !== 'swatch-only' && <span className="text-xs text-subtle">Presets:</span>}
            <div className="flex gap-1.5">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => colorpicker.selectPreset(preset)}
                  disabled={disabled}
                  className={cn(
                    'w-8 h-8 rounded-md border-2 cursor-pointer transition-transform',
                    'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2',
                    colorpicker.value === preset
                      ? 'border-accent ring-2 ring-accent'
                      : 'border-border',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                  style={{ backgroundColor: preset }}
                  title={preset}
                  aria-label={`Select color ${preset}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Alpha info (if enabled) */}
      {alpha && variant === 'default' && (
        <p className="text-xs text-subtle mt-1">Alpha/transparency enabled</p>
      )}

      {/* Error */}
      {error && <p className={errorStyles()}>{error}</p>}
    </div>
  );
}
