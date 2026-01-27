import * as styles from '../StoryblokLayout.css';
import { type StoryblokComponent } from '../types';
import { Trash2 } from 'lucide-react';

interface ConfigPanelProps {
    selectedBlock: StoryblokComponent | undefined;
    onChange: (key: string, value: any) => void;
    onDelete: (id: string) => void;
}

export function ConfigPanel({ selectedBlock, onChange, onDelete }: ConfigPanelProps) {
    if (!selectedBlock) {
        return (
            <aside className={styles.configPanel}>
                <div className={styles.configHeader}>Configuration</div>
                <div style={{ padding: '32px', textAlign: 'center' }} className={styles.helperText}>
                    Select a block to edit its fields.
                </div>
            </aside>
        );
    }

    const editableKeys = Object.keys(selectedBlock).filter(k => k !== '_uid' && k !== 'component');

    return (
        <aside className={styles.configPanel}>
            <div className={styles.configHeader}>
                <span style={{ textTransform: 'capitalize' }}>{selectedBlock.component}</span>
                <button
                    onClick={() => onDelete(selectedBlock._uid)}
                    className={styles.ghostButton}
                    style={{ color: '#ef4444', marginLeft: 'auto' }} // Red for delete is standard
                >
                    <Trash2 size={16} />
                </button>
            </div>

            <div className={styles.configForm}>
                {editableKeys.map(key => {
                    const value = selectedBlock[key];
                    const isLongText = typeof value === 'string' && value.length > 50;

                    return (
                        <div key={key} className={styles.fieldGroup}>
                            <label className={styles.fieldLabel}>{key}</label>
                            {isLongText || key === 'description' || key === 'body' ? (
                                <textarea
                                    className={styles.fieldTextArea}
                                    value={value}
                                    onChange={(e) => onChange(key, e.target.value)}
                                />
                            ) : (
                                <input
                                    className={styles.fieldInput}
                                    value={value}
                                    onChange={(e) => onChange(key, e.target.value)}
                                />
                            )}
                        </div>
                    );
                })}

                {editableKeys.length === 0 && (
                    <div className={styles.helperText} style={{ fontStyle: 'italic' }}>
                        No editable fields for this component.
                    </div>
                )}
            </div>

            <div style={{ marginTop: 'auto', padding: '16px', borderTop: 'none' }}>
                <div className={styles.fieldLabel} style={{ marginBottom: '8px' }}>Technical Details</div>
                <div className={styles.helperText} style={{ fontFamily: 'monospace' }}>
                    UUID: {selectedBlock._uid}
                </div>
            </div>
        </aside>
    );
}
