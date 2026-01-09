/**
 * Field - IDDL Primitive
 *
 * 조회와 편집이 가능한 데이터 객체
 * Section의 mode에 따라 View(Text) 또는 Edit(Input)으로 렌더링
 *
 * @see spec/iddl-spec-1.0.1.md Section 4.1.2
 */

import { cn } from '@/lib/utils';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { Select } from './Select';
import { RadioGroup } from './RadioGroup';
import { CheckboxGroup } from './CheckboxGroup';
import { Slider } from './Slider';
import { Label } from './Label';
import { Badge } from './Badge';

/**
 * IDDL 1.0.1 DataType 전체 지원
 */
export type DataType =
  | 'text'
  | 'number'
  | 'currency'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'textarea'
  | 'richtext'
  | 'image'
  | 'file'
  | 'password'
  | 'email'
  | 'url'
  | 'phone'
  | 'color'
  | 'rating'
  | 'range';

export type Prominence = 'Hero' | 'Primary' | 'Secondary' | 'Tertiary';
export type Intent = 'Neutral' | 'Brand' | 'Positive' | 'Caution' | 'Critical' | 'Info';

export interface FieldOption {
  label: string;
  value: string | number | boolean;
  disabled?: boolean;
  icon?: string;
}

export interface FieldConstraints {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  patternMessage?: string;
  custom?: string;
}

export interface FieldProps {
  // Data Definition (IDDL Required)
  label: string;
  model: string; // 데이터 바인딩 키 (ex: "user.email")
  dataType: DataType;

  // Value
  value?: any;
  onChange?: (value: any) => void;

  // Constraints (IDDL)
  required?: boolean;
  options?: FieldOption[]; // For select/multiselect/radio/checkbox
  constraints?: FieldConstraints;
  dependsOn?: string;
  modeOverride?: 'view' | 'edit';

  // View/Edit Config
  placeholder?: string;
  mode?: 'view' | 'edit'; // Section에서 전파될 수도 있음

  // Styling
  prominence?: Prominence;
  intent?: Intent;
  className?: string;
}

/**
 * View Mode: 데이터 포맷팅 유틸리티
 */
function formatViewValue(dataType: DataType, value: any, options?: FieldOption[]): React.ReactNode {
  if (value == null || value === '') return '-';

  switch (dataType) {
    case 'text':
    case 'email':
    case 'url':
    case 'phone':
    case 'password':
      return value;

    case 'number':
      return Number(value).toLocaleString();

    case 'currency':
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
      }).format(value);

    case 'date':
      return new Date(value).toLocaleDateString('ko-KR');

    case 'datetime':
      return new Date(value).toLocaleString('ko-KR');

    case 'boolean':
      return value ? (
        <Badge variant="success" size="sm">
          Yes
        </Badge>
      ) : (
        <Badge variant="default" size="sm">
          No
        </Badge>
      );

    case 'select':
    case 'radio': {
      const option = options?.find((opt) => String(opt.value) === String(value));
      return option?.label ?? value;
    }

    case 'multiselect':
    case 'checkbox': {
      const selectedOptions = options?.filter((opt) =>
        Array.isArray(value) ? value.map(String).includes(String(opt.value)) : false
      );
      return selectedOptions?.map((opt) => opt.label).join(', ') || '-';
    }

    case 'textarea':
    case 'richtext':
      return <div className="whitespace-pre-wrap">{value}</div>;

    case 'image':
      return value ? (
        <img src={value} alt="Preview" className="max-w-xs rounded-md border border-default" />
      ) : (
        '-'
      );

    case 'file':
      return value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-accent underline">
          파일 보기
        </a>
      ) : (
        '-'
      );

    case 'color':
      return (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded border border-default"
            style={{ backgroundColor: value }}
          />
          <span className="text-sm font-mono">{value}</span>
        </div>
      );

    case 'rating':
      return (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < value ? 'text-yellow-500' : 'text-gray-300'}>
              ★
            </span>
          ))}
        </div>
      );

    case 'range':
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{value}</span>
          {constraints && (
            <span className="text-xs text-subtle">
              ({constraints.min ?? 0} - {constraints.max ?? 100})
            </span>
          )}
        </div>
      );

    default:
      return String(value);
  }
}

/**
 * Field Component
 */
