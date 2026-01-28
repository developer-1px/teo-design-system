import React, { useState } from 'react';
import * as styles from './TemplateStudioPage.css';
import {
    Layout,
    Type,
    Image as ImageIcon,
    BadgeCheck,
    BarChart2,
    Save,
    Play,
    Zap,
    Settings2,
    Info,
    ChevronRight,
    MousePointer2
} from 'lucide-react';

/**
 * DE-FACTO LAYOUT DEFINITIONS
 */
interface LayoutPattern {
    id: string;
    name: string;
    description: string;
    icon: any;
    slots: string[];
}

const STANDARD_PATTERNS: LayoutPattern[] = [
    {
        id: 'L1',
        name: 'The Identity',
        description: 'Icon/Avatar + 2-line text stack',
        icon: ImageIcon,
        slots: ['media', 'title', 'subtitle']
    },
    {
        id: 'L2',
        name: 'The Meta Stack',
        description: 'Clean 2-line vertical text stack',
        icon: Type,
        slots: ['primary_text', 'secondary_text']
    },
    {
        id: 'L3',
        name: 'Visual Metric',
        description: 'Data value + informative progress bar',
        icon: BarChart2,
        slots: ['value', 'status_label', 'percentage']
    },
    {
        id: 'L4',
        name: 'Status Label',
        description: 'Single high-visibility status badge',
        icon: BadgeCheck,
        slots: ['status_text', 'status_type']
    }
];

