import { useState } from 'react';
import * as styles from './FlowPage.css';
import {
    Play, Database, ArrowRight, Settings2,
    Type, List, AlignLeft, CheckSquare, Calendar, EyeOff, Hash
} from 'lucide-react';

// MOCK DATA
const RESPONSE_DATA = [
    { key: 'id', value: 1024, type: 'pk' },
    { key: 'full_name', value: 'Monica Hall', type: 'string' },
    { key: 'email', value: 'monica@acme.inc', type: 'email' },
    { key: 'role', value: 'Admin', type: 'enum' },
    { key: 'is_active', value: true, type: 'boolean' },
    { key: 'last_login', value: '2h ago', type: 'datetime' },
];

const SCHEMA_CONFIG = [
    { key: 'id', ui: 'ID Badge', icon: Hash },
    { key: 'full_name', ui: 'Text Input', icon: Type },
    { key: 'email', ui: 'Email Field', icon: AlignLeft },
    { key: 'role', ui: 'Select Dropdown', icon: List },
    { key: 'is_active', ui: 'Toggle Switch', icon: CheckSquare },
    { key: 'last_login', ui: 'Timestamp', icon: Calendar },
];

export default function FlowPage() {
    const [hoveredKey, setHoveredKey] = useState<string | null>(null);

    return (
        <div className={styles.container}>
            {/* 1. Top Bar */}
            <header className={styles.topBar}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className={styles.methodBadge}>GET</div>
                    <span className={styles.urlText}>api.service.com/v1/users/1024</span>
                </div>

                <div className={styles.flowStatus}>
                    <div style={{ width: 6, height: 6, background: '#10b981', borderRadius: '50%' }} />
                    Connected
                </div>

                <button className={styles.playButton}>
                    <Play size={14} fill="currentColor" />
                    Run
                </button>
            </header>

            {/* 2. Three-Pane Flow */}
            <div className={styles.flowContainer}>

                {/* Column 1: Source (Data) */}
                <div className={styles.sourceCol}>
                    <div className={styles.colHeader}>
                        <span>1. Raw Response</span>
                        <Database size={14} />
                    </div>
                    <div className={styles.scrollArea}>
                        {RESPONSE_DATA.map((item) => (
                            <div
                                key={item.key}
                                className={styles.jsonNode}
                                data-active={hoveredKey === item.key}
                                onMouseEnter={() => setHoveredKey(item.key)}
                                onMouseLeave={() => setHoveredKey(null)}
                            >
                                <span className={styles.jsonKey}>{item.key}</span>
                                <span style={{ color: '#ccc' }}>:</span>
                                <span className={styles.jsonVal}>{String(item.value)}</span>
                            </div>
                        ))}
                        <div style={{ padding: '12px 20px', color: '#999', fontSize: '11px', fontStyle: 'italic' }}>
                            ... 480 bytes received
                        </div>
                    </div>
                </div>

                {/* Column 2: Logic (Schema & Transform) */}
                <div className={styles.logicCol}>
                    <div className={styles.colHeader}>
                        <span>2. UI Transformation</span>
                        <Settings2 size={14} />
                    </div>
                    <div className={styles.scrollArea} style={{ background: '#fafafa' }}>
                        {SCHEMA_CONFIG.map((item) => (
                            <div
                                key={item.key}
                                className={styles.logicCard}
                                data-active={hoveredKey === item.key}
                                onMouseEnter={() => setHoveredKey(item.key)}
                                onMouseLeave={() => setHoveredKey(null)}
                            >
                                <div className={styles.bridgeLine} /> {/* Visual Connection */}

                                <div className={styles.cardTitle}>
                                    <item.icon size={14} color="#71717a" />
                                    <span>{item.key}</span>
                                </div>

                                <div className={styles.propertyRow}>
                                    <span>Component</span>
                                    <select className={styles.select} defaultValue={item.ui}>
                                        <option>Text Input</option>
                                        <option>Select Dropdown</option>
                                        <option>Toggle Switch</option>
                                        <option>ID Badge</option>
                                        <option>Hidden</option>
                                    </select>
                                </div>
                                <div className={styles.propertyRow}>
                                    <span>Label</span>
                                    <input
                                        className={styles.select}
                                        defaultValue={item.key.replace('_', ' ').toUpperCase()}
                                        style={{ width: 100, border: 'none', borderBottom: '1px solid #e4e4e7', background: 'transparent' }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Column 3: Preview (Result) */}
                <div className={styles.previewCol}>
                    <div className={styles.colHeader}>
                        <span>3. Live Preview (Admin UI)</span>
                        <EyeOff size={14} />
                    </div>
                    <div className={styles.previewStage}>
                        <div className={styles.previewCard}>
                            <div className={styles.previewHeader}>
                                <div style={{ fontWeight: 600, fontSize: '14px' }}>Edit User</div>
                                <div style={{ fontSize: '11px', color: '#666', background: '#e4e4e7', padding: '4px 8px', borderRadius: 4 }}>ID: 1024</div>
                            </div>
                            <div className={styles.previewBody}>
                                <div style={{ display: 'grid', gap: '20px' }}>
                                    {SCHEMA_CONFIG.map((item) => (
                                        item.ui !== 'ID Badge' && ( // Skip ID in form
                                            <div
                                                key={item.key}
                                                style={{
                                                    transition: 'opacity 0.2s',
                                                    opacity: hoveredKey && hoveredKey !== item.key ? 0.3 : 1
                                                }}
                                            >
                                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#52525b', marginBottom: '8px' }}>
                                                    {item.key.replace('_', ' ').toUpperCase()}
                                                </label>
                                                <ComponentRenderer type={item.ui} value={RESPONSE_DATA.find(d => d.key === item.key)?.value} />
                                            </div>
                                        )
                                    ))}
                                </div>

                                <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                    <button style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e4e4e7', background: 'white', fontSize: '12px' }}>Cancel</button>
                                    <button style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#18181b', color: 'white', fontSize: '12px' }}>Save Changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper to render fake UI components
function ComponentRenderer({ type, value }: { type: string, value: any }) {
    if (type === 'Toggle Switch') {
        return (
            <div style={{ width: 36, height: 20, background: value ? '#10b981' : '#e4e4e7', borderRadius: 99, position: 'relative' }}>
                <div style={{
                    width: 16, height: 16, background: 'white', borderRadius: '50%', position: 'absolute', top: 2,
                    left: value ? 18 : 2, transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }} />
            </div>
        );
    }
    if (type === 'Select Dropdown') {
        return (
            <div style={{
                padding: '8px 12px', border: '1px solid #e4e4e7', borderRadius: '6px', fontSize: '13px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff'
            }}>
                {String(value)}
                <ArrowRight size={12} style={{ transform: 'rotate(90deg)' }} />
            </div>
        );
    }
    return (
        <input
            defaultValue={String(value)}
            style={{
                width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #e4e4e7',
                fontSize: '13px', outline: 'none'
            }}
        />
    );
}
