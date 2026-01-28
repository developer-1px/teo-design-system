
import * as styles from './SurfaceShowcase.css';
import { TextInput } from '../ui/TextInput';
import { Select } from '../ui/Select';

export function SurfaceShowcase() {
    return (
        <div className={styles.wrapper}>

            {/* 1. Underlying Tokens */}
            <div>
                <div className={styles.sectionTitle}>1. Surface Tokens (Primitives)</div>
                <div className={styles.grid}>
                    <div className={styles.baseCard}>
                        <div className={styles.label}>Surface.Base</div>
                        <div className={styles.desc}>App Background</div>
                    </div>
                    <div className={styles.subtleCard}>
                        <div className={styles.label}>Surface.Subtle</div>
                        <div className={styles.desc}>Sidebar / Toolbar</div>
                    </div>
                    <div className={styles.cardSurface}>
                        <div className={styles.label}>Surface.Card</div>
                        <div className={styles.desc}>Border + Shadow</div>
                    </div>
                </div>
            </div>

            {/* 2. Interactive Surfaces */}
            <div>
                <div className={styles.sectionTitle}>2. Interactive Mixins</div>
                <div className={styles.grid}>
                    <div className={styles.highlightCard}>
                        <div className={styles.label}>Surface.Highlight</div>
                        <div className={styles.desc}>Selected State</div>
                    </div>
                    <div className={styles.ghostCard}>
                        <div className={styles.label}>Surface.Ghost</div>
                        <div className={styles.desc}>Hover me (Transparent)</div>
                    </div>
                </div>
            </div>

            {/* 3. Field Integration */}
            <div>
                <div className={styles.sectionTitle}>3. Field Composition (Inputs)</div>
                <p className={styles.desc} style={{ marginBottom: 16 }}>
                    These components consume <code>surface.field</code> for consistent focus rings and error states.
                </p>

                <div className={styles.componentRow}>
                    <div style={{ width: 200 }}>
                        <TextInput placeholder="Default Input" />
                    </div>
                    <div style={{ width: 200 }}>
                        <TextInput placeholder="With Icon" leftIcon={<span>@</span>} />
                    </div>
                    <div style={{ width: 200 }}>
                        <TextInput placeholder="Error State" error defaultValue="Invalid Value" />
                    </div>
                    <div style={{ width: 200 }}>
                        <TextInput placeholder="Disabled" disabled defaultValue="Disabled Input" />
                    </div>
                </div>

                <div className={styles.componentRow}>
                    <div style={{ width: 200 }}>
                        <Select>
                            <option>Select Option</option>
                            <option>Item 1</option>
                        </Select>
                    </div>
                    <div style={{ width: 200 }}>
                        <Select size="compact">
                            <option>Compact Select</option>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}
