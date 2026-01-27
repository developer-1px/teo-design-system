import React, { createContext, useContext, useState } from 'react';
import * as styles from './Radio.css';

interface RadioGroupContextType {
    value: string;
    onValueChange: (value: string) => void;
    disabled: boolean;
    name?: string;
}

const RadioGroupContext = createContext<RadioGroupContextType | undefined>(undefined);

interface RadioGroupProps {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    name?: string;
    className?: string;
    children: React.ReactNode;
}

export const RadioGroup = ({
    value: controlledValue,
    defaultValue,
    onValueChange,
    disabled = false,
    name,
    className,
    children,
}: RadioGroupProps) => {
    const [internalValue, setInternalValue] = useState(defaultValue || '');

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    const handleValueChange = (newValue: string) => {
        if (!isControlled) {
            setInternalValue(newValue);
        }
        onValueChange?.(newValue);
    };

    return (
        <RadioGroupContext.Provider value={{ value, onValueChange: handleValueChange, disabled, name }}>
            <div className={`${styles.group} ${className || ''}`} role="radiogroup">
                {children}
            </div>
        </RadioGroupContext.Provider>
    );
};

interface RadioGroupItemProps {
    value: string;
    id?: string;
    className?: string;
    disabled?: boolean;
}

export const RadioGroupItem = ({
    value,
    id,
    className,
    disabled: itemDisabled,
}: RadioGroupItemProps) => {
    const context = useContext(RadioGroupContext);

    if (!context) {
        throw new Error('RadioGroupItem must be used within a RadioGroup');
    }

    const isChecked = context.value === value;
    const isDisabled = context.disabled || itemDisabled;

    return (
        <button
            type="button"
            role="radio"
            id={id}
            aria-checked={isChecked}
            data-state={isChecked ? 'checked' : 'unchecked'}
            disabled={isDisabled}
            className={`${styles.item({})} ${className || ''}`}
            onClick={() => !isDisabled && context.onValueChange(value)}
            name={context.name}
            value={value}
        >
            {isChecked && <span className={styles.indicator} />}
        </button>
    );
};
