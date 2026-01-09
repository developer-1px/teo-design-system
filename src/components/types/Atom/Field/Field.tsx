/**
 * Field - 데이터 바인딩 (IDDL v1.0.1)
 *
 * 실제 데이터 모델과 바인딩되는 요소.
 * 부모 컨텍스트의 mode에 따라 Text(View) 또는 Input(Edit)으로 렌더링됩니다.
 *
 * v1.0.1: 14개 신규 dataType, constraints, dependsOn, modeOverride, condition 추가, CVA 적용
 * v2.0.0: Headless + Renderer 패턴 도입 (로직과 프레젠테이션 분리)
 * @see spec/iddl-spec-1.0.1.md#412-field-node
 */

import { cva } from 'class-variance-authority';
import { useState } from 'react';
import { useLayoutContext } from '@/components/context/IDDLContext.tsx';
import type { FieldProps, FieldOption } from '@/components/types/Item/types.ts';
import { cn } from '@/shared/lib/utils.ts';

// Re-export types for convenience
export type { FieldOption } from '@/components/types/Item/types.ts';

// New Renderers (v2.0.0)
import { TextField } from './renderers/TextField';
import { NumberField } from './renderers/NumberField';
import { SelectField } from './renderers/SelectField';
import { RadioField } from './renderers/RadioField';
import { RatingField } from './renderers/RatingField';

/**
 * Field input variants (CVA)
 * Per minimal-renderer-guide.md Section 5.3: Input 패딩 8px 12px
 * Per minimal-renderer-guide.md Section 3.2: radius-sm (4px)
 */
const inputVariants = cva(
  'w-full py-2 px-3 bg-surface-sunken border border-default rounded text-text placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-colors'
);

/**
 * Checkbox/Radio input variants (CVA)
 * Per minimal-renderer-guide.md Section 3.2: radius-sm (4px) for small elements
 */
const checkboxVariants = cva(
  'w-4 h-4 border-default text-accent focus-visible:ring-2 focus-visible:ring-accent rounded',
  {
    variants: {
      type: {
        checkbox: '',
        radio: 'rounded-full', // Radio는 원형
      },
    },
  }
);

/**
 * Field view text variants (CVA)
 */
const fieldViewVariants = cva('text-text', {
  variants: {
    prominence: {
      Hero: 'text-2xl font-semibold',
      Standard: 'text-base',
      Strong: 'text-sm text-muted',
      Subtle: 'text-xs text-subtle',
    },
  },
  defaultVariants: {
    prominence: 'Standard',
  },
});

/**
 * Rating button variants (CVA)
 */
const ratingButtonVariants = cva('text-subtle hover:text-yellow-500 transition-colors');

/**
 * View Mode: 데이터를 텍스트로 표시
 */
function FieldView({
  label,
  model,
  value,
  prominence,
  className,
}: {
  label: string;
  model: string;
  value?: any;
  prominence?: string;
  className?: string;
}) {
  const displayValue = value ?? model; // 실제 구현에서는 model에서 데이터 조회

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <span className="text-xs text-muted font-medium">{label}</span>
      <span
        className={fieldViewVariants({
          prominence: prominence as 'Hero' | 'Standard' | 'Strong' | 'Subtle',
        })}
        data-model={model}
      >
        {displayValue}
      </span>
    </div>
  );
}

/**
 * Edit Mode: 데이터를 입력 폼으로 표시 (v1.0.1: 21개 dataType)
 * IDDL-only: prominence와 dataType만으로 스타일 결정
 * v1.0.2: clearable 지원 추가
 * v2.0.0: Headless + Renderer 패턴 적용 (우선순위 높은 타입부터)
 */
