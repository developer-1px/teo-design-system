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
import type { FieldProps } from '@/components/dsl/Element/Field/Field.types';
import { cn } from '@/shared/lib/utils';

// Types
export type { FieldOption } from '@/components/dsl/Element/Field/Field.types';

// Registry
import { FIELD_REGISTRY } from './field-registry';
import { FieldTextbox } from './renderers/input/FieldTextbox'; // Fallback

/**
 * Field view text variants (CVA)
 */
const fieldViewVariants = cva('text-text', {
  variants: {
    prominence: {
      Hero: 'text-2xl font-bold tracking-tight',
      Standard: 'text-base font-medium',
      Strong: 'text-sm text-text-muted font-medium',
      Subtle: 'text-xs text-text-subtle',
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
  className,
}: {
  label?: string;
  model?: string;
  value?: any;
  prominence?: string;
  className?: string;
}) {
  const displayValue = value ?? model;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <span className="text-[10px] text-text-subtle font-black uppercase tracking-widest">
          {label}
        </span>
      )}
      <span
        className={fieldViewVariants({
          prominence: prominence as 'Hero' | 'Standard' | 'Strong' | 'Subtle',
        })}
        data-model={model}
      >
        {displayValue !== undefined && displayValue !== null ? (
          String(displayValue)
        ) : (
          <span className="opacity-20">—</span>
        )}
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
  const role = props.role;
  const Renderer = FIELD_REGISTRY[role || 'Textbox'];

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
