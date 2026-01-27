import React from 'react';
import * as styles from './Switch.css';

interface SwitchProps {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    size?: 'default' | 'sm';
    className?: string;
    id?: string;
}

export const Switch = ({
    checked: controlledChecked,
    defaultChecked = false,
    onCheckedChange,
    disabled = false,
    size = 'default',
    className,
    id,
}: SwitchProps) => {
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

    return (
        <button
            type="button"
            role="switch"
            id={id}
            aria-checked={checked}
            data-state={checked ? 'checked' : 'unchecked'}
            disabled={disabled}
            className={`${styles.root({ size })} ${className || ''}`}
            onClick={toggle}
        >
            <span
                data-state={checked ? 'checked' : 'unchecked'}
                className={styles.thumb({ size })}
            />
        </button>
    );
};