function FieldEdit(props: FieldProps) {
  const {
    label,
    model,
    dataType,
    placeholder,
    required,
    options,
    constraints,
    clearable,
    className,
    value: controlledValue,
    onChange: controlledOnChange,
    prominence,
    intent,
  } = props;

  // v2.0.0: New Renderer 사용 (text, email, url, phone, password)
  if (['text', 'email', 'url', 'phone', 'password'].includes(dataType)) {
    return (
      <TextField
        label={label}
        model={model}
        dataType={dataType as 'text' | 'email' | 'url' | 'phone' | 'password'}
        prominence={prominence}
        intent={intent}
        constraints={constraints}
        clearable={clearable}
        required={required}
        placeholder={placeholder}
        value={controlledValue as string | undefined}
        onChange={(val) => {
          if (controlledOnChange) {
            const event = { target: { value: val } };
            controlledOnChange(event as any);
          }
        }}
        className={className}
      />
    );
  }

  // v2.0.0: NumberField (number, currency, range)
  if (['number', 'currency', 'range'].includes(dataType)) {
    return (
      <NumberField
        label={label}
        model={model}
        dataType={dataType as 'number' | 'currency' | 'range'}
        prominence={prominence}
        intent={intent}
        constraints={constraints}
        required={required}
        placeholder={placeholder}
        value={controlledValue as number | undefined}
        onChange={(val) => {
          if (controlledOnChange) {
            const event = { target: { value: val } };
            controlledOnChange(event as any);
          }
        }}
        className={className}
      />
    );
  }

  // v2.0.0: SelectField (select, multiselect)
  if (['select', 'multiselect'].includes(dataType)) {
    return (
      <SelectField
        label={label}
        model={model}
        dataType={dataType as 'select' | 'multiselect'}
        options={options || []}
        prominence={prominence}
        intent={intent}
        required={required}
        placeholder={placeholder}
        value={controlledValue}
        onChange={(val) => {
          if (controlledOnChange) {
            const event = { target: { value: val } };
            controlledOnChange(event as any);
          }
        }}
        className={className}
      />
    );
  }

  // v2.0.0: RadioField
  if (dataType === 'radio') {
    return (
      <RadioField
        label={label}
        model={model}
        dataType="radio"
        options={options || []}
        prominence={prominence}
        intent={intent}
        required={required}
        value={controlledValue as string | number | boolean | undefined}
        onChange={(val) => {
          if (controlledOnChange) {
            const event = { target: { value: val } };
            controlledOnChange(event as any);
          }
        }}
        className={className}
      />
    );
  }

  // v2.0.0: RatingField
  if (dataType === 'rating') {
    return (
      <RatingField
        label={label}
        model={model}
        dataType="rating"
        prominence={prominence}
        constraints={constraints}
        required={required}
        value={controlledValue as number | undefined}
        onChange={(val) => {
          if (controlledOnChange) {
            const event = { target: { value: val } };
            controlledOnChange(event as any);
          }
        }}
        className={className}
      />
    );
  }

  // Legacy: 나머지 타입은 기존 코드 사용
  const [internalValue, setInternalValue] = useState('');
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const setValue = controlledOnChange
    ? (newValue: any) => {
        const event = typeof newValue === 'string' ? { target: { value: newValue } } : newValue;
        controlledOnChange(event);
      }
    : setInternalValue;
  const inputClassName = inputVariants();

  const renderInput = () => {
    switch (dataType) {
      // text, password, email, url, phone, number, currency, range, select, multiselect, radio, rating
      // → 이미 새 Renderer로 처리됨 (위 if문들에서)

      case 'date':
        return (
          <input
            type="date"
            name={model}
            required={required}
            min={constraints?.min ? String(constraints.min) : undefined}
            max={constraints?.max ? String(constraints.max) : undefined}
            className={inputClassName}
            data-model={model}
          />
        );

      case 'datetime': // v1.0.1 - Legacy
        return (
          <input
            type="datetime-local"
            name={model}
            required={required}
            className={inputClassName}
            data-model={model}
          />
        );

      case 'boolean': // Legacy - TODO: useBooleanField로 마이그레이션
        return (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name={model}
              className={checkboxVariants({ type: 'checkbox' })}
              data-model={model}
              checked={value}
              onChange={controlledOnChange || ((e) => setValue(e.target.checked))}
            />
            <span className="text-text">{label}</span>
          </label>
        );

      case 'checkbox': // v1.0.1 - 체크박스 그룹 (boolean과 다름)
        return (
          <div className="flex flex-col gap-2">
            {options?.map((opt) => (
              <label key={String(opt.value)} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name={`${model}[]`}
                  value={String(opt.value)}
                  disabled={opt.disabled}
                  className={checkboxVariants({ type: 'checkbox' })}
                  data-model={model}
                />
                <span className="text-sm text-text">{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case 'textarea': // v1.0.1
        return (
          <textarea
            name={model}
            placeholder={placeholder}
            required={required}
            minLength={constraints?.minLength}
            maxLength={constraints?.maxLength}
            rows={4}
            className={inputClassName}
            data-model={model}
          />
        );

      case 'richtext': // v1.0.1 - TODO: 실제 리치 텍스트 에디터 통합 필요
        return (
          <div>
            <textarea
              name={model}
              placeholder={placeholder || 'Rich text editor (placeholder)'}
              required={required}
              rows={6}
              className={inputClassName}
              data-model={model}
            />
            <p className="text-xs text-subtle mt-1">TODO: Rich text editor integration</p>
          </div>
        );

      case 'image':
        return (
          <input
            type="file"
            name={model}
            accept="image/*"
            required={required}
            className={cn(
              inputClassName,
              'file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-accent file:text-white'
            )}
            data-model={model}
          />
        );

      case 'file': // v1.0.1 - 일반 파일
        return (
          <input
            type="file"
            name={model}
            required={required}
            className={cn(
              inputClassName,
              'file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-accent file:text-white'
            )}
            data-model={model}
          />
        );

      case 'color': // v1.0.1
        return (
          <input
            type="color"
            name={model}
            required={required}
            className="w-20 h-10 rounded-md border border-default cursor-pointer"
            data-model={model}
          />
        );

      case 'range': // v1.0.1
        return (
          <div>
            <input
              type="range"
              name={model}
              required={required}
              min={constraints?.min ?? 0}
              max={constraints?.max ?? 100}
              className="w-full h-2 bg-surface-sunken rounded-lg appearance-none cursor-pointer accent-accent"
              data-model={model}
              value={value}
              onChange={controlledOnChange || ((e) => setValue(parseFloat(e.target.value)))}
            />
            <div className="flex justify-between text-xs text-subtle mt-1">
              <span>{constraints?.min ?? 0}</span>
              <span>{constraints?.max ?? 100}</span>
            </div>
          </div>
        );

      case 'rating': // v1.0.1 - 별점
        return (
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={ratingButtonVariants()}
                data-model={model}
                data-value={star}
              >
                <Star size={24} />
              </button>
            ))}
          </div>
        );

      default:
        return (
          <input
            type="text"
            name={model}
            placeholder={placeholder}
            required={required}
            className={inputClassName}
            data-model={model}
          />
        );
    }
  };

  // boolean 타입은 라벨이 인라인으로 포함되어 있음
  if (dataType === 'boolean') {
    return <div className={cn('flex flex-col gap-1', className)}>{renderInput()}</div>;
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label htmlFor={model} className="text-sm text-muted font-medium">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      {renderInput()}
      {constraints?.patternMessage && (
        <p className="text-xs text-subtle mt-1">{constraints.patternMessage}</p>
      )}
    </div>
  );
}

/**
 * Field 컴포넌트: 모드에 따라 View 또는 Edit 렌더링 (v1.0.1)
 */
export function Field({ as, ...props }: FieldProps) {
  const ctx = useLayoutContext();

  // 조건부 렌더링 (v1.0.1)
  // TODO: condition 표현식 평가 구현
  if (props.condition) {
    // 현재는 조건부 렌더링 미구현
  }

  // 부모 컨텍스트에서 상속
  const computedProminence = props.prominence ?? ctx.prominence ?? 'Primary';
  const computedIntent = props.intent ?? ctx.intent ?? 'Neutral';

  // modeOverride가 있으면 우선 사용 (v1.0.1)
  const mode = props.modeOverride ?? ctx.mode ?? 'view';

  // dependsOn 처리 (v1.0.1)
  // TODO: dependsOn 표현식 평가 구현
  if (props.dependsOn) {
    // 현재는 의존성 체크 미구현
  }

  if (props.hidden) return null;

  // as prop이 있으면 사용, 없으면 div
  const Component = as || 'div';

  return (
    <Component
      data-dsl-component="field"
      data-mode={mode}
      data-prominence={computedProminence}
      data-intent={computedIntent}
      data-depends-on={props.dependsOn}
    >
      {mode === 'view' ? (
        <FieldView
          label={props.label}
          model={props.model}
          prominence={computedProminence}
          className={props.className}
        />
      ) : (
        <FieldEdit {...props} />
      )}
    </Component>
  );
}
