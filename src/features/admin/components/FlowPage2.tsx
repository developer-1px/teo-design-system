import { useState, useMemo, useEffect } from 'react';
import * as styles from './FlowPage2.css';
import {
    Zap,
    Braces,
    Database,
    Cpu,
    Layers,
    Rocket,
    CheckCircle2,
    Type,
    Hash,
    Calendar,
    Tag,
    User,
    Check
} from 'lucide-react';

import { JsonViewer } from '../../../components/shared/JsonViewer/JsonViewer';
import { SchemaInspector } from '../../../components/shared/SchemaInspector/SchemaInspector';
import { PanelGroup, Panel, PanelHandle } from '../../../components/ui/Resizable/index';

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

// --- RICH MOCK DATA FOR SCOREBOARD ---
const SCOREBOARD_MOCK = [
    {
        id: "1",
        product: { title: "K-Series Wireless Hub", subtitle: "#ORD-9921" },
        assignee: { name: "Alex Rivers", email: "alex@teodesign.io", avatar: "https://i.pravatar.cc/150?u=alex" },
        status: "Shipped",
        date: "2026-01-28",
        amount: 129.50,
        image: "https://picsum.photos/id/1/200/300"
    },
    {
        id: "2",
        product: { title: "Eco Kit v2", subtitle: "#ORD-9922" },
        assignee: { name: "Sarah Chen", email: "sarah@teodesign.io", avatar: "https://i.pravatar.cc/150?u=sarah" },
        status: "Processing",
        date: "2026-01-29",
        amount: 45.00,
        image: "https://picsum.photos/id/2/200/300"
    },
    {
        id: "3",
        product: { title: "NC Headset Pro", subtitle: "#ORD-9923" },
        assignee: { name: "Michael Park", email: "m.park@teodesign.io", avatar: "https://i.pravatar.cc/150?u=michael" },
        status: "Ready",
        date: "2026-01-30",
        amount: 299.00,
        image: "https://picsum.photos/id/3/200/300"
    },
    {
        id: "4",
        product: { title: "Jeju Tea Set", subtitle: "#ORD-9924" },
        assignee: { name: "Ji-won Kim", email: "jiwon@teodesign.io", avatar: "https://i.pravatar.cc/150?u=jiwon" },
        status: "Cancelled",
        date: "2026-01-25",
        amount: 88.00,
        image: "https://picsum.photos/id/4/200/300"
    }
];

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
    // showPreview removed in favor of isPeeking
    const [isPeeking, setIsPeeking] = useState(false);


    // 4. SCOREBOARD (PEEK) BINDING
    // ESC to close
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsPeeking(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    // ... (imports)
    // Note: Imports for lucide-react should be maintained.

    // Calculate grid template for the scoreboard
    // Removed unused gridTemplate - using hardcoded grid in scoreboard Body

    return (
        <div className={styles.container}>
            {/* --- SCOREBOARD PEEK OVERLAY --- */}
            <div className={styles.peekOverlay} data-peeking={isPeeking}>
                <div className={styles.scoreboardCard}>
                    <div className={styles.scoreboardHeader}>
                        <div className={styles.scoreboardTitle}>
                            <div style={{ background: '#18181b', color: '#fff', padding: '6px', borderRadius: '6px', display: 'flex' }}>
                                <Rocket size={18} />
                            </div>
                            <div>
                                <span style={{ fontSize: '15px' }}>Production Preview</span>
                                <div className={styles.scoreboardHint}>PRESS ESC TO CLOSE</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <div className={styles.integrityBadge} data-perfect={isAllMapped}>
                                {isAllMapped ? <CheckCircle2 size={12} /> : <Zap size={12} />}
                                {validMappingCount} / {targetFields.length} CONFORMED
                            </div>
                        </div>
                    </div>

                    <div className={styles.scoreboardBody} style={{ padding: '0 32px 32px' }}>
                        <div className={styles.richTableWrapper}>
                            <div className={styles.richGridTable} style={{ gridTemplateColumns: '48px minmax(200px, 2fr) minmax(150px, 1.2fr) minmax(120px, 1fr) minmax(120px, 1fr) minmax(120px, 1fr)' }}>
                                {/* HEADER ROW */}
                                <div className={styles.richHeaderCell} style={{ justifyContent: 'center' }}>
                                    <div className={styles.richCheckbox} />
                                </div>
                                <div className={styles.richHeaderCell}><Type size={12} style={{ marginRight: 8 }} /> Product</div>
                                <div className={styles.richHeaderCell}><User size={12} style={{ marginRight: 8 }} /> Assignee</div>
                                <div className={styles.richHeaderCell}><Tag size={12} style={{ marginRight: 8 }} /> Status</div>
                                <div className={styles.richHeaderCell}><Calendar size={12} style={{ marginRight: 8 }} /> Date</div>
                                <div className={styles.richHeaderCell} style={{ justifyContent: 'flex-end' }}><Hash size={12} style={{ marginRight: 8 }} /> Amount</div>

                                {/* BODY ROWS */}
                                {SCOREBOARD_MOCK.map((row, idx) => (
                                    <div key={row.id} style={{ display: 'contents' }}>
                                        <div className={styles.richCell} style={{ justifyContent: 'center' }}>
                                            <div className={styles.richCheckbox} data-state={idx === 0 ? "checked" : ""}>
                                                {idx === 0 && <Check size={12} />}
                                            </div>
                                        </div>
                                        <div className={styles.richCell}>
                                            <div className={styles.richTextStack}>
                                                <span className={styles.richPrimaryText}>{row.product.title}</span>
                                                <span className={styles.richSecondaryText}>{row.product.subtitle}</span>
                                            </div>
                                        </div>
                                        <div className={styles.richCell}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <img src={row.assignee.avatar} className={styles.richAvatar} alt="" />
                                                <div className={styles.richTextStack}>
                                                    <span className={styles.richPrimaryText} style={{ fontSize: '12px' }}>{row.assignee.name}</span>
                                                    <span className={styles.richSecondaryText}>{row.assignee.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.richCell}>
                                            <div className={styles.richBadge} style={{
                                                backgroundColor:
                                                    row.status === 'Shipped' ? '#ecfdf5' :
                                                        row.status === 'Cancelled' ? '#fef2f2' :
                                                            row.status === 'Processing' ? '#eff6ff' : '#f4f4f5',
                                                color:
                                                    row.status === 'Shipped' ? '#059669' :
                                                        row.status === 'Cancelled' ? '#dc2626' :
                                                            row.status === 'Processing' ? '#2563eb' : '#52525b'
                                            }}>
                                                {row.status}
                                            </div>
                                        </div>
                                        <div className={styles.richCell}>
                                            <span style={{ color: '#71717a', fontSize: '12px', fontWeight: 500 }}>{row.date}</span>
                                        </div>
                                        <div className={styles.richCell} style={{ justifyContent: 'flex-end' }}>
                                            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.amount)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
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
                                // disabled={!isAllMapped} // Allow peeking even if not perfect
                                onClick={() => setIsPeeking(true)}
                            >
                                <Rocket size={14} style={{ marginRight: 8 }} />
                                Check Scoreboard
                            </button>
                        </div>
                    </Panel>
                </PanelGroup>
            </div>
        </div>
    );
}
