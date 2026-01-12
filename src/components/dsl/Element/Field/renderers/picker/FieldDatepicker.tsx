/**
 * FieldDatepicker - 날짜/시간 입력 필드 렌더러
 *
 * date, datetime 타입을 지원합니다.
 * FieldCalendar를 팝오버로 띄워 선택합니다.
 *
 * @example
 * <FieldDatepicker
 *   label="Birth Date"
 *   model="user.birthDate"
 *   type="date"
 *   prominence="Standard"
 * />
 */

import { Calendar, Clock } from 'lucide-react';
import { useRef } from 'react';
import { usePopover } from '@/components/headless/components/usePopover';
import type { FieldConstraints } from '@/components/dsl/Element/Field/Field.types';
import type { Intent, Prominence } from '@/components/dsl/Shared.types';
import { cn } from '@/shared/lib/utils';
import { fieldWrapperStyles, inputStyles, labelStyles } from '../../styles/field.styles';
import { FieldCalendar } from './FieldCalendar';

export interface FieldDatepickerProps {
  label: string;
  model: string;
  type: 'date' | 'datetime' | 'time';
  prominence?: Prominence;
  intent?: Intent;
  density?: 'Comfortable' | 'Standard' | 'Compact';
  constraints?: FieldConstraints;
  required?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function FieldDatepicker(props: FieldDatepickerProps) {
  const {
    label,
    model,
    type,
    prominence = 'Standard',
    intent = 'Neutral',
    density = 'Standard',
    _constraints,
    required = false,
    placeholder,
    value,
    onChange,
    className,
    disabled = false,
  } = props;

  const { isOpen, getTriggerProps, getPopoverProps, close } = usePopover({
    placement: 'bottom-start',
    closeOnBlur: true,
  });

  const handleDateSelect = (dateStr: string) => {
    onChange?.(dateStr);
    if (type === 'date') {
      close();
    }
  };

  const getFormatIcon = () => {
    if (type === 'time') return <Clock size={16} />;
    return <Calendar size={16} />;
  };

  const _popoverRef = useRef<HTMLDivElement>(null);

  // Apply popover props to the ref inside the component
  const { ref: hookRef, ...popoverProps } = getPopoverProps();

  return (
    <div className={cn(fieldWrapperStyles({ density }), className, 'relative')}>
      {/* Label */}
      <label htmlFor={model} className={labelStyles({ prominence, required })}>
        {label}
      </label>

      {/* Trigger Input */}
      <div className="relative group">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-hover:text-text transition-colors">
          {getFormatIcon()}
        </div>
        <input
          {...getTriggerProps()}
          id={model}
          readOnly
          value={value || ''}
          placeholder={placeholder || (type === 'time' ? 'Select time' : 'Select date')}
          disabled={disabled}
          className={cn(
            inputStyles({
              prominence,
              density,
              intent,
              dataType: 'text', // use text style
            }),
            'pl-10 cursor-pointer'
          )}
        />
      </div>

      {/* Popover Content */}
      {isOpen && !disabled && (
        <div
          ref={hookRef}
          {...popoverProps}
          className="absolute z-50 top-full left-0 mt-1 shadow-xl bg-surface border border-border rounded-lg animate-in fade-in zoom-in-95 duration-200"
        >
          {type === 'time' ? (
            <div className="p-4">
              <div className="text-sm text-center text-muted">Thinking about time...</div>
              <input
                type="time"
                className="mt-2 w-full bg-layer-2 border border-border rounded p-2"
                value={value}
                onChange={(e) => {
                  onChange?.(e.target.value);
                }}
              />
            </div>
          ) : (
            <FieldCalendar
              label="" // Embedded, so no label
              model={`${model}-calendar`}
              value={value?.includes('T') ? value.split('T')[0] : value}
              onChange={(date) => {
                if (type === 'datetime') {
                  // Append time if needed, currently simplifed to just Date
                  const currentTime = value?.includes('T') ? value.split('T')[1] : '00:00';
                  handleDateSelect(`${date}T${currentTime}`);
                } else {
                  handleDateSelect(date);
                }
              }}
              className="bg-transparent m-0 p-0"
            />
          )}

          {/* DateTime Time Selector Addon */}
          {type === 'datetime' && (
            <div className="border-t border-border p-3 flex items-center justify-between rounded-b-lg">
              <span className="text-xs text-muted">Time:</span>
              <input
                type="time"
                className="bg-layer-2 border border-border rounded px-2 py-1 text-xs"
                value={value?.includes('T') ? value.split('T')[1] : '00:00'}
                onChange={(e) => {
                  const datePart = value?.includes('T')
                    ? value.split('T')[0]
                    : new Date().toISOString().split('T')[0];
                  onChange?.(`${datePart}T${e.target.value}`);
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