export default function TemplateStudioPage() {
    const [selectedPatternId, setSelectedPatternId] = useState<string>('L1');
    const currentPattern = STANDARD_PATTERNS.find(p => p.id === selectedPatternId)!;

    return (
        <div className={styles.container}>
            {/* TOP BAR */}
            <header className={styles.topBar}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ background: '#18181b', color: '#fff', padding: '4px', borderRadius: '4px' }}>
                        <Zap size={16} fill="currentColor" />
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '14px' }}>Cell Design Patterns</span>
                    <span style={{ color: '#d4d4d8' }}>/</span>
                    <span style={{ fontSize: '14px', color: '#71717a' }}>{currentPattern.name} Edition</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button className={styles.chip}><Play size={12} style={{ marginRight: 4 }} /> Simulated View</button>
                    <button className={styles.chip} style={{ background: '#18181b', color: '#fff' }}><Save size={12} style={{ marginRight: 4 }} /> Register Pattern</button>
                </div>
            </header>

            <div className={styles.mainLayout}>
                {/* 1. PATTERN CHOOSER (Left) */}
                <aside className={styles.sidebar}>
                    <div className={styles.sectionTitle}>Standard Layouts</div>
                    {STANDARD_PATTERNS.map(p => (
                        <button
                            key={p.id}
                            onClick={() => setSelectedPatternId(p.id)}
                            className={styles.atomItem}
                            style={{
                                border: 'none',
                                background: selectedPatternId === p.id ? '#fff' : 'transparent',
                                width: '100%',
                                textAlign: 'left',
                                color: selectedPatternId === p.id ? '#3b82f6' : '#52525b',
                                fontWeight: selectedPatternId === p.id ? 600 : 400,
                                borderRight: selectedPatternId === p.id ? '2px solid #3b82f6' : 'none'
                            }}
                        >
                            <p.icon size={14} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <span>{p.id}: {p.name}</span>
                                <span style={{ fontSize: '10px', color: '#a1a1aa', fontWeight: 400 }}>{p.description}</span>
                            </div>
                        </button>
                    ))}

                    <div style={{ marginTop: 'auto', padding: 20, background: '#fafafa', borderTop: '1px solid #e4e4e7' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#a1a1aa', marginBottom: 8 }}>DESIGN SYSTEM STATUS</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '11px', color: '#10b981' }}>
                            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> Standard Compliant
                        </div>
                    </div>
                </aside>

                {/* 2. CANVAS (Center) - Display the chosen FIXED layout */}
                <main className={styles.canvas}>
                    <div style={{ marginBottom: 40, textAlign: 'center' }}>
                        <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>{currentPattern.name}</h2>
                        <p style={{ fontSize: '14px', color: '#71717a' }}>{currentPattern.description}</p>
                    </div>

                    <div className={styles.tablePreviewFrame} style={{ overflow: 'visible' }}>
                        {/* Table Header Fake */}
                        <div style={{ padding: '12px 24px', background: '#fafafa', borderBottom: '1px solid #e4e4e7', display: 'flex', fontSize: '11px', fontWeight: 600, color: '#a1a1aa' }}>
                            <div style={{ flex: 1 }}>{currentPattern.id} PATTERN SPECIFICATION</div>
                            <div>SIMULATED DATA</div>
                        </div>

                        {/* PREVIEW CONTAINER */}
                        <div style={{ padding: 60, display: 'flex', justifyContent: 'center', background: '#fff' }}>
                            <div style={{ position: 'relative', minWidth: '300px' }}>

                                {/* THE ACTUAL RENDERER FOR CHOSEN PATTERN */}
                                <div style={{
                                    border: '1px solid #3b82f6',
                                    padding: '16px 24px',
                                    borderRadius: 12,
                                    background: '#eff6ff33',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 16
                                }}>
                                    {selectedPatternId === 'L1' && (
                                        <>
                                            <div className={styles.atomAvatar} style={{ background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}><ImageIcon size={20} /></div>
                                            <div className={styles.vstack}>
                                                <div className={styles.atomTextMain}>Primary Title Slot</div>
                                                <div className={styles.atomTextSub}>Secondary Description Slot</div>
                                            </div>
                                        </>
                                    )}

                                    {selectedPatternId === 'L2' && (
                                        <div className={styles.vstack}>
                                            <div className={styles.atomTextMain}>Headline Slot</div>
                                            <div className={styles.atomTextSub}>Secondary Metadata Slot</div>
                                        </div>
                                    )}

                                    {selectedPatternId === 'L3' && (
                                        <div style={{ width: '100%' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                                <span className={styles.atomTextMain}>12,450 units</span>
                                                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>IN STOCK</span>
                                            </div>
                                            <div style={{ height: 6, background: '#e4e4e7', borderRadius: 3, overflow: 'hidden' }}>
                                                <div style={{ width: '70%', height: '100%', background: '#3b82f6' }} />
                                            </div>
                                        </div>
                                    )}

                                    {selectedPatternId === 'L4' && (
                                        <span className={styles.atomBadge} style={{ fontSize: '12px', padding: '4px 12px' }}>
                                            Status Badge Slot
                                        </span>
                                    )}
                                </div>

                                {/* SLOT ANNOTATIONS */}
                                <div style={{ marginTop: 24, padding: 16, background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>Active Slots</div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                        {currentPattern.slots.map(s => (
                                            <span key={s} style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '4px 8px', borderRadius: 4, fontSize: '11px', color: '#475569', fontWeight: 500 }}>{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: 40, padding: '20px', background: '#fff', borderRadius: 12, border: '1px solid #e4e4e7', maxWidth: '600px' }}>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                            <div style={{ padding: 8, background: '#fef3c7', borderRadius: 8, color: '#d97706' }}><MousePointer2 size={16} /></div>
                            <div>
                                <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: 4 }}>How to Use</h4>
                                <p style={{ fontSize: '13px', color: '#71717a', lineHeight: 1.5 }}>
                                    Templates are rigid designs. To display data, select a pattern on the left and map your API response keys to the identified slots in the next step.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* 3. SLOT MAPPING (Right) */}
                <aside className={styles.inspector}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                        <Settings2 size={16} />
                        <span style={{ fontWeight: 600 }}>Mapping Definitions</span>
                    </div>

                    <p style={{ fontSize: '12px', color: '#71717a', marginBottom: 24 }}>
                        Map your data fields to the {currentPattern.id} structure.
                    </p>

                    {currentPattern.slots.map(slot => (
                        <div key={slot} className={styles.propField}>
                            <label className={styles.label}>{slot.toUpperCase().replace('_', ' ')} SLOT</label>
                            <div style={{ position: 'relative' }}>
                                <select className={styles.input}>
                                    <option>Select Key...</option>
                                    <option>product_name</option>
                                    <option>sku_code</option>
                                    <option>price_amount</option>
                                    <option>stock_count</option>
                                    <option>image_url</option>
                                </select>
                            </div>
                        </div>
                    ))}

                    <div style={{ marginTop: 'auto', padding: 16, background: '#18181b', color: '#fff', borderRadius: 8 }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#71717a', marginBottom: 8, textTransform: 'uppercase' }}>CSS Definition</div>
                        <code style={{ fontSize: '10px', color: '#a1a1aa', fontFamily: 'monospace', display: 'block', lineHeight: 1.4 }}>
                            .cell_l1 &#123;<br />
                            &nbsp;&nbsp;display: flex;<br />
                            &nbsp;&nbsp;align-items: center;<br />
                            &nbsp;&nbsp;gap: 16px;<br />
                            &#125;
                        </code>
                    </div>
                </aside>
            </div>
        </div>
    );
}
