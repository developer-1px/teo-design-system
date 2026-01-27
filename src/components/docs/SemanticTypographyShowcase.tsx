
import * as styles from './SemanticTypographyShowcase.css';

export const SemanticTypographyShowcase = () => {
    return (
        <div className={styles.panel}>
            {/* Context 1: Navigation Menu */}
            <div className={styles.sidebar}>
                <div className={styles.activeMenuItem}>
                    General <span style={{ opacity: 0.5, fontSize: '10px' }}>(ui.menu)</span>
                </div>
                <div className={styles.menuItem}>Team Members</div>
                <div className={styles.menuItem}>Integrations</div>
                <div className={styles.menuItem}>Billing</div>
            </div>

            {/* Context 2: Main Content */}
            <div className={styles.content}>

                {/* Usage: ui.overline (Section Heading) */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <div className={styles.sectionTitle}>Project Configuration</div>
                        <span style={{ fontSize: '10px', color: '#999', fontFamily: 'monospace' }}>ui.overline</span>
                    </div>

                    <div className={styles.formGroup}>
                        {/* Usage: ui.label */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label className={styles.label}>Project Name</label>
                            <span style={{ fontSize: '10px', color: '#999', fontFamily: 'monospace' }}>ui.label</span>
                        </div>

                        <input
                            className={styles.input}
                            defaultValue="acme-dashboard-v2"
                            readOnly
                        />
                        {/* Usage: ui.caption */}
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div className={styles.helperText}>
                                Public URL will be generated based on this name.
                            </div>
                            <span style={{ fontSize: '10px', color: '#999', fontFamily: 'monospace' }}>ui.caption</span>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <div className={styles.sectionTitle}>Deployment</div>
                        <span style={{ fontSize: '10px', color: '#999', fontFamily: 'monospace' }}>ui.overline</span>
                    </div>

                    <div className={styles.formGroup}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <label className={styles.label}>Build Command</label>
                            <span style={{ fontSize: '10px', color: '#999', fontFamily: 'monospace' }}>ui.label</span>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {/* Usage: ui.code */}
                            <span className={styles.codeBlock}>npm run build</span>
                            <span style={{ fontSize: '10px', color: '#999', fontFamily: 'monospace' }}>ui.code</span>
                            <span className={styles.helperText}>Default for React apps</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
