import React from 'react';
import * as styles from './Checkbox.css';
import { Check } from 'lucide-react';

interface CheckboxProps {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    size?: 'default' | 'sm';
    className?: string;
    id?: string;
}

export const Checkbox = ({
    checked: controlledChecked,
    defaultChecked = false,
    onCheckedChange,
    disabled = false,
    size = 'default',
    className,
    id,
}: CheckboxProps) => {
    const [internalChecked, setInternalChecked] = React.useState(defaultChecked);

    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : internalChecked;

    const toggle = () => {
        if (disabled) return;
        const newChecked = !checked;
        if (!isControlled) {
            setInternalChecked(newChecked);
        }
        onCheckedChange?.(newChecked);
    };

    const iconSize = size === 'sm' ? 12 : 14;

    return (
        <button
            type="button"
            role="checkbox"
            id={id}
            aria-checked={checked}
            data-state={checked ? 'checked' : 'unchecked'}
            disabled={disabled}
            className={`${styles.root({ size })} ${className || ''}`}
            onClick={toggle}
        >
            {checked && (
                <span className={styles.indicator}>
                    <Check size={iconSize} strokeWidth={3} />
                </span>
            )}
        </button>
    );
};
