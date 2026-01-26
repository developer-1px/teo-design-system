import React from "react";
import * as styles from "./SegmentedControl.css";

interface Option {
    value: string;
    label: React.ReactNode;
}

export interface SegmentedControlProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
}

export function SegmentedControl({ value, onChange, options }: SegmentedControlProps) {
    return (
        <div className={styles.root()}>
            {options.map((option) => {
                const isActive = value === option.value;
                return (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={styles.item({ active: isActive })}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
