import { useState, useMemo } from 'react';
import * as styles from './FlowPage2.css';
import {
    Zap,
    Braces,
    Database,
    Cpu,
    Layers,
    Rocket,
    CheckCircle2,
    ChevronRight,
    X,
    Play
} from 'lucide-react';

// --- MOCK DATA ---
const RAW_INPUT = {
    id: "prod_k8s_001",
    timestamp: 1738075200,
    metadata: {
        vendor: "ElectroCore",
        batch: "2026-XQ"
    },
    payload: {
        title: "K-Series Wireless Hub",
        price_usd: 129.50,
        stock: 1420,
        assets: ["https://api.store.com/images/k8s.jpg"]
    }
};

const DESIGN_SPEC = {
    schema_id: "inventory_v4",
    slots: [
        { id: 'uid', label: 'Primary ID', type: 'string' },
        { id: 'p_label', label: 'Display Name', type: 'string' },
        { id: 'p_cost', label: 'Unit Price', type: 'number' },
        { id: 'p_stock', label: 'Inventory Count', type: 'number' },
        { id: 'p_vendor', label: 'Supplier', type: 'string' }
    ],
    columns: [
        { id: 'uid', label: 'ID Reference', width: '20%' },
        { id: 'p_label', label: 'Product Name', width: '30%' },
        { id: 'p_cost', label: 'Price', width: '15%' },
        { id: 'p_stock', label: 'Stock', width: '15%' },
        { id: 'p_vendor', label: 'Vendor', width: '20%' }
    ]
};

