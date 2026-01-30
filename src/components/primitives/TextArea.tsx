import React from 'react';
import * as styles from './TextArea.css';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    resize?: 'none' | 'vertical' | 'horizontal' | 'both';
    error?: boolean;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ className, resize, error, ...props }, ref) => {
        return (
            <div className={styles.container()}>
                <textarea
                    ref={ref}
                    className={`${styles.textarea({ resize, error })} ${className || ''}`}
                    {...props}
                />
            </div>
        );
    }
);

TextArea.displayName = 'TextArea';
