/**
 * Field - 데이터 바인딩 (IDDL v2.0)
 *
 * IDDL 2.0 Field Role Catalog 기반 렌더링
 * role + spec 조합으로 다양한 입력 필드를 표현합니다.
 *
 * @see docs/2-areas/spec/5-field/field.spec.md
 */

import { useState, useEffect } from 'react';
import { cva } from 'class-variance-authority';
import { useLayoutContext } from '@/components/context/IDDLContext.tsx';
import type { FieldProps, FieldRole, FieldSpec } from '@/components/types/Element/Field/Field.types';
import { cn } from '@/shared/lib/utils';

// Re-export types for convenience
export type { FieldOption } from '@/components/types/Element/Field/Field.types';

// Renderers
import { BooleanField } from './renderers/BooleanField'; // Maps to Switch
import { CheckboxField } from './renderers/CheckboxField'; // Maps to Checkbox
import { ColorField } from './renderers/ColorField'; // Legacy? Or keeps it? Spec doesn't mention Color explicitly in the main table, but maybe under mapped? Ah, spec didn't list ColorInput. I'll keep it if needed or remove if strictly following spec. Spec v0.1 has no ColorInput. I'll comment it out or leave for now.
import { DateField } from './renderers/DateField'; // Maps to Date/Time
import { FileField } from './renderers/FileField'; // Maps to FileInput
import { NumberField } from './renderers/NumberField'; // Maps to NumberInput, Slider?
import { OTPField } from './renderers/OTPField';
import { RadioField } from './renderers/RadioField'; // Maps to RadioGroup
import { RatingField } from './renderers/RatingField'; // Maps to Rating
import { SelectField } from './renderers/SelectField'; // Maps to Select
import { TextareaField } from './renderers/TextareaField'; // Maps to TextArea
import { TextField } from './renderers/TextField'; // Maps to TextInput, Email, Password, Search, etc.

// Shared Styles
import { inputStyles } from './styles/field.styles';

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
 * View Mode: 데이터를 텍스트로 표시
 */
function FieldView({
  label,
  model,
  value,
  prominence,
}: {
  label?: string;
  model?: string;
  value?: any;
  prominence?: string;
  className?: string;
}) {
  const displayValue = value ?? model; // 실제 구현에서는 model에서 데이터 조회

  return (
    <div className={cn('flex flex-col gap-1')}>
      {label && <span className="text-xs text-muted font-medium">{label}</span>}
      <span
        className={fieldViewVariants({
          prominence: prominence as 'Hero' | 'Standard' | 'Strong' | 'Subtle',
        })}
        data-model={model}
      >
        {String(displayValue)}
      </span>
    </div>
  );
}

/**
 * Utility: onChange 핸들러 변환 (Renderer의 onChange를 React 이벤트로 변환)
 */
function createChangeHandler(controlledOnChange?: (event: any) => void) {
  return (val: any) => {
    if (controlledOnChange) {
      // Compat: emulate event-like object or pass direct value depending on what consumers expect.
      // Originally consumers might expect event. But React Controlled often uses value.
      // IDDL spec says "onChange is forbidden, use command/binding".
      // But for React Controlled usage here:
      controlledOnChange(val);
    }
  };
}

/**
 * Edit Mode: 데이터를 입력 폼으로 표시
 */
/**
 * Edit Mode: 데이터를 입력 폼으로 표시
 */
