import React, { useState } from 'react';
import * as styles from './StudioPage.css';
import {
    Play, Save, Plus, MoreHorizontal,
    Database, Layout, Code, FileJson,
    ArrowRight, Check, Monitor, Smartphone
} from 'lucide-react';

const MOCK_SCHEMA = [
    { key: 'id', type: 'integer', ui: 'Hidden' },
    { key: 'name', type: 'string', ui: 'Text Input' },
    { key: 'email', type: 'string', ui: 'Email Input' },
    { key: 'role', type: 'enum', ui: 'Select Badge' },
    { key: 'status', type: 'boolean', ui: 'Toggle Switch' },
    { key: 'created_at', type: 'datetime', ui: 'Date Picker' },
];

const MOCK_RESPONSE = `{
  "data": [
    {
      "id": 1,
      "name": "Alex Johnson",
      "email": "alex@example.com",
      "role": "admin",
      "status": true,
      "created_at": "2024-03-20T10:00:00Z"
    },
    {
      "id": 2,
      "name": "Sarah Smith",
      "email": "sarah@example.com",
      "role": "editor",
      "status": true,
      "created_at": "2024-03-21T11:30:00Z"
    }
  ],
  "meta": {
    "total": 2,
    "page": 1
  }
}`;

const COLLECTIONS = [
    { id: 1, method: 'GET', name: 'List Users', url: '/api/v1/users' },
    { id: 2, method: 'POST', name: 'Create User', url: '/api/v1/users' },
    { id: 3, method: 'GET', name: 'Get Profile', url: '/api/v1/me' },
    { id: 4, method: 'PUT', name: 'Update Settings', url: '/api/v1/settings' },
];

