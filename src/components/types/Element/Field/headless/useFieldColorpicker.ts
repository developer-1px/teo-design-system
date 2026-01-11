/**
 * useColorpickerField - Color picker 헤드리스 훅
 *
 * IDDL Field Spec: Control Category - Colorpicker
 * 색상 선택 with format, alpha, presets 지원
 *
 * @see docs/2-areas/spec/4-element/field/field.spec.md#632-colorpicker
 */

import { useState, useEffect, useCallback } from 'react';

export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsv';

export interface UseColorpickerFieldOptions {
  /**
   * Output format
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
   * Current value (controlled)
   */
  value?: string;

  /**
   * onChange callback
   */
  onChange?: (value: string) => void;

  /**
   * Disabled state
   */
  disabled?: boolean;
}

export interface UseColorpickerFieldReturn {
  /**
   * Current color value
   */
  value: string;

  /**
   * Set color value
   */
  setValue: (color: string) => void;

  /**
   * Select a preset
   */
  selectPreset: (color: string) => void;

  /**
   * Props for native color input (for basic functionality)
   */
  inputProps: () => {
    type: 'color';
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
  };
}

/**
 * Color format conversion utilities
 */
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return hex;
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  return `rgb(${r}, ${g}, ${b})`;
}

function rgbToHex(rgb: string): string {
  const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i.exec(rgb);
  if (!result) return rgb;
  const r = parseInt(result[1]);
  const g = parseInt(result[2]);
  const b = parseInt(result[3]);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function convertColor(color: string, targetFormat: ColorFormat): string {
  // Simple conversion (hex ↔ rgb only for now)
  // Full HSL/HSV conversion would require more complex math
  if (targetFormat === 'rgb' && color.startsWith('#')) {
    return hexToRgb(color);
  }
  if (targetFormat === 'hex' && color.startsWith('rgb')) {
    return rgbToHex(color);
  }
  return color;
}

/**
 * useColorpickerField Hook
 */
export function useFieldColorpicker(options: UseColorpickerFieldOptions): UseColorpickerFieldReturn {
  const {
    format = 'hex',
    alpha = false,
    presets = [],
    value: controlledValue,
    onChange,
    disabled = false,
  } = options;
  // Internal state for uncontrolled usage
  const [internalValue, setInternalValue] = useState<string>(controlledValue || '#000000');

  // Determine if controlled
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  // Sync internal value
  useEffect(() => {
    if (!isControlled && controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue, isControlled]);

  /**
   * Set color value
   */
  const setValue = useCallback(
    (color: string) => {
      if (disabled) return;

      const convertedColor = convertColor(color, format);

      if (!isControlled) {
        setInternalValue(convertedColor);
      }

      if (onChange) {
        onChange(convertedColor);
      }
    },
    [format, isControlled, onChange, disabled]
  );

  /**
   * Select a preset
   */
  const selectPreset = useCallback(
    (color: string) => {
      setValue(color);
    },
    [setValue]
  );

  /**
   * Props for native color input
   */
  const inputProps = useCallback(
    () => ({
      type: 'color' as const,
      value: value.startsWith('#') ? value : '#000000', // Native input requires hex
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
      },
      ...(disabled && { disabled: true }),
    }),
    [value, setValue, disabled]
  );

  return {
    value,
    setValue,
    selectPreset,
    inputProps,
  };
}
