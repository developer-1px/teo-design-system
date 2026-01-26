import * as styles from './SurfaceShowcase.css';

export function SurfaceShowcase() {
    return (
        <div className={styles.grid}>
            {/* Base Surface */}
            <div className={styles.baseCard}>
                <div className={styles.label}>Surface.Base</div>
                <div className={styles.desc}>Main App Background</div>
            </div>

            {/* Subtle Surface */}
            <div className={styles.subtleCard}>
                <div className={styles.label}>Surface.Subtle</div>
                <div className={styles.desc}>Sidebar / Toolbar</div>
            </div>

            {/* Card Surface */}
            <div className={styles.cardSurface}>
                <div className={styles.label}>Surface.Card</div>
                <div className={styles.desc}>Floating Content (Border + Shadow)</div>
            </div>

            {/* Highlight Surface */}
            <div className={styles.highlightCard}>
                <div className={styles.label}>Surface.Highlight</div>
                <div className={styles.desc}>Selected / Active State</div>
            </div>

            {/* Input Surface */}
            <div className={styles.inputCard}>
                <div className={styles.label}>Surface.Input</div>
                <div className={styles.desc}>Form Fields</div>
            </div>

            {/* Ghost Surface */}
            <div className={styles.ghostCard}>
                <div className={styles.label}>Surface.Ghost</div>
                <div className={styles.desc}>Transparent (Hover me)</div>
            </div>
        </div>
    );
}
