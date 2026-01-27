import { vars } from '../../styles/vars.css';
import * as styles from './RadiusShowcase.css';

// Type definition for safe indexing
type SurfaceKey = keyof typeof styles.surfaceVariant;

const radii = [
    { name: 'none', value: vars.borderRadius.none, surface: 'subtle' as SurfaceKey },
    { name: 'sm', value: vars.borderRadius.sm, surface: 'input' as SurfaceKey },
    { name: 'md', value: vars.borderRadius.md, surface: 'card' as SurfaceKey },
    { name: 'lg', value: vars.borderRadius.lg, surface: 'highlight' as SurfaceKey },
    { name: 'xl', value: vars.borderRadius.xl, surface: 'base' as SurfaceKey },
    { name: 'full', value: vars.borderRadius.full, surface: 'primary' as SurfaceKey },
];

export const RadiusShowcase = () => {
    return (
        <div className={styles.container}>
            {radii.map((radius) => (
                <div key={radius.name} className={styles.itemWrapper}>
                    <div
                        className={`${styles.demoBox} ${styles.surfaceVariant[radius.surface]}`}
                        style={{ borderRadius: radius.value }}
                    >
                        {radius.name}
                    </div>
                    <div className={styles.label}>{radius.name}</div>
                    <div className={styles.subLabel}>var(--radius-{radius.name})</div>
                </div>
            ))}
        </div>
    );
};
