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
    X
} from 'lucide-react';
import { JsonViewer } from '../../components/shared/JsonViewer/JsonViewer';
import { SchemaInspector } from '../../components/shared/SchemaInspector/SchemaInspector';
import { PanelGroup, Panel, PanelHandle } from '../../components/ui/Resizable';

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


const TARGET_INTERFACE = {
    uid: 'string',
    display: {
        title: 'string',
        vendor: 'string',
    },
    inventory: {
        price: 'number',
        stock: 'number',
    }
};

export default function FlowPage2() {
    const [transformCode, setTransformCode] = useState(`// Transform Pipeline (Partial Conformance)
function transform(input) {
  return {
    uid: input.id, 
    display: {
        title: input.payload.title.toUpperCase(),
        // vendor: omitted_for_demonstration
    },
    inventory: {
        price: input.payload.price_usd,
        qty: input.payload.stock // Field name mismatch: expected "stock"
    }
  };
}`);

    // Helper to get total field count and values from nested interface
    const getInterfaceFields = (obj: any, prefix = ''): string[] => {
        return Object.entries(obj).reduce((acc: string[], [key, val]) => {
            const path = prefix ? `${prefix}.${key}` : key;
            if (typeof val === 'object' && val !== null) {
                return [...acc, ...getInterfaceFields(val, path)];
            }
            return [...acc, path];
        }, []);
    };

    const targetFields = useMemo(() => getInterfaceFields(TARGET_INTERFACE), []);

    // 1. EXECUTE TRANSFORMATION
    const processedResult = useMemo(() => {
        try {
            const fn = new Function('input', `${transformCode}; return transform(input);`);
            return { success: true, data: fn(RAW_INPUT) as any, error: null };
        } catch (e: any) {
            return { success: false, data: {}, error: e.message };
        }
    }, [transformCode]);

    // 2. WIRING & VALIDATION (Conformance Check)
    const getByPath = (obj: any, path: string[]) => {
        return path.reduce((acc, key) => acc?.[key], obj);
    };

    const validMappingCount = useMemo(() => {
        return targetFields.filter(pathStr => {
            const pathArr = pathStr.split('.');
            const value = getByPath(processedResult.data, pathArr);
            const expectedType = getByPath(TARGET_INTERFACE, pathArr);

            if (value === undefined || value === null) return false;
            return typeof value === expectedType;
        }).length;
    }, [processedResult.data, targetFields]);

    const isAllMapped = useMemo(() => {
        return validMappingCount === targetFields.length;
    }, [validMappingCount, targetFields]);

    // 3. PREVIEW & SIMULATION STATE
    const [showPreview, setShowPreview] = useState(false);


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
                            {targetFields.map(path => (
                                <div key={path} className={styles.cell} style={{ flex: 1, fontWeight: 700, borderBottom: 'none' }}>
                                    {path}
                                </div>
                            ))}
                        </div>
                        <div style={{ padding: '0 24px' }}>
                            {(Array.isArray(processedResult.data) ? processedResult.data : [processedResult.data]).map((row: any, i: number) => (
                                <div key={i} style={{ display: 'flex', borderTop: '1px solid #f4f4f5' }}>
                                    {targetFields.map(path => {
                                        const value = getByPath(row, path.split('.'));
                                        return (
                                            <div key={path} className={styles.cell} style={{ flex: 1, borderRight: 'none' }}>
                                                <span style={{ fontWeight: 500 }}>{String(value ?? '-')}</span>
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

            <header className={styles.topBar} style={{ background: '#fff', borderBottom: '1px solid #e4e4e7' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div className={styles.methodBadge} style={{ background: '#3b82f6', color: '#fff' }}>PIPELINE</div>
                    <span className={styles.urlText} style={{ color: '#71717a' }}>worker://inventory-adapter-v4</span>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div
                        className={styles.integrityBadge}
                        data-perfect={isAllMapped}
                        style={{ border: isAllMapped ? 'none' : '1px solid #e4e4e7' }}
                    >
                        {isAllMapped ? <CheckCircle2 size={12} /> : <Zap size={12} />}
                        {validMappingCount} / {targetFields.length} CONFORMED
                    </div>
                </div>
            </header>

            <div className={styles.flowContainerScrollable}>
                <PanelGroup direction="horizontal">
                    {/* --- STAGE 1: RAW INPUT --- */}
                    <Panel id="source" defaultSize={20} className={styles.stageCol} style={{ borderRight: 'none' }}>
                        <div className={styles.stageHeader}>
                            <Database size={13} />
                            SOURCE: INCOMING_WEBHOOK
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto', background: '#fff' }}>
                            <JsonViewer data={RAW_INPUT} />
                        </div>
                        <div style={{ padding: '12px', background: '#f9fafb', borderTop: '1px solid #e4e4e7', fontSize: '10px', color: '#94a3b8' }}>
                            STATUS: RECEIVED (200 OK)
                        </div>
                    </Panel>

                    <PanelHandle id="handle-0" />

                    {/* --- STAGE 2: TRANSFORM ENGINE --- */}
                    <Panel id="transform" defaultSize={30} className={styles.centerCol} style={{ borderRight: 'none' }}>
                        <div className={styles.stageHeader} style={{ background: '#f8fafc', borderColor: '#e4e4e7' }}>
                            <Cpu size={13} color="#0ea5e9" />
                            TRANSFORM: ADAPTER_JS
                        </div>
                        <textarea
                            className={styles.codeBlock}
                            style={{ background: '#fff', color: '#0ea5e9', border: 'none' }}
                            value={transformCode}
                            onChange={(e) => setTransformCode(e.target.value)}
                            spellCheck={false}
                        />
                    </Panel>

                    <PanelHandle id="handle-1" />

                    {/* --- STAGE 3: LIVE RESULTS --- */}
                    <Panel id="output" defaultSize={25} className={styles.resultCol} style={{ borderRight: 'none' }}>
                        <div className={styles.stageHeader} style={{ background: '#f8fafc', borderColor: '#e4e4e7' }}>
                            <Braces size={13} color="#0ea5e9" />
                            OUTPUT: LIVE_SIGNALS
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            <JsonViewer data={processedResult.data || {}} />
                        </div>
                    </Panel>

                    <PanelHandle id="handle-2" />

                    {/* --- STAGE 4: DATA SOURCE CONFORMANCE --- */}
                    <Panel id="target" defaultSize={25} className={styles.rightCol}>
                        <div className={styles.stageHeader} style={{
                            background: isAllMapped ? '#f5f5ff' : '#fff1f2',
                            borderColor: isAllMapped ? '#e4e4e7' : '#fecdd3',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {isAllMapped ? <Layers size={13} color="#6366f1" /> : <Zap size={13} color="#f43f5e" />}
                                TARGET: CONTRACT_V4
                            </div>
                            <div style={{ fontSize: '10px', color: isAllMapped ? '#10b981' : '#e11d48', fontWeight: 800 }}>
                                {isAllMapped ? 'CONFORMED' : 'SPEC_MISMATCH'} • {validMappingCount}/{targetFields.length}
                            </div>
                        </div>
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            <SchemaInspector
                                template={TARGET_INTERFACE}
                                source={processedResult.data}
                            />
                        </div>

                        {/* SCHEMA OUTPUT & RUN SIMULATION */}
                        <div className={styles.schemaPanel}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <Braces size={14} color="#6366f1" />
                                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#1f2937' }}>OUTPUT BINDING</span>
                                </div>
                                {!isAllMapped && <div style={{ fontSize: '10px', color: '#ef4444', fontWeight: 700 }}>BLOCKING PREVIEW</div>}
                            </div>

                            <button
                                className={styles.runButton}
                                disabled={!isAllMapped}
                                onClick={() => setShowPreview(true)}
                            >
                                <Rocket size={14} style={{ marginRight: 8 }} />
                                Run Production Simulation
                            </button>
                        </div>
                    </Panel>
                </PanelGroup>
            </div>
        </div>
    );
}
