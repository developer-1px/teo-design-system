import { CheckCircle2, Zap, ChevronRight } from 'lucide-react';
import { PList, PListRow } from '../PList/PList';

interface SchemaInspectorProps {
    template: any;
    source: any;
    depth?: number;
    path?: string[];
}

/**
 * Pro Tool Agent: SchemaInspector
 * Compares a Schema Template (Expected) against a Data Source (Reality).
 * Automatically handles recursion, path tracking, and validation feedback.
 */
export function SchemaInspector({ template, source, depth = 0, path = [] }: SchemaInspectorProps) {
    if (typeof template !== 'object' || template === null) return null;

    const entries = Object.entries(template);

    const getByPath = (obj: any, pathArr: string[]) => {
        return pathArr.reduce((acc, key) => acc?.[key], obj);
    };

    return (
        <PList isRoot={depth === 0}>
            {entries.map(([key, value]) => {
                const currentPath = [...path, key];
                const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);

                // If value is a string in the template, it's considered an "Expected Type"
                const isLeaf = typeof value === 'string';

                const renderLabel = () => (
                    <>
                        {isObject ?
                            <ChevronRight size={10} style={{ transform: 'rotate(90deg)', opacity: 0.5 }} />
                            : <div style={{ width: 10 }} />
                        }
                        <span>{key}</span>
                    </>
                );

                const renderValue = () => {
                    if (!isLeaf) return null;

                    const expectedType = value;
                    const runtimeValue = getByPath(source, currentPath);
                    const hasValue = runtimeValue !== undefined && runtimeValue !== null;
                    const runtimeType = typeof runtimeValue;
                    const isTypeMatch = hasValue && runtimeType === expectedType;

                    return (
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', paddingRight: 4 }}>
                            <span style={{
                                fontSize: '11px',
                                color: isTypeMatch ? (runtimeType === 'number' ? '#0ea5e9' : runtimeType === 'boolean' ? '#f43f5e' : '#1e293b') : '#f43f5e',
                                fontWeight: isTypeMatch && (runtimeType === 'number' || runtimeType === 'boolean') ? 700 : 500,
                                opacity: isTypeMatch ? 1 : 0.8
                            }}>
                                {isTypeMatch
                                    ? (runtimeType === 'string' ? `"${runtimeValue}"` : String(runtimeValue))
                                    : `Expect: <${expectedType}>`}
                            </span>
                            {isTypeMatch ? (
                                <CheckCircle2 size={12} color="#10b981" />
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    {hasValue && <span style={{ fontSize: '9px', fontWeight: 800, color: '#f43f5e' }}>TYPE_MISMATCH</span>}
                                    <Zap size={11} color="#f43f5e" />
                                </div>
                            )}
                        </div>
                    );
                };

                return (
                    <div key={key}>
                        <PListRow
                            depth={depth}
                            label={renderLabel()}
                            value={renderValue()}
                        />
                        {isObject && (
                            <SchemaInspector
                                template={value}
                                source={source}
                                depth={depth + 1}
                                path={currentPath}
                            />
                        )}
                    </div>
                );
            })}
        </PList>
    );
}
