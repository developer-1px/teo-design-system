/**
 * OTPField - OTP/PIN 입력 렌더러
 *
 * 6자리(또는 n자리) 코드를 입력받는 분할된 인풋 필드입니다.
 * - 자동 포커스 이동 (입력 시 다음, 백스페이스 시 이전)
 * - 붙여넣기 지원
 * - 숫자 전용 모드 지원
 */

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import type { Intent, Prominence } from '@/components/types/Shared.types';
import { cn } from '@/shared/lib/utils';
import {
  errorStyles,
  fieldWrapperStyles,
  inputStyles,
  labelStyles,
} from '../../styles/field.styles';

export interface FieldOtpProps {
  /** Field label */
  label: string;

  /** Field model name */
  model: string;

  /** OTP Length (default: 6) */
  length?: number;

  /** Numeric only (default: false) */
  numeric?: boolean;

  /** Controlled value (string) */
  value?: string;

  /** Change handler */
  onChange?: (value: string) => void;

  /** Prominence level */
  prominence?: Prominence;

  /** Intent (error state etc) */
  intent?: Intent;

  /** Density */
  density?: 'Comfortable' | 'Standard' | 'Compact';

  /** Required */
  required?: boolean;

  /** Disabled */
  disabled?: boolean;

  /** Placeholder (not typically used in OTP but good for API match) */
  placeholder?: string;

  className?: string;

  /** Error message */
  error?: string;
}

export function FieldOtp(props: FieldOtpProps) {
  const {
    label,
    model,
    length = 6,
    numeric = false,
    value = '',
    onChange,
    prominence = 'Standard',
    intent = 'Neutral',
    density = 'Standard',
    required = false,
    disabled = false,
    className,
    error,
  } = props;

  // Split value into array of characters
  // Ensure we have an array of length `length`
  const getDigits = (val: string) => {
    const chars = val.split('');
    const padded = [...chars];
    while (padded.length < length) padded.push('');
    return padded.slice(0, length);
  };

  const digits = getDigits(value);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize refs array
  if (inputRefs.current.length !== length) {
    inputRefs.current = Array(length).fill(null);
  }

  const handleChange = (index: number, char: string) => {
    if (disabled) return;

    // Numeric check
    if (numeric && char && !/^\d+$/.test(char)) return;

    // Take only the last character if multiple chars entered (unexpected usually)
    const newChar = char.slice(-1);

    const newDigits = [...digits];
    newDigits[index] = newChar;

    const newValue = newDigits.join('');
    onChange?.(newValue);

    // Auto focus next
    if (newChar && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // If empty, move prev and delete
        e.preventDefault();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange?.(newDigits.join(''));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (!pasted) return;

    let chars = pasted.split('');
    if (numeric) {
      chars = chars.filter((c) => /^\d$/.test(c));
    }

    chars = chars.slice(0, length);

    // Merge with current value ?? Usually paste replaces component state from start or focused index?
    // Let's replace simple logic: replace whole value
    onChange?.(chars.join(''));

    // Focus last filled
    const lastIdx = Math.min(chars.length, length) - 1;
    if (lastIdx >= 0) {
      inputRefs.current[lastIdx]?.focus();
    }
  };

  // Update refs when length changes? ref array init handles it generally but React might warn if hooks vary.
  // OTP length is usually static.

  return (
    <div className={cn(fieldWrapperStyles({ density }), className)}>
      {/* Label */}
      <label htmlFor={`${model}-0`} className={labelStyles({ prominence, required })}>
        {label}
      </label>

      <div className="flex gap-2">
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            id={i === 0 ? model : `${model}-${i}`}
            type={numeric ? 'tel' : 'text'}
            inputMode={numeric ? 'numeric' : 'text'}
            value={digits[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            disabled={disabled}
            maxLength={1}
            className={cn(
              inputStyles({ prominence, intent, error: !!error }),
              'w-10 h-10 text-center p-0 flex items-center justify-center font-mono text-lg'
            )}
            autoComplete="off"
          />
        ))}
      </div>

      {/* Error message */}
      {error && (
        <span className={errorStyles()} id={`${model}-error`} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
