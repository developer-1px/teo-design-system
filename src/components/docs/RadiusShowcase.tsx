import React from 'react';
import * as styles from './RadiusShowcase.css';
import { vars } from '../../styles/vars.css';

const radii = [
    { name: 'none', value: vars.borderRadius.none },
    { name: 'sm', value: vars.borderRadius.sm },
    { name: 'md', value: vars.borderRadius.md },
    { name: 'lg', value: vars.borderRadius.lg },
    { name: 'xl', value: vars.borderRadius.xl },
    { name: 'full', value: vars.borderRadius.full },
];

export const RadiusShowcase = () => {
    return (
        <div className={styles.container}>
            {radii.map((radius) => (
                <div key={radius.name} className={styles.row}>
                    <div className={styles.label}>{radius.name}</div>
                    <div
                        className={styles.demoBox}
                        style={{ borderRadius: radius.value }}
                    >
                        Preview
                    </div>
                    <div className={styles.valueLabel}>
                        {/* Note: We can't show calc values nicely, but normally this would be static text or inspected */}
                        var(--radius-{radius.name})
                    </div>
                </div>
            ))}
        </div>
    );
};
