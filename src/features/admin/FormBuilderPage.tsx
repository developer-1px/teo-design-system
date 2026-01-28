import React, { useState } from 'react';
import {
    Layout, Type, CheckSquare, Calendar, ChevronDown, AlignLeft,
    Settings, Share2, Eye, Trash2, Plus
} from 'lucide-react';
import * as styles from './FormBuilderPage.css';

// Types
type FieldType = 'text' | 'number' | 'email' | 'textarea' | 'select' | 'date' | 'checkbox';

interface FormField {
    id: string;
    type: FieldType;
    label: string;
    description?: string;
    required: boolean;
    placeholder?: string;
    options?: string; // For select/radio (comma separated for simplicity)
}

const INITIAL_FIELDS: FormField[] = [
    { id: 'f1', type: 'text', label: 'Full Name', required: true, placeholder: 'e.g. John Doe' },
    { id: 'f2', type: 'email', label: 'Email Address', required: true, placeholder: 'john@example.com' },
    { id: 'f3', type: 'textarea', label: 'Bio', required: false, description: 'Tell us a bit about yourself' },
];

export default function FormBuilderPage() {
    const [fields, setFields] = useState<FormField[]>(INITIAL_FIELDS);
    const [selectedId, setSelectedId] = useState<string | null>('f1');
    const [editingId, setEditingId] = useState<string | null>(null);

    const selectedField = fields.find(f => f.id === selectedId);

    const addField = (type: FieldType) => {
        const newId = `f${Date.now()}`;
        const newField: FormField = {
            id: newId,
            type,
            label: `New ${type} field`,
            required: false,
            placeholder: '',
            description: ''
        };
        setFields([...fields, newField]);
        setSelectedId(newId);
        setEditingId(newId); // Auto-edit new fields
    };

    const updateField = (id: string, updates: Partial<FormField>) => {
        setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
    };

    const removeField = (id: string) => {
        setFields(fields.filter(f => f.id !== id));
        if (selectedId === id) setSelectedId(null);
    };

    // Global Key Handler
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (editingId) return; // If already editing, let the input handle it

        if (e.key === 'Enter' && selectedId) {
            e.preventDefault();
            setEditingId(selectedId);
        }
        if (e.key === 'Backspace' && selectedId) {
            // Optional: Delete on backspace if desired, but maybe dangerous without confirmation
            // removeField(selectedId);
        }
    };

    return (
        <div className={styles.container} onKeyDown={handleKeyDown} tabIndex={-1} style={{ outline: 'none' }}>
            {/* Header */}
            <header className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontWeight: 600 }}>Form Builder</div>
                    <div style={{ fontSize: '11px', padding: '2px 8px', background: '#F3F4F6', borderRadius: '4px', color: '#666' }}>
                        DRAFT
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ height: 28, padding: '0 12px', borderRadius: 4, border: '1px solid #ddd', background: 'white', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Eye size={14} /> Preview
                    </button>
                    <button style={{ height: 28, padding: '0 12px', borderRadius: 4, border: 'none', background: '#111', color: 'white', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Share2 size={14} /> Publish
                    </button>
                </div>
            </header>

            <div className={styles.workspace}>
                {/* Left: Components */}
                <div className={styles.leftPanel}>
                    <div className={styles.panelHeader}>Form Elements</div>
                    <div className={styles.panelContent}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#999', marginBottom: '8px' }}>INPUTS</div>
                        <ComponentButton icon={Type} label="Short Text" onClick={() => addField('text')} />
                        <ComponentButton icon={AlignLeft} label="Long Text" onClick={() => addField('textarea')} />
                        <ComponentButton icon={Layout} label="Number" onClick={() => addField('number')} />
                        <ComponentButton icon={Layout} label="Email" onClick={() => addField('email')} />

                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#999', marginBottom: '8px', marginTop: '16px' }}>SELECTION</div>
                        <ComponentButton icon={ChevronDown} label="Dropdown" onClick={() => addField('select')} />
                        <ComponentButton icon={CheckSquare} label="Checkbox" onClick={() => addField('checkbox')} />
                        <ComponentButton icon={Calendar} label="Date Picker" onClick={() => addField('date')} />
                    </div>
                </div>

                {/* Center: Canvas */}
                <div className={styles.centerPanel}>
                    <div className={styles.canvas} onClick={() => { setSelectedId(null); setEditingId(null); }}>
                        <div className={styles.formContainer} onClick={e => e.stopPropagation()}>
                            <div style={{ borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '8px' }}>
                                <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Registration Form</h1>
                                <p style={{ fontSize: '14px', color: '#666', margin: '4px 0 0' }}>Please fill out the details below.</p>
                            </div>

                            {fields.map(field => (
                                <CanvasField
                                    key={field.id}
                                    field={field}
                                    isSelected={field.id === selectedId}
                                    isEditing={field.id === editingId}
                                    onClick={() => setSelectedId(field.id)}
                                    onEdit={(val) => {
                                        updateField(field.id, { label: val });
                                        setEditingId(null);
                                    }}
                                />
                            ))}

                            {fields.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#999', border: '2px dashed #eee', borderRadius: '8px' }}>
                                    Click elements on the left to add them
                                </div>
                            )}

                            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #eee' }}>
                                <button style={{ width: '100%', padding: '10px', background: '#111', color: 'white', borderRadius: '6px', border: 'none', fontWeight: 500 }}>
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Properties */}
                <div className={styles.rightPanel}>
                    <div className={styles.panelHeader}>
                        Properties
                        <Settings size={14} />
                    </div>
                    <div className={styles.panelContent}>
                        {selectedField ? (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '13px' }}>{selectedField.type.toUpperCase()}</div>
                                        <div style={{ fontSize: '11px', color: '#666' }}>ID: {selectedField.id}</div>
                                    </div>
                                    <button onClick={() => removeField(selectedField.id)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <PropertySection title="General">
                                    <TextInput
                                        label="Label"
                                        value={selectedField.label}
                                        onChange={v => updateField(selectedField.id, { label: v })}
                                    />
                                    <TextInput
                                        label="Placeholder"
                                        value={selectedField.placeholder || ''}
                                        onChange={v => updateField(selectedField.id, { placeholder: v })}
                                    />
                                    <TextInput
                                        label="Description"
                                        value={selectedField.description || ''}
                                        onChange={v => updateField(selectedField.id, { description: v })}
                                    />
                                </PropertySection>

                                <PropertySection title="Validation">
                                    <div className={styles.propertyRow}>
                                        <div className={styles.propertyLabel}>Required</div>
                                        <input
                                            type="checkbox"
                                            checked={selectedField.required}
                                            onChange={e => updateField(selectedField.id, { required: e.target.checked })}
                                        />
                                    </div>
                                </PropertySection>

                                {selectedField.type === 'select' && (
                                    <PropertySection title="Options">
                                        <TextInput
                                            label="Choices"
                                            value={selectedField.options || ''}
                                            onChange={v => updateField(selectedField.id, { options: v })}
                                            placeholder="Use comma to separate"
                                        />
                                        <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                                            Comma separated values (e.g. Red,Green,Blue)
                                        </div>
                                    </PropertySection>
                                )}
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', color: '#999', marginTop: '40px', fontSize: '13px' }}>
                                Select a field to configure
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-components

function ComponentButton({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) {
    return (
        <div className={styles.componentItem} onClick={onClick}>
            <Icon size={14} style={{ opacity: 0.6 }} />
            <span>{label}</span>
            <Plus size={12} style={{ marginLeft: 'auto', opacity: 0 }} className="plus-icon" />
        </div>
    );
}

function CanvasField({ field, isSelected, isEditing, onClick, onEdit }: {
    field: FormField,
    isSelected: boolean,
    isEditing: boolean,
    onClick: () => void,
    onEdit: (val: string) => void
}) {
    return (
        <div
            className={styles.canvasField}
            data-selected={isSelected}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
        >
            {isEditing ? (
                <input
                    autoFocus
                    defaultValue={field.label}
                    className={styles.fieldLabel} // Reuse label styles but override if needed
                    style={{
                        border: '1px solid #3b82f6',
                        padding: '2px 4px',
                        width: '100%',
                        borderRadius: 4
                    }}
                    onBlur={(e) => onEdit(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.currentTarget.blur();
                        }
                    }}
                    onClick={e => e.stopPropagation()} // Prevent re-triggering parent click
                />
            ) : (
                <label className={styles.fieldLabel}>
                    {field.label}
                    {field.required && <span className={styles.requiredBadge}>*</span>}
                </label>
            )}

            {renderFieldInput(field)}

            {field.description && (
                <div className={styles.fieldHelper}>{field.description}</div>
            )}
        </div>
    );
}

function renderFieldInput(field: FormField) {
    switch (field.type) {
        case 'textarea':
            return <textarea className={styles.fieldInput} placeholder={field.placeholder} style={{ height: '80px', resize: 'none' }} disabled />;
        case 'select':
            return (
                <div className={styles.fieldInput} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: field.placeholder ? '#999' : 'inherit' }}>{field.placeholder || 'Select an option...'}</span>
                    <ChevronDown size={14} style={{ opacity: 0.5 }} />
                </div>
            );
        case 'checkbox':
            return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" disabled />
                    <span style={{ fontSize: '14px' }}>{field.placeholder || 'Yes, I agree'}</span>
                </div>
            );
        case 'date':
            return (
                <div className={styles.fieldInput} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#999' }}>MM/DD/YYYY</span>
                    <Calendar size={14} style={{ opacity: 0.5 }} />
                </div>
            );
        default:
            return <input type={field.type} className={styles.fieldInput} placeholder={field.placeholder} disabled />;
    }
}

function PropertySection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#999', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>
                {title}
            </div>
            {children}
        </div>
    );
}

function TextInput({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder?: string }) {
    return (
        <div className={styles.propertyRow}>
            <div className={styles.propertyLabel}>{label}</div>
            <input
                className={styles.propertyInput}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    );
}
