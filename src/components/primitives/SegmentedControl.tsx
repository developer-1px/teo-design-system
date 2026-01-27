import { type ReactNode } from 'react';
import * as styles from './SegmentedControl.css';

export interface SegmentedControlOption {
    value: string;
    label: ReactNode;
    icon?: ReactNode;
}

interface SegmentedControlProps {
    options: SegmentedControlOption[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function SegmentedControl({ options, value, onChange, className }: SegmentedControlProps) {
    return (
        <div className={`${styles.root} ${className || ''}`}>
            {options.map((option) => (
                <button
                    key={option.value}
                    className={styles.item}
                    data-active={value === option.value}
                    onClick={() => onChange(option.value)}
                    type="button"
                >
                    {option.icon}
                    {option.label}
                </button>
            ))}
        </div>
    );
}