export function Field({
  label,
  model,
  dataType,
  value,
  onChange,
  required = false,
  options,
  constraints,
  dependsOn,
  modeOverride,
  placeholder,
  mode = 'view',
  prominence = 'Primary',
  intent = 'Neutral',
  className,
}: FieldProps) {
  // modeOverride가 있으면 우선 사용
  const effectiveMode = modeOverride ?? mode;

  // View 모드: 읽기 전용 텍스트로 표시
  if (effectiveMode === 'view') {
    const displayValue = formatViewValue(dataType, value, options);

    return (
      <div
        className={cn('flex flex-col gap-1', className)}
        data-iddl-node="field"
        data-model={model}
        data-mode="view"
        data-datatype={dataType}
      >
        <Label className="text-sm text-muted">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div
          className={cn(
            'text-base',
            prominence === 'Hero' && 'text-2xl font-bold',
            prominence === 'Primary' && 'text-base font-medium',
            prominence === 'Secondary' && 'text-sm',
            prominence === 'Tertiary' && 'text-xs text-subtle'
          )}
        >
          {displayValue}
        </div>
      </div>
    );
  }

  // Edit 모드: 입력 요소로 표시
  return (
    <div
      className={cn('flex flex-col gap-1.5', className)}
      data-iddl-node="field"
      data-model={model}
      data-mode="edit"
      data-datatype={dataType}
    >
      <Label htmlFor={model} required={required}>
        {label}
      </Label>

      {/* dataType에 따른 입력 요소 렌더링 */}
      {(() => {
        const commonProps = {
          id: model,
          name: model,
          required,
          placeholder,
        };

        switch (dataType) {
          case 'text':
            return (
              <Input
                {...commonProps}
                type="text"
                value={value ?? ''}
                onChange={(e) => onChange?.(e.target.value)}
                minLength={constraints?.minLength}
                maxLength={constraints?.maxLength}
                pattern={constraints?.pattern}
              />
            );

          case 'number':
            return (
              <Input
                {...commonProps}
                type="number"
                value={value ?? ''}
                onChange={(e) => onChange?.(e.target.valueAsNumber)}
                min={constraints?.min}
                max={constraints?.max}
              />
            );

          case 'currency':
            return (
              <Input
                {...commonProps}
                type="number"
                value={value ?? ''}
                onChange={(e) => onChange?.(e.target.valueAsNumber)}
                min={constraints?.min ?? 0}
                step="1000"
                placeholder={placeholder ?? '금액 입력'}
              />
            );

          case 'date':
            return (
              <Input
                {...commonProps}
                type="date"
                value={value ?? ''}
                onChange={(e) => onChange?.(e.target.value)}
              />
            );

          case 'datetime':
            return (
              <Input
                {...commonProps}
                type="datetime-local"
                value={value ?? ''}
                onChange={(e) => onChange?.(e.target.value)}
              />
            );

          case 'password':
            return (
              <Input
                {...commonProps}
                type="password"
                value={value ?? ''}
                onChange={(e) => onChange?.(e.target.value)}
                minLength={constraints?.minLength}
                maxLength={constraints?.maxLength}
              />
            );

          case 'email':
            return (
              <Input
                {...commonProps}
                type="email"
                value={value ?? ''}
                onChange={(e) => onChange?.(e.target.value)}
              />
            );

          case 'url':
            return (
              <Input
                {...commonProps}
                type="url"
                value={value ?? ''}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder ?? 'https://example.com'}
              />
            );

          case 'phone':
            return (
              <Input
                {...commonProps}
                type="tel"
                value={value ?? ''}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder ?? '010-1234-5678'}
              />
            );

          case 'color':
            return (
              <Input
                {...commonProps}
                type="color"
                value={value ?? '#000000'}
                onChange={(e) => onChange?.(e.target.value)}
                className="h-10 w-20"
              />
            );

          case 'boolean':
            return (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={model}
                  checked={value ?? false}
                  onChange={(e) => onChange?.(e.target.checked)}
                  className="w-4 h-4 rounded border-default text-accent focus:ring-2 focus:ring-accent"
                />
                <span className="text-sm text-muted">활성화</span>
              </label>
            );

          case 'select':
            return (
              <Select
                {...commonProps}
                options={options ?? []}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
              />
            );

          case 'multiselect':
            return (
              <Select
                {...commonProps}
                options={options ?? []}
                value={value}
                onChange={(e) => {
                  const selected = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value
                  );
                  onChange?.(selected);
                }}
                multiple
              />
            );

          case 'radio':
            return (
              <RadioGroup
                name={model}
                options={options ?? []}
                value={value}
                onChange={onChange}
              />
            );

          case 'checkbox':
            return (
              <CheckboxGroup
                name={model}
                options={options ?? []}
                value={value}
                onChange={onChange}
              />
            );

          case 'textarea':
            return (
              <Textarea
                {...commonProps}
                value={value ?? ''}
                onChange={(e) => onChange?.(e.target.value)}
                minLength={constraints?.minLength}
                maxLength={constraints?.maxLength}
                rows={4}
              />
            );

          case 'richtext':
            return (
              <Textarea
                {...commonProps}
                value={value ?? ''}
                onChange={(e) => onChange?.(e.target.value)}
                rows={8}
                placeholder={placeholder ?? 'Rich text 입력 (향후 에디터 통합 예정)'}
              />
            );

          case 'image':
            return (
              <Input
                {...commonProps}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => onChange?.(reader.result);
                    reader.readAsDataURL(file);
                  }
                }}
              />
            );

          case 'file':
            return (
              <Input
                {...commonProps}
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onChange?.(file);
                  }
                }}
              />
            );

          case 'rating':
            return (
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onChange?.(i + 1)}
                    className={cn(
                      'text-2xl transition-colors',
                      i < (value ?? 0) ? 'text-yellow-500' : 'text-gray-300',
                      'hover:text-yellow-400'
                    )}
                  >
                    ★
                  </button>
                ))}
              </div>
            );

          case 'range':
            return (
              <Slider
                value={value ?? constraints?.min ?? 0}
                onChange={(e) => onChange?.(e.target.valueAsNumber)}
                min={constraints?.min ?? 0}
                max={constraints?.max ?? 100}
                step={1}
                showValue
              />
            );

          default:
            return (
              <Input
                {...commonProps}
                type="text"
                value={value ?? ''}
                onChange={(e) => onChange?.(e.target.value)}
              />
            );
        }
      })()}
    </div>
  );
}
