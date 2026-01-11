import React from 'react';
import { cn } from '@/shared/lib/utils';
import { BlockRendererProps } from '../../Block.types';

// 1. Form
export function Form({ Element, children, className, ...props }: BlockRendererProps) {
    return (
        <Element className={cn('space-y-6', className)} {...props} onSubmit={(e: React.FormEvent) => e.preventDefault()}>
            {children}
        </Element>
    );
}

// 2. FieldGroup (Fieldset)
export function FieldGroup({ Element, children, className, spec, ...props }: BlockRendererProps) {
    const legend = (spec?.legend as string) || 'Group Title';
    return (
        <Element className={cn('border border-border-default rounded-lg p-4 pt-3 relative mt-3', className)} {...props}>
            <legend className="px-2 text-sm font-medium text-text absolute -top-2.5 bg-surface">{legend}</legend>
            <div className="space-y-4 pt-1">
                {children}
            </div>
        </Element>
    );
}

// 3. RadioGroup
export function RadioGroup({ Element, children, className, spec, ...props }: BlockRendererProps) {
    const orientation = (spec?.orientation as string) || 'vertical';
    return (
        <Element className={cn('flex gap-4', orientation === 'vertical' ? 'flex-col' : 'flex-row', className)} {...props}>
            {children || ['Option A', 'Option B', 'Option C'].map((opt, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="radiogroup-mock" defaultChecked={i === 0} className="w-4 h-4 text-primary accent-primary" />
                    <span className="text-sm">{opt}</span>
                </label>
            ))}
        </Element>
    );
}

// 4. CheckboxGroup
export function CheckboxGroup({ Element, children, className, spec, ...props }: BlockRendererProps) {
    const orientation = (spec?.orientation as string) || 'vertical';
    return (
        <Element className={cn('flex gap-4', orientation === 'vertical' ? 'flex-col' : 'flex-row', className)} {...props}>
            {children || ['Check 1', 'Check 2'].map((opt, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-primary accent-primary" />
                    <span className="text-sm">{opt}</span>
                </label>
            ))}
        </Element>
    );
}

// 5. ToggleGroup
export function ToggleGroup({ Element, children, className, ...props }: BlockRendererProps) {
    return (
        <Element className={cn('inline-flex bg-surface-raised rounded-md p-1 border border-border-default', className)} {...props}>
            {children || ['Bold', 'Italic', 'Underline'].map((opt, i) => (
                <button key={i} className={cn("px-3 py-1 text-xs font-medium rounded-sm hover:bg-surface-hover", i === 0 && "bg-white shadow-sm text-primary")}>
                    {opt}
                </button>
            ))}
        </Element>
    );
}

// 6. InputGroup
export function InputGroup({ Element, children, className, ...props }: BlockRendererProps) {
    return (
        <Element className={cn('flex items-center', className)} {...props}>
            <span className="px-3 py-2 bg-surface-raised border border-r-0 border-border-default rounded-l-md text-sm text-text-subtle">http://</span>
            <input className="flex-1 py-2 px-3 border border-border-default text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary z-10" placeholder="example.com" />
            <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-r-md hover:bg-primary-hover">Go</button>
        </Element>
    );
}

// 7. FormActions
export function FormActions({ Element, children, className, ...props }: BlockRendererProps) {
    return (
        <Element className={cn('flex items-center justify-end gap-3 pt-4 border-t border-border-subtle mt-4', className)} {...props}>
            {children || (
                <>
                    <button className="px-4 py-2 text-sm text-text font-medium hover:bg-surface-hover rounded-md">Cancel</button>
                    <button className="px-4 py-2 text-sm text-white bg-primary font-medium hover:bg-primary-hover rounded-md shadow-sm">Save Changes</button>
                </>
            )}
        </Element>
    );
}
