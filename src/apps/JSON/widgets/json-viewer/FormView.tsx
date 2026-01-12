/**
 * FormView - JSON 데이터를 Form으로 표시하는 뷰 컴포넌트
 *
 * Notion처럼 우측 패널에서 JSON 데이터를 필드별로 편집할 수 있도록 표시합니다.
 */

import { X } from 'lucide-react';
import { useMemo } from 'react';
import type { JsonObject } from '@/apps/JSON/widgets/database/types';
import { IDDLProvider } from '@/components/context/IDDLContext';
import { Field } from '@/components/dsl/Element/Field/Field';

export interface FormViewProps {
  /**
   * 표시할 JSON 데이터 (단일 객체)
   */
  data: JsonObject;

  /**
   * 필드 변경 콜백
   */
  onChange?: (key: string, value: unknown) => void;

  /**
   * 닫기 콜백
   */
  onClose?: () => void;

  /**
   * Read-only 모드 (기본값: false)
   */
  readOnly?: boolean;
}

/**
 * JSON 값의 타입에 따라 적절한 dataType 추론
 */
function inferDataType(value: unknown): string {
  if (value === null || value === undefined) {
    return 'text';
  }

  if (typeof value === 'boolean') {
    return 'boolean';
  }

  if (typeof value === 'number') {
    return 'number';
  }

  if (Array.isArray(value)) {
    return 'textarea'; // 배열은 JSON 문자열로 표시
  }

  if (typeof value === 'object') {
    return 'textarea'; // 객체는 JSON 문자열로 표시
  }

  // String type inference
  const str = String(value);

  // Email pattern
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) {
    return 'email';
  }

  // URL pattern
  if (/^https?:\/\/.+/.test(str)) {
    return 'url';
  }

  // Date pattern (ISO 8601)
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
    return 'date';
  }

  // Color pattern (#hex)
  if (/^#[0-9A-Fa-f]{6}$/.test(str)) {
    return 'color';
  }

  return 'text';
}

/**
 * 필드 키를 사람이 읽기 쉬운 라벨로 변환
 */
function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1') // camelCase → spaces
    .replace(/[_-]/g, ' ') // snake_case, kebab-case → spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
    .trim();
}

export function FormView({ data, onChange, onClose, readOnly = false }: FormViewProps) {
  // 필드 목록 생성
  const fields = useMemo(() => {
    return Object.entries(data).map(([key, value]) => {
      const dataType = inferDataType(value);
      let displayValue = value;

      // 배열/객체는 JSON 문자열로 변환
      if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
        displayValue = JSON.stringify(value, null, 2);
      }

      return {
        key,
        label: formatLabel(key),
        dataType,
        value: displayValue,
      };
    });
  }, [data]);

  return (
    <IDDLProvider
      value={{
        prominence: 'Standard',
        density: 'Compact',
        intent: 'Neutral',
        depth: 1,
        mode: readOnly ? 'view' : 'edit',
      }}
    >
      <div className="h-full w-full flex flex-col bg-surface border-l border-border">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
          <h2 className="text-sm font-semibold text-text">Detail View</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-surface-raised transition-colors"
              title="Close"
            >
              <X size={16} className="text-subtle" />
            </button>
          )}
        </div>

        {/* Form Fields - 2 Column Grid Layout */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-4">
            {fields.map((field) => (
              <Field
                key={field.key}
                label={field.label}
                model={field.key}
                dataType={field.dataType as any}
                value={field.value}
                onChange={(e: any) => {
                  if (onChange && !readOnly) {
                    const newValue = e.target?.value ?? e;
                    onChange(field.key, newValue);
                  }
                }}
                density="Compact"
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        {!readOnly && (
          <div className="px-4 py-3 border-t border-border bg-surface-sunken">
            <p className="text-xs text-subtle">
              Changes are automatically saved (read-only preview)
            </p>
          </div>
        )}
      </div>
    </IDDLProvider>
  );
}
