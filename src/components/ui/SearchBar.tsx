import React from 'react';
import { TextInput, type TextInputProps } from './TextInput';
import { Search, X } from 'lucide-react';
import * as styles from './SearchBar.css';

interface SearchBarProps extends Omit<TextInputProps, 'leftIcon' | 'rightIcon'> {
    onClear?: () => void;
    onSearch?: (value: string) => void;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
    ({ value, onChange, onClear, onSearch, className, ...props }, ref) => {

        const handleClear = () => {
            // Create a synthetic event to clearer propagation if needed, 
            // or just call the parent callback.
            if (onClear) {
                onClear();
            } else if (onChange) {
                // Emulate empty event
                const event = {
                    target: { value: '' },
                    currentTarget: { value: '' }
                } as React.ChangeEvent<HTMLInputElement>;
                onChange(event);
            }
        };

        const hasValue = value && String(value).length > 0;

        return (
            <TextInput
                ref={ref}
                type="text"
                value={value}
                onChange={onChange}
                leftIcon={<Search size={16} />}
                rightIcon={
                    hasValue ? (
                        <button type="button" className={styles.clearButton} onClick={handleClear} tabIndex={-1}>
                            <X size={14} />
                        </button>
                    ) : null
                }
                className={className}
                placeholder={props.placeholder || "Search..."}
                {...props}
            />
        );
    }
);
SearchBar.displayName = 'SearchBar';
