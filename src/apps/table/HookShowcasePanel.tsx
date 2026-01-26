
import React from 'react';
import { useAccordion, useDropdown, useTabs, useModal } from './simulated-hooks';
import { ChevronDown, ChevronRight, X } from 'lucide-react';

const panelStyle: React.CSSProperties = {
    width: '320px',
    borderRight: '1px solid #e2e2e2',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto'
};

const headerStyle: React.CSSProperties = {
    padding: '16px',
    borderBottom: '1px solid #eee',
    fontSize: '14px',
    fontWeight: 600,
    color: '#333'
};

const sectionStyle: React.CSSProperties = {
    padding: '16px',
    borderBottom: '1px solid #eee'
};

const labelStyle: React.CSSProperties = {
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#888',
    marginBottom: '8px',
    display: 'block',
    fontWeight: 600
};

export const HookShowcasePanel: React.FC = () => {
    return (
        <div style={panelStyle}>
            <div style={headerStyle}>
                Headless Hooks Showcase
            </div>

            <AccordionDemo />
            <DropdownDemo />
            <TabsDemo />
            <ModalDemo />
        </div>
    );
};

// --- Demos ---

const AccordionDemo = () => {
    const { field, bind } = useAccordion({
        items: ['item-1', 'item-2'],
        allowMultiple: true
    });

    return (
        <div style={sectionStyle}>
            <span style={labelStyle}>useAccordion</span>
            <div {...bind.root}>
                {field.items.map(id => (
                    <div key={id} style={{ marginBottom: 4, background: '#fff', border: '1px solid #ddd', borderRadius: 4 }}>
                        <button
                            {...bind.trigger(id)}
                            style={{
                                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13
                            }}
                        >
                            {id === 'item-1' ? 'System Rules' : 'User Preferences'}
                            {field.isExpanded(id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </button>
                        <div {...bind.panel(id)} style={{ padding: '8px 12px', fontSize: 13, borderTop: '1px solid #eee' }}>
                            {id === 'item-1' ? 'Showing active system rules...' : 'User notification settings...'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DropdownDemo = () => {
    const { field, bind } = useDropdown({ items: ['Edit', 'Duplicate', 'Archive', 'Delete'] });

    return (
        <div style={sectionStyle}>
            <span style={labelStyle}>useDropdown</span>
            <div {...bind.container}>
                <button {...bind.trigger} style={{
                    padding: '6px 12px', borderRadius: 4, border: '1px solid #ddd', background: '#fff',
                    fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', width: '100%'
                }}>
                    Actions
                    <ChevronDown size={12} />
                </button>

                {field.isOpen && (
                    <div {...bind.menu} style={{
                        position: 'absolute', top: '100%', left: 0, width: '100%',
                        background: '#fff', border: '1px solid #ddd', borderRadius: 4, marginTop: 4,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10
                    }}>
                        {field.items.map(item => (
                            <div key={item} {...bind.item(item)} style={{
                                padding: '8px 12px', fontSize: 13, cursor: 'pointer',
                                background: field.selectedItem === item ? '#f0f0f0' : '#fff'
                            }}>
                                {item}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {field.selectedItem && <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>Selected: {field.selectedItem}</div>}
        </div>
    );
};

const TabsDemo = () => {
    const { field, bind } = useTabs({ tabs: ['Data', 'Logs'], defaultTab: 'Data' });

    return (
        <div style={sectionStyle}>
            <span style={labelStyle}>useTabs</span>
            <div {...bind.list} style={{ display: 'flex', gap: 4, marginBottom: 8, padding: 2, background: '#eee', borderRadius: 6 }}>
                {field.tabs.map(tab => (
                    <button key={tab} {...bind.tab(tab)} style={{
                        flex: 1, padding: '4px 8px', fontSize: 12, border: 'none', borderRadius: 4,
                        background: field.activeTab === tab ? '#fff' : 'transparent',
                        fontWeight: field.activeTab === tab ? 600 : 400,
                        boxShadow: field.activeTab === tab ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                        cursor: 'pointer'
                    }}>
                        {tab}
                    </button>
                ))}
            </div>
            <div style={{ height: 60, background: '#fff', border: '1px solid #eee', borderRadius: 4, padding: 12, fontSize: 13, color: '#666' }}>
                <div {...bind.panel('Data')}>Table Data Content...</div>
                <div {...bind.panel('Logs')}>System Logs Content...</div>
            </div>
        </div>
    );
};

const ModalDemo = () => {
    const { field, action, bind } = useModal({ onClose: () => console.log('close') });

    return (
        <div style={sectionStyle}>
            <span style={labelStyle}>useModal</span>
            <button onClick={action.open} style={{
                width: '100%', padding: '8px', background: '#000', color: '#fff',
                border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13
            }}>
                Open Configuration
            </button>

            {field.isOpen && (
                <div {...bind.overlay} style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }}>
                    <div {...bind.dialog} style={{
                        width: 400, background: '#fff', borderRadius: 8, padding: 24,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                            <h2 {...bind.title} style={{ margin: 0, fontSize: 18 }}>Configuration</h2>
                            <button onClick={action.close} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <p style={{ fontSize: 14, color: '#555', lineHeight: 1.5 }}>
                            This modal is powered by the <code>useModal</code> hook. try pressing Escape or clicking outside to close it.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24, gap: 8 }}>
                            <button onClick={action.close} style={{ padding: '8px 16px', background: '#eee', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Cancel</button>
                            <button onClick={action.close} style={{ padding: '8px 16px', background: '#000', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