export default function StudioPage() {
    const [activeTab, setActiveTab] = useState('schema');
    const [selectedReq, setSelectedReq] = useState(1);
    const [method, setMethod] = useState('GET');

    return (
        <div className={styles.container}>
            {/* 1. Header (Global Nav) */}
            <header className={styles.header}>
                <div className={styles.logo}>
                    <div style={{ width: 24, height: 24, background: '#18181b', borderRadius: 6 }}></div>
                    <span>API Design Studio</span>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className={styles.navItem} style={{ border: '1px solid #e4e4e7', borderRadius: 6 }}>
                        <Smartphone size={14} />
                    </button>
                    <button className={styles.navItem} style={{ border: '1px solid #e4e4e7', borderRadius: 6 }}>
                        <Monitor size={14} />
                    </button>
                </div>
            </header>

            {/* 2. Sidebar (Collection Explorer) */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <span>EXPLORER</span>
                    <Plus size={14} style={{ cursor: 'pointer' }} />
                </div>
                <div style={{ padding: '0 8px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#a1a1aa', padding: '8px', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Database size={12} />
                        <span>Core Service</span>
                    </div>
                    {COLLECTIONS.map(req => (
                        <div
                            key={req.id}
                            className={`${styles.navItem} ${selectedReq === req.id ? styles.navItemActive : ''}`}
                            onClick={() => setSelectedReq(req.id)}
                            style={{ borderRadius: 6 }}
                        >
                            <span
                                className={styles.methodBadge}
                                style={{
                                    color: req.method === 'GET' ? '#0ea5e9' : req.method === 'POST' ? '#10b981' : '#f59e0b',
                                    background: req.method === 'GET' ? '#e0f2fe' : req.method === 'POST' ? '#d1fae5' : '#fef3c7',
                                }}
                            >
                                {req.method}
                            </span>
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {req.name}
                            </span>
                        </div>
                    ))}
                </div>
            </aside>

            {/* 3. Main Stage (Request & Schema) */}
            <main className={styles.main}>
                {/* 3.1 URL Bar */}
                <div className={styles.urlBar}>
                    <div className={styles.inputGroup}>
                        <select className={styles.methodSelect} value={method} onChange={e => setMethod(e.target.value)}>
                            <option>GET</option>
                            <option>POST</option>
                            <option>PUT</option>
                            <option>DELETE</option>
                        </select>
                        <input className={styles.urlInput} defaultValue="https://api.example.com/v1/users" />
                    </div>
                    <button className={styles.sendButton}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Play size={12} fill="currentColor" />
                            <span>Run</span>
                        </div>
                    </button>
                    <button className={styles.sendButton} style={{ background: '#fff', border: '1px solid #e4e4e7', color: '#18181b' }}>
                        <Save size={14} />
                    </button>
                </div>

                {/* 3.2 Tabs */}
                <div className={styles.tabs}>
                    <div className={`${styles.tab} ${activeTab === 'params' ? styles.activeTab : ''}`} onClick={() => setActiveTab('params')}>Params</div>
                    <div className={`${styles.tab} ${activeTab === 'headers' ? styles.activeTab : ''}`} onClick={() => setActiveTab('headers')}>Headers</div>
                    <div className={`${styles.tab} ${activeTab === 'body' ? styles.activeTab : ''}`} onClick={() => setActiveTab('body')}>Body</div>
                    <div className={styles.tab} style={{ color: '#e4e4e7', cursor: 'default' }}>|</div>
                    <div className={`${styles.tab} ${activeTab === 'response' ? styles.activeTab : ''}`} onClick={() => setActiveTab('response')}>Response</div>
                    <div className={`${styles.tab} ${activeTab === 'schema' ? styles.activeTab : ''}`} onClick={() => setActiveTab('schema')}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <FileJson size={14} />
                            <span>Schema Map</span>
                        </div>
                    </div>
                </div>

                {/* 3.3 Content Area */}
                <div className={styles.contentArea}>
                    {activeTab === 'schema' && (
                        <div>
                            <div className={styles.sectionHeader}>
                                <span>DETECTED FIELDS</span>
                                <span style={{ fontSize: '11px', color: '#10b981' }}>● Auto-mapped from response</span>
                            </div>
                            {MOCK_SCHEMA.map((field, idx) => (
                                <div key={idx} className={styles.schemaRow}>
                                    <div className={styles.keyName}>{field.key}</div>
                                    <div className={styles.typeBadge}>{field.type}</div>
                                    <ArrowRight size={14} className={styles.arrowRight} />
                                    <div style={{ flex: 1 }}>
                                        <select className={styles.uiComponentSelect} defaultValue={field.ui}>
                                            <option>Text Input</option>
                                            <option>Email Input</option>
                                            <option>Number Input</option>
                                            <option>Select Badge</option>
                                            <option>Toggle Switch</option>
                                            <option>Date Picker</option>
                                            <option>Hidden</option>
                                        </select>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <div style={{ width: 16, height: 16, border: '1px solid #e4e4e7', borderRadius: 4 }}></div>
                                    </div>
                                </div>
                            ))}

                            <div className={styles.sectionHeader} style={{ marginTop: 24 }}>
                                <span>GENERATOR SETTINGS</span>
                            </div>
                            <div style={{ padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div style={{ border: '1px solid #e4e4e7', padding: 12, borderRadius: 6, background: '#fff' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#71717a', marginBottom: 8 }}>VIEW TYPE</div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <div style={{ padding: '6px 12px', background: '#f4f4f5', borderRadius: 4, fontSize: '12px', fontWeight: 500 }}>Table View</div>
                                        <div style={{ padding: '6px 12px', border: '1px solid #e4e4e7', borderRadius: 4, fontSize: '12px', color: '#71717a' }}>Kanban</div>
                                        <div style={{ padding: '6px 12px', border: '1px solid #e4e4e7', borderRadius: 4, fontSize: '12px', color: '#71717a' }}>Form</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'response' && (
                        <div className={styles.codeBlock}>
                            <pre>{MOCK_RESPONSE}</pre>
                        </div>
                    )}
                </div>
            </main>

            {/* 4. Right Panel (Preview) */}
            <aside className={styles.rightPanel}>
                <div className={styles.previewHeader}>
                    <Layout size={14} />
                    <span>Reference Preview</span>
                </div>
                <div className={styles.previewBody}>
                    <div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        {/* Mock Table Header */}
                        <div style={{ padding: '12px', borderBottom: '1px solid #f4f4f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '12px', fontWeight: 600 }}>Users</div>
                            <div style={{ fontSize: '10px', padding: '4px 8px', background: '#18181b', color: 'white', borderRadius: 4 }}>Create New</div>
                        </div>
                        {/* Mock Table Rows */}
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ padding: '10px 12px', borderBottom: '1px solid #f4f4f5', display: 'flex', alignItems: 'center', fontSize: '12px', gap: 12 }}>
                                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#f4f4f5' }}></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 500 }}>User Name {i}</div>
                                    <div style={{ fontSize: '10px', color: '#a1a1aa' }}>user{i}@example.com</div>
                                </div>
                                <div style={{ padding: '2px 6px', borderRadius: 4, background: i === 1 ? '#dcfce7' : '#f3f4f6', color: i === 1 ? '#166534' : '#4b5563', fontSize: '10px', fontWeight: 500 }}>
                                    {i === 1 ? 'Admin' : 'User'}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: 24 }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#a1a1aa', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                            <span>GENERATED DOCS</span>
                            <ArrowRight size={12} />
                        </div>
                        <div style={{ background: '#fff', border: '1px solid #e4e4e7', borderRadius: 6, padding: 12 }}>
                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#0ea5e9', marginBottom: 4 }}>GET /users</div>
                            <div style={{ fontSize: '11px', color: '#52525b', lineHeight: 1.4 }}>
                                Retrieve a paginated list of users. Supports filtering by role.
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}