function FieldEdit(props: FieldProps) {
  const {
    role,
    spec,
    label,
    model,
    placeholder,
    required,
    disabled,
    value: propValue,
    onChange: propOnChange,
    prominence,
    intent,
    density,
    className,
    description,
    defaultValue, // Add this to FieldTypes! But for now we extract it if present in props usage
  } = props as FieldProps & { defaultValue?: any };

  // Internal state for semi-controlled usage (Showcase)
  const [internalValue, setInternalValue] = useState(propValue !== undefined ? propValue : defaultValue);

  // Sync internal value if propValue changes
  useEffect(() => {
    if (propValue !== undefined) {
      setInternalValue(propValue);
    }
  }, [propValue]);

  const controlledValue = propValue !== undefined ? propValue : internalValue;

  // Get density from parent context
  const ctx = useLayoutContext();
  const computedDensity = density ?? ctx.density ?? 'Standard';

  // Shared onChange handler
  const handleChange = (val: any) => {
    // If not controlled (propValue is undefined), update internal state
    if (propValue === undefined) {
      setInternalValue(val);
    }
    // Always call parent handler
    if (propOnChange) { // Fixed: createChangeHandler logic inlined
      propOnChange(val);
    }
  };

  // Common props passed to all renderers
  const commonProps = {
    label: label || '', // Some renderers require label
    model: model || '',
    prominence,
    intent,
    required,
    placeholder,
    disabled,
    density: computedDensity as 'Comfortable' | 'Standard' | 'Compact',
    className,
  };

  /**
   * Dispatch Logic based on Field Role
   */
  switch (role) {
    // 1. Text Inputs
    case 'TextInput':
    case 'EmailInput':
    case 'PasswordInput':
      {
        const typeMap: Record<string, 'text' | 'email' | 'password' | 'url'> = {
          TextInput: 'text',
          EmailInput: 'email',
          PasswordInput: 'password',
        };
        const inputType = typeMap[role] || 'text';
        const s = spec as any;

        return (
          <TextField
            {...commonProps}
            type={inputType}
            constraints={{
              maxLength: s?.maxLength,
              pattern: s?.pattern,
            }}
            value={controlledValue as string}
            onChange={handleChange}
          />
        );
      }

    case 'SearchInput':
      {
        const s = spec as any;
        return (
          <TextField
            {...commonProps}
            type="text"
            clearable={s?.clearable}
            value={controlledValue as string}
            onChange={handleChange}
          />
        );
      }

    case 'OTPInput':
      {
        const s = spec as any;
        return (
          <OTPField
            {...commonProps}
            length={s?.length}
            numeric={s?.numeric}
            value={controlledValue as string}
            onChange={handleChange}
          />
        );
      }

    case 'TextArea':
      {
        const s = spec as any;
        return (
          <TextareaField
            {...commonProps}
            type="textarea"
            constraints={{
              maxLength: s?.maxLength,
              // rows not directly supported in interface yet, but can pass via style or new prop if added
            }}
            value={controlledValue as string}
            onChange={handleChange}
          />
        );
      }

    // 2. Number Inputs
    case 'NumberInput':
      {
        const s = spec as any;
        return (
          <NumberField
            {...commonProps}
            type="number"
            constraints={{
              min: s?.min,
              max: s?.max,
              step: s?.step,
            }}
            value={controlledValue as number}
            onChange={handleChange}
          />
        );
      }

    case 'Slider':
      {
        const s = spec as any;
        // Start with NumberField role="range" or similar if available, or create Slider renderer later.
        // Current NumberField supports 'range'.
        return (
          <NumberField
            {...commonProps}
            type="range"
            constraints={{
              min: s?.min,
              max: s?.max,
              step: s?.step,
            }}
            value={controlledValue as number}
            onChange={handleChange}
          />
        );
      }

    // 3. Selection Inputs
    case 'Select':
      {
        const s = spec as any;
        return (
          <SelectField
            {...commonProps}
            type={s?.multiple ? 'multiselect' : 'select'}
            options={s?.options || []}
            value={controlledValue}
            onChange={handleChange}
          />
        );
      }

    case 'Combobox':
      {
        // TODO: Implement Combobox renderer. Fallback to Select.
        const s = spec as any;
        return (
          <SelectField
            {...commonProps}
            type="select"
            options={s?.options || []}
            value={controlledValue}
            onChange={handleChange}
          />
        );
      }

    case 'RadioGroup':
      {
        const s = spec as any;
        return (
          <RadioField
            {...commonProps}
            type="radio"
            options={s?.options || []}
            value={controlledValue}
            onChange={handleChange}
          />
        );
      }

    case 'Checkbox':
      {
        return (
          <BooleanField
            {...commonProps}
            type="boolean"
            value={controlledValue as boolean}
            onChange={handleChange}
          />
        );
      }

    case 'Switch':
      {
        // TODO: Update BooleanField to support 'switch' variant or create SwitchField
        return (
          <BooleanField
            {...commonProps}
            type="boolean"
            value={controlledValue as boolean}
            onChange={handleChange}
          // variant="switch" ??
          />
        );
      }

    // 4. Date/File Inputs
    case 'DateInput':
    case 'TimeInput':
    case 'DateTimeInput':
      {
        const typeMap: Record<string, 'date' | 'datetime'> = {
          DateInput: 'date',
          TimeInput: 'date', // Fallback
          DateTimeInput: 'datetime',
        };
        const s = spec as any;
        return (
          <DateField
            {...commonProps}
            type={typeMap[role] || 'date'}
            constraints={{
              min: s?.min, // string format
              max: s?.max,
            }}
            value={controlledValue as string}
            onChange={handleChange}
          />
        );
      }
    case 'FileInput':
      {
        const s = spec as any;
        return (
          <FileField
            {...commonProps}
            type="file"
            // accept={s?.accept}
            // multiple={s?.multiple}
            onChange={handleChange}
          />
        );
      }

    // 5. Complex
    case 'Rating':
      {
        const s = spec as any;
        return (
          <RatingField
            {...commonProps}
            type="rating"
            constraints={{
              max: s?.max,
              step: s?.step,
            }}
            value={controlledValue as number}
            onChange={handleChange}
          />
        );
      }

    case 'TagInput':
      {
        // TODO: Implement TagInput. Fallback to TextField or Select.
        return (
          <TextField
            {...commonProps}
            type="text"
            value={controlledValue as string}
            onChange={handleChange}
          />
        );
      }

    default:
      console.warn(`[Field] Unimplemented role "${role}". Falling back to TextInput.`);
      return (
        <TextField
          {...commonProps}
          type="text"
          value={controlledValue as string}
          onChange={handleChange}
        />
      );
  }
}

/**
 * Field 컴포넌트: 모드에 따라 View 또는 Edit 렌더링
 */
export function Field({ as, ...props }: FieldProps) {
  const ctx = useLayoutContext();
  const { modeOverride, hidden } = props as any; // Legacy props access

  // 부모 컨텍스트에서 상속
  const computedProminence = props.prominence ?? ctx.prominence ?? 'Primary';
  const computedIntent = props.intent ?? ctx.intent ?? 'Neutral';

  const mode = modeOverride ?? ctx.mode ?? 'edit';

  if (hidden) return null;

  // as prop이 있으면 사용, 없으면 div
  const Component = as || 'div';

  return (
    <Component
      data-dsl-component="field"
      data-mode={mode}
      data-role={props.role}
      data-prominence={computedProminence}
      data-intent={computedIntent}
    >
      {mode === 'view' ? (
        <FieldView
          label={props.label}
          model={props.model}
          value={props.value}
          prominence={computedProminence}
        />
      ) : (
        <FieldEdit {...props} />
      )}
    </Component>
  );
}
