import React from 'react';
import * as styles from './Select.css';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
    label: string;
    value: string | number;
    disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    size?: 'default' | 'dense' | 'compact';
    options?: SelectOption[];
    placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ size = 'default', options, placeholder, children, className, ...props }, ref) => {
        return (
            <div className={styles.container}>
                <select
                    ref={ref}
                    className={`${styles.select({ size })} ${className || ''}`}
                    defaultValue={props.value === undefined && props.defaultValue === undefined ? "" : undefined}
                    {...props}
                >
                    {placeholder && <option value="" disabled>{placeholder}</option>}
                    {options ? (
                        options.map((opt) => (
                            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                                {opt.label}
                            </option>
                        ))
                    ) : children}
                </select>
                <div className={styles.chevron}>
                    <ChevronDown size={16} />
                </div>
            </div>
        );
    }
);
Select.displayName = 'Select';
