/**
 * FieldCalendar - 캘린더 입력 필드 렌더러
 *
 * 간단한 캘린더 UI를 제공합니다.
 * - 월 이동
 * - 날짜 선택
 * - 오늘 날짜 표시
 *
 * @example
 * <FieldCalendar
 *   label="Meeting Date"
 *   model="meetDate"
 *   prominence="Standard"
 * />
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { Intent, Prominence } from '@/components/dsl/Shared.types';
import { cn } from '@/shared/lib/utils';
import { fieldWrapperStyles, labelStyles } from '../../styles/field.styles';

export interface FieldCalendarProps {
  label: string;
  model: string;
  prominence?: Prominence;
  intent?: Intent;
  value?: string; // YYYY-MM-DD
  onChange?: (value: string) => void;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

export function FieldCalendar(props: FieldCalendarProps) {
  const {
    label,
    model,
    prominence = 'Standard',
    intent = 'Neutral',
    value,
    onChange,
    className,
    required = false,
    disabled = false,
  } = props;

  // Initialize state
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);

  // Helper: Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper: Get start day of week (0=Sun, 6=Sat)
  const getStartDayOfWeek = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Navigation
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Selection
  const handleDateClick = (day: number) => {
    if (disabled) return;
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange?.(dateStr);
  };

  // Render Setup
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const startDay = getStartDayOfWeek(year, month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startDay }, (_, i) => i);

  const isSelected = (day: number) => {
    if (!value) return false;
    const [selYear, selMonth, selDay] = value.split('-').map(Number);
    return selYear === year && selMonth === month + 1 && selDay === day;
  };

  const isToday = (day: number) => {
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <div className={cn(fieldWrapperStyles(), className)} data-model={model}>
      {/* Label */}
      <label htmlFor={model} className={labelStyles({ prominence, required })}>
        {label}
      </label>

      {/* Calendar UI */}
      <div
        className={cn(
          'border border-border rounded-lg p-4 bg-layer-1 w-fit',
          disabled && 'opacity-50 pointer-events-none'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1 hover:bg-layer-2 rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-semibold text-text">
            {monthNames[month]} {year}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1 hover:bg-layer-2 rounded-full transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs text-muted font-medium">
          <div>Su</div>
          <div>Mo</div>
          <div>Tu</div>
          <div>We</div>
          <div>Th</div>
          <div>Fr</div>
          <div>Sa</div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1">
          {blanks.map((b) => (
            <div key={`blank-${b}`} />
          ))}
          {days.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => handleDateClick(day)}
              className={cn(
                'w-8 h-8 rounded-full text-sm flex items-center justify-center transition-all',
                isSelected(day) ? 'bg-accent text-white font-bold' : 'hover:bg-layer-2 text-text',
                isToday(day) && !isSelected(day) && 'border border-accent text-accent',
                'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1'
              )}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
