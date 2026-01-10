/**
 * Field - 데이터 바인딩 (IDDL v1.0.1)
 *
 * 실제 데이터 모델과 바인딩되는 요소.
 * 부모 컨텍스트의 mode에 따라 Text(View) 또는 Input(Edit)으로 렌더링됩니다.
 *
 * v1.0.1: 14개 신규 dataType, constraints, dependsOn, modeOverride, condition 추가, CVA 적용
 * v2.0.0: Headless + Renderer 패턴 도입 (로직과 프레젠테이션 분리)
 * v2.0.1: role + type + value 일관성 체계 (dataType → type)
 * v3.0.0: role 기반 구조로 전환 (role="Input|Select|Radio|Checkbox|Rating" + type)
 * v3.1.0: Legacy → Renderer 마이그레이션 완료 (모든 21개 타입 Renderer화, 548줄 → 417줄)
 *
 * @see spec/iddl-spec-1.0.1.md#412-field-node
 */

import { cva } from 'class-variance-authority';
import { useLayoutContext } from '@/components/context/IDDLContext.tsx';
import type { FieldOption, FieldProps } from '@/components/types/Element/Field/Field.types';
import { cn } from '@/shared/lib/utils';

// Re-export types for convenience
export type { FieldOption } from '@/components/types/Element/Field/Field.types';

import { BooleanField } from './renderers/BooleanField';
import { CheckboxField } from './renderers/CheckboxField';
import { ColorField } from './renderers/ColorField';
import { DateField } from './renderers/DateField';
import { FileField } from './renderers/FileField';
import { NumberField } from './renderers/NumberField';
import { RadioField } from './renderers/RadioField';
import { RatingField } from './renderers/RatingField';
import { SelectField } from './renderers/SelectField';
import { TextareaField } from './renderers/TextareaField';
// Renderers (v2.0.0, v3.1.0 expanded)
import { TextField } from './renderers/TextField';