export default function FlowPage2() {
    const [mappings, setMappings] = useState<Record<string, string>>({
        uid: 'id',
        p_label: 'title'
    });
    const [transformCode, setTransformCode] = useState(`// Transform Pipeline\nfunction transform(input) {\n  return {\n    id: input.id,\n    title: input.payload.title,\n    price: input.payload.price_usd,\n    stock: input.payload.stock,\n    vendor: input.metadata.vendor,\n    is_low_stock: input.payload.stock < 100\n  };\n}`);

    // Multi-stage selection state
    const [activeSignal, setActiveSignal] = useState<string | null>(null);

    // 1. EXECUTE TRANSFORMATION
    const processedResult = useMemo(() => {
        try {
            const fn = new Function('input', `${transformCode}; return transform(input);`);
            return { success: true, data: fn(RAW_INPUT) as any, error: null };
        } catch (e: any) {
            return { success: false, data: {}, error: e.message };
        }
    }, [transformCode]);

    const signalFields = useMemo(() => {
        return Object.keys(processedResult.data || {});
    }, [processedResult]);

    // 2. WIRING & VALIDATION
    const isAllMapped = useMemo(() => {
        return DESIGN_SPEC.slots.every(slot => !!mappings[slot.id]);
    }, [mappings]);

    const mappedCount = useMemo(() => {
        return DESIGN_SPEC.slots.filter(slot => !!mappings[slot.id]).length;
    }, [mappings]);

    // 3. PREVIEW & SIMULATION STATE
    const [showPreview, setShowPreview] = useState(false);

    const performBinding = (slotId: string) => {
        if (activeSignal) {
            setMappings(prev => ({ ...prev, [slotId]: activeSignal }));
            setActiveSignal(null);
        }
    };

    return (
        <div className={styles.container}>
            {/* --- PREVIEW MODAL --- */}
            <div className={styles.previewOverlay} data-open={showPreview}>
                <div className={styles.simulationCard}>
                    <div className={styles.simulationHeader}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Rocket size={16} color="#3b82f6" />
                            </div>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 800 }}>Production Simulation</div>
                                <div style={{ fontSize: '11px', color: '#71717a' }}>Verifying data binding with live payload</div>
                            </div>
                        </div>
                        <button className={styles.closeButton} onClick={() => setShowPreview(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    {/* LIVE TABLE RENDER */}
                    <div className={styles.liveTable}>
                        <div className={styles.headerRow} style={{ padding: '0 24px' }}>
                            {DESIGN_SPEC.columns.map(col => (
                                <div key={col.id} className={styles.cell} style={{ width: col.width, fontWeight: 700, borderBottom: 'none' }}>
                                    {col.label}
                                </div>
                            ))}
                        </div>
                        <div style={{ padding: '0 24px' }}>
                            {processedResult.data.map((row: any, i: number) => (
                                <div key={i} style={{ display: 'flex', borderTop: `1px solid ${styles.zinc[100]}` }}>
                                    {DESIGN_SPEC.columns.map(col => {
                                        const mappedField = mappings[col.id];
                                        const value = mappedField ? row[mappedField] : null;
                                        return (
                                            <div key={col.id} className={styles.cell} style={{ width: col.width, borderRight: 'none' }}>
                                                {col.id === 'avatar' && value ? (
                                                    <div className={styles.avatarMock}>ID</div>
                                                ) : (
                                                    <span style={{ fontWeight: 500 }}>{value ?? '-'}</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ padding: '24px', borderTop: `1px solid ${styles.zinc[200]}`, background: '#fafafa', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                        <button style={{ padding: '10px 16px', background: '#fff', border: `1px solid ${styles.zinc[200]}`, borderRadius: '6px', fontWeight: 600, fontSize: '13px' }} onClick={() => setShowPreview(false)}>
                            Adjust Logic
                        </button>
                        <button style={{ padding: '10px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <CheckCircle2 size={16} />
                            Confirm & Deploy
                        </button>
                    </div>
                </div>
            </div>

            <header className={styles.topBar}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className={styles.methodBadge} style={{ background: '#3b82f6', color: '#fff' }}>PIPELINE</div>
                    <span className={styles.urlText} style={{ color: '#e4e4e7' }}>worker://inventory-adapter-v4</span>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div
                        className={styles.integrityBadge}
                        data-perfect={isAllMapped}
                    >
                        {isAllMapped ? <CheckCircle2 size={12} /> : <Zap size={12} />}
                        {mappedCount} / {DESIGN_SPEC.slots.length} WIRED
                    </div>
                </div>
            </header>

            <div className={styles.flowContainerScrollable}>

                {/* --- STAGE 1: RAW INPUT --- */}
                <div className={styles.stageCol}>
                    <div className={styles.stageHeader}>
                        <Database size={13} />
                        SOURCE: INCOMING_WEBHOOK
                    </div>
                    <div className={styles.codeBlock}>
                        <pre style={{ margin: 0, color: '#94a3b8' }}>
                            {JSON.stringify(RAW_INPUT, null, 2)}
                        </pre>
                    </div>
                    <div style={{ padding: '12px', background: '#09090b', borderTop: '1px solid #27272a', fontSize: '10px', color: '#71717a' }}>
                        STATUS: RECEIVED (200 OK)
                    </div>
                </div>

                <div style={{ alignSelf: 'center', margin: '0 -14px', zIndex: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#18181b', border: '1px solid #3f3f46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ChevronRight size={16} color="#3f3f46" />
                    </div>
                </div>

                {/* --- STAGE 2: TRANSFORM ENGINE --- */}
                <div className={styles.centerCol}>
                    <div className={styles.stageHeader} style={{ background: '#020617', borderColor: '#1e293b' }}>
                        <Cpu size={13} color="#38bdf8" />
                        TRANSFORM: ADAPTER_JS
                    </div>
                    <textarea
                        className={styles.codeBlock}
                        style={{ background: '#020617', color: '#38bdf8', border: 'none' }}
                        value={transformCode}
                        onChange={(e) => setTransformCode(e.target.value)}
                        spellCheck={false}
                    />

                    {/* COMPUTED SIGNALS */}
                    <div className={styles.fieldList}>
                        <div style={{ width: '100%', fontSize: '10px', color: '#a1a1aa', fontWeight: 800, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Zap size={10} /> COMPUTED SIGNALS (OUTPUT)
                        </div>
                        {signalFields.map(field => (
                            <div
                                key={field}
                                className={styles.signalChip}
                                data-active={activeSignal === field}
                                onClick={() => setActiveSignal(field)}
                            >
                                <span style={{ opacity: 0.5 }}>λ</span>
                                {field}
                                {Object.values(mappings).includes(field) && <CheckCircle2 size={10} color="#10b981" />}
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ alignSelf: 'center', margin: '0 -14px', zIndex: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#1e293b', border: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ChevronRight size={16} color="#38bdf8" />
                    </div>
                </div>

                {/* --- STAGE 3: BINDING TARGETS --- */}
                <div className={styles.rightCol}>
                    <div className={styles.stageHeader} style={{ background: '#0f172a', borderColor: '#1e293b' }}>
                        <Layers size={13} color="#818cf8" />
                        TARGET: UI_SCHEMA_V4
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                        <div style={{ padding: '8px', fontSize: '11px', color: isAllMapped ? '#10b981' : '#ef4444', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                            {isAllMapped ? <CheckCircle2 size={14} /> : <Zap size={14} className="animate-pulse" />}
                            {isAllMapped ? 'WIRING COMPLETE' : 'INCOMPLETE PIPELINE'}
                        </div>

                        {DESIGN_SPEC.slots.map(slot => (
                            <div
                                key={slot.id}
                                className={styles.slotCard}
                                data-error={!mappings[slot.id]}
                                onClick={() => performBinding(slot.id)}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>{slot.label}</span>
                                    <div className={styles.bindStatus} data-bound={!!mappings[slot.id]}>
                                        {mappings[slot.id] ? <CheckCircle2 size={10} /> : <Zap size={10} />}
                                        {mappings[slot.id] ? 'MAPPED' : 'IDLE'}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '4px', border: mappings[slot.id] ? '1px solid #1e293b' : '1px dashed #ef4444' }}>
                                    {mappings[slot.id] ? (
                                        <>
                                            <Zap size={12} color="#3b82f6" />
                                            <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>{mappings[slot.id]}</span>
                                        </>
                                    ) : (
                                        <span style={{ fontSize: '12px', color: '#ef4444', fontStyle: 'italic', opacity: 0.8 }}>
                                            {activeSignal ? `Click to map ${activeSignal}` : 'REQUIRED INPUT MISSING'}
                                        </span>
                                    )}
                                </div>
                                <div style={{ fontSize: '10px', color: '#334155' }}>Type: {slot.type.toUpperCase()}</div>
                            </div>
                        ))}
                    </div>

                    {/* SCHEMA OUTPUT & RUN SIMULATION */}
                    <div className={styles.schemaPanel}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Braces size={14} color="#818cf8" />
                                <span style={{ fontSize: '11px', fontWeight: 800 }}>OUTPUT BINDING</span>
                            </div>
                            {!isAllMapped && <div style={{ fontSize: '10px', color: '#ef4444', fontWeight: 700 }}>BLOCKING PREVIEW</div>}
                        </div>

                        <button
                            className={styles.runButton}
                            disabled={!isAllMapped}
                            onClick={() => setShowPreview(true)}
                        >
                            {isAllMapped ? <Play size={16} fill="white" /> : <Zap size={16} />}
                            {isAllMapped ? 'RUN SIMULATION' : `${DESIGN_SPEC.slots.length - mappedCount} SLOTS REMAINING`}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
