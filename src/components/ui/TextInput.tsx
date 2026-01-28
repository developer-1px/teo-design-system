import React from 'react';
import * as styles from './TextInput.css';

export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    size?: 'default' | 'dense' | 'compact' | 'large';
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    error?: boolean;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
    ({ size = 'default', leftIcon, rightIcon, error, className, ...props }, ref) => {
        return (
            <div className={styles.container}>
                {leftIcon && <div className={styles.leftIcon}>{leftIcon}</div>}
                <input
                    ref={ref}
                    className={`${styles.input({
                        size,
                        hasLeftIcon: !!leftIcon,
                        hasRightIcon: !!rightIcon
                    })} ${className || ''}`}
                    data-invalid={error}
                    {...props}
                />
                {rightIcon && <div className={styles.rightIcon}>{rightIcon}</div>}
            </div>
        );
    }
);
TextInput.displayName = "TextInput";