// Shared Styles (v2.1.0 - only for fallback)
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
  label: string;
  model: string;
  value?: any;
  prominence?: string;
  className?: string;
}) {
  const displayValue = value ?? model; // 실제 구현에서는 model에서 데이터 조회

  return (
    <div className={cn('flex flex-col gap-1')}>
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
 * Utility: onChange 핸들러 변환 (Renderer의 onChange를 React 이벤트로 변환)
 */
function createChangeHandler(controlledOnChange?: (event: any) => void) {
  return (val: any) => {
    if (controlledOnChange) {
      const event = { target: { value: val } };
      controlledOnChange(event as any);
    }
  };
}

/**
 * Utility: Renderer 선택 로직 (role과 type 기반)
 * v3.1.0: 모든 21개 타입 지원 (Legacy fallback 제거)
 * @returns { renderer: Component, rendererType: string } | null
 */
function getRendererConfig(role?: string, type?: string) {
  // role 기반 우선 매핑
  if (role === 'Input') {
    if (!type || ['text', 'email', 'url', 'phone', 'password'].includes(type)) {
      return {
        renderer: TextField,
        rendererType: (type || 'text') as 'text' | 'email' | 'url' | 'phone' | 'password',
      };
    }
    if (['number', 'currency', 'range'].includes(type)) {
      return { renderer: NumberField, rendererType: type as 'number' | 'currency' | 'range' };
    }
  }

  if (role === 'Select') {
    return {
      renderer: SelectField,
      rendererType: (type === 'multiselect' ? 'multiselect' : 'select') as 'select' | 'multiselect',
    };
  }

  if (role === 'Radio') {
    return { renderer: RadioField, rendererType: 'radio' as const };
  }

  if (role === 'Rating') {
    return { renderer: RatingField, rendererType: 'rating' as const };
  }

  // type 기반 fallback (하위 호환성)
  if (!type) return null;

  // Text-based inputs
  if (['text', 'email', 'url', 'phone', 'password'].includes(type)) {
    return {
      renderer: TextField,
      rendererType: type as 'text' | 'email' | 'url' | 'phone' | 'password',
    };
  }

  // Number inputs
  if (['number', 'currency', 'range'].includes(type)) {
    return { renderer: NumberField, rendererType: type as 'number' | 'currency' | 'range' };
  }

  // Selection inputs
  if (['select', 'multiselect'].includes(type)) {
    return { renderer: SelectField, rendererType: type as 'select' | 'multiselect' };
  }

  if (type === 'radio') {
    return { renderer: RadioField, rendererType: 'radio' as const };
  }

  if (type === 'rating') {
    return { renderer: RatingField, rendererType: 'rating' as const };
  }

  // Date/Time inputs (NEW v3.1.0)
  if (['date', 'datetime'].includes(type)) {
    return { renderer: DateField, rendererType: type as 'date' | 'datetime' };
  }

  // Boolean input (NEW v3.1.0)
  if (type === 'boolean') {
    return { renderer: BooleanField, rendererType: 'boolean' as const };
  }

  // Checkbox group (NEW v3.1.0)
  if (type === 'checkbox') {
    return { renderer: CheckboxField, rendererType: 'checkbox' as const };
  }

  // Textarea (NEW v3.1.0)
  if (['textarea', 'richtext'].includes(type)) {
    return { renderer: TextareaField, rendererType: type as 'textarea' | 'richtext' };
  }

  // File uploads (NEW v3.1.0)
  if (['file', 'image'].includes(type)) {
    return { renderer: FileField, rendererType: type as 'file' | 'image' };
  }

  // Color picker (NEW v3.1.0)
  if (type === 'color') {
    return { renderer: ColorField, rendererType: 'color' as const };
  }

  return null;
}

/**
 * Edit Mode: 데이터를 입력 폼으로 표시 (v1.0.1: 21개 type)
 * IDDL-only: prominence와 type만으로 스타일 결정
 * v1.0.2: clearable 지원 추가
 * v2.0.0: Headless + Renderer 패턴 적용 (우선순위 높은 타입부터)
 * v2.0.1: dataType → type으로 rename
 * v3.0.0: role 기반 구조 (role 우선, type은 세부 variant)
 * v3.1.0: 반복 코드 제거 - createChangeHandler, getRendererConfig 유틸리티 사용
 */
function FieldEdit(props: FieldProps) {
  const {
    role,
    label,
    model,
    type,
    placeholder,
    required,
    options,
    constraints,
    clearable,
    value: controlledValue,
    onChange: controlledOnChange,
    prominence,
    intent,
  } = props;

  // Get density from parent context
  const ctx = useLayoutContext();
  const computedDensity = props.density ?? ctx.density ?? 'Standard';

  // Shared onChange handler
  const handleChange = createChangeHandler(controlledOnChange);

  // Shared common props
  const commonProps = {
    label,
    model,
    prominence,
    intent,
    required,
    placeholder,
  };

  // Try to get renderer from role/type mapping
  const rendererConfig = getRendererConfig(role, type);

  if (rendererConfig) {
    const { renderer: Renderer, rendererType } = rendererConfig;

    // TextField-specific props
    if (Renderer === TextField) {
      return (
        <Renderer
          {...commonProps}
          type={rendererType as 'text' | 'email' | 'url' | 'phone' | 'password'}
          density={computedDensity as 'Comfortable' | 'Standard' | 'Compact'}
          constraints={constraints}
          clearable={clearable}
          value={controlledValue as string | undefined}
          onChange={handleChange}
        />
      );
    }

    // NumberField-specific props
    if (Renderer === NumberField) {
      return (
        <Renderer
          {...commonProps}
          type={rendererType as 'number' | 'currency' | 'range'}
          constraints={constraints}
          value={controlledValue as number | undefined}
          onChange={handleChange}
        />
      );
    }

    // SelectField-specific props
    if (Renderer === SelectField) {
      return (
        <Renderer
          {...commonProps}
          type={rendererType as 'select' | 'multiselect'}
          options={options || []}
          density={computedDensity as 'Comfortable' | 'Standard' | 'Compact'}
          value={controlledValue}
          onChange={handleChange}
        />
      );
    }

    // RadioField-specific props
    if (Renderer === RadioField) {
      return (
        <Renderer
          {...commonProps}
          type={rendererType as 'radio'}
          options={options || []}
          value={controlledValue as string | number | boolean | undefined}
          onChange={handleChange}
        />
      );
    }

    // RatingField-specific props
    if (Renderer === RatingField) {
      return (
        <Renderer
          {...commonProps}
          type={rendererType as 'rating'}
          constraints={constraints}
          value={controlledValue as number | undefined}
          onChange={handleChange}
        />
      );
    }

    // DateField-specific props (NEW v3.1.0)
    if (Renderer === DateField) {
      return (
        <Renderer
          {...commonProps}
          type={rendererType as 'date' | 'datetime'}
          density={computedDensity as 'Comfortable' | 'Standard' | 'Compact'}
          constraints={constraints}
          value={controlledValue as string | undefined}
          onChange={handleChange}
        />
      );
    }

    // BooleanField-specific props (NEW v3.1.0)
    if (Renderer === BooleanField) {
      return (
        <Renderer
          {...commonProps}
          type={rendererType as 'boolean'}
          density={computedDensity as 'Comfortable' | 'Standard' | 'Compact'}
          value={controlledValue as boolean | undefined}
          onChange={handleChange}
        />
      );
    }

    // CheckboxField-specific props (NEW v3.1.0)
    if (Renderer === CheckboxField) {
      return (
        <Renderer
          {...commonProps}
          type={rendererType as 'checkbox'}
          options={options || []}
          density={computedDensity as 'Comfortable' | 'Standard' | 'Compact'}
          value={controlledValue as Array<string | number | boolean> | undefined}
          onChange={handleChange}
        />
      );
    }

    // TextareaField-specific props (NEW v3.1.0)
    if (Renderer === TextareaField) {
      return (
        <Renderer
          {...commonProps}
          type={rendererType as 'textarea' | 'richtext'}
          density={computedDensity as 'Comfortable' | 'Standard' | 'Compact'}
          constraints={constraints}
          value={controlledValue as string | undefined}
          onChange={handleChange}
        />
      );
    }

    // FileField-specific props (NEW v3.1.0)
    if (Renderer === FileField) {
      return (
        <Renderer
          {...commonProps}
          type={rendererType as 'file' | 'image'}
          density={computedDensity as 'Comfortable' | 'Standard' | 'Compact'}
          onChange={handleChange}
        />
      );
    }

    // ColorField-specific props (NEW v3.1.0)
    if (Renderer === ColorField) {
      return (
        <Renderer
          {...commonProps}
          type={rendererType as 'color'}
          density={computedDensity as 'Comfortable' | 'Standard' | 'Compact'}
          value={controlledValue as string | undefined}
          onChange={handleChange}
        />
      );
    }
  }

  // Fallback: 알 수 없는 타입은 기본 text input으로 처리
  console.warn(`[Field] Unknown type "${type}" for model "${model}". Falling back to text input.`);
  return (
    <div className={cn('flex flex-col gap-1')}>
      <label htmlFor={model} className="text-sm text-text font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={model}
        name={model}
        type="text"
        placeholder={placeholder}
        required={required}
        className={inputStyles({
          prominence,
          density: computedDensity as any,
          intent,
          dataType: 'text',
        })}
        data-model={model}
      />
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
  const mode = props.modeOverride ?? ctx.mode ?? 'edit';

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
          value={props.value}
          prominence={computedProminence}
        />
      ) : (
        <FieldEdit {...props} />
      )}
    </Component>
  );
}
