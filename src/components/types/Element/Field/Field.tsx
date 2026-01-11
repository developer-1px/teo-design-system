/**
 * Field - 데이터 바인딩 (IDDL v2.0)
 *
 * IDDL 2.0 Field Role Catalog 기반 렌더링
 * role + spec 조합으로 다양한 입력 필드를 표현합니다.
 *
 * @see docs/2-areas/spec/5-field/field.spec.md
 */

import { cva } from 'class-variance-authority';
import { useLayoutContext } from '@/components/context/IDDLContext.tsx';
import type { FieldProps } from '@/components/types/Element/Field/Field.types';
import { cn } from '@/shared/lib/utils';
import { getInputStyles } from './styles/field.styles'; // Ensure styles are available

// Types
export type { FieldOption } from '@/components/types/Element/Field/Field.types';

import { FieldTextbox } from './renderers/input/FieldTextbox'; // Fallback
// Registry
import { getFieldRenderer } from './role-registry';

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
 * Field 컴포넌트: 모드에 따라 View 또는 Edit 렌더링
 */
export function Field({ as, ...props }: FieldProps) {
  const ctx = useLayoutContext();
  const { modeOverride, hidden } = props as any; // Legacy props access

  // 부모 컨텍스트에서 상속
  const computedProminence = props.prominence ?? ctx.prominence ?? 'Primary';
  const computedIntent = props.intent ?? ctx.intent ?? 'Neutral';

  // Determine mode
  const mode = modeOverride ?? ctx.mode ?? 'edit';

  if (hidden) return null;

  // as prop이 있으면 사용, 없으면 div
  const Component = as || 'div';

  // 1. View Mode (Read-only)
  if (mode === 'view') {
    return (
      <Component
        data-dsl-component="field"
        data-mode={mode}
        data-role={props.role}
        data-prominence={computedProminence}
        data-intent={computedIntent}
      >
        <FieldView
          label={props.label}
          model={props.model}
          value={props.value}
          prominence={computedProminence}
        />
      </Component>
    );
  }

  // 2. Edit Mode (Resolve Renderer via Registry)
  // IDDL 2.0 conversion: Map legacy 'type' to 'role' if role is missing
  let role = props.role;
  if (!role && props.type) {
    const typeMapping: Record<string, any> = {
      text: 'Textbox',
      number: 'Spinbutton',
      currency: 'Spinbutton',
      email: 'Textbox',
      url: 'Textbox',
      phone: 'Textbox',
      password: 'Textbox',
      textarea: 'Textbox',
      date: 'Datepicker',
      datetime: 'Datepicker',
      time: 'Timepicker',
      select: 'Select',
      multiselect: 'Combobox',
      radio: 'Radio',
      checkbox: 'Checkbox',
      boolean: 'Checkbox',
      color: 'Colorpicker',
      rating: 'Rating',
      range: 'Slider',
      file: 'Filepicker',
    };
    role = typeMapping[props.type] || 'Textbox';
  }

  const Renderer = getFieldRenderer(role || 'Textbox');

  // 3. Fallback Handling
  if (!Renderer) {
    if (import.meta.env.DEV) {
      console.warn(`[Field] Unknown role "${role}". Falling back to Textbox.`);
    }
    // Fallback to Textbox
    return (
      <Component data-role={role} data-error="unknown-role">
        <FieldTextbox {...(props as any)} role="Textbox" />
      </Component>
    );
  }

  // 4. Render Field
  // Merge compatibility props into spec for the renderer
  const mergedSpec = {
    ...props.spec,
    ...(props.options ? { options: props.options } : {}),
    ...(props.constraints ? props.constraints : {}),
    ...(props.type === 'textarea' ? { multiline: true } : {}),
    ...(props.type === 'datetime' ? { variant: 'datetime' } : {}),
  };

  return (
    <Component
      data-dsl-component="field"
      data-mode={mode}
      data-role={role}
      data-prominence={computedProminence}
      data-intent={computedIntent}
    >
      <Renderer {...props} role={role as any} spec={mergedSpec as any} />
    </Component>
  );
}
